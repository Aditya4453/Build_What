"use client";
import { createContext, useContext, useState } from "react";
type Flow = { intent: "ownership-transfer" | "license-renewal"; prompt: string; answers: Record<string, string>; uploads: Record<string, string>; language: "en" | "hi"; setIntent: (v: Flow["intent"]) => void; setPrompt: (v: string) => void; setAnswers: (v: Record<string,string>) => void; setUploads: (v: Record<string,string>) => void; setLanguage: (v: "en" | "hi") => void; };
const FlowContext = createContext<Flow | null>(null);
export function FlowProvider({ children }: { children: React.ReactNode }) { const [intent, setIntent] = useState<Flow["intent"]>("ownership-transfer"); const [prompt,setPrompt]=useState(""); const [answers,setAnswers]=useState<Record<string,string>>({}); const [uploads,setUploads]=useState<Record<string,string>>({}); const [language,setLanguage]=useState<"en" | "hi">("en"); return <FlowContext.Provider value={{intent,prompt,answers,uploads,language,setIntent,setPrompt,setAnswers,setUploads,setLanguage}}>{children}</FlowContext.Provider>; }
export const useFlow = () => { const value = useContext(FlowContext); if (!value) throw new Error("FlowProvider missing"); return value; };
