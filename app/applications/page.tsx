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
        className="mx-auto min-h-[calc(100vh-140px)] max-w-2xl px-6 py-10"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
          {f.citizen ? `Signed in as ${f.citizen.name}` : "Demo applications"}
        </p>
        <h1 id="applications-title" className="mt-1 text-2xl font-bold tracking-tight text-primary">
          My Applications
        </h1>

        <div aria-live="polite" className="mt-6 space-y-4">
          {state === "loading" && (
            <p className="card p-5 text-xs text-outline font-medium">
              Loading your saved demo applications…
            </p>
          )}
          {state === "signed-out" && (
            <p className="card p-5 text-xs text-outline font-medium leading-relaxed">
              Sign in with the published demo credentials to view the persisted application.
            </p>
          )}
          {state === "error" && (
            <p className="card p-5 text-xs text-outline font-medium leading-relaxed">
              Saved demo applications could not be read. Please refresh and try again.
            </p>
          )}

          {apps.map((app) => (
            <article className="card p-6 space-y-3" key={app.id}>
              <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                  {app.serviceType}
                </p>
                <h2 className="text-base font-bold text-primary mt-0.5">
                  {app.id}
                </h2>
              </div>
              
              <div className="text-xs text-outline leading-relaxed border-t border-outline-variant/40 pt-3">
                <p>Status: <span className="font-semibold text-primary capitalize">{app.status.replaceAll("-", " ")}</span></p>
                <span className="text-[10px] text-outline/65">
                  Last updated: {new Date(app.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-xs font-semibold text-primary">
                Next Step: {app.nextAction}
              </p>
              
              <div className="pt-2">
                <Link href={`/track?id=${encodeURIComponent(app.id)}`} className="btn-primary py-2 px-4.5 text-xs inline-block">
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
