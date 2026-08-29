"use client";

import {
  ExternalLink,
  ShieldCheck,
  Building2,
} from "lucide-react";

export interface GovernmentUpdateItem {
  id: string;
  category: "rules" | "policies" | "schemes";
  categoryLabel: string;
  badgeType: "brand" | "success" | "info" | "warning";
  gazetteNo: string;
  date: string;
  title: string;
  summary: string;
  officialUrl: string;
}

export const GOVERNMENT_UPDATES_DATA: GovernmentUpdateItem[] = [
  {
    id: "bh-series-2026",
    category: "rules",
    categoryLabel: "CMVR Amendment",
    badgeType: "brand",
    gazetteNo: "G.S.R. 412(E)",
    date: "14 August 2026",
    title: "Bharat (BH) Series Vehicle Registration Expansion",
    summary:
      "Nationwide road-tax portability for private and public sector employees with automated electronic certificate verification.",
    officialUrl: "https://morth.nic.in/central-motor-vehicles-rules-1989",
  },
  {
    id: "pm-edrive-scheme",
    category: "schemes",
    categoryLabel: "National Scheme",
    badgeType: "success",
    gazetteNo: "F.No. 12(14)/2026-EM",
    date: "01 August 2026",
    title: "PM e-DRIVE National EV Subsidy Scheme",
    summary:
      "Upfront purchase subsidies on electric 2-wheelers, 3-wheelers, and zero state permit registration fees for green vehicles.",
    officialUrl: "https://pmedrive.heavyindustries.gov.in/",
  },
  {
    id: "scrappage-policy-2",
    category: "policies",
    categoryLabel: "Policy Circular",
    badgeType: "info",
    gazetteNo: "RT-11018/02/2026-MVL",
    date: "28 July 2026",
    title: "Vehicle Modernization (Scrappage 2.0) Road Tax Rebate",
    summary:
      "Up to 25% road-tax concession on new vehicle purchases upon submitting a digital Certificate of Deposit from registered scrapping centers.",
    officialUrl: "https://vscrap.parivahan.gov.in/vehiclescrap/vscrap/",
  },
  {
    id: "automated-driving-tests",
    category: "rules",
    categoryLabel: "Safety Standard",
    badgeType: "brand",
    gazetteNo: "G.S.R. 298(E)",
    date: "15 July 2026",
    title: "Mandatory Automated Driving Test Tracks (ADTT)",
    summary:
      "100% sensor-based, zero-human-bias driving skill evaluations with video telematics and transparent scoring across all RTOs.",
    officialUrl: "https://parivahan.gov.in/parivahan//en/content/automated-driving-test-tracks",
  },
  {
    id: "cashless-accident-treatment",
    category: "schemes",
    categoryLabel: "Citizen Welfare",
    badgeType: "success",
    gazetteNo: "Scheme No. 04/2026-NHA",
    date: "05 July 2026",
    title: "Cashless Emergency Treatment for Road Accident Victims",
    summary:
      "Guaranteed cashless medical trauma care up to ₹1,50,000 during the critical Golden Hour on all National and State Highways.",
    officialUrl: "https://morth.nic.in/cashless-treatment-road-accident-victims",
  },
  {
    id: "digilocker-idp",
    category: "policies",
    categoryLabel: "Digital Governance",
    badgeType: "info",
    gazetteNo: "Advisory No. 19/2026",
    date: "20 June 2026",
    title: "Paperless International Driving Permit via DigiLocker",
    summary:
      "Instant issuance of QR-verified International Driving Permits through Aadhaar and passport data integration without physical RTO visits.",
    officialUrl: "https://parivahan.gov.in/parivahan//en/content/international-driving-permit",
  },
];

export function GovernmentUpdates() {
  // Duplicate list to achieve continuous infinite marquee loop
  const loopItems = [...GOVERNMENT_UPDATES_DATA, ...GOVERNMENT_UPDATES_DATA];

  return (
    <section
      id="rules-policies-schemes"
      aria-labelledby="updates-heading"
      className="w-full border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] bg-[var(--ux4g-bg-neutral,#FAFAFA)] dark:bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <span className="ux4g-tag-tonal-brand ux4g-tag-s mb-2.5 inline-flex items-center gap-1.5 uppercase font-bold tracking-widest">
            <ShieldCheck size={13} />
            Official Gazettes & Schemes
          </span>

          <h2
            id="updates-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white"
          >
            Rules, Policies & Schemes
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400">
            Latest circulars, amendments under CMVR 1989, and citizen welfare schemes. (Hover to pause)
          </p>
        </div>

        {/* Infinite Loop Marquee Container */}
        <div className="relative w-full overflow-hidden">
          {/* Subtle Left & Right Edge Fade Gradients */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[var(--ux4g-bg-neutral,#FAFAFA)] dark:from-neutral-950 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[var(--ux4g-bg-neutral,#FAFAFA)] dark:from-neutral-950 to-transparent z-10" />

          {/* Marquee Track */}
          <div className="animate-marquee flex gap-5 py-3">
            {loopItems.map((item, idx) => (
              <article
                key={`${item.id}-${idx}`}
                className="w-[290px] sm:w-[330px] md:w-[350px] shrink-0 flex flex-col justify-between p-6 rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 shadow-sm hover:shadow-md hover:border-[#002B7F] dark:hover:border-blue-500 transition-all duration-200 select-none"
              >
                {/* Card Top: Metadata, Heading & Concise Description */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        item.badgeType === "brand"
                          ? "bg-[#EEF4FF] text-[#002B7F] dark:bg-blue-950/80 dark:text-blue-300 border border-[#002B7F]/20"
                          : item.badgeType === "success"
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/20"
                          : "bg-sky-50 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-500/20"
                      }`}
                    >
                      {item.categoryLabel}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                      {item.gazetteNo}
                    </span>
                  </div>

                  {/* Clear Bold Heading */}
                  <h3 className="text-base font-extrabold tracking-tight text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  {/* Concise 1-sentence description */}
                  <p className="mt-2 text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-300 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Card Bottom: Date & Direct "Read more" link to official page */}
                <div className="mt-6 pt-4 border-t border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[var(--ux4g-text-neutral-tertiary,#737373)] dark:text-neutral-400 font-medium">
                    {item.date}
                  </span>

                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ux4g-btn ux4g-btn-primary ux4g-btn-sm text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap shadow-sm hover:gap-2 transition-all"
                  >
                    <span>Read more</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Official Source Indicator */}
        <div className="mt-8 p-3.5 rounded-xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <Building2 size={15} className="text-[#002B7F] dark:text-blue-400 shrink-0" />
            <span>
              All notifications redirect directly to official <strong>MoRTH</strong> & <strong>Parivahan</strong> portal resources.
            </span>
          </div>
          <a
            href="https://morth.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#002B7F] dark:text-blue-400 hover:underline shrink-0 inline-flex items-center gap-1"
          >
            <span>MoRTH Portal</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
