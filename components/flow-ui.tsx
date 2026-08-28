"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BadgeCheck, Check, ChevronRight, Clock3, FileText, LockKeyhole, RefreshCw, UploadCloud, AlertCircle } from "lucide-react";
import intents from "@/data/intents.json";
import { requirementFor, validateAnswer } from "@/data/forms";
import { useFlow } from "./flow-provider";
import { TurnstileDemo } from "./turnstile-demo";

const data = intents as typeof intents;

const copy = {
  en: {
    welcome: "WELCOME TO PARIVAHAN PATH",
    title: "What do you need to do today?",
    description: "Tell us what you need in your own words. We'll figure out the right service and guide you step by step.",
    placeholder: "e.g. I bought a second-hand car and want to transfer it.",
    start: "Start",
    common: "Common tasks",
    identified: "Identified service",
    help: "I can help with that.",
    continue: "Yes, continue",
    another: "Choose another service"
  },
  hi: {
    welcome: "परिवहन पथ में आपका स्वागत है",
    title: "आज आप क्या करना चाहते हैं?",
    description: "अपनी ज़रूरत अपने शब्दों में बताइए। हम सही सेवा ढूँढकर कदम-दर-कदम मदद करेंगे।",
    placeholder: "उदा. मैंने पुरानी कार खरीदी है और स्वामित्व स्थानांतरित करना चाहता हूँ।",
    start: "शुरू करें",
    common: "सामान्य कार्य",
    identified: "पहचानी गई सेवा",
    help: "मैं इसमें आपकी मदद कर सकता हूँ।",
    continue: "हाँ, आगे बढ़ें",
    another: "दूसरी सेवा चुनें"
  }
};

export function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby="page-title" className="mx-auto flex min-h-[calc(100vh-140px)] max-w-2xl flex-col justify-center px-6 py-10">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{number}</p>
      <h1 id="page-title" className="mb-4 text-2xl font-bold tracking-tight text-primary md:text-3xl leading-snug">{title}</h1>
      {children}
    </section>
  );
}

function SecureBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-secondary/20 bg-secondary/5 px-2.5 py-0.5 text-[10px] font-bold text-secondary">
      <LockKeyhole size={11} /> Secured demo
    </span>
  );
}

export function Landing() {
  const r = useRouter();
  const f = useFlow();
  const t = copy[f.language];

  const start = (p: string) => {
    f.setPrompt(p);
    f.setIntent(/renew|licen[cs]e/i.test(p) ? "license-renewal" : "ownership-transfer");
    r.push("/understand");
  };

  return (
    <section aria-labelledby="landing-title" className="relative mx-auto flex min-h-[calc(100vh-140px)] max-w-4xl flex-col items-center justify-center px-6 py-12 text-center">

      <span className="mb-5 rounded-full border border-secondary/20 bg-secondary/5 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-secondary">
        {t.welcome}
      </span>

      <h1 id="landing-title" className="max-w-2xl text-3xl font-extrabold tracking-tight text-primary md:text-4xl md:leading-[1.2]">
        {t.title}
      </h1>

      <p className="mt-3.5 max-w-lg text-sm leading-relaxed text-outline select-none">
        {t.description}
      </p>

      {/* Styled Intent Search form */}
      <form
        aria-label="Describe the service you need"
        onSubmit={(e) => {
          e.preventDefault();
          start(f.prompt);
        }}
        className="mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-outline-variant/40 bg-surface-low p-2 shadow-civic sm:flex-row"
      >
        <label className="sr-only" htmlFor="service-prompt">Describe what you need</label>
        <input
          id="service-prompt"
          value={f.prompt}
          onChange={(e) => f.setPrompt(e.target.value)}
          className="min-w-0 flex-1 rounded-xl bg-surface-container/50 px-5 py-2.5 text-sm focus:outline-none"
          placeholder={t.placeholder}
        />
        <button
          aria-label="Start service guidance"
          className="btn-primary px-6 py-2.5 text-xs"
        >
          {t.start}
          <ChevronRight size={14} />
        </button>
      </form>

      {/* Recommended tasks list below */}
      <div className="mt-12">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-outline/65">
          {t.common}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Transfer ownership", "Renew license", "Replace / download RC", "Pay a challan"].map((x) => {
            const comingSoon = x === "Replace / download RC" || x === "Pay a challan";
            return <button aria-label={comingSoon ? `${x} coming soon` : `Start ${x}`} key={x} disabled={comingSoon} onClick={() => !comingSoon && start(x)} className="rounded-full border border-outline-variant/60 bg-surface-low text-xs font-semibold text-primary transition-all hover:bg-surface-container hover:border-outline btn-task disabled:cursor-not-allowed disabled:opacity-45">
              {x}{comingSoon ? " · Coming soon" : ""}
            </button>;
          })}
        </div>
      </div>
    </section>
  );
}

