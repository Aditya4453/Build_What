import { applicationContext, readStore, writeStore } from "@/lib/demo-store";
import { sessionUserId } from "@/lib/demo-session";
export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const userId=await sessionUserId(); if(!userId)return Response.json({message:"Sign in required"},{status:401});
  const context=await applicationContext(userId); if(!context)return Response.json({message:"No demo application"},{status:404});
  const attempt=Number(new URL(request.url).searchParams.get("attempt")||"0"); const random=Math.random(); const status=random<0.1?"failed":random<0.25?"confirmation-pending":"success";
  const store=await readStore(); const payment=store.payments.find(p=>p.applicationId===context.application.id); if(payment){payment.status=status;payment.updatedAt=new Date().toISOString()} await writeStore(store);
  return Response.json({status,attempt,amount:payment?.amount||500,reference:payment?.transactionReference||"PP-PAY-2608142",charged:status!=="failed"});
}
