"use client";
import { createContext, useContext, useState } from "react";
type Flow = { intent: "ownership-transfer" | "license-renewal"; prompt: string; answers: Record<string, string>; uploads: Record<string, string>; setIntent: (v: Flow["intent"]) => void; setPrompt: (v: string) => void; setAnswers: (v: Record<string,string>) => void; setUploads: (v: Record<string,string>) => void; };
const FlowContext = createContext<Flow | null>(null);
export function FlowProvider({ children }: { children: React.ReactNode }) { const [intent, setIntent] = useState<Flow["intent"]>("ownership-transfer"); const [prompt,setPrompt]=useState(""); const [answers,setAnswers]=useState<Record<string,string>>({}); const [uploads,setUploads]=useState<Record<string,string>>({}); return <FlowContext.Provider value={{intent,prompt,answers,uploads,setIntent,setPrompt,setAnswers,setUploads}}>{children}</FlowContext.Provider>; }
export const useFlow = () => { const value = useContext(FlowContext); if (!value) throw new Error("FlowProvider missing"); return value; };
