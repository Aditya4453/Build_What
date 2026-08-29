"use client";

import Link from "next/link";
import { Shell } from "@/components/shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-extrabold text-[var(--ux4g-text-neutral-primary,#171717)]">404</h1>
        <p className="mt-2 text-base text-[var(--ux4g-text-neutral-secondary,#404040)]">
          Page Not Found / पृष्ठ नहीं मिला
        </p>
        <Link
          href="/"
          className="ux4g-btn ux4g-btn-primary ux4g-btn-md mt-6 inline-flex items-center gap-2"
        >
          Return to Home / मुख्य पृष्ठ पर वापस जाएं
        </Link>
      </div>
    </Shell>
  );
}
