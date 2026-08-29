"use client";

import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, Send, X, Bot, Sparkles, User, RefreshCw, Trash2, ArrowUpRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useFlow } from "./flow-provider";
import { getTranslation } from "@/lib/translations";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

// Markdown & structured text formatter for chat bubbles
function FormattedMessage({ text }: { text: string }) {
  // Normalize clumped asterisk bullets like: "Text * **Key:** Val * **Key2:** Val"
  let cleanText = text.replace(/([^\n])\s*\*\s+\*\*/g, "$1\n\n* **");
  cleanText = cleanText.replace(/([^\n])\s*•\s+/g, "$1\n\n• ");

  // Split into paragraphs / lines
  const lines = cleanText.split("\n").map(l => l.trim()).filter(Boolean);

  const renderInlineMarkdown = (content: string) => {
    // Parse **bold** and *italic*
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="font-semibold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-neutral-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={idx} className="italic text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-300">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        // Bullet item
        if (line.startsWith("* ") || line.startsWith("- ") || line.startsWith("• ")) {
          const itemText = line.replace(/^[\*\-•]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ux4g-color-primary-600,#002B7F)] shrink-0 mt-1.5" />
              <div className="flex-1 text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-neutral-100">
                {renderInlineMarkdown(itemText)}
              </div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-neutral-100">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

export function CitizenAssistant() {
  const { language } = useFlow();
  const t = getTranslation(language);
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getGreeting = () => {
    if (language === "hi") {
      return "नमस्ते! मैं परिवहन सहायक हूँ। आप अपने आवेदन स्थिति, शुल्क, दस्तावेज़ या अपॉइंटमेंट के बारे में कभी भी पूछ सकते हैं।";
    }
    if (language === "mr") {
      return "नमस्कार! मी परिवहन सहाय्यक आहे. आपण आपल्या अर्जाची स्थिती, पेमेंट, कागदपत्रे किंवा अपॉइंटमेंटबद्दल विचारू शकता.";
    }
    if (language === "ta") {
      return "வணக்கம்! நான் பரிவஹன் வழிகாட்டி. உங்கள் விண்ணப்ப நிலை, கட்டணம் அல்லது அப்பாயிண்ட்மெண்ட் பற்றி கேளுங்கள்.";
    }
    return "Hello! I am your Parivahan Guide. You can ask about your application status, payment, documents, or appointment schedule.";
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-greeting",
      sender: "bot",
      text: getGreeting(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const quickPrompts = [
    { label: "📋 Application Status", query: "What is my current application status and next step?" },
    { label: "💳 Payment Details", query: "What is my payment status and reference number?" },
    { label: "📅 Appointment", query: "When and where is my appointment scheduled?" },
    { label: "📑 Document Checks", query: "What is the status of my uploaded documents?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: query, screen: path }),
      });
      const data = await response.json();
      const botReply = data.answer || "I could not retrieve your application context at this moment.";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "Could not connect to the assistant service. Please check your network or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        sender: "bot",
        text: getGreeting(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Parivahan AI Assistant"
        className="ux4g-btn ux4g-btn-primary ux4g-btn-md fixed bottom-6 right-6 z-30 flex items-center gap-2.5 rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Sparkles size={16} />
        <span className="font-semibold text-xs tracking-wide">Assistant Help</span>
      </button>

      {/* Chat window modal */}
      {open && (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Parivahan AI Chatbot"
          className="fixed bottom-6 right-6 z-40 flex flex-col w-[min(92vw,380px)] h-[540px] max-h-[85vh] rounded-2xl bg-white dark:bg-neutral-900 border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[var(--ux4g-color-primary-600,#002B7F)] to-[var(--ux4g-color-primary-800,#001A4D)] text-white shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-inner">
                <Bot size={18} />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-bold text-white tracking-wide">
                    Parivahan Guide
                  </h2>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI Assistant
                  </span>
                </div>
                <p className="text-[10px] text-white/80 font-medium">
                  Verified Portal Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation"
                aria-label="Clear chat"
                className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/15 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/15 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Subheader info note */}
          <div className="px-3.5 py-1.5 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800/60 border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 flex items-center justify-between text-[10px] text-[var(--ux4g-text-neutral-secondary,#525252)] dark:text-neutral-400">
            <span>🔒 Synced with application database</span>
            {path !== "/track" && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push("/track");
                }}
                className="font-semibold text-[var(--ux4g-color-primary-600,#002B7F)] hover:underline inline-flex items-center gap-0.5"
              >
                Track Log <ArrowUpRight size={10} />
              </button>
            )}
          </div>

          {/* Chat message stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/50 dark:bg-neutral-900/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs shadow-sm mt-0.5 ${
                    msg.sender === "user"
                      ? "bg-neutral-800 text-white dark:bg-neutral-700"
                      : "bg-[var(--ux4g-color-primary-600,#002B7F)] text-white"
                  }`}
                >
                  {msg.sender === "user" ? <User size={13} /> : <Bot size={13} />}
                </span>

                {/* Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs ${
                    msg.sender === "user"
                      ? "rounded-tr-none bg-[var(--ux4g-color-primary-600,#002B7F)] text-white font-medium"
                      : "rounded-tl-none bg-white dark:bg-neutral-800 border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700/80 text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-neutral-100"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <FormattedMessage text={msg.text} />
                  )}
                  <span
                    className={`block text-[9px] mt-1.5 text-right font-normal ${
                      msg.sender === "user" ? "text-white/70" : "text-[var(--ux4g-text-neutral-tertiary,#737373)]"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading / Thinking Indicator */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ux4g-color-primary-600,#002B7F)] text-white text-xs shadow-sm mt-0.5">
                  <Bot size={13} />
                </span>
                <div className="rounded-2xl rounded-tl-none bg-white dark:bg-neutral-800 border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700/80 px-3.5 py-3 shadow-sm flex items-center gap-2 text-xs text-[var(--ux4g-text-neutral-secondary,#525252)]">
                  <span className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--ux4g-color-primary-600,#002B7F)] animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--ux4g-color-primary-600,#002B7F)] animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--ux4g-color-primary-600,#002B7F)] animate-bounce"></span>
                  </span>
                  <span className="text-[11px] font-medium text-[var(--ux4g-text-neutral-tertiary,#737373)]">
                    Analyzing database…
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Carousel/Chips */}
          <div className="px-3 pt-2 pb-1.5 bg-white dark:bg-neutral-900 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => handleSendMessage(chip.query)}
                className="shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800 border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-300 hover:bg-[var(--ux4g-color-primary-50,#EEF4FF)] dark:hover:bg-blue-950/40 hover:text-[var(--ux4g-color-primary-600,#002B7F)] hover:border-[var(--ux4g-color-primary-200,#B5D3FB)] transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input & Action Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-neutral-900 flex items-center gap-1.5"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800 px-3.5 py-2.5 text-xs text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--ux4g-color-primary-500,#1D4ED8)] transition-all"
                placeholder="Ask about status, payment, documents..."
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              aria-label="Send query"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--ux4g-color-primary-600,#002B7F)] text-white hover:bg-[var(--ux4g-color-primary-700,#002266)] disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
            >
              <Send size={14} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
