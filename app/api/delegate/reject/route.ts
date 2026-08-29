import { sessionUserId } from "@/lib/demo-session";
import { rejectDelegatedApplication } from "@/lib/delegated-access";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const userId = (await sessionUserId()) || "guest-session";
    const body = await request.json();
    const { applicationId, rejectionNote } = body;

    if (!applicationId) {
      return Response.json(
        { success: false, error: "Missing applicationId" },
        { status: 400 }
      );
    }

    const result = await rejectDelegatedApplication(applicationId, userId, rejectionNote);

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error || "Rejection failed" },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Application returned to draft state.",
      applicationId,
    });
  } catch (error) {
    console.error("Error rejecting delegated application:", error);
    return Response.json(
      { success: false, error: "Failed to reject application" },
      { status: 500 }
    );
  }
}
