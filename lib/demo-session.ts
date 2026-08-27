import { cookies } from "next/headers";
export const sessionName="parivahan_demo_user";
export async function sessionUserId(){return (await cookies()).get(sessionName)?.value || null}
