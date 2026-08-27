import { cookies } from "next/headers"; import { sessionName } from "@/lib/demo-session";
export async function POST(){(await cookies()).set(sessionName,"",{path:"/",maxAge:0});return Response.json({ok:true})}
