import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const userId = await sessionUserId();
    if (!userId) {
      return Response.json({ message: "Sign in required" }, { status: 401 });
    }

    const db = await getDb();
    
    // Find application for this user
    const application = await db.collection("applications").findOne({ userId });
    if (!application) {
      return Response.json({ message: "No application found" }, { status: 404 });
    }

    const attempt = Number(new URL(request.url).searchParams.get("attempt") || "0");
    const random = Math.random();
    const status = random < 0.1 ? "failed" : random < 0.25 ? "confirmation-pending" : "success";
    
    const now = new Date().toISOString();

    // Find existing payment
    let payment: any = await db.collection("payments").findOne({ applicationId: application.id });
    
    if (payment) {
      // Update the existing payment status
      await db.collection("payments").updateOne(
        { id: payment.id },
        { 
          $set: { 
            status, 
            updatedAt: now 
          } 
        }
      );
      payment.status = status;
    } else {
      // Create if missing
      const payId = "pay_" + Math.random().toString(36).substring(2, 10);
      const payRef = "PP-PAY-" + Math.floor(1000000 + Math.random() * 9000000).toString();
      payment = {
        id: payId,
        applicationId: application.id,
        amount: 500,
        transactionReference: payRef,
        status,
        createdAt: now,
        updatedAt: now
      };
      await db.collection("payments").insertOne(payment);
    }

    // Also log status history if payment is confirmed successfully
    if (status === "success") {
      // Update application stage details
      await db.collection("applications").updateOne(
        { id: application.id },
        {
          $set: {
            updatedAt: now,
            nextAction: "Await document verification"
          }
        }
      );

      // Check if Payment confirmed history log exists
      const hasHist = await db.collection("applications").findOne({
        id: application.id,
        "statusHistory.status": "Payment confirmed"
      });
      
      if (!hasHist) {
        const histId = "hist_" + Math.random().toString(36).substring(2, 10);
        await db.collection("applications").updateOne(
          { id: application.id },
          {
            $push: {
              statusHistory: {
                id: histId,
                applicationId: application.id,
                status: "Payment confirmed",
                message: "The synthetic ₹500 payment was confirmed.",
                timestamp: now
              }
            } as any
          }
        );
      }
    }

    return Response.json({
      status,
      attempt,
      amount: payment?.amount || 500,
      reference: payment?.transactionReference || "PP-PAY-2608142",
      charged: status !== "failed"
    });
  } catch (error) {
    console.error("Payment API error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
