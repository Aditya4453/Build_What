"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CarFront, LogOut, Moon, Sun, User, Menu, X } from "lucide-react";
import { useFlow } from "./flow-provider";
import { CitizenAssistant } from "./citizen-assistant";

export function Shell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, citizen, signOut, theme, setTheme } = useFlow();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const leave = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    signOut();
  };

  // Helper to determine active state of navigation links
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
    <div className="flex min-h-screen flex-col bg-surface/30">
      {/* Skip to Main Content Link for accessibility */}
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-primary px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      {/* Transparent Header without Border Line */}
      <header className="sticky top-0 z-20 bg-transparent relative">
        <div className="w-full flex h-16 items-center justify-between px-6 md:px-10 md:grid md:grid-cols-3">
          
          {/* Logo Brand left & Hamburger Menu toggle button */}
          <div className="flex items-center gap-3 justify-self-start z-30">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-outline hover:text-primary hover:bg-surface-container md:hidden transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link
              href="/"
              aria-label="Parivahan Path home"
              className="flex items-center gap-2.5 text-base font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-surface"
              >
                <CarFront size={16} />
              </span>
              <span>Parivahan Path</span>
            </Link>
          </div>

          {/* Center Navigation Links with Active Indicators */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center justify-center gap-7 text-xs font-semibold tracking-wider uppercase md:flex justify-self-center"
          >
            <Link
              href="/"
              className={`relative py-5 transition-colors ${
                isHomeActive
                  ? "text-primary font-bold"
                  : "text-outline hover:text-primary"
              }`}
            >
              Home
              {isHomeActive && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary rounded-full" />
              )}
            </Link>
            <Link
              href="/track"
              className={`relative py-5 transition-colors ${
                isTrackActive
                  ? "text-primary font-bold"
                  : "text-outline hover:text-primary"
              }`}
            >
              Track
              {isTrackActive && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary rounded-full" />
              )}
            </Link>
            {citizen && (
              <Link
                href="/applications"
                className={`relative py-5 transition-colors ${
                  isAppsActive
                     ? "text-primary font-bold"
                     : "text-outline hover:text-primary"
                }`}
              >
                My Applications
                {isAppsActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary rounded-full" />
                )}
              </Link>
            )}
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-3 justify-self-end">
            
            {/* Language Selector: EN | हिंदी */}
            <div
              aria-label="Language selection"
              className="flex items-center gap-1.5 text-xs font-bold tracking-wide"
            >
              <button
                onClick={() => setLanguage("en")}
                aria-label="Switch to English"
                aria-pressed={language === "en"}
                className={`rounded px-1.5 py-1 transition-colors ${
                  language === "en" ? "text-primary" : "text-outline/60 hover:text-primary"
                }`}
              >
                EN
              </button>
              <span className="text-outline-variant select-none">|</span>
              <button
                onClick={() => setLanguage("hi")}
                aria-label="हिंदी में बदलें"
                aria-pressed={language === "hi"}
                className={`rounded px-1.5 py-1 transition-colors ${
                  language === "hi" ? "text-primary" : "text-outline/60 hover:text-primary"
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Theme Toggle Moon/Sun */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="flex h-8 w-8 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-primary"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Profile Avatar / Login Action */}
            {citizen ? (
              <div className="flex items-center gap-2 pl-1">
                <span className="hidden text-xs font-semibold text-primary sm:inline max-w-[120px] truncate">
                  {citizen.name}
                </span>
                <button
                  onClick={leave}
                  title="Sign out of demo account"
                  aria-label="Sign out of demo account"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/60 bg-surface-container text-outline transition-colors hover:bg-[#ffdad6] hover:text-[#93000a] hover:border-[#ffdad6]"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/60 bg-surface-container text-outline hover:text-primary hover:border-outline transition-colors"
                aria-label="Sign in to your account"
              >
                <User size={15} />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-30 bg-surface-low border-b border-outline-variant px-6 py-4 shadow-civic md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-4 text-xs font-semibold tracking-wider uppercase">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 transition-colors ${
                  isHomeActive ? "text-primary font-bold" : "text-outline hover:text-primary"
                }`}
              >
                Home
              </Link>
              <Link
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 transition-colors ${
                  isTrackActive ? "text-primary font-bold" : "text-outline hover:text-primary"
                }`}
              >
                Track
              </Link>
              {citizen && (
                <Link
                  href="/applications"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    isAppsActive ? "text-primary font-bold" : "text-outline hover:text-primary"
                  }`}
                >
                  My Applications
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Page Layout Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      <CitizenAssistant />

      {/* Spacious Footer without Border Line and Background */}
      <footer className="w-full py-8 mt-auto text-center bg-transparent">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-outline">
          Hackathon Prototype • Synthetic Data • Not an Official Service
        </p>
        <p className="mt-2 text-xs font-medium">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline"
          >
            About this prototype
          </a>
        </p>
      </footer>
    </div>
  );
}
