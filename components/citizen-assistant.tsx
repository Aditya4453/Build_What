"use client";

import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, Send, X, Bot, Sparkles } from "lucide-react";
import { useState } from "react";
import { useFlow } from "./flow-provider";
import { getTranslation } from "@/lib/translations";

export function CitizenAssistant() {
  const { language } = useFlow();
  const t = getTranslation(language);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(
    language === "hi"
      ? "दस्तावेज़, भुगतान या अगले चरण के बारे में पूछें।"
      : language === "mr"
      ? "कागदपत्रे, पेमेंट किंवा पुढील टप्प्याबद्दल विचारा."
      : language === "ta"
      ? "ஆவணங்கள், கட்டணம் அல்லது அடுத்த படி பற்றி கேளுங்கள்."
      : "Ask about your documents, payment, appointment, or next step."
  );
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const r = useRouter();

  const ask = async (form: HTMLFormElement) => {
    const message = new FormData(form).get("question")?.toString() || "";
    if (!message) return;
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, screen: path }),
      });
      const data = await response.json();
      setAnswer(data.answer || "I could not check the stored application.");
    } catch {
      setAnswer("I could not reach the demo application context. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Help floating button trigger using UX4G Primary Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open application help assistant"
        className="ux4g-btn ux4g-btn-primary ux4g-btn-md fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full shadow-lg"
      >
        <MessageCircle size={16} />
        <span>Assistant Help</span>
      </button>

      {open && (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Application help assistant"
          className="ux4g-card ux4g-card-solid ux4g-card-vertical fixed bottom-20 right-6 z-40 w-[min(90vw,360px)] p-5 shadow-2xl animate-in zoom-in-95 duration-150"
        >
          {/* Chat header area */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--ux4g-color-primary-50,#F3F0FF)] dark:bg-[var(--ux4g-color-primary-950,#1A0E3D)] text-[var(--ux4g-color-primary-600,#4A2BC2)]">
                <Sparkles size={14} />
              </span>
              <div>
                <h2 className="text-xs font-bold text-[var(--ux4g-text-neutral-primary,#171717)] flex items-center gap-1">
                  Parivahan Guide
                </h2>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--ux4g-text-neutral-tertiary,#737373)]">
                  Smart Assistant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="ux4g-icon-btn ux4g-icon-btn-outline-primary ux4g-icon-btn-xs"
            >
              <X size={14} />
            </button>
          </div>

          <p className="mt-3 text-[11px] leading-normal text-[var(--ux4g-text-neutral-secondary,#404040)]">
            Uses saved application context in MongoDB. Will not make any unauthorized changes.
          </p>

          {/* Conversational bubble container */}
          <div aria-live="polite" className="mt-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ux4g-color-primary-600,#4A2BC2)] text-white text-[10px] font-bold mt-0.5 shadow-sm">
                <Bot size={12} />
              </span>
              <div className="rounded-xl rounded-tl-none bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] px-3.5 py-2.5 text-xs text-[var(--ux4g-text-neutral-primary,#171717)] leading-relaxed shadow-sm">
                {loading ? (
                  <span className="flex items-center gap-2 font-medium text-[var(--ux4g-text-neutral-secondary,#404040)]">
                    <span className="ux4g-spinner-primary-full ux4g-spinner-xs" role="status" aria-label="Loading" />
                    <span>Checking application database…</span>
                  </span>
                ) : (
                  answer
                )}
              </div>
            </div>
          </div>

          {/* Chat Submission area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(e.currentTarget);
              e.currentTarget.reset();
            }}
            className="mt-4 flex gap-1.5"
          >
            <label className="sr-only" htmlFor="assistant-question">
              Ask a question
            </label>
            <div className="ux4g-input-container ux4g-input-sm ux4g-input-default flex-1">
              <input
                id="assistant-question"
                required
                name="question"
                className="w-full rounded-md border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] px-3 py-2 text-xs text-[var(--ux4g-text-neutral-primary,#171717)] focus:outline-none"
                placeholder="e.g. What is my next step?"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="ux4g-btn ux4g-btn-primary ux4g-btn-sm min-w-[36px] px-2.5 justify-center"
              aria-label="Ask assistant"
            >
              <Send size={13} />
            </button>
          </form>

          {path !== "/track" && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                r.push("/track");
              }}
              className="mt-3.5 block text-center w-full text-[10px] font-bold tracking-wider uppercase text-[var(--ux4g-text-brand-primary-default,#4A2BC2)] hover:underline"
            >
              View Application status log
            </button>
          )}
        </section>
      )}
    </>
  );
}
