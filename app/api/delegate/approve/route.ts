import { sessionUserId } from "@/lib/demo-session";
import { approveDelegatedApplication } from "@/lib/delegated-access";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const userId = (await sessionUserId()) || "guest-session";
    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return Response.json(
        { success: false, error: "Missing applicationId" },
        { status: 400 }
      );
    }

    const result = await approveDelegatedApplication(applicationId, userId);

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error || "Approval failed" },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Application approved and submitted for official processing.",
      applicationId,
    });
  } catch (error) {
    console.error("Error approving delegated application:", error);
    return Response.json(
      { success: false, error: "Failed to approve application" },
      { status: 500 }
    );
  }
}
