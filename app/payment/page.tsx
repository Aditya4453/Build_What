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
        className="mx-auto flex min-h-[calc(100vh-160px)] max-w-lg flex-col justify-center px-4 py-10 sm:px-6"
      >
        <div className="mb-2">
          <span className="ux4g-tag-tonal-brand ux4g-tag-s">
            Application: {applicationId}
          </span>
        </div>
        <h1 id="payment-title" className="text-2xl font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)] sm:text-3xl">
          Fee Payment
        </h1>

        <div className="ux4g-card ux4g-card-solid ux4g-card-vertical mt-6 p-6 space-y-6 shadow-sm" aria-live="polite">
          <div className="border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] pb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ux4g-text-neutral-tertiary,#737373)]">
              Government Fee
            </p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)]">
              ₹500
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--ux4g-text-neutral-secondary,#404040)]">
              Reference: <span className="font-mono">{f.paymentReference}</span>
            </p>
          </div>

          <div className="ux4g-alert ux4g-alert-info p-4">
            <h2 className="text-xs font-bold text-[var(--ux4g-text-neutral-primary,#171717)] uppercase tracking-wide">
              {state.title}
            </h2>
            <p className="mt-1 text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] leading-relaxed">
              {state.description}
            </p>
          </div>

          {f.paymentStatus === "pending" && (
            <button
              type="button"
              onClick={retry}
              className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full justify-center"
            >
              Confirm demo payment
            </button>
          )}

          {f.paymentStatus === "processing" && (
            <div className="flex items-center justify-center gap-2.5 py-3 text-xs font-semibold text-[var(--ux4g-text-neutral-primary,#171717)]">
              <span className="ux4g-spinner-primary-full ux4g-spinner-sm" role="status" aria-label="Loading" />
              <span>Processing simulated payment safely…</span>
            </div>
          )}

          {f.paymentStatus === "success" && (
            <a
              href={`/track?id=${encodeURIComponent(applicationId)}`}
              className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full flex items-center justify-center gap-1.5"
            >
              <Check size={16} /> <span>Continue to application</span>
            </a>
          )}

          {f.paymentStatus === "failed" && (
            <button
              type="button"
              onClick={retry}
              className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={14} /> <span>Retry payment</span>
            </button>
          )}

          {f.paymentStatus === "confirmation-pending" && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={retry}
                className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md w-full justify-center"
              >
                Check status
              </button>
              <p className="text-[11px] font-semibold text-[var(--ux4g-color-red-700,#8A1A16)] text-center">
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
    <Suspense
      fallback={
        <Shell>
          <section className="mx-auto flex min-h-[calc(100vh-160px)] max-w-lg flex-col justify-center px-4 py-10 text-center">
            <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)]">Loading payment...</p>
          </section>
        </Shell>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
