"use client";

import { useState } from "react";
import {
  Users,
  Copy,
  Check,
  X,
  ShieldCheck,
  Clock,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useFlow } from "./flow-provider";

interface DelegateHelpModalProps {
  applicationId?: string;
  variant?: "button" | "card" | "banner";
  className?: string;
}

export function DelegateHelpModal({
  applicationId,
  variant = "button",
  className = "",
}: DelegateHelpModalProps) {
  const f = useFlow();
  const [isOpen, setIsOpen] = useState(false);
  const [delegateName, setDelegateName] = useState("");
  const [expiryHours, setExpiryHours] = useState("24");
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const effectiveAppId = applicationId || f.applicationId || `APP-${Date.now().toString(36).toUpperCase()}`;

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/delegate/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: effectiveAppId,
          intent: f.intent,
          answers: f.answers,
          uploads: f.uploads,
          prompt: f.prompt,
          expiryHours: Number(expiryHours),
          delegateName: delegateName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate link");
      }

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const finalLink = origin && data.token ? `${origin}/delegate/${data.token}` : data.shareUrl;
      setGeneratedLink(finalLink);
    } catch (err: any) {
      setError(err.message || "Could not generate assistance link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    setIsOpen(false);
    setGeneratedLink(null);
    setCopied(false);
    setError("");
  };

  return (
    <>
      {/* Trigger Button or Banner */}
      {variant === "button" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm inline-flex items-center gap-2 font-semibold ${className}`}
        >
          <Users size={14} />
          <span>Let someone help me</span>
        </button>
      )}

      {variant === "card" && (
        <div className={`p-4 rounded-xl border border-[var(--ux4g-color-primary-200,#B5D3FB)] dark:border-blue-900/60 bg-[var(--ux4g-color-primary-50,#EEF4FF)] dark:bg-blue-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--ux4g-color-primary-600,#002B7F)] text-white shrink-0 mt-0.5">
              <Users size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white">
                Stuck or need assistance?
              </h4>
              <p className="text-[11px] text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-300 mt-0.5">
                Invite a trusted relative or helper to complete this application on your behalf.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="ux4g-btn ux4g-btn-primary ux4g-btn-sm text-xs font-bold shrink-0 whitespace-nowrap"
          >
            Let someone help me
          </button>
        </div>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delegation-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--ux4g-color-primary-50,#EEF4FF)] dark:bg-blue-950/80 text-[var(--ux4g-color-primary-600,#002B7F)] dark:text-blue-300">
                  <Users size={20} />
                </div>
                <div>
                  <h3 id="delegation-modal-title" className="text-base font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white">
                    Delegate Application Access
                  </h3>
                  <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400">
                    Allow a family member or helper to finish this application
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Privacy & Reassurance Banner */}
            <div className="mt-4 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/30 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200">
                <strong className="block font-bold">Privacy & Account Protection</strong>
                <p className="mt-0.5 leading-relaxed text-[11px]">
                  This link <strong>does NOT share your login</strong> credentials or personal profile. It only grants single-use access to complete <strong>this specific application</strong> ({effectiveAppId}).
                </p>
              </div>
            </div>

            {!generatedLink ? (
              /* Configuration Form */
              <form onSubmit={handleGenerateLink} className="mt-5 space-y-4 text-xs">
                <div>
                  <label htmlFor="delegate-name" className="block font-bold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-neutral-200 mb-1">
                    Who is helping you? (Optional)
                  </label>
                  <input
                    id="delegate-name"
                    type="text"
                    placeholder="e.g. Grandson - Raj / Friend - Anita"
                    value={delegateName}
                    onChange={(e) => setDelegateName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800 px-3.5 py-2.5 text-xs text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--ux4g-color-primary-600,#002B7F)]"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    This name will appear on the audit record so you know who completed it.
                  </span>
                </div>

                <div>
                  <label htmlFor="expiry-hours" className="block font-bold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-neutral-200 mb-1">
                    Link Validity Duration
                  </label>
                  <select
                    id="expiry-hours"
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(e.target.value)}
                    className="w-full rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800 px-3.5 py-2.5 text-xs text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--ux4g-color-primary-600,#002B7F)]"
                  >
                    <option value="2">2 Hours (Fast turnaround)</option>
                    <option value="24">24 Hours (Recommended)</option>
                    <option value="168">7 Days (Extended assistance)</option>
                  </select>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ux4g-btn ux4g-btn-primary ux4g-btn-sm font-bold inline-flex items-center gap-1.5"
                  >
                    {loading ? "Generating Link..." : "Create Helper Link"}
                  </button>
                </div>
              </form>
            ) : (
              /* Success / Shareable Link View */
              <div className="mt-5 space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-[var(--ux4g-color-primary-200,#B5D3FB)] dark:border-blue-900 bg-[var(--ux4g-color-primary-50,#EEF4FF)]/60 dark:bg-blue-950/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[var(--ux4g-color-primary-600,#002B7F)] dark:text-blue-300 uppercase tracking-wider">
                      Ready to Share
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <Clock size={11} /> Valid for {expiryHours} hours
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-700 rounded-xl p-2.5">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="w-full text-xs font-mono text-neutral-700 dark:text-neutral-200 bg-transparent focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="ux4g-btn ux4g-btn-primary ux4g-btn-sm text-xs font-bold inline-flex items-center gap-1 shrink-0"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-300">
                    Send this link via WhatsApp, SMS, or Email. Once your helper finishes and submits the application, this link will automatically expire.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="ux4g-btn ux4g-btn-primary ux4g-btn-sm font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
