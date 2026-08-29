"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { useFlow } from "@/components/flow-provider";
import { Users, ShieldCheck, ChevronRight, AlertTriangle, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { DelegateApprovalModal, PendingDelegatedApp } from "@/components/delegate-approval-modal";

type Application = {
  id: string;
  serviceType: string;
  status: string;
  updatedAt: string;
  nextAction: string;
  completedViaDelegated?: boolean;
  delegateName?: string;
  delegatedAt?: string;
  answers?: Record<string, string>;
  uploads?: Record<string, string>;
  rejectionNote?: string;
};

export default function Page() {
  const f = useFlow();
  const [apps, setApps] = useState<Application[]>([]);
  const [state, setState] = useState("loading");
  const [activeApprovalApp, setActiveApprovalApp] = useState<PendingDelegatedApp | null>(null);
  const [actionNotice, setActionNotice] = useState<{ text: string; type: "success" | "info" } | null>(null);

  const fetchApplications = () => {
    fetch("/api/applications")
      .then(async (r) => {
        if (!r.ok) {
          setState("signed-out");
          return;
        }
        const data = await r.json();
        setApps(data.applications || []);
        setState("ready");
      })
      .catch(() => setState("error"));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const pendingApprovalApps = apps.filter((a) => a.status === "pending_owner_approval");
  const otherApps = apps.filter((a) => a.status !== "pending_owner_approval");

  const handleApprovalSuccess = (appId: string, action: "approved" | "rejected") => {
    fetchApplications();
    if (action === "approved") {
      setActionNotice({
        text: `Application ${appId} approved successfully and sent for official processing!`,
        type: "success",
      });
    } else {
      setActionNotice({
        text: `Application ${appId} returned to draft status for revisions.`,
        type: "info",
      });
    }
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <Shell>
      <section
        aria-labelledby="applications-title"
        className="mx-auto min-h-[calc(100vh-160px)] max-w-3xl px-4 py-10 sm:px-6 space-y-6"
      >
        <div>
          <div className="mb-2">
            <span className="ux4g-tag-tonal-brand ux4g-tag-s">
              {f.citizen ? `Signed in as ${f.citizen.name}` : "Demo applications"}
            </span>
          </div>
          <h1 id="applications-title" className="text-2xl font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white sm:text-3xl">
            My Applications
          </h1>
        </div>

        {/* Action / Success Banner */}
        {actionNotice && (
          <div
            role="status"
            className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-bold animate-in fade-in duration-150 ${
              actionNotice.type === "success"
                ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200"
                : "border-blue-200 dark:border-blue-900 bg-[#EEF4FF] dark:bg-blue-950/60 text-[#002B7F] dark:text-blue-200"
            }`}
          >
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{actionNotice.text}</span>
          </div>
        )}

        {/* Mock Notification Toast/Banner for Pending Approvals */}
        {pendingApprovalApps.length > 0 && (
          <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top-1 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                  🔔 Action Required: {pendingApprovalApps.length} Delegated Submission{pendingApprovalApps.length > 1 ? "s" : ""} Awaiting Your Confirmation
                </h2>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                  Your helper completed the application details. Please review and confirm to officially submit.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveApprovalApp(pendingApprovalApps[0])}
              className="ux4g-btn ux4g-btn-primary ux4g-btn-sm font-bold shrink-0 whitespace-nowrap shadow-sm"
            >
              Review Now
            </button>
          </div>
        )}

        {/* 1. SEPARATE SECTION: Needs Your Approval */}
        {pendingApprovalApps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Needs Your Approval ({pendingApprovalApps.length})
              </h2>
            </div>

            <div className="space-y-3">
              {pendingApprovalApps.map((app) => (
                <article
                  key={app.id}
                  className="ux4g-card ux4g-card-solid p-6 rounded-2xl border-2 border-amber-300 dark:border-amber-800/80 bg-white dark:bg-neutral-900 shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="ux4g-tag-tonal-brand ux4g-tag-s uppercase font-bold text-[10px]">
                          {app.serviceType.replaceAll("-", " ")}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          Awaiting Your Approval
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white mt-1">
                        {app.id}
                      </h3>
                    </div>

                    <span className="text-[11px] text-[var(--ux4g-text-neutral-tertiary,#737373)] dark:text-neutral-400 font-medium">
                      Submitted: {new Date(app.delegatedAt || app.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-neutral-800/80 border border-amber-200/60 dark:border-neutral-700 text-xs flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                    <Users size={14} className="text-[#002B7F] dark:text-blue-400 shrink-0" />
                    <span>
                      Completed by <strong>{app.delegateName || "a trusted helper"}</strong>. Review answers and documents before confirming.
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveApprovalApp(app)}
                      className="ux4g-btn ux4g-btn-primary ux4g-btn-md font-bold inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 size={15} />
                      <span>Review & Confirm Submission</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 2. MAIN SECTION: All Other Applications */}
        <div aria-live="polite" className="space-y-4 pt-2">
          {state === "loading" && (
            <div className="ux4g-card ux4g-card-solid ux4g-card-vertical p-5 text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] flex items-center gap-2">
              <span className="ux4g-spinner-primary-full ux4g-spinner-sm" role="status" aria-label="Loading" />
              <span>Loading your saved applications…</span>
            </div>
          )}
          {state === "signed-out" && (
            <div className="ux4g-alert ux4g-alert-info p-4 text-xs">
              Sign in with the published demo credentials to view your applications.
            </div>
          )}
          {state === "error" && (
            <div className="ux4g-alert ux4g-alert-error p-4 text-xs">
              Saved applications could not be read. Please refresh and try again.
            </div>
          )}

          {otherApps.length > 0 ? (
            <div className="space-y-4">
              {pendingApprovalApps.length > 0 && (
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ux4g-text-neutral-tertiary,#737373)] dark:text-neutral-400">
                  Processed & Active Filings ({otherApps.length})
                </h3>
              )}

              {otherApps.map((app) => (
                <article
                  className="ux4g-card ux4g-card-solid ux4g-card-vertical p-6 rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 shadow-sm space-y-3"
                  key={app.id}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="ux4g-tag-tonal-brand ux4g-tag-s uppercase font-bold text-[10px]">
                        {app.serviceType.replaceAll("-", " ")}
                      </span>
                      <h3 className="text-base font-bold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white mt-1">
                        {app.id}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        app.status === "approved"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : app.status === "draft"
                          ? "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                          : "bg-blue-100 text-[#002B7F] dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {app.status.replaceAll("-", " ")}
                    </span>
                  </div>

                  <div className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400 leading-relaxed border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 pt-3">
                    <p>
                      Status:{" "}
                      <span className="font-semibold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-neutral-200 capitalize">
                        {app.status.replaceAll("-", " ")}
                      </span>
                    </p>
                    <span className="text-[11px] text-[var(--ux4g-text-neutral-tertiary,#737373)]">
                      Last updated: {new Date(app.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-neutral-200">
                    Next Step: {app.nextAction}
                  </p>

                  {/* Rejection Note Display if Drafted by Owner */}
                  {app.status === "draft" && app.rejectionNote && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-900 dark:text-red-200 flex items-start gap-2">
                      <MessageSquare size={14} className="text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Revision Requested:</strong> {app.rejectionNote}
                      </div>
                    </div>
                  )}

                  {/* Delegated Access Owner Badge */}
                  {app.completedViaDelegated && (
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#EEF4FF] text-[#002B7F] dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <Users size={12} /> Completed via delegated access by {app.delegateName || "a trusted helper"}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href={`/track?id=${encodeURIComponent(app.id)}`}
                      className="ux4g-btn ux4g-btn-primary ux4g-btn-sm inline-flex items-center gap-1"
                    >
                      <span>Track application</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            pendingApprovalApps.length === 0 &&
            state === "ready" && (
              <div className="ux4g-card ux4g-card-solid p-8 text-center rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400">
                  No active or past applications found. Start a new service from the home page.
                </p>
                <Link href="/" className="ux4g-btn ux4g-btn-primary ux4g-btn-sm mt-4 inline-flex items-center">
                  Start a Service
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      {/* Owner Approval Modal Dialog */}
      {activeApprovalApp && (
        <DelegateApprovalModal
          application={activeApprovalApp}
          isOpen={true}
          onClose={() => setActiveApprovalApp(null)}
          onSuccess={handleApprovalSuccess}
        />
      )}
    </Shell>
  );
}
