import { applicationContext } from "@/lib/demo-store"; import { sessionUserId } from "@/lib/demo-session";
export async function GET(){const userId=await sessionUserId();if(!userId)return Response.json({user:null,context:null});const context=await applicationContext(userId);return Response.json({user:context?.user||null,context})}
