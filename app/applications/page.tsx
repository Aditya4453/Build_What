"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { useFlow } from "@/components/flow-provider";

type Application = {
  id: string;
  serviceType: string;
  status: string;
  updatedAt: string;
  nextAction: string;
};

export default function Page() {
  const f = useFlow();
  const [apps, setApps] = useState<Application[]>([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    fetch("/api/applications")
      .then(async (r) => {
        if (!r.ok) {
          setState("signed-out");
          return;
        }
        const data = await r.json();
        setApps(data.applications);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <Shell>
      <section
        aria-labelledby="applications-title"
        className="mx-auto min-h-[calc(100vh-160px)] max-w-2xl px-4 py-10 sm:px-6"
      >
        <div className="mb-2">
          <span className="ux4g-tag-tonal-brand ux4g-tag-s">
            {f.citizen ? `Signed in as ${f.citizen.name}` : "Demo applications"}
          </span>
        </div>
        <h1 id="applications-title" className="text-2xl font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)] sm:text-3xl">
          My Applications
        </h1>

        <div aria-live="polite" className="mt-6 space-y-4">
          {state === "loading" && (
            <div className="ux4g-card ux4g-card-solid ux4g-card-vertical p-5 text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] flex items-center gap-2">
              <span className="ux4g-spinner-primary-full ux4g-spinner-sm" role="status" aria-label="Loading" />
              <span>Loading your saved demo applications…</span>
            </div>
          )}
          {state === "signed-out" && (
            <div className="ux4g-alert ux4g-alert-info p-4 text-xs">
              Sign in with the published demo credentials to view the persisted application.
            </div>
          )}
          {state === "error" && (
            <div className="ux4g-alert ux4g-alert-error p-4 text-xs">
              Saved demo applications could not be read. Please refresh and try again.
            </div>
          )}

          {apps.map((app) => (
            <article className="ux4g-card ux4g-card-solid ux4g-card-vertical p-6 space-y-3 shadow-sm" key={app.id}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="ux4g-tag-tonal-brand ux4g-tag-s uppercase font-bold text-[10px]">
                    {app.serviceType}
                  </span>
                  <h2 className="text-base font-bold text-[var(--ux4g-text-neutral-primary,#171717)] mt-1">
                    {app.id}
                  </h2>
                </div>
                <span className="ux4g-tag-filled-success ux4g-tag-s capitalize">
                  {app.status.replaceAll("-", " ")}
                </span>
              </div>
              
              <div className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] leading-relaxed border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] pt-3">
                <p>Status: <span className="font-semibold text-[var(--ux4g-text-neutral-primary,#171717)] capitalize">{app.status.replaceAll("-", " ")}</span></p>
                <span className="text-[11px] text-[var(--ux4g-text-neutral-tertiary,#737373)]">
                  Last updated: {new Date(app.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-xs font-semibold text-[var(--ux4g-text-neutral-primary,#171717)]">
                Next Step: {app.nextAction}
              </p>
              
              <div className="pt-2">
                <Link
                  href={`/track?id=${encodeURIComponent(app.id)}`}
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-sm inline-flex items-center"
                >
                  Reopen application
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}
