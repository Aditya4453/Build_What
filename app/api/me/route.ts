import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const userId = await sessionUserId();
    if (!userId) {
      return Response.json({ user: null, context: null });
    }

    const db = await getDb();
    
    // Fetch user details
    const user = await db.collection("users").findOne({ id: userId });
    if (!user) {
      return Response.json({ user: null, context: null });
    }

    // Fetch the active application for this user
    const application = await db.collection("applications").findOne({ userId });
    if (!application) {
      const cleanUser = { ...user };
      delete (cleanUser as any)._id;
      delete (cleanUser as any).password;
      return Response.json({ user: cleanUser, context: null });
    }

    const appId = application.id;

    // Fetch remaining application details in parallel
    const [documents, payment, appointment] = await Promise.all([
      db.collection("documents").find({ applicationId: appId }).toArray(),
      db.collection("payments").findOne({ applicationId: appId }),
      db.collection("appointments").findOne({ applicationId: appId })
    ]);

    const clean = (item: any) => {
      if (!item) return null;
      const { _id, password, ...rest } = item;
      return rest;
    };

    const cleanArr = (arr: any[]) => {
      return arr.map(item => clean(item));
    };

    const cleanUser = clean(user);
    const cleanApp = clean(application);
    const cleanDocs = cleanArr(documents);
    const cleanPayment = clean(payment);
    const cleanAppointment = clean(appointment);

    const context = {
      user: cleanUser,
      application: cleanApp,
      history: (application.statusHistory || []).slice(-4).map((h: any) => {
        const { _id, ...rest } = h;
        return rest;
      }),
      documents: cleanDocs,
      payment: cleanPayment,
      appointment: cleanAppointment
    };

    return Response.json({
      user: cleanUser,
      context
    });
  } catch (error) {
    console.error("Error retrieving user context:", error);
    return Response.json({ user: null, context: null }, { status: 500 });
  }
}
