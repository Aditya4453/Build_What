export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const attempt = Number(new URL(request.url).searchParams.get("attempt") || "0");
  const random = Math.random();
  const status = random < 0.1 ? "failed" : random < 0.25 ? "confirmation-pending" : "success";
  return Response.json({ status, attempt, amount: 500, reference: "PP-PAY-2608142", charged: status !== "failed" });
}
