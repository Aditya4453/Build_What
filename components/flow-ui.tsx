"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  LockKeyhole,
  RefreshCw,
  UploadCloud,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import intents from "@/data/intents.json";
import { requirementFor, validateAnswer } from "@/data/forms";
import { useFlow } from "./flow-provider";
import { TurnstileDemo } from "./turnstile-demo";
import { getTranslation } from "@/lib/translations";
import { GovernmentUpdates } from "./government-updates";
import { DelegateHelpModal } from "./delegate-help-modal";

const data = intents as typeof intents;

export function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby="page-title" className="mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl flex-col justify-center px-4 py-8 sm:px-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="ux4g-tag-tonal-brand ux4g-tag-s">{number}</span>
        <DelegateHelpModal variant="button" />
      </div>
      <h1 id="page-title" className="mb-4 text-2xl font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)] sm:text-3xl leading-snug">
        {title}
      </h1>
      {children}
    </section>
  );
}

function SecureBadge() {
  return (
    <span className="ux4g-tag-tonal-brand ux4g-tag-s inline-flex items-center gap-1.5 font-bold">
      <LockKeyhole size={12} /> Secured Citizen Session
    </span>
  );
}

export function Landing() {
  const r = useRouter();
  const f = useFlow();
  const t = getTranslation(f.language);

  const start = (p: string) => {
    f.setPrompt(p);
    f.setIntent(/renew|licen[cs]e|नवीनीकरण|लाइसेंस|પરવાનો|నవీకరణ|புதுப்பித்தல்|নবায়ন|ਨਵਿਆਉਣਾ|ନବୀକରଣ|പുതുക്കൽ|নবীকৰণ/i.test(p) ? "license-renewal" : "ownership-transfer");
    r.push("/understand");
  };

  const isDark = f.theme === "dark";

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${isDark ? "'/images/Background_dark.png'" : "'/images/Background_light.png'"})`,
        }}
        className="landing-hero-bg relative min-h-[calc(100vh-160px)] w-full flex items-center justify-center transition-all duration-300"
      >
        <section aria-labelledby="landing-title" className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
          <span className="ux4g-tag-tonal-brand ux4g-tag-s mb-5 uppercase tracking-widest font-bold">
            {t.landing.welcomeBadge}
          </span>

          <h1 id="landing-title" className="max-w-2xl text-3xl font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)] sm:text-4xl md:leading-[1.2]">
            {t.landing.heroTitle}
          </h1>

          <p className="mt-3.5 max-w-lg text-sm leading-relaxed text-[var(--ux4g-text-neutral-secondary,#404040)]">
            {t.landing.heroSubtitle}
          </p>

          {/* Styled UX4G Intent Search form */}
          <form
            aria-label="Describe the service you need"
            onSubmit={(e) => {
              e.preventDefault();
              start(f.prompt);
            }}
            className="ux4g-card ux4g-card-solid ux4g-card-vertical mt-8 flex w-full max-w-2xl flex-col gap-2.5 p-3 shadow-md sm:flex-row bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-sm"
          >
            <label className="sr-only" htmlFor="service-prompt">
              Describe what you need
            </label>
            <div className="ux4g-input-container ux4g-input-md ux4g-input-default flex-1">
              <input
                id="service-prompt"
                value={f.prompt}
                onChange={(e) => f.setPrompt(e.target.value)}
                className="w-full rounded-md border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] px-4 py-2.5 text-sm text-[var(--ux4g-text-neutral-primary,#171717)] focus:outline-none"
                placeholder={t.landing.promptPlaceholder}
              />
            </div>
            <button
              type="submit"
              aria-label="Start service guidance"
              className="ux4g-btn ux4g-btn-primary ux4g-btn-md flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span>{t.landing.startBtn}</span>
              <ChevronRight size={16} />
            </button>
          </form>

          {/* Recommended tasks list using UX4G Filter Chips */}
          <div className="mt-10">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[var(--ux4g-text-neutral-tertiary,#737373)]">
              {t.landing.commonTasksTitle}
            </p>
            <div className="ux4g-filter-chip-group flex flex-wrap justify-center gap-2">
              {[
                { label: t.landing.transferOwnership, action: () => { f.setIntent("ownership-transfer"); f.setPrompt(t.landing.transferOwnership); r.push("/understand"); } },
                { label: t.landing.renewLicense, action: () => { f.setIntent("license-renewal"); f.setPrompt(t.landing.renewLicense); r.push("/understand"); } },
                { label: `${t.landing.replaceRc} · ${t.landing.comingSoon}`, disabled: true },
                { label: `${t.landing.payChallan} · ${t.landing.comingSoon}`, disabled: true },
              ].map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  disabled={item.disabled}
                  onClick={item.action}
                  className={`ux4g-filter-chip-md font-semibold bg-white/90 dark:bg-[#1E1E1E]/90 ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Rules, Policies & National Schemes Section */}
      <GovernmentUpdates />
    </>
  );
}

