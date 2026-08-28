"use client";

import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, Send, X, Bot, Sparkles } from "lucide-react";
import { useState } from "react";

export function CitizenAssistant() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("Ask about your documents, payment, appointment, or next step.");
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
      {/* Help floating button trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open application help assistant"
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-primary text-xs font-bold text-surface shadow-civic border border-outline-variant/10 hover:opacity-90 transition-opacity btn-chat-trigger"
      >
        <MessageCircle size={15} />
        Assistant Help
      </button>

      {open && (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Application help assistant"
          className="fixed bottom-[88px] right-6 z-40 w-[min(90vw,360px)] rounded-2xl border border-outline-variant bg-surface-low p-5 shadow-civic animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Chat header area */}
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                <Sparkles size={13} />
              </span>
              <div>
                <h2 className="text-xs font-bold text-primary flex items-center gap-1">
                  Parivahan Guide
                </h2>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-outline">Smart Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="flex h-6 w-6 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-primary"
            >
              <X size={14} />
            </button>
          </div>

          <p className="mt-3 text-[10px] leading-normal text-outline">
            Uses saved application context in MongoDB. Will not make any unauthorized changes.
          </p>

          {/* Conversational bubble container */}
          <div aria-live="polite" className="mt-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary text-surface text-[10px] font-bold mt-0.5">
                <Bot size={11} />
              </span>
              <div className="rounded-2xl rounded-tl-none bg-surface-container/70 border border-outline-variant/40 px-3.5 py-2.5 text-xs text-primary leading-relaxed shadow-sm">
                {loading ? (
                  <span className="flex items-center gap-1.5 font-medium text-outline">
                    <span className="h-1 w-1 bg-outline rounded-full animate-bounce" />
                    <span className="h-1 w-1 bg-outline rounded-full animate-bounce delay-75" />
                    <span className="h-1 w-1 bg-outline rounded-full animate-bounce delay-150" />
                    Checking application database…
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
            <label className="sr-only" htmlFor="assistant-question">Ask a question</label>
            <input
              id="assistant-question"
              required
              name="question"
              className="min-w-0 flex-1 rounded-xl border border-outline-variant/60 bg-surface-container/50 px-3.5 py-2 text-xs focus:bg-surface-low focus:outline-none"
              placeholder="e.g. Why no appointment?"
            />
            <button
              disabled={loading}
              className="btn-primary min-w-[36px] px-0 justify-center rounded-xl py-2.5"
              aria-label="Ask assistant"
            >
              <Send size={12} />
            </button>
          </form>

          {path !== "/track" && (
            <button
              onClick={() => {
                setOpen(false);
                r.push("/track");
              }}
              className="mt-3.5 block text-center w-full text-[10px] font-extrabold tracking-wider uppercase text-secondary hover:underline"
            >
              View Application status log
            </button>
          )}
        </section>
      )}
    </>
  );
}
