import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { sessionName } from "@/lib/demo-session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email) {
      return Response.json({ message: "Email is required." }, { status: 400 });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password || "demo123").trim();

    const db = await getDb();
    
    // Find user in MongoDB
    let user = await db.collection("users").findOne({ email: cleanEmail });

    if (user) {
      const expectedPassword = (user as any).password || "demo123";
      if (cleanPassword !== expectedPassword) {
        return Response.json({ message: "Incorrect password for this account." }, { status: 401 });
      }
    } else {
      // User registration and auto-provision flow
      const userId = "usr_" + Math.random().toString(36).substring(2, 10);
      const emailParts = cleanEmail.split("@");
      const baseName = emailParts[0];
      const name = baseName
        .split(/[._\-+]/)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");

      const randomPhone = "+91 " + Math.floor(6000000000 + Math.random() * 4000000000).toString();
      const now = new Date().toISOString();

      user = {
        id: userId,
        name,
        email: cleanEmail,
        phone: randomPhone,
        createdAt: now,
        password: cleanPassword, // Preserve password for authenticating later
      } as any;

      // Provision a default application for the registered user
      const appId = "DLR-2026-" + Math.floor(10000 + Math.random() * 90000).toString();
      const docId1 = "doc_" + Math.random().toString(36).substring(2, 10);
      const docId2 = "doc_" + Math.random().toString(36).substring(2, 10);
      const payId = "pay_" + Math.random().toString(36).substring(2, 10);
      const aptId = "apt_" + Math.random().toString(36).substring(2, 10);
      const payRef = "PP-PAY-" + Math.floor(1000000 + Math.random() * 9000000).toString();

      const newApplication = {
        id: appId,
        userId: userId,
        serviceType: "Driving Licence Renewal",
        status: "document-verification",
        currentStep: "Document verification",
        createdAt: now,
        updatedAt: now,
        nextAction: "Await document verification",
        statusHistory: [
          { id: "hist_" + Math.random().toString(36).substring(2, 10), applicationId: appId, status: "Application submitted", message: "Your driving licence renewal application was received.", timestamp: now },
          { id: "hist_" + Math.random().toString(36).substring(2, 10), applicationId: appId, status: "Payment confirmed", message: "The synthetic ₹500 payment was confirmed.", timestamp: now },
          { id: "hist_" + Math.random().toString(36).substring(2, 10), applicationId: appId, status: "Documents received", message: "Your uploaded files are ready for validation.", timestamp: now },
          { id: "hist_" + Math.random().toString(36).substring(2, 10), applicationId: appId, status: "Document verification", message: "We are checking document readability and required information.", timestamp: now },
        ]
      };

      const newDocuments = [
        {
          id: docId1,
          applicationId: appId,
          documentType: "Current driving licence",
          filename: "driving-licence.pdf",
          validationStatus: "approved",
          checks: [
            { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "Format verified", status: "approved", message: "PDF format is supported." },
            { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "File readable", status: "approved", message: "The file can be read." },
            { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "Signature present", status: "approved", message: "A signature is visible." }
          ]
        },
        {
          id: docId2,
          applicationId: appId,
          documentType: "Address proof",
          filename: "address-proof.pdf",
          validationStatus: "processing",
          checks: [
            { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "Format verified", status: "approved", message: "PDF format is supported." },
            { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "File readable", status: "approved", message: "The file can be read." },
            { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "Signature present", status: "approved", message: "A signature is visible." },
            { id: "check_" + Math.random().toString(36).substring(2, 10), checkType: "Required information detected", status: "processing", message: "Waiting for mock validation." }
          ]
        }
      ];

      const newPayment = {
        id: payId,
        applicationId: appId,
        amount: 500,
        transactionReference: payRef,
        status: "success",
        createdAt: now,
        updatedAt: now,
      };

      const newAppointment = {
        id: aptId,
        applicationId: appId,
        date: "",
        time: "",
        location: "",
        status: "not-available",
      };

      // Write all to MongoDB directly
      await db.collection("users").insertOne(user as any);
      await db.collection("applications").insertOne(newApplication);
      await db.collection("documents").insertMany(newDocuments);
      await db.collection("payments").insertOne(newPayment);
      await db.collection("appointments").insertOne(newAppointment);
    }

    const { password: _, _id, ...safeUser } = user as any;

    (await cookies()).set(sessionName, safeUser.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ user: safeUser });
  } catch (error: any) {
    console.error("Authentication error:", error);
    return Response.json({ message: "An error occurred during authentication." }, { status: 500 });
  }
}
