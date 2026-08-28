import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 650));
    const userId = await sessionUserId();
    if (!userId) {
      return Response.json({ status: "rejected", message: "Sign in required", retryable: true }, { status: 401 });
    }

    const db = await getDb();
    
    // Find application for this user
    const application = await db.collection("applications").findOne({ userId });
    if (!application) {
      return Response.json({ status: "rejected", message: "No application found", retryable: true }, { status: 404 });
    }

    const attempt = Number(new URL(request.url).searchParams.get("attempt") || "0");
    
    // 10% failure simulation
    const rejected = Math.random() < 0.1;
    const status = rejected ? "rejected" : "approved";
    const now = new Date().toISOString();

    const historyArray = application.statusHistory || [];

    if (status === "approved") {
      const logExists = historyArray.some((h: any) => h.status === "Licence issued");
      
      const updateData: any = {
        status: "approved", 
        currentStep: "Licence issued",
        nextAction: "None",
        updatedAt: now
      };

      if (!logExists) {
        const histId = "hist_" + Math.random().toString(36).substring(2, 10);
        await db.collection("applications").updateOne(
          { id: application.id },
          { 
            $set: updateData,
            $push: {
              statusHistory: {
                id: histId,
                applicationId: application.id,
                status: "Licence issued",
                message: "Your driving licence renewal application was approved and licence issued.",
                timestamp: now
              }
            } as any
          }
        );
      } else {
        await db.collection("applications").updateOne(
          { id: application.id },
          { $set: updateData }
        );
      }
    } else {
      // If rejected
      const logExists = historyArray.some((h: any) => h.status === "Review failed");
      
      const updateData: any = {
        status: "rejected", 
        currentStep: "RTO processing",
        nextAction: "Retry review",
        updatedAt: now
      };

      if (!logExists) {
        const histId = "hist_" + Math.random().toString(36).substring(2, 10);
        await db.collection("applications").updateOne(
          { id: application.id },
          { 
            $set: updateData,
            $push: {
              statusHistory: {
                id: histId,
                applicationId: application.id,
                status: "Review failed",
                message: "A temporary review issue occurred. Your original submission is safe.",
                timestamp: now
              }
            } as any
          }
        );
      } else {
        await db.collection("applications").updateOne(
          { id: application.id },
          { $set: updateData }
        );
      }
    }

    return Response.json({ 
      applicationId: application.id, 
      status, 
      attempt, 
      retryable: rejected 
    });
  } catch (error) {
    console.error("Application verification API failed:", error);
    return Response.json({ status: "rejected", message: "Review process failed", retryable: true }, { status: 500 });
  }
}
