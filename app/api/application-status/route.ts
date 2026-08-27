export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 650));
  const attempt = Number(new URL(request.url).searchParams.get("attempt") || "0");
  // About one in ten independent demo attempts ends in a recoverable review failure.
  const rejected = Math.random() < 0.1;
  return Response.json({ applicationId: "PP-2026-08142", status: rejected ? "rejected" : "approved", attempt, retryable: rejected });
}
