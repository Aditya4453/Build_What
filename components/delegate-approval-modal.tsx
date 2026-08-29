"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle2,
  X,
  AlertTriangle,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

export interface PendingDelegatedApp {
  id: string;
  serviceType: string;
  status: string;
  updatedAt: string;
  delegateName?: string;
  delegatedAt?: string;
  answers?: Record<string, string>;
  uploads?: Record<string, string>;
  rejectionNote?: string;
}

interface DelegateApprovalModalProps {
  application: PendingDelegatedApp;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedAppId: string, action: "approved" | "rejected") => void;
}

export function DelegateApprovalModal({
  application,
  isOpen,
  onClose,
  onSuccess,
}: DelegateApprovalModalProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const helperName = application.delegateName || "a trusted helper";
  const answersList = Object.entries(application.answers || {});
  const uploadsList = Object.entries(application.uploads || {});

  const handleApprove = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/delegate/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: application.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to approve application");
      }

      onSuccess(application.id, "approved");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to approve application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/delegate/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application.id,
          rejectionNote: rejectionNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reject application");
      }

      onSuccess(application.id, "rejected");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to return application to draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="approval-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="ux4g-tag-tonal-brand ux4g-tag-s text-[10px] font-bold uppercase">
                {application.serviceType.replaceAll("-", " ")}
              </span>
              <span className="text-xs font-mono font-bold text-[#002B7F] dark:text-blue-400">
                {application.id}
              </span>
            </div>
            <h2 id="approval-modal-title" className="text-xl font-extrabold tracking-tight">
              Review Delegated Submission
            </h2>
            <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400 mt-0.5">
              Completed by <strong className="text-[#002B7F] dark:text-blue-300">{helperName}</strong> on{" "}
              {new Date(application.delegatedAt || application.updatedAt).toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Informational Callout */}
        <div className="mt-4 p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-[#EEF4FF] dark:bg-blue-950/40 flex items-start gap-2.5 text-xs text-[#001A4D] dark:text-blue-200">
          <AlertCircle size={17} className="text-[#002B7F] dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Please review the information and documents entered by <strong>{helperName}</strong>. Once approved, your application will be submitted for official verification.
          </p>
        </div>

        {/* Submitted Data Review Section */}
        <div className="my-5 space-y-4 text-xs">
          {/* Answers */}
          <div className="p-4 rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800/60 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Submitted Information
            </h3>
            {answersList.length > 0 ? (
              <dl className="grid gap-3 sm:grid-cols-2">
                {answersList.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[10px] font-bold uppercase text-neutral-400">{k}</dt>
                    <dd className="font-semibold text-neutral-800 dark:text-neutral-100 text-xs mt-0.5">
                      {v || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-neutral-400 italic">No specific form questions recorded.</p>
            )}
          </div>

          {/* Uploaded Documents */}
          <div className="p-4 rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800/60 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Attached Documents
            </h3>
            {uploadsList.length > 0 ? (
              <ul className="space-y-2">
                {uploadsList.map(([docName, fileName]) => (
                  <li key={docName} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#002B7F] dark:text-blue-400 shrink-0" />
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{docName}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> {fileName}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-400 italic">Standard electronic certificates verified.</p>
            )}
          </div>

          {/* Rejection / Request Changes Note Area */}
          {rejectMode && (
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50/60 dark:bg-red-950/30 space-y-2 animate-in fade-in duration-150">
              <label htmlFor="rejection-note" className="block text-xs font-bold text-red-900 dark:text-red-300">
                Reason for Rejection / Revision Note (Optional):
              </label>
              <textarea
                id="rejection-note"
                rows={3}
                placeholder="e.g., Please double check the chassis number or upload a clearer DL photo..."
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                className="w-full rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-neutral-900 p-3 text-xs text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-[10px] text-red-700 dark:text-red-400">
                This note will be saved with the draft so you or a future helper know what to adjust.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-4 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          {!rejectMode ? (
            <>
              <button
                type="button"
                onClick={() => setRejectMode(true)}
                disabled={loading}
                className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm text-red-600 dark:text-red-400 hover:border-red-600 w-full sm:w-auto"
              >
                Reject / Request Changes
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={loading}
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-md font-bold inline-flex items-center gap-1.5 shadow-md w-full sm:w-auto justify-center"
                >
                  <CheckCircle2 size={15} />
                  <span>{loading ? "Processing Approval..." : "Approve & Submit"}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setRejectMode(false)}
                disabled={loading}
                className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm w-full sm:w-auto"
              >
                Back to Review
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={loading}
                className="ux4g-btn ux4g-btn-primary ux4g-btn-md !bg-red-700 !border-red-700 text-white font-bold inline-flex items-center gap-1.5 shadow-md w-full sm:w-auto justify-center"
              >
                <span>{loading ? "Returning to Draft..." : "Confirm Rejection to Draft"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
