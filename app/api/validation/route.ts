import intents from "@/data/intents.json";
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (Math.random() < 0.1) {
    return Response.json({ applicationId: "PP-2026-08142", status: "rejected", retryable: true, documents: [] });
  }
  const documents = intents["ownership-transfer"].documents.map((name, index) => ({
    name,
    status: index === 3 ? "needs-attention" : "validated",
    detail: index === 3 ? "Address proof is unclear. Upload a clearer copy." : "File format and details verified.",
    checks: index === 3 ? ["File format verified", "Document image detected"] : ["File format verified", "Signature present", "Application details match"],
  }));
  return Response.json({ applicationId: "PP-2026-08142", status: "approved", documents });
}
