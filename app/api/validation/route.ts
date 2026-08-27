import intents from "@/data/intents.json";
export async function GET() {
  const documents = intents["ownership-transfer"].documents.map((name, index) => ({ name, status: index === 3 ? "needs-attention" : "validated", detail: index === 3 ? "Address proof is unclear. Upload a clearer copy." : "File format and details verified." }));
  return Response.json({ applicationId: "PP-2026-08142", documents });
}
