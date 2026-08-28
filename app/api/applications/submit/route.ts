import { z } from "zod";
import intents from "@/data/intents.json";
import { questionSchemas, type IntentKey } from "@/data/forms";
import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

const intentSchema = z.enum(["ownership-transfer", "license-renewal"]);
const submissionSchema = z.object({
  intent: intentSchema,
  answers: z.record(z.string()),
  uploads: z.record(z.string().trim().min(1))
});

const service = {
  "ownership-transfer": { label: "Vehicle Ownership Transfer", prefix: "VOT" },
  "license-renewal": { label: "Driving Licence Renewal", prefix: "DLR" }
} as const;

function validationErrors(intent: IntentKey, answers: Record<string, string>, uploads: Record<string, string>) {
  const answerCheck = questionSchemas[intent].safeParse(answers);
  const requiredDocuments = intents[intent].documents;
  return {
    answers: answerCheck.success ? {} : answerCheck.error.flatten().fieldErrors,
    documents: requiredDocuments
      .filter((document) => !uploads[document]?.trim())
      .map((document) => ({ document, message: `${document} is required for this prototype application.` }))
  };
}

export async function POST(request: Request) {
  try {
    const userId = await sessionUserId();
    if (!userId) return Response.json({ message: "Sign in required." }, { status: 401 });

    const parsed = submissionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ message: "Please fix the highlighted information.", errors: parsed.error.flatten() }, { status: 400 });
    }

    const { intent, answers, uploads } = parsed.data;
    const errors = validationErrors(intent, answers, uploads);
    if (Object.keys(errors.answers).length || errors.documents.length) {
      return Response.json({ message: "Please fix the highlighted information.", errors }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date().toISOString();
    const configuration = service[intent];
    const appId = `${configuration.prefix}-${userId.replace(/[^a-z0-9]/gi, "").toUpperCase()}`;
    const application = {
      id: appId,
      userId,
      intent,
      serviceType: configuration.label,
      status: "prototype-review",
      currentStep: "Prototype consistency check",
      createdAt: now,
      updatedAt: now,
      nextAction: "Confirm demo payment",
      answers,
      uploads,
      statusHistory: [{
        id: `${appId}-submitted`,
        applicationId: appId,
        status: "Submitted information",
        message: "Your information is ready for prototype review.",
        timestamp: now
      }]
    };

    await db.collection("applications").updateOne(
      { id: appId, userId },
      {
        $set: {
          userId,
          intent,
          serviceType: configuration.label,
          status: "prototype-review",
          currentStep: "Prototype consistency check",
          updatedAt: now,
          nextAction: "Confirm demo payment",
          answers,
          uploads
        },
        $setOnInsert: { id: appId, createdAt: now, statusHistory: application.statusHistory }
      },
      { upsert: true }
    );

    for (const [index, documentType] of intents[intent].documents.entries()) {
      const documentId = `${appId}-doc-${index + 1}`;
      await db.collection("documents").updateOne(
        { id: documentId },
        {
          $set: {
            applicationId: appId,
            documentType,
            filename: uploads[documentType],
            validationStatus: "looks-ready",
            checks: [
              { id: `${documentId}-format`, checkType: "Filename provided", status: "looks-ready", message: "A filename was provided for this prototype check." },
              { id: `${documentId}-consistency`, checkType: "Required document included", status: "looks-ready", message: "This required document is included." }
            ]
          },
          $setOnInsert: { id: documentId }
        },
        { upsert: true }
      );
    }

    const paymentId = `${appId}-payment`;
    await db.collection("payments").updateOne(
      { id: paymentId },
      {
        $setOnInsert: {
          id: paymentId,
          applicationId: appId,
          amount: 500,
          transactionReference: `PP-PAY-${appId}`,
          status: "pending",
          createdAt: now,
          updatedAt: now
        }
      },
      { upsert: true }
    );

    await db.collection("appointments").updateOne(
      { id: `${appId}-appointment` },
      { $setOnInsert: { id: `${appId}-appointment`, applicationId: appId, date: "", time: "", location: "", status: "not-available" } },
      { upsert: true }
    );

    return Response.json({ applicationId: appId });
  } catch (error) {
    console.error("Error submitting application:", error);
    return Response.json({ message: "Failed to submit application details." }, { status: 500 });
  }
}