export function Understand() {
  const r = useRouter();
  const f = useFlow();
  const item = data[f.intent];
  const t = copy[f.language];

  return (
    <Step number="Step 1 of 4" title={t.help}>
      <div className="card mt-3 p-6 md:p-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#0d9488]">{t.identified}</p>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-primary">{item.label}</h2>
        <p className="mt-3 text-sm leading-relaxed text-outline">
          {item.description} Based on your input, we will ask a few quick questions and prepare a personalized checklist map.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            aria-label="Confirm identified service"
            onClick={() => r.push("/questions")}
            className="btn-primary text-xs"
          >
            {t.continue}
            <ChevronRight size={14} />
          </button>
          <Link href="/" className="btn-secondary text-xs">
            {t.another}
          </Link>
        </div>
      </div>
    </Step>
  );
}

export function Questions() {
  const r = useRouter();
  const f = useFlow();
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
    <Step number={`Step ${index + 2} of 4`} title={q.label}>
      <p className="mb-1 text-sm text-outline">A few steps help us prepare correct forms, documents and next steps.</p>
      <p className="mb-6 text-xs font-bold text-secondary uppercase tracking-wider">{req}</p>

      {q.options ? (
        <div role="group" aria-label={q.label} className="grid gap-3 sm:grid-cols-2">
          {q.options.map((o) => (
            <button
              key={o}
              onClick={() => choose(o)}
              className="card min-h-20 p-5 text-left font-bold text-sm tracking-tight hover:-translate-y-0.5 hover:border-[#0d9488]"
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
          className="card p-6 space-y-4"
        >
          <label className="block text-sm font-semibold text-primary" htmlFor="answer">
            Your answer <span className="text-secondary">({req})</span>
          </label>
          <input
            id="answer"
            name="answer"
            aria-describedby={error ? "answer-error" : undefined}
            placeholder={q.placeholder}
            className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-sm focus:outline-none"
          />
          <button className="btn-primary text-xs w-full py-2.5">
            Continue
            <ChevronRight size={14} />
          </button>
        </form>
      )}

      {error && (
        <p id="answer-error" role="alert" className="mt-4 text-sm font-semibold text-[#b3261e] bg-[#ffe4e1] border border-[#f2b8b5] p-2.5 rounded-lg text-center">
          {error}
        </p>
      )}

      <p className="mt-8 text-xs font-bold uppercase tracking-wider text-outline/65">
        Question {index + 1} of {item.questions.length}
      </p>
    </Step>
  );
}

export function Plan() {
  const r = useRouter();
  const f = useFlow();
  const item = data[f.intent];

  return (
    <Step number="Your personalised path" title="Your Action Plan">
      <p className="text-sm text-outline">Here is your customized path checklist. You can return to this list at any time.</p>

      <ol className="card mt-6 divide-y divide-outline-variant/40">
        {item.plan.map((x, i) => (
          <li className="flex gap-4 p-5" key={x}>
            <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-surface">
              {i + 1}
            </span>
            <div>
              <h2 className="text-sm font-bold text-primary">{x}</h2>
              <p className="mt-0.5 text-xs text-outline">
                {i === 0 ? "We'll use details you shared." : "Will be reviewed step-by-step during status tracking."}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <button
        onClick={() => r.push("/upload")}
        className="btn-primary mt-6 text-xs w-full sm:w-auto"
      >
        Upload documents
        <ChevronRight size={14} />
      </button>
    </Step>
  );
}

export function Uploads() {
  const r = useRouter();
  const f = useFlow();
  const item = data[f.intent];

  const add = (n: string, file?: File) =>
    f.setUploads({ ...f.uploads, [n]: file?.name || `${n.toLowerCase().replaceAll(" ", "-")}.pdf` });

  return (
    <Step number="Documents" title="Upload required files">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-outline">Verify details. Local validation simulates checks instantly.</p>
        <SecureBadge />
      </div>

      <div className="mt-6 space-y-3">
        {item.documents.map((n) => (
          <div className="card flex flex-wrap items-center justify-between gap-3 p-4" key={n}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                <FileText size={16} />
              </span>
              <div>
                <h2 className="text-xs font-bold text-primary">
                  {n} <span className="text-[10px] font-semibold text-secondary lowercase font-mono">(required)</span>
                </h2>
                {f.uploads[n] ? (
                  <p className="flex items-center gap-1 text-[10px] font-bold text-secondary mt-0.5">
                    <Check size={11} /> {f.uploads[n]}
                  </p>
                ) : (
                  <p className="text-[10px] text-outline mt-0.5">PDF, JPG, or PNG</p>
                )}
              </div>
            </div>

            <label className="btn-secondary cursor-pointer px-4.5 py-2.5 text-xs">
              <UploadCloud size={13} />
              {f.uploads[n] ? "Replace" : "Upload"}
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

      <button
        onClick={() => r.push("/review")}
        className="btn-primary mt-6 text-xs w-full sm:w-auto"
      >
        Review application
        <ChevronRight size={14} />
      </button>
    </Step>
  );
}

export function Review() {
  const r = useRouter();
  const f = useFlow();
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
    <Step number="Final review" title="Review and validate">
      <p className="text-sm text-outline">Check the information before submitting this prototype application.</p>

      <div className="card mt-6 p-6 space-y-5">
        <h2 className="text-base font-bold text-primary border-b border-outline-variant/40 pb-2">{item.label}</h2>

        <dl className="grid gap-4 sm:grid-cols-2">
          {Object.entries(f.answers).map(([key, value]) => (
            <div key={key} className="space-y-0.5">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-outline">{key}</dt>
              <dd className="font-semibold text-sm text-primary">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-outline-variant/40 pt-4">
          <h3 className="font-bold text-xs text-outline uppercase tracking-wider mb-2">Documents List</h3>
          <ul className="grid gap-2 text-xs">
            {item.documents.map((n) => (
              <li className="flex items-center gap-2" key={n}>
                {f.uploads[n] ? (
                  <BadgeCheck aria-hidden="true" size={14} className="text-secondary shrink-0" />
                ) : (
                  <AlertCircle aria-hidden="true" size={14} className="text-[#b3261e] shrink-0" />
                )}
                <span className="font-medium text-primary">{n}</span>
                <span className="text-[10px] text-outline/65">({f.uploads[n] ? "file ready" : "missing"})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`rounded-xl border p-4 text-xs ${looksReady ? "border-secondary/30 bg-secondary/5" : "border-[#f2b8b5] bg-[#ffe4e1]"}`}>
          {looksReady ? <><p className="font-bold text-primary">Looks ready to submit</p><p className="mt-1 text-outline">We found no common issues in this prototype check.</p><p className="mt-2 font-semibold text-outline">Prototype check only — this does not constitute official government verification.</p></> : <><p className="font-bold text-primary">Needs attention</p><ul className="mt-2 space-y-1 text-outline">{missingAnswers.map((question) => <li key={question.id}>{question.label} is needed to prepare this application. <Link className="font-bold text-secondary underline" href="/questions">Fix this</Link></li>)}{missingDocuments.map((document) => <li key={document}>{document} is needed for this application. <Link className="font-bold text-secondary underline" href="/upload">Fix this</Link></li>)}</ul></>}
        </div>
        <TurnstileDemo onVerified={setVerified} />
      </div>

      {submitError && (
        <p role="alert" className="mt-4 text-xs font-semibold text-[#b3261e] bg-[#ffe4e1] border border-[#f2b8b5] p-2.5 rounded-lg text-center">
          {submitError}
        </p>
      )}

      <button
        disabled={!verified || !looksReady || submitting}
        onClick={handleSubmit}
        className="btn-primary mt-6 text-xs w-full py-2.5"
      >
        {submitting ? "Saving..." : f.citizen ? "Submit & pay" : "Sign in to submit"}
        <ChevronRight size={14} />
      </button>
      <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-wider text-outline">Prototype for demonstration only · Uses synthetic data · Not an official Parivahan service</p>
    </Step>
  );
}

type ApplicationStatus = "queued" | "processing" | "approved" | "rejected";

export function Track() {
  const r = useRouter();
  const searchParams = useSearchParams();
  const f = useFlow();
  const [status, setStatus] = useState<ApplicationStatus>("queued");
  const [attempt, setAttempt] = useState(0);
  const [currentStep, setCurrentStep] = useState("Submitted information");
  const [nextAction, setNextAction] = useState("Confirm demo payment");
  const [loadError, setLoadError] = useState(false);
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
        setStatus(payload.status === "approved" ? "approved" : payload.status === "rejected" ? "rejected" : "processing");
      })
      .catch(() => { setLoadError(true); setStatus("rejected"); });
  }, [applicationId, attempt]);

  const retry = () => setAttempt((a) => a + 1);

  const descriptions = {
    queued: "Your application is safely queued. Next: payment and document checks.",
    processing: "Your submitted information is being reviewed in this prototype.",
    approved: "Simulated: prototype check complete.",
    rejected: "We couldn't update your status. Your existing application is still unchanged."
  };

  const steps = [
    "Information submitted",
    "Demo payment",
    "Prototype consistency check",
    "Next step available"
  ];

  const active = status === "queued" ? 0 : status === "processing" ? 2 : 3;

  return (
    <Step number={`Application ID: ${applicationId}`} title="Track application progress">
      <div className="card mt-3 p-6 space-y-6" aria-live="polite">

        {/* Status Callout Banner */}
        <div
          className={`flex gap-3 rounded-xl p-4 border ${status === "rejected"
              ? "bg-[#ffe4e1] border-[#f2b8b5] text-[#b3261e]"
              : "bg-surface-container/60 border-outline-variant/60"
            }`}
        >
          <Clock3 aria-hidden="true" className="shrink-0 mt-0.5" size={16} />
          <div>
            <p className="font-bold text-xs uppercase tracking-wider">Status: {status === "approved" ? "Simulated: prototype check complete" : status}</p>
            <p className="text-xs leading-relaxed text-outline/90 mt-1">{descriptions[status]}</p>
            <p className="mt-2 text-xs font-bold text-primary">Payment: {f.paymentStatus.replaceAll("-", " ")}</p>
          </div>
        </div>

        {/* Steps Flow Timeline */}
        <div className="space-y-1">
          {steps.map((title, i) => {
            const isComplete = i < active || status === "approved";
            const isActiveStep = i === active && status !== "approved";
            return (
              <div className="flex gap-4" key={title}>
                <div className="flex flex-col items-center">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${isComplete
                        ? "bg-secondary text-surface"
                        : isActiveStep
                          ? "bg-primary text-surface"
                          : "border border-outline-variant bg-surface-low text-outline/50"
                      }`}
                  >
                    {isComplete ? <Check size={13} /> : i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <span className={`h-8 w-px ${i < active ? "bg-secondary" : "bg-outline-variant"}`} />
                  )}
                </div>
                <div className="pb-4">
                  <h2 className={`text-xs font-bold ${isActiveStep ? "text-primary" : "text-ink/80"}`}>
                    {title}
                  </h2>
                  <p className="text-[10px] text-outline/65 mt-0.5">
                    {i === 1 && f.paymentStatus !== "success"
                      ? "Payment confirmation pending — do not resubmit."
                      : i === 4
                        ? "Appointments list will appear once available."
                        : "Action recorded."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {loadError && (
          <button
            onClick={retry}
            className="btn-primary text-xs w-full py-2.5"
            aria-label="Retry application status check"
          >
            <RefreshCw size={13} /> Retry status check
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <button onClick={() => r.push(`/validation?id=${encodeURIComponent(applicationId)}`)} className="btn-secondary text-xs flex-1 py-2.5">
          View document validation
          <ChevronRight size={13} />
        </button>
        {f.paymentStatus !== "success" && (
          <button onClick={() => r.push(`/payment?id=${encodeURIComponent(applicationId)}`)} className="btn-secondary text-xs flex-1 py-2.5">
            Check payment status
          </button>
        )}
      </div>
      <div className="card mt-4 p-5 text-xs leading-relaxed">
        <p><strong>WHAT:</strong> Your submitted information is being reviewed in this prototype.</p>
        <p className="mt-2"><strong>WHY:</strong> Current stage: {currentStep}.</p>
        <p className="mt-2"><strong>NEXT:</strong> {nextAction}.</p>
        <p className="mt-2"><strong>ACTION NEEDED:</strong> {f.paymentStatus === "success" ? "No" : "Yes — confirm the demo payment."}</p>
        {loadError && <p className="mt-3 font-semibold text-[#b3261e]">Retrying checks your existing application. It does not create a new application.</p>}
      </div>
      <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-wider text-outline">Prototype for demonstration only · Uses synthetic data · Not an official Parivahan service</p>
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
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl p-4.5 border ${status === "rejected"
            ? "bg-[#ffe4e1] border-[#f2b8b5] text-[#b3261e]"
            : "bg-surface-container/60 border-outline-variant/60"
          }`}
      >
        <div>
          <p className="font-bold text-xs uppercase tracking-wider">State: {status}</p>
          <p className="text-xs text-outline/90 mt-0.5">
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
            onClick={() => setAttempt((a) => a + 1)}
            className="btn-secondary text-xs px-3.5 py-1.5 shrink-0 self-start sm:self-auto"
          >
            <RefreshCw size={12} /> Retry validation
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {status !== "approved" ? (
          <div className="card p-5 text-xs text-outline/80">Checking file verification statuses…</div>
        ) : (
          docs.map((doc) => (
            <div className="card p-5" key={doc.name}>
              <div className="flex items-start gap-3">
                {doc.status === "validated" ? (
                  <BadgeCheck aria-hidden="true" size={18} className="text-secondary shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle aria-hidden="true" size={18} className="text-[#b3261e] shrink-0 mt-0.5" />
                )}
                <div>
                  <h2 className="text-xs font-bold text-primary">{doc.name}</h2>
                  <p className={`text-[10px] font-bold leading-normal mt-0.5 ${doc.status === "validated" ? "text-secondary" : "text-[#b3261e]"}`}>
                    {doc.detail}
                  </p>

                  <h3 className="mt-3 text-[10px] font-bold uppercase tracking-wider text-outline">Checks Completed</h3>
                  <ul className="mt-1.5 grid gap-1 text-xs text-outline/80">
                    {doc.checks.map((check) => (
                      <li className="flex items-center gap-1.5" key={check}>
                        <Check size={11} className="text-secondary shrink-0" />
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/upload" className="btn-primary mt-6 text-xs w-full py-2.5 max-w-[200px] text-center">
        Update documents
      </Link>
    </Step>
  );
}
