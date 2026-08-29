"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  Clock,
  ExternalLink,
  Lock,
} from "lucide-react";
import intents from "@/data/intents.json";
import { requirementFor, validateAnswer } from "@/data/forms";
import { Shell } from "@/components/shell";

const data = intents as typeof intents;

interface DelegateAppState {
  valid: boolean;
  token?: string;
  applicationId?: string;
  ownerName?: string;
  intent?: "ownership-transfer" | "license-renewal";
  delegateName?: string;
  applicationState?: {
    answers: Record<string, string>;
    uploads: Record<string, string>;
    prompt?: string;
  };
  expiresAt?: string;
  reason?: string;
  message?: string;
}

export default function DelegatePage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [delegateData, setDelegateData] = useState<DelegateAppState | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState<"questions" | "uploads" | "review" | "success">("questions");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [qError, setQError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`/api/delegate/${encodeURIComponent(token)}`)
      .then(async (res) => {
        const json = await res.json();
        setDelegateData(json);
        if (json.valid && json.applicationState) {
          setAnswers(json.applicationState.answers || {});
          setUploads(json.applicationState.uploads || {});
        }
      })
      .catch(() => {
        setDelegateData({
          valid: false,
          reason: "NETWORK_ERROR",
          message: "Could not connect to the delegation service.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <Shell>
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center p-6 text-center">
          <span className="ux4g-spinner-primary-full ux4g-spinner-lg mb-4" role="status" aria-label="Validating token" />
          <h2 className="text-base font-bold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white">
            Validating Secure Assistance Link…
          </h2>
          <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400 mt-1">
            Verifying cryptographic token and single-use permissions.
          </p>
        </div>
      </Shell>
    );
  }

  // Handle Invalid / Expired / Already Used Token
  if (!delegateData || !delegateData.valid) {
    const isUsed = delegateData?.reason === "ALREADY_USED";
    const isExpired = delegateData?.reason === "EXPIRED";

    return (
      <Shell>
        <section aria-labelledby="invalid-link-title" className="mx-auto my-12 max-w-lg px-4 sm:px-6">
          <div className="ux4g-card ux4g-card-solid p-8 text-center rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 shadow-md space-y-4">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertCircle size={28} />
            </div>

            <h1 id="invalid-link-title" className="text-xl font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white">
              {isUsed
                ? "This Application Has Already Been Completed"
                : isExpired
                ? "This Assistance Link Has Expired"
                : "Assistance Link Not Found"}
            </h1>

            <p className="text-xs leading-relaxed text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-300">
              {isUsed
                ? "This single-use link was already completed and securely submitted. No further modifications can be made through this proxy link."
                : isExpired
                ? "For safety, delegated assistance links expire automatically. Please ask the applicant to generate a fresh link from their portal."
                : "This link is invalid or may have been revoked by the application owner."}
            </p>

            <div className="pt-4 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/" className="ux4g-btn ux4g-btn-primary ux4g-btn-sm w-full sm:w-auto">
                Go to Parivahan Home
              </Link>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  const intentKey = delegateData.intent || "ownership-transfer";
  const item = data[intentKey];
  const ownerName = delegateData.ownerName || "the applicant";
  const helperLabel = delegateData.delegateName || "Helper";
  const currentQ = item.questions[currentQIndex];
  const isLastQ = currentQIndex >= item.questions.length - 1;

  const handleAnswerSubmit = (ans: string) => {
    const trimmed = ans.trim();
    const check = validateAnswer(intentKey, currentQ.id, trimmed);

    if (!check.success) {
      setQError(check.error.issues[0]?.message || "Please check this answer.");
      return;
    }

    setQError("");
    setAnswers((prev) => ({ ...prev, [currentQ.id]: trimmed }));
    setInputVal("");

    if (isLastQ) {
      setActiveStep("uploads");
    } else {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handleUploadFile = (docName: string) => {
    setUploads((prev) => ({
      ...prev,
      [docName]: `${docName.toLowerCase().replaceAll(" ", "-")}.pdf`,
    }));
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/delegate/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          answers,
          uploads,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Submission failed");
      }

      setActiveStep("success");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Persistent Scoped Assistance Banner */}
        <div className="mb-6 rounded-2xl border border-[var(--ux4g-color-primary-200,#B5D3FB)] dark:border-blue-900 bg-[var(--ux4g-color-primary-50,#EEF4FF)] dark:bg-blue-950/40 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--ux4g-color-primary-600,#002B7F)] text-white shrink-0 mt-0.5">
                <Users size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--ux4g-color-primary-600,#002B7F)] dark:text-blue-300">
                    Delegated Assistant Mode
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <h2 className="text-xs sm:text-sm font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white mt-0.5">
                  You are helping <span className="underline decoration-[#002B7F]">{ownerName}</span> complete: {item.label}
                </h2>
                <p className="text-[11px] text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-300">
                  Application ID: <strong className="font-mono">{delegateData.applicationId}</strong> · Scoped exclusively to this application.
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white dark:bg-neutral-900 border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                <Lock size={10} /> Safe & Scoped
              </span>
            </div>
          </div>
        </div>

        {/* Step Progress Tracker */}
        {activeStep !== "success" && (
          <div className="mb-6 flex items-center justify-between border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 pb-3 text-xs font-semibold text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${activeStep === "questions" ? "bg-[#002B7F] text-white" : "bg-emerald-600 text-white"}`}>
                1
              </span>
              <span className={activeStep === "questions" ? "font-bold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white" : ""}>
                Information
              </span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700">───</span>
            <div className="flex items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${activeStep === "uploads" ? "bg-[#002B7F] text-white" : activeStep === "review" ? "bg-emerald-600 text-white" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600"}`}>
                2
              </span>
              <span className={activeStep === "uploads" ? "font-bold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white" : ""}>
                Documents
              </span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700">───</span>
            <div className="flex items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${activeStep === "review" ? "bg-[#002B7F] text-white" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600"}`}>
                3
              </span>
              <span className={activeStep === "review" ? "font-bold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white" : ""}>
                Review & Submit
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: Questions */}
        {activeStep === "questions" && (
          <div className="ux4g-card ux4g-card-solid p-6 rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 shadow-sm space-y-5">
            <div>
              <span className="ux4g-tag-tonal-brand ux4g-tag-s text-[10px] font-bold">
                Step 1: Required Details ({currentQIndex + 1}/{item.questions.length})
              </span>
              <h2 className="text-lg font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white mt-1">
                {currentQ.label}
              </h2>
              <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400 mt-0.5">
                Answer on behalf of {ownerName}
              </p>
            </div>

            {currentQ.options ? (
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAnswerSubmit(opt)}
                    className="p-4 rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800 text-left font-bold text-xs hover:border-[#002B7F] hover:bg-[#EEF4FF]/50 dark:hover:bg-blue-950/40 text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white transition-all shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAnswerSubmit(inputVal);
                }}
                className="space-y-4 pt-2"
              >
                <div>
                  <input
                    type="text"
                    placeholder={currentQ.placeholder || "Enter details..."}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-full rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800 px-4 py-3 text-xs text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#002B7F]"
                  />
                  {qError && (
                    <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {qError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  {currentQIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQIndex((prev) => prev - 1)}
                      className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
                    >
                      <ChevronLeft size={14} /> Back
                    </button>
                  ) : <div />}
                  <button type="submit" className="ux4g-btn ux4g-btn-primary ux4g-btn-sm font-bold inline-flex items-center gap-1">
                    <span>Continue</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STEP 2: Document Uploads */}
        {activeStep === "uploads" && (
          <div className="ux4g-card ux4g-card-solid p-6 rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 shadow-sm space-y-5">
            <div>
              <span className="ux4g-tag-tonal-brand ux4g-tag-s text-[10px] font-bold">
                Step 2: Required Documents
              </span>
              <h2 className="text-lg font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white mt-1">
                Attach Synthetic Documents for {ownerName}
              </h2>
              <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400 mt-0.5">
                Attach the required certificates or identification records below.
              </p>
            </div>

            <div className="space-y-3">
              {item.documents.map((docName) => {
                const isAttached = !!uploads[docName];
                return (
                  <div
                    key={docName}
                    className="p-4 rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white dark:bg-neutral-900 border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 text-[#002B7F] dark:text-blue-400">
                        <FileText size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white">
                          {docName}
                        </h4>
                        <p className="text-[11px] text-[var(--ux4g-text-neutral-tertiary,#737373)] dark:text-neutral-400">
                          {isAttached ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={12} /> {uploads[docName]} attached
                            </span>
                          ) : (
                            "Required for submission"
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUploadFile(docName)}
                      className={`ux4g-btn ${isAttached ? "ux4g-btn-outline-primary" : "ux4g-btn-primary"} ux4g-btn-sm text-xs font-bold shrink-0`}
                    >
                      <UploadCloud size={13} />
                      <span>{isAttached ? "Re-upload" : "Attach Document"}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveStep("questions")}
                className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep("review")}
                className="ux4g-btn ux4g-btn-primary ux4g-btn-sm font-bold inline-flex items-center gap-1"
              >
                <span>Proceed to Review</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Final Submission */}
        {activeStep === "review" && (
          <div className="ux4g-card ux4g-card-solid p-6 rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 shadow-sm space-y-5">
            <div>
              <span className="ux4g-tag-tonal-brand ux4g-tag-s text-[10px] font-bold">
                Step 3: Review & Submission
              </span>
              <h2 className="text-lg font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white mt-1">
                Final Review for {ownerName}
              </h2>
              <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400 mt-0.5">
                Confirm the details below before submitting on behalf of the applicant.
              </p>
            </div>

            {/* Answers Summary */}
            <div className="p-4 rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800/80 space-y-3">
              <h4 className="text-xs font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white uppercase tracking-wider">
                Submitted Information
              </h4>
              <dl className="grid gap-2.5 sm:grid-cols-2 text-xs">
                {Object.entries(answers).map(([key, val]) => (
                  <div key={key}>
                    <dt className="text-[10px] font-bold text-neutral-400 uppercase">{key}</dt>
                    <dd className="font-semibold text-neutral-800 dark:text-neutral-200">{val || "Not provided"}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Documents Summary */}
            <div className="p-4 rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800/80 space-y-2">
              <h4 className="text-xs font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white uppercase tracking-wider">
                Attached Documents
              </h4>
              <ul className="space-y-1.5 text-xs">
                {item.documents.map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{doc}</span>
                    <span className="text-[10px] text-neutral-400">({uploads[doc] || "synthetically verified"})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delegate Declaration Callout */}
            <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 text-xs text-blue-950 dark:text-blue-200">
              <p>
                🤝 By submitting, you confirm that you have completed this application accurately as <strong>{helperLabel}</strong> on behalf of <strong>{ownerName}</strong>. Once submitted, this delegation link will immediately expire.
              </p>
            </div>

            {submitError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveStep("uploads")}
                className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="ux4g-btn ux4g-btn-primary ux4g-btn-md font-bold inline-flex items-center gap-2 shadow-md"
              >
                <span>{submitting ? "Submitting Application..." : "Submit on Behalf of Applicant"}</span>
                <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success Screen */}
        {activeStep === "success" && (
          <div className="ux4g-card ux4g-card-solid p-8 rounded-2xl border border-blue-200 dark:border-blue-900 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 shadow-lg text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#EEF4FF] dark:bg-blue-950/80 text-[#002B7F] dark:text-blue-400">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="ux4g-tag-tonal-brand ux4g-tag-s text-[10px] uppercase font-bold tracking-wider">
                Submitted for Owner Approval
              </span>
              <h2 className="text-2xl font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white mt-2">
                Submitted for Approval!
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-300 mt-1 max-w-md mx-auto">
                Submitted for approval. <strong>{ownerName}</strong> needs to review and confirm before this is officially sent to Parivahan.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800/60 max-w-md mx-auto text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 font-medium">Application ID:</span>
                <span className="font-mono font-bold text-[#002B7F] dark:text-blue-300">{delegateData.applicationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 font-medium">Applicant (Owner):</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 font-medium">Completed By:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{helperLabel} (Proxy Helper)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 font-medium">Current Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Waiting for owner confirmation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 font-medium">Link Status:</span>
                <span className="font-bold text-neutral-500 dark:text-neutral-400">Single-use token locked</span>
              </div>
            </div>

            <p className="text-[11px] text-[var(--ux4g-text-neutral-tertiary,#737373)] dark:text-neutral-400 max-w-md mx-auto">
              {ownerName} can now log into their account to review your inputs, make adjustments if needed, and confirm the official submission.
            </p>

            <div className="pt-2 flex justify-center">
              <Link href="/" className="ux4g-btn ux4g-btn-primary ux4g-btn-md font-bold">
                Return to Parivahan Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
