"use client";
import Link from "next/link";
import { CarFront, CircleUserRound } from "lucide-react";
import { useFlow } from "./flow-provider";

export function Shell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useFlow();
  return <div className="min-h-screen pb-14">
    <a href="#main-content" className="sr-only z-50 rounded bg-primary px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
    <header className="sticky top-0 z-20 border-b border-outline-variant/40 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 lg:px-12">
        <Link href="/" aria-label="Parivahan Path home" className="flex items-center gap-3 text-xl font-bold text-primary"><span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded bg-primary text-white"><CarFront size={19}/></span>Parivahan Path</Link>
        <nav aria-label="Primary navigation" className="hidden gap-8 text-sm font-semibold md:flex"><Link href="/">Home</Link><Link href="/track">Track application</Link></nav>
        <div className="flex items-center gap-3 text-sm text-muted"><div aria-label="Language" className="flex items-center gap-1 rounded border border-outline-variant/70 p-1"><button onClick={()=>setLanguage("en")} aria-pressed={language==="en"} className={`rounded px-2 py-1 ${language==="en"?"bg-primary text-white":""}`}>EN</button><button onClick={()=>setLanguage("hi")} aria-pressed={language==="hi"} className={`rounded px-2 py-1 ${language==="hi"?"bg-primary text-white":""}`}>हिंदी</button></div><CircleUserRound aria-label="Demo citizen profile" size={27} className="text-primary"/></div>
      </div>
    </header>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <footer className="fixed bottom-0 z-30 w-full border-t border-outline-variant/50 bg-surface/95 py-2 text-center text-[10px] font-semibold tracking-wider text-muted">HACKATHON PROTOTYPE • SYNTHETIC DATA • NOT AN OFFICIAL SERVICE</footer>
  </div>;
}
