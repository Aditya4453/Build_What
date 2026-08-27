"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type PaymentStatus = "pending" | "processing" | "success" | "failed" | "confirmation-pending";
type Citizen = { name: string; email: string };
type Flow = {
  intent: "ownership-transfer" | "license-renewal"; prompt: string; answers: Record<string, string>; uploads: Record<string, string>; language: "en" | "hi";
  citizen: Citizen | null; theme: "light" | "dark"; paymentStatus: PaymentStatus; paymentReference: string;
  setIntent: (v: Flow["intent"]) => void; setPrompt: (v: string) => void; setAnswers: (v: Record<string,string>) => void; setUploads: (v: Record<string,string>) => void; setLanguage: (v: "en" | "hi") => void;
  signIn: (citizen: Citizen) => void; signOut: () => void; setTheme: (theme: "light" | "dark") => void; setPaymentStatus: (status: PaymentStatus) => void;
};
const FlowContext = createContext<Flow | null>(null);
const storageKey = "parivahan-path-demo-session";
export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [intent, setIntent] = useState<Flow["intent"]>("license-renewal"); const [prompt,setPrompt]=useState(""); const [answers,setAnswers]=useState<Record<string,string>>({}); const [uploads,setUploads]=useState<Record<string,string>>({}); const [language,setLanguage]=useState<"en"|"hi">("en"); const [citizen,setCitizen]=useState<Citizen|null>(null); const [theme,setThemeState]=useState<"light"|"dark">("light"); const [paymentStatus,setPaymentStatus]=useState<PaymentStatus>("pending"); const [paymentReference] = useState("PP-PAY-2608142"); const [ready,setReady]=useState(false);
  useEffect(()=>{ const stored=localStorage.getItem(storageKey); if(stored){const saved=JSON.parse(stored); setCitizen(saved.citizen||null); setThemeState(saved.theme||"light"); setPaymentStatus(saved.paymentStatus||"pending");}else setThemeState(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"); setReady(true);},[]);
  useEffect(()=>{if(!ready)return; document.documentElement.dataset.theme=theme; localStorage.setItem(storageKey,JSON.stringify({citizen,theme,paymentStatus}));},[citizen,theme,paymentStatus,ready]);
  const signIn=(value:Citizen)=>setCitizen(value); const signOut=()=>setCitizen(null); const setTheme=(value:"light"|"dark")=>setThemeState(value);
  return <FlowContext.Provider value={{intent,prompt,answers,uploads,language,citizen,theme,paymentStatus,paymentReference,setIntent,setPrompt,setAnswers,setUploads,setLanguage,signIn,signOut,setTheme,setPaymentStatus}}>{children}</FlowContext.Provider>;
}
export const useFlow = () => { const value = useContext(FlowContext); if (!value) throw new Error("FlowProvider missing"); return value; };
