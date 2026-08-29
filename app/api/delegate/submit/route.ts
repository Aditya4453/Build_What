import { submitDelegatedApplication } from "@/lib/delegated-access";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, answers = {}, uploads = {} } = body;

    if (!token) {
      return Response.json(
        { success: false, error: "Missing delegation token" },
        { status: 400 }
      );
    }

    const result = await submitDelegatedApplication({
      token,
      answers,
      uploads,
    });

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error || "Submission failed" },
        { status: 403 }
      );
    }

    return Response.json({
      success: true,
      applicationId: result.applicationId,
      ownerName: result.ownerName,
      message: `Submitted successfully. ${result.ownerName} will be notified.`,
    });
  } catch (error) {
    console.error("Error in delegated submit API:", error);
    return Response.json(
      { success: false, error: "Internal server error during delegated submission" },
      { status: 500 }
    );
  }
}
