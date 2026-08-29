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

    const systemPrompt = `You are a helpful, courteous citizen support AI assistant for the Parivahan Path portal.
You have access to the citizen's current application context below. 

Formatting & Response Rules:
1. Always structure your responses clearly with clean paragraphs and distinct bullet points on new lines.
2. Answer accurately using ONLY facts from the provided context.
3. If the user asks about something not mentioned in the context (like other services or unrecorded dates), clearly say you don't know and reference only available context.
4. NEVER invent or hallucinate dates, statuses, reference IDs, or details.
5. Keep your answers brief, professional, and citizen-friendly.

Context:
${JSON.stringify(context, null, 2)}`;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    // 1. Try Google Gemini API first
    if (geminiApiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }],
              },
              contents: [
                {
                  role: "user",
                  parts: [{ text: message }],
                },
              ],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 1000,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const answer = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (answer) {
            return Response.json({ answer, provider: "gemini" });
          }
        } else {
          console.warn("Gemini API returned non-OK status:", geminiRes.status, await geminiRes.text());
        }
      } catch (geminiErr) {
        console.error("Gemini API call failed, attempting fallback:", geminiErr);
      }
    }

    // 2. Secondary fallback to OpenAI if configured
    if (openaiApiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`
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
            return Response.json({ answer, provider: "openai" });
          }
        }
      } catch (openAiErr) {
        console.error("OpenAI fallback failed:", openAiErr);
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
