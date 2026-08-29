"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LanguageCode } from "@/lib/translations";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "confirmation-pending";

export type Citizen = { name: string; email: string };

export type Flow = {
  intent: "ownership-transfer" | "license-renewal";
  prompt: string;
  answers: Record<string, string>;
  uploads: Record<string, string>;
  language: LanguageCode;
  citizen: Citizen | null;
  theme: "light" | "dark";
  paymentStatus: PaymentStatus;
  paymentReference: string;
  applicationId: string;
  setIntent: (v: Flow["intent"]) => void;
  setPrompt: (v: string) => void;
  setAnswers: (v: Record<string, string>) => void;
  setUploads: (v: Record<string, string>) => void;
  setLanguage: (v: LanguageCode) => void;
  signIn: (citizen: Citizen) => void;
  signOut: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setPaymentReference: (v: string) => void;
  setApplicationId: (v: string) => void;
};

const FlowContext = createContext<Flow | null>(null);
const storageKey = "parivahan-path-demo-session";

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [intent, setIntent] = useState<Flow["intent"]>("license-renewal");
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [paymentReference, setPaymentReference] = useState("PP-PAY-2608142");
  const [applicationId, setApplicationId] = useState("PP-2026-08142");
  const [ready, setReady] = useState(false);

  // Restore saved settings on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const saved = JSON.parse(stored);
        if (saved.citizen) setCitizen(saved.citizen);
        const resolvedTheme = saved.theme === "light" || saved.theme === "dark"
          ? saved.theme
          : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setThemeState(resolvedTheme);
        document.documentElement.dataset.theme = resolvedTheme;
        if (resolvedTheme === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");

        if (saved.language) {
          setLanguageState(saved.language);
          document.documentElement.lang = saved.language;
        }
        if (saved.paymentStatus) setPaymentStatus(saved.paymentStatus);
      } else {
        const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = sysDark ? "dark" : "light";
        setThemeState(initialTheme);
        document.documentElement.dataset.theme = initialTheme;
        if (initialTheme === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
      }
    } catch {
      // Fallback in case of localStorage restriction
    }
    setReady(true);
  }, []);

  // Fetch logged in session if any
  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setCitizen(data.user);
          if (data.context?.payment?.status) setPaymentStatus(data.context.payment.status);
          if (data.context?.payment?.transactionReference)
            setPaymentReference(data.context.payment.transactionReference);
          if (data.context?.application?.id) setApplicationId(data.context.application.id);
        }
      })
      .catch(() => undefined);
  }, []);

  // Sync state changes to DOM and localStorage
  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    document.documentElement.lang = language;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ citizen, theme, language, paymentStatus })
      );
    } catch {
      // ignore storage quota errors
    }
  }, [citizen, theme, language, paymentStatus, ready]);

  const signIn = (value: Citizen) => setCitizen(value);
  const signOut = () => setCitizen(null);
  const setTheme = (value: "light" | "dark") => {
    setThemeState(value);
    document.documentElement.dataset.theme = value;
    if (value === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };
  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      if (next === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  };
  const setLanguage = (value: LanguageCode) => {
    setLanguageState(value);
    document.documentElement.lang = value;
  };

  return (
    <FlowContext.Provider
      value={{
        intent,
        prompt,
        answers,
        uploads,
        language,
        citizen,
        theme,
        paymentStatus,
        paymentReference,
        applicationId,
        setIntent,
        setPrompt,
        setAnswers,
        setUploads,
        setLanguage,
        signIn,
        signOut,
        setTheme,
        toggleTheme,
        setPaymentStatus,
        setPaymentReference,
        setApplicationId,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export const useFlow = () => {
  const value = useContext(FlowContext);
  if (!value) throw new Error("FlowProvider missing");
  return value;
};
