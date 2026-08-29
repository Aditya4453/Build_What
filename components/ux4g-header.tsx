"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  CarFront,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Search,
  Globe,
  ChevronDown,
  Check,
  Sparkles,
} from "lucide-react";
import { useFlow } from "./flow-provider";
import { SUPPORTED_LANGUAGES, getTranslation, LanguageCode } from "@/lib/translations";

export function Ux4gHeader() {
  const { language, setLanguage, citizen, signOut, theme, toggleTheme } = useFlow();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  const t = getTranslation(language);

  const leave = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    signOut();
  };

  const changeFontSize = (size: "sm" | "base" | "lg") => {
    setFontSize(size);
    if (typeof document !== "undefined") {
      if (size === "sm") document.documentElement.style.fontSize = "14px";
      else if (size === "lg") document.documentElement.style.fontSize = "18px";
      else document.documentElement.style.fontSize = "16px";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const currentLangObj = useMemo(
    () => SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0],
    [language]
  );

  const filteredLanguages = useMemo(() => {
    if (!langSearch.trim()) return SUPPORTED_LANGUAGES;
    const query = langSearch.toLowerCase().trim();
    return SUPPORTED_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(query) ||
        l.nativeName.toLowerCase().includes(query) ||
        l.region.toLowerCase().includes(query)
    );
  }, [langSearch]);

  const isHomeActive =
    pathname === "/" ||
    pathname.startsWith("/understand") ||
    pathname.startsWith("/questions") ||
    pathname.startsWith("/plan") ||
    pathname.startsWith("/upload") ||
    pathname.startsWith("/review");

  const isTrackActive = pathname.startsWith("/track") || pathname.startsWith("/validation");
  const isAppsActive = pathname.startsWith("/applications");

  return (
    <header className="sticky top-0 z-30 w-full shadow-sm">
      {/* 1. Top Utility & Masthead Bar (Government Banner) */}
      <div className="w-full bg-[#0B1528] text-white text-xs border-b border-[#1E293B] transition-colors duration-200">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Indian Flag & Government of India */}
          <div className="flex items-center gap-2.5">
            <svg
              className="h-3.5 w-5 rounded-[2px] shadow-sm shrink-0"
              viewBox="0 0 900 600"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="National Flag of India"
            >
              <rect width="900" height="200" fill="#FF9933" />
              <rect y="200" width="900" height="200" fill="#FFFFFF" />
              <rect y="400" width="900" height="200" fill="#138808" />
              <circle cx="450" cy="300" r="80" fill="none" stroke="#000080" strokeWidth="6" />
              <circle cx="450" cy="300" r="14" fill="#000080" />
            </svg>
            <span className="font-semibold tracking-wide text-slate-100 flex items-center gap-1.5">
              <span className="hidden sm:inline">भारत सरकार</span>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span>{t.nav.governmentOfIndia}</span>
            </span>
          </div>

          {/* Right: Accessibility Controls, Language, Theme Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-[11px] font-medium text-slate-200">
            {/* Skip to Main Content */}
            <a
              href="#main-content"
              className="hidden md:inline hover:text-white transition-colors focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:p-2 focus:text-primary focus:shadow"
            >
              {t.nav.skipToContent}
            </a>

            <span className="hidden md:inline text-slate-600">|</span>

            {/* Font Size Adjusters: -A, A, A+ */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeFontSize("sm")}
                aria-label="Decrease font size"
                className={`rounded px-1.5 py-0.5 font-bold transition-colors ${
                  fontSize === "sm"
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                -A
              </button>
              <button
                type="button"
                onClick={() => changeFontSize("base")}
                aria-label="Normal font size"
                className={`rounded px-1.5 py-0.5 font-bold transition-colors ${
                  fontSize === "base"
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => changeFontSize("lg")}
                aria-label="Increase font size"
                className={`rounded px-1.5 py-0.5 font-bold transition-colors ${
                  fontSize === "lg"
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                A+
              </button>
            </div>

            <span className="text-slate-600">|</span>

            {/* Prominent Multi-Language Switcher Trigger */}
            <button
              type="button"
              onClick={() => setLangModalOpen(true)}
              className="flex items-center gap-1.5 rounded bg-slate-800/80 hover:bg-slate-700 px-2 py-1 font-semibold text-slate-100 hover:text-white transition-colors border border-slate-700"
              aria-label={`Select language. Currently ${currentLangObj.name} (${currentLangObj.nativeName})`}
              title="Change language / भाषा बदलें"
            >
              <Globe size={13} className="text-primary-300 text-indigo-400" />
              <span className="font-bold">{currentLangObj.nativeName}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">({currentLangObj.name})</span>
              <ChevronDown size={11} className="text-slate-400" />
            </button>

            <span className="text-slate-600">|</span>

            {/* Dedicated High-Contrast Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 rounded bg-slate-800/80 hover:bg-slate-700 px-2 py-1 font-semibold text-slate-100 hover:text-white transition-colors border border-slate-700"
              aria-label={`Current theme: ${theme === "light" ? "Light" : "Dark"}. Click to switch to ${theme === "light" ? "Dark" : "Light"} mode.`}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? (
                <>
                  <Moon size={13} className="text-indigo-400" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun size={13} className="text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Navigation Header (Elevated Surface) */}
      <div className="w-full bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] transition-colors duration-200">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Emblem + 40x40 Logo + Ministry / Department Name */}
          <div className="flex items-center gap-3.5">
            {/* Hamburger Button on Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ux4g-icon-btn ux4g-icon-btn-outline-primary ux4g-icon-btn-sm lg:hidden"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* National Emblem SVG */}
            <div className="hidden sm:flex flex-col items-center justify-center pr-1 shrink-0" title="State Emblem of India">
              <svg width="28" height="38" viewBox="0 0 70 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M35 5C22 5 15 15 15 28C15 38 22 45 28 48C24 50 20 54 20 62C20 70 25 76 35 78C45 76 50 70 50 62C50 54 46 50 42 48C48 45 55 38 55 28C55 15 48 5 35 5Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-[var(--ux4g-text-neutral-primary,#171717)]"
                />
                <path
                  d="M22 84H48M18 90H52"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-[var(--ux4g-text-neutral-primary,#171717)]"
                />
                <circle cx="35" cy="30" r="6" fill="currentColor" className="text-[var(--ux4g-color-primary-600,#4A2BC2)]" />
              </svg>
            </div>

            {/* Logo 40x40 Badge */}
            <Link
              href="/"
              aria-label="Parivahan Path home"
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--ux4g-color-primary-600,#4A2BC2)] text-white shadow-sm font-bold text-xs"
              >
                <CarFront size={20} />
              </div>

              {/* Ministry Name & Portal Title */}
              <div className="flex flex-col leading-tight">
                <span className="text-base font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)] sm:text-lg">
                  {t.nav.portalName}
                </span>
                <span className="text-[11px] font-semibold text-[var(--ux4g-text-brand-primary-default,#4A2BC2)]">
                  {t.nav.ministryName}
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[var(--ux4g-text-neutral-secondary,#404040)]"
          >
            <Link
              href="/"
              className={`relative py-6 transition-colors hover:text-[var(--ux4g-text-neutral-primary,#171717)] ${
                isHomeActive
                  ? "font-bold text-[var(--ux4g-text-brand-primary-default,#4A2BC2)]"
                  : ""
              }`}
            >
              {t.nav.home}
              {isHomeActive && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-[var(--ux4g-color-primary-600,#4A2BC2)]" />
              )}
            </Link>

            <Link
              href="/track"
              className={`relative py-6 transition-colors hover:text-[var(--ux4g-text-neutral-primary,#171717)] ${
                isTrackActive
                  ? "font-bold text-[var(--ux4g-text-brand-primary-default,#4A2BC2)]"
                  : ""
              }`}
            >
              {t.nav.track}
              {isTrackActive && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-[var(--ux4g-color-primary-600,#4A2BC2)]" />
              )}
            </Link>

            {citizen ? (
              <Link
                href="/applications"
                className={`relative py-6 transition-colors hover:text-[var(--ux4g-text-neutral-primary,#171717)] ${
                  isAppsActive
                    ? "font-bold text-[var(--ux4g-text-brand-primary-default,#4A2BC2)]"
                    : ""
                }`}
              >
                {t.nav.applications}
                {isAppsActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-[var(--ux4g-color-primary-600,#4A2BC2)]" />
                )}
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="py-6 hover:text-[var(--ux4g-text-neutral-primary,#171717)] transition-colors"
              >
                {t.nav.services}
              </Link>
            )}

            <a
              href="https://morth.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="py-6 hover:text-[var(--ux4g-text-neutral-primary,#171717)] transition-colors"
            >
              {t.nav.about}
            </a>
          </nav>

          {/* Right: Primary CTA Button + Search Icon */}
          <div className="flex items-center gap-3">
            {/* Search Input Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center rounded-lg border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] px-2.5 py-1 animate-in fade-in duration-150"
                >
                  <input
                    type="search"
                    placeholder={t.nav.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-32 sm:w-44 bg-transparent text-xs text-[var(--ux4g-text-neutral-primary,#171717)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-slate-400 hover:text-slate-700 ml-1"
                    aria-label="Close search"
                  >
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search box"
                  className="ux4g-icon-btn ux4g-icon-btn-outline-primary ux4g-icon-btn-sm"
                >
                  <Search size={16} />
                </button>
              )}
            </div>

            {/* Primary Action CTA Button */}
            {citizen ? (
              <div className="flex items-center gap-2">
                <span className="hidden max-w-[120px] truncate text-xs font-semibold text-[var(--ux4g-text-neutral-primary,#171717)] sm:inline">
                  {citizen.name}
                </span>
                <button
                  type="button"
                  onClick={leave}
                  title={t.nav.signOut}
                  aria-label={t.nav.signOut}
                  className="ux4g-icon-btn ux4g-icon-btn-outline-primary ux4g-icon-btn-sm"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="ux4g-btn ux4g-btn-primary ux4g-btn-md font-bold shadow-sm"
              >
                <span>{t.nav.signIn}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] px-6 py-4 shadow-md lg:hidden animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-3 text-sm font-semibold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 transition-colors ${
                isHomeActive
                  ? "font-bold text-[var(--ux4g-text-brand-primary-default,#4A2BC2)]"
                  : "text-[var(--ux4g-text-neutral-secondary,#404040)]"
              }`}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 transition-colors ${
                isTrackActive
                  ? "font-bold text-[var(--ux4g-text-brand-primary-default,#4A2BC2)]"
                  : "text-[var(--ux4g-text-neutral-secondary,#404040)]"
              }`}
            >
              {t.nav.track}
            </Link>
            {citizen && (
              <Link
                href="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 transition-colors ${
                  isAppsActive
                    ? "font-bold text-[var(--ux4g-text-brand-primary-default,#4A2BC2)]"
                    : "text-[var(--ux4g-text-neutral-secondary,#404040)]"
                }`}
              >
                {t.nav.applications}
              </Link>
            )}
            <a
              href="https://morth.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-[var(--ux4g-text-neutral-secondary,#404040)]"
            >
              {t.nav.about}
            </a>

            {/* Mobile Language and Theme controls */}
            <div className="pt-3 mt-1 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLangModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--ux4g-text-brand-primary-default,#4A2BC2)]"
              >
                <Globe size={14} />
                <span>Language: {currentLangObj.nativeName}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--ux4g-text-neutral-primary,#171717)]"
              >
                {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>
            </div>

            {!citizen && (
              <div className="pt-2 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)]">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-md w-full justify-center"
                >
                  {t.nav.signIn}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* 4. Enhanced Multi-Language Selector Modal */}
      {langModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLangModalOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] p-6 shadow-2xl text-[var(--ux4g-text-neutral-primary,#171717)] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)]">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--ux4g-color-primary-50,#F3F0FF)] text-[var(--ux4g-color-primary-600,#4A2BC2)]">
                  <Globe size={18} />
                </div>
                <div>
                  <h2 id="lang-modal-title" className="text-base font-extrabold tracking-tight">
                    Select Official Language / भाषा चुनें
                  </h2>
                  <p className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)]">
                    Choose your preferred Indian regional language for complete portal translation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLangModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
                aria-label="Close language selector"
              >
                <X size={18} />
              </button>
            </div>

            {/* Language Search Filter */}
            <div className="mt-4">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] px-3 py-2">
                <Search size={15} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search language / भाषा खोजें (e.g. Hindi, Tamil, বাংলা)..."
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-[var(--ux4g-text-neutral-primary,#171717)] focus:outline-none"
                />
                {langSearch && (
                  <button type="button" onClick={() => setLangSearch("")} className="text-xs text-slate-400">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Language Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {filteredLanguages.map((opt) => {
                const isSelected = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setLanguage(opt.code as LanguageCode);
                      setLangModalOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-[var(--ux4g-color-primary-600,#4A2BC2)] bg-[var(--ux4g-color-primary-50,#F3F0FF)] dark:bg-[var(--ux4g-color-primary-950,#1A0E3D)] text-[var(--ux4g-color-primary-600,#4A2BC2)] ring-1 ring-[var(--ux4g-color-primary-600,#4A2BC2)] font-bold"
                        : "border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] hover:bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)]"
                    }`}
                  >
                    <div className="flex flex-col leading-snug">
                      <span className="text-sm font-extrabold">{opt.nativeName}</span>
                      <span className="text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] font-medium">
                        {opt.name}
                      </span>
                      <span className="text-[10px] text-[var(--ux4g-text-neutral-tertiary,#737373)] mt-0.5">
                        {opt.region}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ux4g-color-primary-600,#4A2BC2)] text-white shadow-sm shrink-0">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-3 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] flex items-center justify-between text-xs text-[var(--ux4g-text-neutral-tertiary,#737373)]">
              <span className="flex items-center gap-1">
                <Sparkles size={13} className="text-amber-500" />
                All 12 Indian regional languages supported
              </span>
              <button
                type="button"
                onClick={() => setLangModalOpen(false)}
                className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
