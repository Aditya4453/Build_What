import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const userId = await sessionUserId();
    if (!userId) {
      return Response.json({ applications: [] }, { status: 401 });
    }
    const db = await getDb();
    const applications = await db.collection("applications").find({ userId }).toArray();
    
    const cleanApps = applications.map(app => {
      const { _id, ...rest } = app;
      return rest;
    });

    return Response.json({ applications: cleanApps });
  } catch (error) {
    console.error("Error retrieving user applications list:", error);
    return Response.json({ applications: [] }, { status: 500 });
  }
}
