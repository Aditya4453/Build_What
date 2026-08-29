"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { useFlow } from "@/components/flow-provider";
import { getTranslation } from "@/lib/translations";

export default function Page() {
  const r = useRouter();
  const f = useFlow();
  const t = getTranslation(f.language);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (useDemo = false) => {
    setLoading(true);
    setError("");

    const payload = useDemo
      ? { email: "citizen@example.demo", password: "demo123" }
      : { email, password };

    if (!useDemo && !payload.email) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Sign-in could not be completed.");
        setLoading(false);
        return;
      }

      const { user } = await response.json();
      f.signIn(user);

      // If citizen filled out details before logging in, sync answers to DB and go to payment
      if (Object.keys(f.answers).length > 0) {
        try {
          await fetch("/api/applications/submit", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ answers: f.answers, uploads: f.uploads }),
          });
        } catch (e) {
          console.warn("Failed to sync wizard answers during auth", e);
        }
        r.push("/payment");
        return;
      }

      // Check for returning user's active application in DB and restore state
      const meResponse = await fetch("/api/me");
      if (meResponse.ok) {
        const meData = await meResponse.json();
        if (meData.context) {
          if (meData.context.application?.id) {
            f.setApplicationId(meData.context.application.id);
            if (meData.context.payment?.transactionReference) {
              f.setPaymentReference(meData.context.payment.transactionReference);
            }
            if (meData.context.payment?.status) {
              f.setPaymentStatus(meData.context.payment.status);
            }
            r.push("/track");
            return;
          }
        }
      }

      r.push("/applications");
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <section
        aria-labelledby="sign-in-title"
        className="mx-auto flex min-h-[calc(100vh-160px)] max-w-md flex-col justify-center px-4 py-10 sm:px-6"
      >
        <div className="mb-2">
          <span className="ux4g-tag-tonal-brand ux4g-tag-s">
            MongoDB Secured Portal
          </span>
        </div>
        <h1 id="sign-in-title" className="text-2xl font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)] sm:text-3xl">
          {t.signIn.title}
        </h1>
        <p className="mt-2 text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] leading-relaxed">
          {t.signIn.subtitle}
        </p>

        <div className="ux4g-card ux4g-card-solid ux4g-card-vertical mt-6 p-6 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--ux4g-text-neutral-secondary,#404040)] border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] pb-2">
            Citizen Session
          </h2>

          <div className="ux4g-input-container ux4g-input-md ux4g-input-default space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ux4g-text-neutral-secondary,#404040)]" htmlFor="email-input">
              {t.signIn.emailLabel}
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-md border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] px-4 py-2.5 text-xs text-[var(--ux4g-text-neutral-primary,#171717)] focus:outline-none"
            />
          </div>

          <div className="ux4g-input-container ux4g-input-md ux4g-input-default space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ux4g-text-neutral-secondary,#404040)]" htmlFor="password-input">
              {t.signIn.passwordLabel}
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] px-4 py-2.5 text-xs text-[var(--ux4g-text-neutral-primary,#171717)] focus:outline-none"
            />
            <p className="text-[11px] text-[var(--ux4g-text-neutral-tertiary,#737373)] mt-1 leading-relaxed">
              Enter any password to register, or use your existing password to log in.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSignIn(false)}
            disabled={loading}
            className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full justify-center"
          >
            {loading ? "Authenticating..." : t.signIn.submitBtn}
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)]"></div>
            </div>
            <span className="relative bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] px-3 text-[10px] uppercase font-bold tracking-wider text-[var(--ux4g-text-neutral-tertiary,#737373)]">
              Or Quick Sign In
            </span>
          </div>

          <p className="text-[11px] font-medium text-[var(--ux4g-text-neutral-secondary,#404040)] text-center leading-relaxed">
            Test account: <span className="bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] font-mono px-1.5 py-0.5 rounded text-[var(--ux4g-text-neutral-primary,#171717)]">citizen@example.demo</span> · password <span className="bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] font-mono px-1.5 py-0.5 rounded text-[var(--ux4g-text-neutral-primary,#171717)]">demo123</span>
          </p>

          <button
            type="button"
            onClick={() => handleSignIn(true)}
            disabled={loading}
            className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md w-full justify-center"
          >
            {t.signIn.demoAccountBtn}
          </button>

          {error && (
            <div role="alert" className="ux4g-alert ux4g-alert-error p-3 text-xs font-semibold text-center">
              {error}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
