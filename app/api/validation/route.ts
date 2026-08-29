import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

const prototypeCheckLabel = (checkType: string) => {
  if (checkType === "Signature present") return "Prototype consistency marker";
  if (checkType === "Format verified") return "Filename provided";
  if (checkType === "File readable") return "Required document included";
  return checkType;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const userId = await sessionUserId();
    if (!userId) return Response.json({ message: "Sign in required", documents: [] }, { status: 401 });

    const applicationId = new URL(request.url).searchParams.get("id");
    if (!applicationId) return Response.json({ message: "Application ID is required", documents: [] }, { status: 400 });

    const db = await getDb();
    const application = await db.collection("applications").findOne({ id: applicationId, userId });
    if (!application) return Response.json({ message: "Application not found", documents: [] }, { status: 404 });

    const documents = await db.collection("documents").find({ applicationId }).toArray();
    const output = documents.map((document: any) => ({
      name: document.documentType,
      status: document.validationStatus === "needs-attention" ? "needs-attention" : "validated",
      detail: document.validationStatus === "needs-attention"
        ? "Needs attention before this prototype check can continue."
        : "Looks ready in this prototype consistency check.",
      checks: (document.checks || []).map((check: any) => prototypeCheckLabel(check.checkType))
    }));

    return Response.json({
      applicationId,
      status: output.some((document) => document.status === "needs-attention") ? "rejected" : "approved",
      documents: output
    });
  } catch (error) {
    console.error("Document validation API failed:", error);
    return Response.json({ message: "We couldn't update your status", documents: [] }, { status: 500 });
  }
}
