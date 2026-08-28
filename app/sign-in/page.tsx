"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { useFlow } from "@/components/flow-provider";

export default function Page() {
  const r = useRouter();
  const f = useFlow();
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
        className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md flex-col justify-center px-6 py-10"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
          MongoDB Secured Portal
        </p>
        <h1 id="sign-in-title" className="mt-1 text-2xl font-bold tracking-tight text-primary">
          Continue to portal
        </h1>
        <p className="mt-2 text-xs text-outline leading-relaxed">
          Your credentials and application logs are saved directly in MongoDB.
        </p>

        <div className="card mt-6 p-6 space-y-4">
          <h2 className="text-sm font-bold text-primary border-b border-outline-variant/40 pb-2 uppercase tracking-wide">
            Citizen Session
          </h2>
          
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-outline" htmlFor="email-input">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-xs bg-surface-container focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-outline" htmlFor="password-input">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-xs bg-surface-container focus:outline-none"
            />
            <p className="text-[10px] text-outline mt-1 font-medium leading-relaxed">
              Enter any new password to register, or use your existing password to log in.
            </p>
          </div>

          <button
            onClick={() => handleSignIn(false)}
            disabled={loading}
            className="btn-primary w-full py-2.5 font-bold text-xs"
          >
            {loading ? "Authenticating..." : "Sign In / Register"}
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/60"></div>
            </div>
            <span className="relative bg-surface-low px-3 text-[10px] uppercase font-bold tracking-wider text-outline">
              Or Quick Sign In
            </span>
          </div>

          <p className="text-[10px] font-medium text-outline text-center leading-relaxed">
            Test account: <span className="bg-surface-container font-mono px-1 py-0.5 rounded text-primary">citizen@example.demo</span> · password <span className="bg-surface-container font-mono px-1 py-0.5 rounded text-[#2c3d52]">demo123</span>
          </p>

          <button
            onClick={() => handleSignIn(true)}
            disabled={loading}
            className="btn-secondary w-full py-2.5 text-xs"
          >
            Use Demo Citizen Account
          </button>

          {error && (
            <p role="alert" className="mt-3 text-xs font-semibold text-[#b3261e] border border-[#f2b8b5] bg-[#ffe4e1] rounded-lg p-2.5 text-center leading-relaxed animate-in fade-in duration-200">
              {error}
            </p>
          )}
        </div>
      </section>
    </Shell>
  );
}
