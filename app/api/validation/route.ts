import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userId = await sessionUserId();
    if (!userId) {
      return Response.json({ status: "rejected", documents: [], retryable: true }, { status: 401 });
    }

    const db = await getDb();
    
    // Find application for this user
    const application = await db.collection("applications").findOne({ userId });
    if (!application) {
      return Response.json({ status: "rejected", documents: [], retryable: true }, { status: 404 });
    }

    // 10% failure simulation
    const isFailed = Math.random() < 0.1;
    if (isFailed) {
      return Response.json({
        applicationId: application.id,
        status: "rejected",
        retryable: true,
        documents: []
      });
    }

    // Retrieve user's documents
    const docs = await db.collection("documents").find({ applicationId: application.id }).toArray();
    
    const now = new Date().toISOString();
    
    // Update document validation status and embedded checks to approved/validated
    for (const document of docs) {
      const updatedChecks = (document.checks || []).map((c: any) => {
        if (c.status === "processing") {
          return { ...c, status: "approved", message: "Mock validation completed." };
        }
        return c;
      });

      await db.collection("documents").updateOne(
        { id: document.id },
        { 
          $set: { 
            validationStatus: "approved",
            checks: updatedChecks
          } 
        }
      );
      
      // Update in-memory copy for return payload
      document.validationStatus = "approved";
      document.checks = updatedChecks;
    }

    const documentsOutput = docs.map(document => {
      const docChecks = (document.checks || []).map((c: any) => c.checkType);
      return {
        name: document.documentType,
        status: "validated",
        detail: "File format and details verified.",
        checks: docChecks
      };
    });

    // Update application progress
    await db.collection("applications").updateOne(
      { id: application.id },
      {
        $set: {
          status: "document-verification",
          updatedAt: now
        }
      }
    );

    return Response.json({
      applicationId: application.id,
      status: "approved",
      documents: documentsOutput
    });
  } catch (error) {
    console.error("Document check validation helper failed:", error);
    return Response.json({ status: "rejected", documents: [], retryable: true }, { status: 500 });
  }
}
