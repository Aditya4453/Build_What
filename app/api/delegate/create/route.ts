import { sessionUserId } from "@/lib/demo-session";
import { getDb } from "@/lib/mongodb";
import { createDelegatedAccess } from "@/lib/delegated-access";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      applicationId,
      intent,
      answers = {},
      uploads = {},
      prompt = "",
      expiryHours = 24,
      delegateName = "",
    } = body;

    // Get current session user if signed in, or fallback to synthetic session identifier
    const userId = (await sessionUserId()) || "guest-session";
    const db = await getDb();

    let ownerName = "Citizen";
    if (userId !== "guest-session") {
      const user = await db.collection("users").findOne({ id: userId });
      if (user && user.name) {
        ownerName = user.name;
      }
    }

    const effectiveAppId =
      applicationId ||
      `APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { token, expiresAt } = await createDelegatedAccess({
      applicationId: effectiveAppId,
      createdBy: userId,
      ownerName,
      intent: intent === "license-renewal" ? "license-renewal" : "ownership-transfer",
      applicationState: {
        answers,
        uploads,
        prompt,
      },
      expiryHours: Number(expiryHours) || 24,
      delegateName,
    });

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const shareUrl = `${proto}://${host}/delegate/${token}`;

    return Response.json({
      success: true,
      token,
      shareUrl,
      applicationId: effectiveAppId,
      expiresAt: expiresAt.toISOString(),
      ownerName,
    });
  } catch (error) {
    console.error("Error creating delegated access token:", error);
    return Response.json(
      { success: false, error: "Failed to generate delegation link" },
      { status: 500 }
    );
  }
}
