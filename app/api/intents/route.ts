import intents from "@/data/intents.json";
export async function GET() { return Response.json(intents); }
