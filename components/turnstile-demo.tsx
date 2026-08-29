"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

export function TurnstileDemo({ onVerified }: { onVerified: (value: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"unverified" | "verifying" | "verified" | "failed">("unverified");
  const [widget, setWidget] = useState<string>();

  const render = () => {
    if (!ref.current || !window.turnstile || widget) return;
    const id = window.turnstile.render(ref.current, {
      sitekey: "1x00000000000000000000AA",
      theme: "light",
      callback: () => {
        setState("verified");
        onVerified(true);
      },
      "error-callback": () => {
        setState("failed");
        onVerified(false);
      },
      "before-interactive-callback": () => setState("verifying"),
    });
    setWidget(id);
  };

  useEffect(() => {
    render();
  }, [widget]);

  return (
    <div className="ux4g-card ux4g-card-solid ux4g-card-vertical mt-6 border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[var(--ux4g-text-neutral-primary,#171717)]">
            Human Verification <span className="font-medium text-[var(--ux4g-text-brand-primary-default,#4A2BC2)]">(Citizen Security Check)</span>
          </p>
          <p aria-live="polite" className="mt-0.5 text-xs text-[var(--ux4g-text-neutral-secondary,#404040)]">
            {state === "unverified"
              ? "Complete the security verification test to submit."
              : state === "verifying"
              ? "Verifying secure citizen session…"
              : state === "verified"
              ? "Verified successfully."
              : "Verification failed. Please retry."}
          </p>
        </div>
        <span className="ux4g-tag-tonal-brand ux4g-tag-s">
          Secured
        </span>
      </div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={render}
      />
      <div className="mt-3" ref={ref} />
      {state === "failed" && (
        <button
          type="button"
          onClick={() => {
            onVerified(false);
            setState("unverified");
            window.turnstile?.reset(widget);
          }}
          className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm mt-3"
        >
          Retry verification
        </button>
      )}
    </div>
  );
}
