import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const userId = await sessionUserId();
    if (!userId) {
      return Response.json({ message: "Sign in required." }, { status: 401 });
    }

    const { answers, uploads } = await request.json();

    const db = await getDb();

    // Check if the user has an existing application
    let application = await db.collection("applications").findOne({ userId });
    
    const now = new Date().toISOString();
    let appId: string;

    if (application) {
      appId = application.id;
      // Update existing application
      await db.collection("applications").updateOne(
        { id: appId },
        {
          $set: {
            answers,
            uploads,
            updatedAt: now,
            status: "document-verification",
            currentStep: "Document verification",
            nextAction: "Await document verification"
          }
        }
      );
    } else {
      // Create a brand new application record
      appId = "DLR-2026-" + Math.floor(10000 + Math.random() * 90000).toString();
      await db.collection("applications").insertOne({
        id: appId,
        userId: userId,
        serviceType: "Driving Licence Renewal",
        status: "document-verification",
        currentStep: "Document verification",
        createdAt: now,
        updatedAt: now,
        nextAction: "Await document verification",
        answers,
        uploads,
        statusHistory: [
          {
            id: "hist_" + Math.random().toString(36).substring(2, 10),
            applicationId: appId,
            status: "Application submitted",
            message: "Your driving licence renewal application was received.",
            timestamp: now
          }
        ]
      });
    }

    // Synchronize documents and embedded checks
    if (uploads && typeof uploads === "object") {
      for (const [docType, filename] of Object.entries(uploads)) {
        let document = await db.collection("documents").findOne({
          applicationId: appId,
          documentType: docType
        });

        const checks = [
          { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "Format verified", status: "approved", message: "PDF format is supported." },
          { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "File readable", status: "approved", message: "The file can be read." },
          { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "Signature present", status: "approved", message: "A signature is visible." }
        ];

        if (docType !== "Current driving licence") {
          checks.push({
            id: "check_" + Math.random().toString(36).substring(2, 10),
            checkType: "Required information detected",
            status: "processing",
            message: "Waiting for mock validation."
          });
        }

        if (document) {
          await db.collection("documents").updateOne(
            { id: document.id },
            {
              $set: {
                filename: String(filename),
                validationStatus: docType === "Current driving licence" ? "approved" : "processing",
                checks: checks
              }
            }
          );
        } else {
          const docId = "doc_" + Math.random().toString(36).substring(2, 10);
          await db.collection("documents").insertOne({
            id: docId,
            applicationId: appId,
            documentType: docType,
            filename: String(filename),
            validationStatus: docType === "Current driving licence" ? "approved" : "processing",
            checks: checks
          });
        }
      }
    }

    // Ensure payment record exists for this application
    const payment = await db.collection("payments").findOne({ applicationId: appId });
    if (!payment) {
      const payId = "pay_" + Math.random().toString(36).substring(2, 10);
      const payRef = "PP-PAY-" + Math.floor(1000000 + Math.random() * 9000000).toString();
      await db.collection("payments").insertOne({
        id: payId,
        applicationId: appId,
        amount: 500,
        transactionReference: payRef,
        status: "pending",
        createdAt: now,
        updatedAt: now
      });
    }

    // Ensure appointment record exists for this application
    const appointment = await db.collection("appointments").findOne({ applicationId: appId });
    if (!appointment) {
      const aptId = "apt_" + Math.random().toString(36).substring(2, 10);
      await db.collection("appointments").insertOne({
        id: aptId,
        applicationId: appId,
        date: "",
        time: "",
        location: "",
        status: "not-available"
      });
    }

    return Response.json({ applicationId: appId });
  } catch (error) {
    console.error("Error submitting application:", error);
    return Response.json({ message: "Failed to submit application details." }, { status: 500 });
  }
}
