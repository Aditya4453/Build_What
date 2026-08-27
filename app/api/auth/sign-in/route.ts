import { cookies } from "next/headers";
import { readStore } from "@/lib/demo-store";
import { sessionName } from "@/lib/demo-session";
export async function POST(request:Request){const {email,password}=await request.json();const store=await readStore();const user=store.users.find(u=>u.email===email);if(!user||password!=="demo123")return Response.json({message:"Use the published demo credentials."},{status:401});(await cookies()).set(sessionName,user.id,{httpOnly:true,sameSite:"lax",path:"/",maxAge:60*60*24*7});return Response.json({user})}
