import { applicationContext, readStore } from "@/lib/demo-store"; import { sessionUserId } from "@/lib/demo-session";
export async function GET(){const userId=await sessionUserId();if(!userId)return Response.json({applications:[]},{status:401});const store=await readStore();return Response.json({applications:store.applications.filter(a=>a.userId===userId)})}
