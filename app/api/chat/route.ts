import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const userId = await sessionUserId();
    if (!userId) {
      return Response.json({ answer: "Please sign in to ask about an application." }, { status: 401 });
    }

    const { message } = await request.json();
    if (!message) {
      return Response.json({ answer: "Please provide a question." }, { status: 400 });
    }

    const db = await getDb();
    
    // Fetch only required application details
    const application = await db.collection("applications").findOne(
      { userId },
      { projection: { id: 1, currentStep: 1, status: 1, nextAction: 1, statusHistory: 1 } }
    );

    if (!application) {
      return Response.json({ answer: "I can’t find an application in your demo account." });
    }

    const appId = application.id;

    // Retrieve other relevant details
    const [payment, documents, appointment] = await Promise.all([
      db.collection("payments").findOne({ applicationId: appId }, { projection: { status: 1, transactionReference: 1, amount: 1 } }),
      db.collection("documents").find({ applicationId: appId }, { projection: { documentType: 1, filename: 1, validationStatus: 1, checks: 1 } }).toArray(),
      db.collection("appointments").findOne({ applicationId: appId }, { projection: { status: 1, date: 1, time: 1, location: 1 } })
    ]);

    // Build small structured context
    const recentHistory = (application.statusHistory || []).slice(-3).map((h: any) => ({
      status: h.status,
      message: h.message,
      timestamp: h.timestamp
    }));

    const documentsContext = documents.map((d: any) => ({
      documentType: d.documentType,
      validationStatus: d.validationStatus,
      checks: (d.checks || []).map((c: any) => ({ checkType: c.checkType, status: c.status, message: c.message }))
    }));

    const context = {
      applicationId: appId,
      currentStep: application.currentStep,
      applicationStatus: application.status,
      nextAction: application.nextAction,
      paymentStatus: payment?.status || "none",
      paymentReference: payment?.transactionReference || "none",
      paymentAmount: payment?.amount || 0,
      appointmentStatus: appointment?.status || "not-available",
      appointmentDate: appointment?.date || "none",
      appointmentTime: appointment?.time || "none",
      appointmentLocation: appointment?.location || "none",
      documents: documentsContext,
      recentStatusHistory: recentHistory
    };

    const systemPrompt = `You are a helpful citizen support AI assistant for the Parivahan Path portal.
You have access to the citizen's current application context below. 

Rules:
1. Answer the citizen's question accurately using ONLY facts from the provided context.
2. If the user asks about something not mentioned in the context (like other services, other dates, or custom fees), clearly say you don't know and reference only available context.
3. NEVER invent or hallucinate any dates, statuses, reference IDs, or other details.
4. Keep your answers brief, professional, and citizen-friendly.
5. If the application is approved, help celebrate or guide them on next steps. If payment is pending/processing, instruct them not to pay twice.

Context:
${JSON.stringify(context, null, 2)}`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            temperature: 0.1,
            max_tokens: 150
          })
        });

        if (response.ok) {
          const result = await response.json();
          const answer = result.choices?.[0]?.message?.content?.trim();
          if (answer) {
            return Response.json({ answer });
          }
        }
        console.warn("OpenAI API response error, using fallback logic.");
      } catch (apiErr) {
        console.error("OpenAI API fetch failed, using fallback logic.", apiErr);
      }
    }

    // Local context fallback (if key is missing or API call fails)
    const q = String(message).toLowerCase();
    let answer = `I can only explain the current stored application. Your next step is ${context.nextAction}.`;
    if (q.includes("pay") || q.includes("payment")) {
      answer = context.paymentStatus === "success" 
        ? "Your payment is confirmed. Do not pay again; the next stored step is document verification." 
        : "We’re confirming your payment. Don’t pay again. Use Check Status; it updates this same payment record.";
    } else if (q.includes("document")) {
      answer = `Your document status is ${context.applicationStatus}. The stored checks include format, readability, signature, and required information.`;
    } else if (q.includes("appoint")) {
      answer = context.appointmentStatus === "not-available" 
        ? "An appointment is not available in the current application yet. It becomes available after RTO processing." 
        : `Your appointment is ${context.appointmentDate} at ${context.appointmentTime} at ${context.appointmentLocation}.`;
    } else if (q.includes("process") || q.includes("status")) {
      const lastMsg = context.recentStatusHistory[context.recentStatusHistory.length - 1]?.message || "";
      answer = `Your application is currently ${context.currentStep}. ${lastMsg} Next: ${context.nextAction}.`;
    }

    return Response.json({ answer });
  } catch (error) {
    console.error("AI Chat completion error:", error);
    return Response.json({ answer: "I could not analyze your application context at this time. Please try again." }, { status: 500 });
  }
}
