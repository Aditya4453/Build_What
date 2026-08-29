"use client";

import { Ux4gHeader } from "./ux4g-header";
import { Ux4gFooter } from "./ux4g-footer";
import { CitizenAssistant } from "./citizen-assistant";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--ux4g-bg-neutral,#FAFAFA)] text-[var(--ux4g-text-neutral-primary,#171717)] transition-colors duration-200">
      {/* UX4G Standard Government Header */}
      <Ux4gHeader />

      {/* Main Page Layout Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      <CitizenAssistant />

      {/* Comprehensive UX4G MoRTH Footer */}
      <Ux4gFooter />
    </div>
  );
}
