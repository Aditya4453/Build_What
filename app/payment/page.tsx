"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, RefreshCw } from "lucide-react";
import { Shell } from "@/components/shell";
import { PaymentStatus, useFlow } from "@/components/flow-provider";

const copy: Record<PaymentStatus, { title: string; description: string }> = {
  pending: {
    title: "Ready to confirm payment",
    description: "Your synthetic fee is ready for confirmation.",
  },
  processing: {
    title: "Confirming your payment",
    description: "Please wait while the mock payment is verified.",
  },
  success: {
    title: "Payment successful",
    description: "Your ₹500 payment is confirmed. Your application can continue.",
  },
  failed: {
    title: "Payment wasn't completed",
    description: "No charge was made to this demo account. You can safely retry.",
  },
  "confirmation-pending": {
    title: "We’re confirming your payment",
    description: "Your ₹500 payment may be deducted. Don’t pay again. Check the status using your reference.",
  },
};

function PaymentPageContent() {
  const f = useFlow();
  const searchParams = useSearchParams();
  const [attempt, setAttempt] = useState(0);
  const applicationId = searchParams.get("id") || f.applicationId;

  useEffect(() => {
    if (f.paymentStatus !== "processing") return;
    const id = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/payment?id=${encodeURIComponent(applicationId)}`, { method: "POST" });
        if (!response.ok) throw new Error("Payment unavailable");
        const data = await response.json();
        f.setPaymentStatus(data.status);
      } catch {
        f.setPaymentStatus("confirmation-pending");
      }
    }, 700);
    return () => clearTimeout(id);
  }, [applicationId, attempt, f]);

  const retry = () => {
    f.setPaymentStatus("processing");
    setAttempt((a) => a + 1);
  };

  const state = copy[f.paymentStatus];

  return (
    <Shell>
      <section
        aria-labelledby="payment-title"
        className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col justify-center px-6 py-10"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
          Application: {applicationId}
        </p>
        <h1 id="payment-title" className="mt-1 text-2xl font-bold tracking-tight text-primary">
          Fee Payment
        </h1>

        <div className="card mt-6 p-6 space-y-6 animate-in fade-in duration-200" aria-live="polite">
          <div className="border-b border-outline-variant/40 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-outline">
              Government Fee
            </p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-primary">
              ₹500
            </p>
            <p className="mt-1 text-[11px] font-semibold text-outline">
              Reference: {f.paymentReference}
            </p>
          </div>

          <div className="rounded-xl bg-surface-container/60 border border-outline-variant/60 p-4">
            <h2 className="text-xs font-bold text-primary uppercase tracking-wide">
              {state.title}
            </h2>
            <p className="mt-1 text-xs text-outline leading-relaxed">
              {state.description}
            </p>
          </div>

          {f.paymentStatus === "pending" && (
            <button onClick={retry} className="btn-primary w-full py-2.5 text-xs">
              Confirm demo payment
            </button>
          )}

          {f.paymentStatus === "processing" && (
            <p className="flex items-center justify-center gap-2 text-xs font-semibold text-primary py-2">
              <RefreshCw className="animate-spin text-secondary" size={14} /> 
              Processing safely…
            </p>
          )}

          {f.paymentStatus === "success" && (
            <a href={`/track?id=${encodeURIComponent(applicationId)}`} className="btn-primary w-full py-2.5 text-xs">
              <Check size={14} /> Continue to application
            </a>
          )}

          {f.paymentStatus === "failed" && (
            <button onClick={retry} className="btn-primary w-full py-2.5 text-xs">
              <RefreshCw size={14} /> Retry payment
            </button>
          )}

          {f.paymentStatus === "confirmation-pending" && (
            <div className="space-y-3">
              <button onClick={retry} className="btn-secondary w-full py-2.5 text-xs">
                Check status
              </button>
              <p className="text-[10px] font-semibold text-[#b3261e] text-center">
                Do not pay again. This will not create a duplicate payment.
              </p>
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <Shell>
        <section className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col justify-center px-6 py-10">
          <p className="text-xs text-outline text-center">Loading payment...</p>
        </section>
      </Shell>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