export function Understand() {
  const r = useRouter();
  const f = useFlow();
  const item = data[f.intent];
  const t = getTranslation(f.language);

  return (
    <Step number={t.understand.step} title={t.understand.title}>
      <div className="ux4g-card ux4g-card-solid ux4g-card-vertical p-6 sm:p-8">
        <span className="ux4g-tag-tonal-brand ux4g-tag-s mb-2 font-bold uppercase">
          {t.understand.identifiedService}
        </span>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)]">
          {item.label}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ux4g-text-neutral-secondary,#404040)]">
          {item.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            aria-label="Confirm identified service"
            onClick={() => r.push("/questions")}
            className="ux4g-btn ux4g-btn-primary ux4g-btn-md flex items-center gap-1.5"
          >
            <span>{t.understand.continueBtn}</span>
            <ChevronRight size={16} />
          </button>
          <Link href="/" className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md">
            {t.understand.changeServiceBtn}
          </Link>
        </div>
      </div>
    </Step>
  );
}

export function Questions() {
  const r = useRouter();
  const f = useFlow();
  const t = getTranslation(f.language);
  const item = data[f.intent];
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");

  const q = item.questions[index];
  const req = requirementFor(f.intent, q.id);

  const choose = (value: string) => {
    const check = validateAnswer(f.intent, q.id, value);
    if (!check.success) {
      setError(check.error.issues[0]?.message || "Please check this answer.");
      return;
    }
    f.setAnswers({ ...f.answers, [q.id]: value });
    if (index === item.questions.length - 1) {
      r.push("/plan");
    } else {
      setIndex(index + 1);
      setError("");
    }
  };

  return (
    <Step number={`${t.questions.step} (${index + 1}/${item.questions.length})`} title={q.label}>
      <p className="mb-1 text-sm text-[var(--ux4g-text-neutral-secondary,#404040)]">
        {t.questions.subtitle}
      </p>
      <p className="mb-6 text-xs font-bold uppercase tracking-wider text-[var(--ux4g-text-brand-primary-default,#002B7F)]">
        {t.questions.required}: {req}
      </p>

      {q.options ? (
        <div role="group" aria-label={q.label} className="grid gap-3 sm:grid-cols-2">
          {q.options.map((o) => (
            <button
              type="button"
              key={o}
              onClick={() => choose(o)}
              className="ux4g-card ux4g-card-solid ux4g-card-vertical flex min-h-[72px] items-center p-4 text-left font-bold text-sm tracking-tight transition-all hover:border-[var(--ux4g-color-primary-600,#002B7F)] hover:shadow-md"
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            choose(new FormData(e.currentTarget).get("answer")?.toString() || "");
          }}
          className="ux4g-card ux4g-card-solid ux4g-card-vertical p-6 space-y-4"
        >
          <div className="ux4g-input-container ux4g-input-md ux4g-input-default">
            <label className="block text-sm font-semibold text-[var(--ux4g-text-neutral-primary,#171717)] mb-1" htmlFor="answer">
              Your answer <span className="font-normal text-[var(--ux4g-text-brand-primary-default,#002B7F)]">({req})</span>
            </label>
            <input
              id="answer"
              name="answer"
              aria-describedby={error ? "answer-error" : undefined}
              placeholder={q.placeholder}
              className="w-full rounded-md border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] px-4 py-2.5 text-sm text-[var(--ux4g-text-neutral-primary,#171717)] focus:outline-none"
            />
          </div>
          <button type="submit" className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full flex items-center justify-center gap-1.5">
            <span>{t.questions.continueBtn}</span>
            <ChevronRight size={16} />
          </button>
        </form>
      )}

      {error && (
        <div id="answer-error" role="alert" className="ux4g-alert ux4g-alert-error mt-4 p-3 text-xs font-semibold">
          {error}
        </div>
      )}

      {index > 0 && (
        <button
          type="button"
          onClick={() => { setIndex(index - 1); setError(""); }}
          className="mt-6 text-xs font-bold text-[var(--ux4g-text-neutral-secondary,#404040)] hover:underline"
        >
          ← {t.questions.backBtn}
        </button>
      )}
    </Step>
  );
}

export function Plan() {
  const r = useRouter();
  const f = useFlow();
  const t = getTranslation(f.language);
  const item = data[f.intent];

  return (
    <Step number={t.plan.step} title={t.plan.title}>
      <p className="text-sm text-[var(--ux4g-text-neutral-secondary,#404040)]">
        {t.plan.subtitle}
      </p>

      <ol className="ux4g-card ux4g-card-solid ux4g-card-vertical mt-6 divide-y divide-[var(--ux4g-border-neutral-subtle,#E5E5E5)]">
        {item.plan.map((x, i) => (
          <li className="flex gap-4 p-5" key={x}>
            <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--ux4g-color-primary-600,#002B7F)] text-xs font-bold text-white shadow-sm">
              {i + 1}
            </span>
            <div>
              <h2 className="text-sm font-bold text-[var(--ux4g-text-neutral-primary,#171717)]">{x}</h2>
              <p className="mt-0.5 text-xs text-[var(--ux4g-text-neutral-secondary,#404040)]">
                {i === 0 ? "Configured based on your responses." : "Verified during state transport workflow."}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => r.push("/upload")}
          className="ux4g-btn ux4g-btn-primary ux4g-btn-md flex items-center justify-center gap-1.5 w-full sm:w-auto"
        >
          <span>{t.plan.continueBtn}</span>
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => r.push("/questions")}
          className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md"
        >
          {t.plan.backBtn}
        </button>
      </div>
    </Step>
  );
}

export function Uploads() {
  const r = useRouter();
  const f = useFlow();
  const t = getTranslation(f.language);
  const item = data[f.intent];

  const add = (n: string, file?: File) =>
    f.setUploads({ ...f.uploads, [n]: file?.name || `${n.toLowerCase().replaceAll(" ", "-")}.pdf` });

  return (
    <Step number={t.upload.step} title={t.upload.title}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)]">
          {t.upload.subtitle}
        </p>
        <SecureBadge />
      </div>

      <div className="mt-6 space-y-3">
        {item.documents.map((n) => (
          <div className="ux4g-card ux4g-card-solid ux4g-card-vertical flex flex-wrap items-center justify-between gap-3 p-4" key={n}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] text-[var(--ux4g-text-brand-primary-default,#002B7F)]">
                <FileText size={18} />
              </span>
              <div>
                <h2 className="text-xs font-bold text-[var(--ux4g-text-neutral-primary,#171717)]">
                  {n} <span className="ux4g-tag-tonal-brand ux4g-tag-s ml-1 font-mono text-[10px]">({t.questions.required})</span>
                </h2>
                {f.uploads[n] ? (
                  <p className="flex items-center gap-1 text-[11px] font-bold text-[var(--ux4g-color-green-700,#00522C)] mt-0.5">
                    <Check size={12} /> {f.uploads[n]}
                  </p>
                ) : (
                  <p className="text-[11px] text-[var(--ux4g-text-neutral-tertiary,#737373)] mt-0.5">
                    PDF, JPG, or PNG (Max 5MB)
                  </p>
                )}
              </div>
            </div>

            <label className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm cursor-pointer flex items-center gap-1.5">
              <UploadCloud size={14} />
              <span>{f.uploads[n] ? "Replace" : "Upload"}</span>
              <input
                aria-label={`Upload ${n}`}
                onChange={(e) => add(n, e.target.files?.[0])}
                className="hidden"
                type="file"
              />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => r.push("/review")}
          className="ux4g-btn ux4g-btn-primary ux4g-btn-md flex items-center justify-center gap-1.5 w-full sm:w-auto"
        >
          <span>{t.upload.continueBtn}</span>
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => r.push("/plan")}
          className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md"
        >
          {t.upload.backBtn}
        </button>
      </div>
    </Step>
  );
}

export function Review() {
  const r = useRouter();
  const f = useFlow();
  const t = getTranslation(f.language);
  const item = data[f.intent];
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const missingAnswers = item.questions.filter((question) => !f.answers[question.id]?.trim());
  const missingDocuments = item.documents.filter((document) => !f.uploads[document]?.trim());
  const looksReady = missingAnswers.length === 0 && missingDocuments.length === 0;

  const handleSubmit = async () => {
    if (!f.citizen) {
      r.push("/sign-in");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ intent: f.intent, answers: f.answers, uploads: f.uploads }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit");
      }
      const resData = await response.json();
      if (resData.applicationId) {
        f.setApplicationId(resData.applicationId);
        f.setPaymentReference(`PP-PAY-${resData.applicationId}`);
        f.setPaymentStatus("pending");
      }
      r.push(`/payment?id=${encodeURIComponent(resData.applicationId || f.applicationId)}`);
    } catch {
      setSubmitError("Could not save application details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Step number={t.review.step} title={t.review.title}>
      <p className="text-sm text-[var(--ux4g-text-neutral-secondary,#404040)]">
        {t.review.subtitle}
      </p>

      <div className="ux4g-card ux4g-card-solid ux4g-card-vertical mt-6 p-6 space-y-5">
        <h2 className="text-base font-bold text-[var(--ux4g-text-neutral-primary,#171717)] border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] pb-2">
          {item.label}
        </h2>

        <dl className="grid gap-4 sm:grid-cols-2">
          {Object.entries(f.answers).map(([key, value]) => (
            <div key={key} className="space-y-0.5">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--ux4g-text-neutral-tertiary,#737373)]">
                {key}
              </dt>
              <dd className="font-semibold text-sm text-[var(--ux4g-text-neutral-primary,#171717)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] pt-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--ux4g-text-neutral-tertiary,#737373)] mb-2">
            Documents Checklist
          </h3>
          <ul className="grid gap-2 text-xs">
            {item.documents.map((n) => (
              <li className="flex items-center gap-2" key={n}>
                {f.uploads[n] ? (
                  <BadgeCheck aria-hidden="true" size={16} className="text-[var(--ux4g-color-green-700,#00522C)] shrink-0" />
                ) : (
                  <AlertCircle aria-hidden="true" size={16} className="text-[var(--ux4g-color-red-700,#8A1A16)] shrink-0" />
                )}
                <span className="font-medium text-[var(--ux4g-text-neutral-primary,#171717)]">{n}</span>
                <span className="text-[10px] text-[var(--ux4g-text-neutral-tertiary,#737373)]">
                  ({f.uploads[n] ? "file attached" : "missing"})
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`ux4g-alert ${looksReady ? "ux4g-alert-info" : "ux4g-alert-warning"} p-4 text-xs`}>
          {looksReady ? (
            <>
              <p className="font-bold text-[var(--ux4g-text-neutral-primary,#171717)]">Looks ready to submit</p>
              <p className="mt-1 text-[var(--ux4g-text-neutral-secondary,#404040)]">All questions and required files are fulfilled.</p>
              <p className="mt-2 font-semibold text-[var(--ux4g-text-neutral-tertiary,#737373)]">{t.review.consentNotice}</p>
            </>
          ) : (
            <>
              <p className="font-bold text-[var(--ux4g-text-neutral-primary,#171717)]">Needs attention</p>
              <ul className="mt-2 space-y-1 text-[var(--ux4g-text-neutral-secondary,#404040)]">
                {missingAnswers.map((question) => (
                  <li key={question.id}>
                    {question.label} is needed.{" "}
                    <Link className="font-bold text-[var(--ux4g-text-brand-primary-default,#002B7F)] underline" href="/questions">
                      Complete now
                    </Link>
                  </li>
                ))}
                {missingDocuments.map((document) => (
                  <li key={document}>
                    {document} is required.{" "}
                    <Link className="font-bold text-[var(--ux4g-text-brand-primary-default,#002B7F)] underline" href="/upload">
                      Upload now
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <TurnstileDemo onVerified={setVerified} />
      </div>

      {submitError && (
        <div role="alert" className="ux4g-alert ux4g-alert-error mt-4 p-3 text-xs font-semibold text-center">
          {submitError}
        </div>
      )}

      <DelegateHelpModal variant="card" className="mt-5" />

      <button
        type="button"
        disabled={!verified || !looksReady || submitting}
        onClick={handleSubmit}
        className="ux4g-btn ux4g-btn-primary ux4g-btn-md mt-6 flex items-center justify-center gap-1.5 w-full"
      >
        <span>{submitting ? "Saving..." : f.citizen ? t.review.submitBtn : "Sign In to Proceed"}</span>
        <ChevronRight size={16} />
      </button>
      <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--ux4g-text-neutral-tertiary,#737373)]">
        Prototype for demonstration only · Uses synthetic data · Not an official Parivahan service
      </p>
    </Step>
  );
}

type ApplicationStatus = "queued" | "processing" | "approved" | "rejected";

export function Track() {
  const r = useRouter();
  const searchParams = useSearchParams();
  const f = useFlow();
  const t = getTranslation(f.language);
  const [status, setStatus] = useState<ApplicationStatus>("queued");
  const [attempt, setAttempt] = useState(0);
  const [currentStep, setCurrentStep] = useState("Submitted information");
  const [nextAction, setNextAction] = useState("Confirm demo payment");
  const [loadError, setLoadError] = useState(false);
  const [delegatedInfo, setDelegatedInfo] = useState<{ completedViaDelegated?: boolean; delegateName?: string } | null>(null);
  const applicationId = searchParams.get("id") || f.applicationId;

  useEffect(() => {
    setStatus("queued");
    setLoadError(false);
    fetch(`/api/application-status?id=${encodeURIComponent(applicationId)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Status unavailable");
        const payload = await response.json();
        setCurrentStep(payload.currentStep);
        setNextAction(payload.nextAction);
        if (payload.completedViaDelegated) {
          setDelegatedInfo({
            completedViaDelegated: true,
            delegateName: payload.delegateName,
          });
        }
        setStatus(payload.status === "approved" ? "approved" : payload.status === "rejected" ? "rejected" : "processing");
      })
      .catch(() => {
        setLoadError(true);
        setStatus("rejected");
      });
  }, [applicationId, attempt]);

  const retry = () => setAttempt((a) => a + 1);

  const descriptions = {
    queued: "Your application is safely queued. Next: payment and document checks.",
    processing: "Your submitted information is being reviewed in this prototype.",
    approved: t.track.statusApproved,
    rejected: "We could not update your status. Your existing application remains unchanged.",
  };

  const steps = [
    "Information submitted",
    "Demo payment",
    "Prototype consistency check",
    "Next step available",
  ];

  const active = status === "queued" ? 0 : status === "processing" ? 2 : 3;

  return (
    <Step number={`Application ID: ${applicationId}`} title={t.track.title}>
      <div className="ux4g-card ux4g-card-solid ux4g-card-vertical mt-3 p-6 space-y-6" aria-live="polite">
        {/* Delegated Access Info Alert */}
        {delegatedInfo?.completedViaDelegated && (
          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-[#EEF4FF] dark:bg-blue-950/80 text-xs text-[#002B7F] dark:text-blue-300 font-bold flex items-center gap-2">
            <span>🤝 Completed via delegated access by {delegatedInfo.delegateName || "a trusted helper"}</span>
          </div>
        )}

        {/* Status Callout Banner */}
        <div className={`ux4g-alert ${status === "rejected" ? "ux4g-alert-error" : "ux4g-alert-info"} flex items-start gap-3 p-4`}>
          <Clock3 aria-hidden="true" className="shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-bold text-xs uppercase tracking-wider">
              Status: {status === "approved" ? t.track.statusApproved : status === "processing" ? t.track.statusProcessing : t.track.statusPending}
            </p>
            <p className="text-xs leading-relaxed text-[var(--ux4g-text-neutral-secondary,#404040)] mt-1">
              {descriptions[status]}
            </p>
            <p className="mt-2 text-xs font-bold text-[var(--ux4g-text-neutral-primary,#171717)]">
              Payment: {f.paymentStatus.replaceAll("-", " ")}
            </p>
          </div>
        </div>

        {/* UX4G Stepper Timeline */}
        <div className="ux4g-stepper ux4g-stepper-vertical space-y-3">
          {steps.map((title, i) => {
            const isComplete = i < active || status === "approved";
            const isActiveStep = i === active && status !== "approved";
            return (
              <div className={`ux4g-stepper-step flex gap-4 ${isComplete ? "completed" : isActiveStep ? "active" : ""}`} key={title}>
                <div className="flex flex-col items-center">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                      isComplete
                        ? "bg-[var(--ux4g-color-green-700,#00522C)] text-white"
                        : isActiveStep
                        ? "bg-[var(--ux4g-color-primary-600,#002B7F)] text-white"
                        : "border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] text-[var(--ux4g-text-neutral-tertiary,#737373)]"
                    }`}
                  >
                    {isComplete ? <Check size={14} /> : i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <span className={`h-8 w-0.5 ${i < active ? "bg-[var(--ux4g-color-green-700,#00522C)]" : "bg-[var(--ux4g-border-neutral-subtle,#E5E5E5)]"}`} />
                  )}
                </div>
                <div className="pb-4">
                  <h2 className={`text-xs font-bold ${isActiveStep ? "text-[var(--ux4g-text-brand-primary-default,#002B7F)]" : "text-[var(--ux4g-text-neutral-primary,#171717)]"}`}>
                    {title}
                  </h2>
                  <p className="text-[11px] text-[var(--ux4g-text-neutral-tertiary,#737373)] mt-0.5">
                    {i === 1 && f.paymentStatus !== "success"
                      ? "Payment confirmation pending — do not resubmit."
                      : i === 3
                      ? "Official review completed."
                      : "Action recorded in MongoDB."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {loadError && (
          <button
            type="button"
            onClick={retry}
            className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full flex items-center justify-center gap-1.5"
            aria-label="Retry application status check"
          >
            <RefreshCw size={14} /> <span>Retry status check</span>
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => r.push(`/validation?id=${encodeURIComponent(applicationId)}`)}
          className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md flex-1 flex items-center justify-center gap-1.5"
        >
          <span>View document validation</span>
          <ChevronRight size={14} />
        </button>
        {f.paymentStatus !== "success" && (
          <button
            type="button"
            onClick={() => r.push(`/payment?id=${encodeURIComponent(applicationId)}`)}
            className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md flex-1"
          >
            Check payment status
          </button>
        )}
      </div>
    </Step>
  );
}

type ValidationDoc = {
  name: string;
  status: "validated" | "needs-attention";
  detail: string;
  checks: string[];
};

export function Validation() {
  const f = useFlow();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ApplicationStatus>("queued");
  const [docs, setDocs] = useState<ValidationDoc[]>([]);
  const [attempt, setAttempt] = useState(0);
  const applicationId = searchParams.get("id") || f.applicationId;

  useEffect(() => {
    setStatus("queued");
    setDocs([]);
    const processing = window.setTimeout(() => setStatus("processing"), 350);
    const load = window.setTimeout(async () => {
      try {
        const result = await fetch(`/api/validation?id=${encodeURIComponent(applicationId)}`);
        if (!result.ok) throw new Error("Validation unavailable");
        const payload = await result.json();
        setDocs(payload.documents);
        setStatus(payload.status);
      } catch {
        setStatus("rejected");
      }
    }, 800);
    return () => {
      clearTimeout(processing);
      clearTimeout(load);
    };
  }, [applicationId, attempt]);

  return (
    <Step number="Document validation" title="Document checks timeline">
      <div
        role="status"
        aria-live="polite"
        className={`ux4g-alert ${status === "rejected" ? "ux4g-alert-error" : "ux4g-alert-info"} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4`}
      >
        <div>
          <p className="font-bold text-xs uppercase tracking-wider">State: {status}</p>
          <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] mt-0.5">
            {status === "queued"
              ? "Checking uploads format, signature, details."
              : status === "processing"
              ? "Checking formats and OCR signatures."
              : status === "rejected"
              ? "Failed to validate. No local files were changed."
              : "All checks completed."}
          </p>
        </div>
        {status === "rejected" && (
          <button
            type="button"
            onClick={() => setAttempt((a) => a + 1)}
            className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm shrink-0 self-start sm:self-auto flex items-center gap-1.5"
          >
            <RefreshCw size={13} /> <span>Retry validation</span>
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {status !== "approved" ? (
          <div className="ux4g-card ux4g-card-solid ux4g-card-vertical p-5 text-xs text-[var(--ux4g-text-neutral-tertiary,#737373)] flex items-center gap-2">
            <span className="ux4g-spinner-primary-full ux4g-spinner-sm" role="status" aria-label="Loading" />
            <span>Checking file verification statuses…</span>
          </div>
        ) : (
          docs.map((doc) => (
            <div className="ux4g-card ux4g-card-solid ux4g-card-vertical p-5" key={doc.name}>
              <div className="flex items-start gap-3">
                {doc.status === "validated" ? (
                  <BadgeCheck aria-hidden="true" size={20} className="text-[var(--ux4g-color-green-700,#00522C)] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle aria-hidden="true" size={20} className="text-[var(--ux4g-color-red-700,#8A1A16)] shrink-0 mt-0.5" />
                )}
                <div>
                  <h2 className="text-xs font-bold text-[var(--ux4g-text-neutral-primary,#171717)]">{doc.name}</h2>
                  <p className={`text-[11px] font-bold leading-normal mt-0.5 ${doc.status === "validated" ? "text-[var(--ux4g-color-green-700,#00522C)]" : "text-[var(--ux4g-color-red-700,#8A1A16)]"}`}>
                    {doc.detail}
                  </p>

                  <h3 className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[var(--ux4g-text-neutral-tertiary,#737373)]">
                    Checks Completed
                  </h3>
                  <ul className="mt-1.5 grid gap-1 text-xs text-[var(--ux4g-text-neutral-secondary,#404040)]">
                    {doc.checks.map((check) => (
                      <li className="flex items-center gap-1.5" key={check}>
                        <Check size={12} className="text-[var(--ux4g-color-green-700,#00522C)] shrink-0" />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/upload" className="ux4g-btn ux4g-btn-primary ux4g-btn-md mt-6 inline-flex justify-center w-full max-w-[200px] text-center">
        Update documents
      </Link>
    </Step>
  );
}
