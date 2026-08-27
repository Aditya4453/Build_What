"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
declare global { interface Window { turnstile?: { render: (container: HTMLElement, options: Record<string, unknown>) => string; reset: (id?: string) => void } } }
export function TurnstileDemo({ onVerified }: { onVerified: (value: boolean) => void }) {
  const ref=useRef<HTMLDivElement>(null), [state,setState]=useState<"unverified"|"verifying"|"verified"|"failed">("unverified"), [widget,setWidget]=useState<string>();
  const render=()=>{if(!ref.current||!window.turnstile||widget)return;const id=window.turnstile.render(ref.current,{sitekey:"1x00000000000000000000AA",theme:"light",callback:()=>{setState("verified");onVerified(true)},"error-callback":()=>{setState("failed");onVerified(false)},"before-interactive-callback":()=>setState("verifying")});setWidget(id)};
  useEffect(()=>{render()},[widget]);
  return <div className="mt-6 rounded-md border border-secondary/30 bg-[#e4f7f7] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-bold">Human verification <span className="text-sm text-secondary">(demo)</span></p><p aria-live="polite" className="text-sm text-muted">{state==="unverified"?"Complete the Turnstile test to submit.":state==="verifying"?"Verifying…":state==="verified"?"Verified.":"Verification failed. Please retry."}</p></div><span className="rounded-full border border-secondary/30 px-3 py-1 text-xs font-bold text-secondary">Secured</span></div><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={render}/><div className="mt-3" ref={ref}/>{state==="failed"&&<button onClick={()=>{onVerified(false);setState("unverified");window.turnstile?.reset(widget)}} className="btn-secondary mt-3 py-2">Retry verification</button>}</div>;
}
