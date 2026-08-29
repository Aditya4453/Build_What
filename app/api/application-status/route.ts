import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const userId = await sessionUserId();
    if (!userId) return Response.json({ message: "Sign in required" }, { status: 401 });

    const applicationId = new URL(request.url).searchParams.get("id");
    if (!applicationId) return Response.json({ message: "Application ID is required" }, { status: 400 });

    const db = await getDb();
    const application = await db.collection("applications").findOne({ id: applicationId, userId });
    if (!application) return Response.json({ message: "Application not found" }, { status: 404 });

    return Response.json({
      applicationId: application.id,
      status: application.status || "document-verification",
      currentStep: application.currentStep || "Prototype consistency check",
      nextAction: application.nextAction || "No action needed",
      retryable: false,
      completedViaDelegated: application.completedViaDelegated || false,
      delegateName: application.delegateName || null,
      delegatedAt: application.delegatedAt || null,
      history: application.statusHistory || []
    });
  } catch (error) {
    console.error("Application status API failed:", error);
    return Response.json({ message: "We couldn't update your status" }, { status: 500 });
  }
}
