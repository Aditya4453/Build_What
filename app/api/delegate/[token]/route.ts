import { validateDelegationToken } from "@/lib/delegated-access";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    const result = await validateDelegationToken(token);

    if (!result.valid || !result.data) {
      return Response.json(
        {
          valid: false,
          reason: result.reason || "NOT_FOUND",
          message:
            result.reason === "ALREADY_USED"
              ? "This delegation link has already been completed."
              : result.reason === "EXPIRED"
              ? "This delegation link has expired."
              : "This delegation link is not valid.",
        },
        { status: 403 }
      );
    }

    const { applicationId, ownerName, intent, delegateName, applicationState, expiresAt } =
      result.data;

    // Return strictly scoped application data
    return Response.json({
      valid: true,
      token,
      applicationId,
      ownerName,
      intent,
      delegateName: delegateName || "Helper",
      applicationState,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error looking up delegation token:", error);
    return Response.json(
      { valid: false, reason: "SERVER_ERROR", message: "Error validating link" },
      { status: 500 }
    );
  }
}
