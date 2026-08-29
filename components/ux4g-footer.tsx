"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Globe,
  Moon,
  Sun,
  CarFront,
  ArrowUpRight,
  ArrowUp,
  ExternalLink,
} from "lucide-react";
import { useFlow } from "./flow-provider";
import { SUPPORTED_LANGUAGES, getTranslation, LanguageCode } from "@/lib/translations";

export function Ux4gFooter() {
  const { language, setLanguage, theme, toggleTheme } = useFlow();
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  const t = getTranslation(language);

  const changeFontSize = (size: "sm" | "base" | "lg") => {
    setFontSize(size);
    if (typeof document !== "undefined") {
      if (size === "sm") document.documentElement.style.fontSize = "14px";
      else if (size === "lg") document.documentElement.style.fontSize = "18px";
      else document.documentElement.style.fontSize = "16px";
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full min-w-full mt-auto bg-[#08021E] text-white transition-colors duration-200">
      {/* 1. Top Accessibility, Language & Theme Utility Bar (Full Width) */}
      <div className="w-full border-b border-[#1E293B] bg-[#070D1A] py-2.5 text-xs text-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-300">
              {t.nav.accessibility}:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeFontSize("sm")}
                aria-label="Decrease font size"
                className={`rounded border px-2 py-0.5 font-bold transition-colors ${
                  fontSize === "sm"
                    ? "border-[var(--ux4g-color-primary-600,#4A2BC2)] bg-[var(--ux4g-color-primary-600,#4A2BC2)] text-white"
                    : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                -A
              </button>
              <button
                type="button"
                onClick={() => changeFontSize("base")}
                aria-label="Reset font size"
                className={`rounded border px-2 py-0.5 font-bold transition-colors ${
                  fontSize === "base"
                    ? "border-[var(--ux4g-color-primary-600,#4A2BC2)] bg-[var(--ux4g-color-primary-600,#4A2BC2)] text-white"
                    : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => changeFontSize("lg")}
                aria-label="Increase font size"
                className={`rounded border px-2 py-0.5 font-bold transition-colors ${
                  fontSize === "lg"
                    ? "border-[var(--ux4g-color-primary-600,#4A2BC2)] bg-[var(--ux4g-color-primary-600,#4A2BC2)] text-white"
                    : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                A+
              </button>
            </div>
            <a
              href="#main-content"
              className="text-indigo-400 hover:underline hover:text-indigo-300 ml-2"
            >
              {t.nav.skipToContent}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            {/* Quick Language Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangPickerOpen(!langPickerOpen)}
                className="flex items-center gap-1.5 font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
                aria-label="Toggle language menu"
              >
                <Globe size={13} />
                <span>Language: {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName}</span>
              </button>

              {langPickerOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-64 rounded-xl border border-slate-700 bg-[#0B1528] p-2 shadow-2xl z-50 text-white animate-in fade-in zoom-in-95 duration-100">
                  <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                    {SUPPORTED_LANGUAGES.map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => {
                          setLanguage(opt.code as LanguageCode);
                          setLangPickerOpen(false);
                        }}
                        className={`flex flex-col items-start px-2 py-1 rounded text-left text-xs ${
                          language === opt.code
                            ? "bg-[var(--ux4g-color-primary-600,#4A2BC2)] text-white font-bold"
                            : "hover:bg-slate-800 text-slate-200"
                        }`}
                      >
                        <span className="font-semibold">{opt.nativeName}</span>
                        <span className="text-[10px] opacity-75">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-slate-700">|</span>

            {/* Quick Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1 text-slate-300 hover:text-white"
              aria-label={`Toggle theme: currently ${theme}`}
            >
              {theme === "light" ? <Moon size={13} className="text-indigo-400" /> : <Sun size={13} className="text-amber-400" />}
              <span>{theme === "light" ? t.nav.themeDark : t.nav.themeLight}</span>
            </button>

            <span className="text-slate-700">|</span>

            <Link href="/" className="hover:underline text-slate-300 hover:text-white">
              {t.nav.home}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Banner / Hero Support Callout with Watermark (Full Width) */}
      <div className="relative overflow-hidden w-full bg-[#0C0628] border-b border-indigo-950/80 px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Subtle Watermark Typography in Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-7xl font-black tracking-tighter text-white/[0.04] sm:text-9xl md:right-16 lg:text-[12rem]"
        >
          PARIVAHAN
        </div>

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center w-full">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Need Support?
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Reach out to our citizen helpdesk or smart assistant and we will guide you step by step.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <a
              href="mailto:helpdesk-vahan@gov.in"
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-transparent px-5 py-2 text-xs sm:text-sm font-bold text-white transition-all hover:bg-white hover:text-[#0C0628] shadow-sm hover:shadow"
            >
              <span>Get in touch</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Footer 5-Column Grid (Full Width Edge-to-Edge) */}
      <div className="w-full bg-[#08021E] py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6 w-full">
          
          {/* Column 1: CITIZEN SERVICES */}
          <div className="lg:pr-4 lg:border-r lg:border-white/10">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              CITIZEN SERVICES
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Portal Overview</Link></li>
              <li><Link href="/understand" className="hover:text-white hover:underline transition-colors">Vehicle RC Transfer</Link></li>
              <li><Link href="/understand" className="hover:text-white hover:underline transition-colors">License Renewal</Link></li>
              <li><Link href="/track" className="hover:text-white hover:underline transition-colors">Track Status</Link></li>
              <li><Link href="/applications" className="hover:text-white hover:underline transition-colors">My Applications</Link></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Download Digital RC</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Pay Traffic Challan</a></li>
            </ul>
          </div>

          {/* Column 2: ABOUT & REGULATORY */}
          <div className="lg:pr-4 lg:border-r lg:border-white/10">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              ABOUT & REGULATORY
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="https://morth.nic.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white hover:underline transition-colors">About MoRTH <ExternalLink size={11} className="text-slate-400" /></a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">CMVR 1989 Rules</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">CMVR 1989 Ebook</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Motor Vehicles Act</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Homologation Standards</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Permit Fees & Period</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">State Transport RTOs</a></li>
            </ul>
          </div>

          {/* Column 3: CITIZEN RESOURCES */}
          <div className="lg:pr-4 lg:border-r lg:border-white/10">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              CITIZEN RESOURCES
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Fees & User Charges</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Citizen Manual Guide</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Document Checklist</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Audit & Transparency</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Grievance Redressal</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Accessibility Guidelines</a></li>
            </ul>
          </div>

          {/* Column 4: IMPORTANT LINKS */}
          <div className="lg:pr-4 lg:border-r lg:border-white/10">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              IMPORTANT LINKS
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#" className="flex items-center gap-1 hover:text-white hover:underline transition-colors">Careers at MoRTH <ExternalLink size={11} className="text-slate-400" /></a></li>
              <li><a href="#" className="flex items-center gap-1 hover:text-white hover:underline transition-colors">Tenders & Gazette <ExternalLink size={11} className="text-slate-400" /></a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Workshop Feedback</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Helpdesk Support</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Web Information Manager</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">National Portal of India</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 5: IDENTITY, POWERED BY, SOCIALS & VISITOR COUNTER */}
          <div className="flex flex-col gap-3.5">
            {/* Organization Emblem & Title Badge */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ux4g-color-primary-600,#4A2BC2)] text-white shadow font-bold">
                <CarFront size={22} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm sm:text-base font-black tracking-tight text-white">
                  Parivahan Path
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Government of India
                </span>
              </div>
            </div>

            {/* Address details */}
            <p className="text-[11px] leading-relaxed text-slate-300">
              Ministry of Road Transport and Highways<br />
              Transport Bhawan, 1, Parliament Street,<br />
              New Delhi - 110001
            </p>

            {/* Powered by tag */}
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Powered by</span>
              <span className="font-bold text-slate-200">UX4G Design System 3.0</span>
            </div>

            {/* Circular Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-white hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-white hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-white hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-white hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-white hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Visitor Count Pill Badge */}
            <div className="pt-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#1A123D] border border-white/10 px-3.5 py-1 text-xs font-semibold text-slate-200">
                <span>Visitor:</span>
                <span className="font-mono font-bold text-white tracking-wider">475,575</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Terms, Copyright & Quick Return Bar (Full Width) */}
      <div className="w-full border-t border-[#1C1242] bg-[#060117] py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row w-full">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <button
              type="button"
              onClick={scrollToTop}
              title="Back to Top"
              aria-label="Scroll back to top of page"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowUp size={14} />
            </button>
            <p className="text-[11px] text-slate-400">
              Designed by{" "}
              <a
                href="https://github.com/Aditya4453"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-200 hover:text-white hover:underline transition-colors"
              >
                Aditya Modani
              </a>{" "}
              and{" "}
              <a
                href="https://github.com/justsamridhi"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-200 hover:text-white hover:underline transition-colors"
              >
                Samridhi Gupta
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <a href="#" className="hover:text-white hover:underline transition-colors">Terms & Conditions</a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-white hover:underline transition-colors">{t.footer.privacyPolicy}</a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-white hover:underline transition-colors">Hyperlink Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
