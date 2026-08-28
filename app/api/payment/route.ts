import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

async function applicationFor(request: Request) {
  const userId = await sessionUserId();
  if (!userId) return { error: Response.json({ message: "Sign in required" }, { status: 401 }) };
  const applicationId = new URL(request.url).searchParams.get("id");
  if (!applicationId) return { error: Response.json({ message: "Application ID is required" }, { status: 400 }) };
  const db = await getDb();
  const application = await db.collection("applications").findOne({ id: applicationId, userId });
  if (!application) return { error: Response.json({ message: "Application not found" }, { status: 404 }) };
  return { db, application };
}

export async function GET(request: Request) {
  try {
    const result = await applicationFor(request);
    if ("error" in result) return result.error;
    const payment = await result.db.collection("payments").findOne({ applicationId: result.application.id });
    if (!payment) return Response.json({ message: "Payment record not found" }, { status: 404 });
    return Response.json({ status: payment.status, amount: payment.amount, reference: payment.transactionReference, charged: payment.status === "success" });
  } catch (error) {
    console.error("Payment status API error:", error);
    return Response.json({ message: "We couldn't update your status" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const result = await applicationFor(request);
    if ("error" in result) return result.error;
    const payment = await result.db.collection("payments").findOne({ applicationId: result.application.id });
    if (!payment) return Response.json({ message: "Payment record not found" }, { status: 404 });

    if (payment.status === "pending" || payment.status === "processing") {
      const now = new Date().toISOString();
      await result.db.collection("payments").updateOne({ id: payment.id }, { $set: { status: "success", updatedAt: now } });
      await result.db.collection("applications").updateOne(
        { id: result.application.id },
        { $set: { updatedAt: now, nextAction: "Await prototype consistency check" } }
      );
      payment.status = "success";
    }

    return Response.json({ status: payment.status, amount: payment.amount, reference: payment.transactionReference, charged: payment.status === "success" });
  } catch (error) {
    console.error("Payment confirmation API error:", error);
    return Response.json({ message: "We couldn't update your status" }, { status: 500 });
  }
}
