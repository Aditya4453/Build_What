"use client";
import Link from "next/link";
import { Shell } from "@/components/shell";
import { useFlow } from "@/components/flow-provider";
export default function Page(){const f=useFlow();return <Shell><section aria-labelledby="applications-title" className="mx-auto min-h-[calc(100vh-120px)] max-w-3xl px-4 py-12"><p className="text-xs font-bold uppercase tracking-widest text-secondary">{f.citizen?`Signed in as ${f.citizen.name}`:"Demo applications"}</p><h1 id="applications-title" className="mt-2 text-3xl font-bold text-primary">My Applications</h1><div className="card mt-7 p-6"><p className="text-sm font-bold text-secondary">DRIVING LICENCE RENEWAL</p><h2 className="mt-1 text-xl font-bold">Application PP-2026-08142</h2><p className="mt-2 text-muted">Payment: {f.paymentStatus.replaceAll("-"," ")} · Documents: ready</p><Link href="/track" className="btn-primary mt-5">Reopen application</Link></div></section></Shell>}
