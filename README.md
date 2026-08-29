🇮🇳 Parivahan Path

An AI-powered, citizen-first reimagining of India's vehicle & licence services — built with Codex for [Build What Moves India].

Parivahan Path replaces fragmented, jargon-heavy government portals with a single, intent-driven journey. A citizen describes what they need in plain language — in any of 13 Indian languages — and the system guides them through exactly what applies to their situation, nothing more.

Built with Codex as a core part of both the development process and the product itself — powering the intent-recognition engine, the pre-submission review logic, and the grounded AI assistant described below.

⚠️ Hackathon prototype — not an official government product. Uses synthetic/mock data only. Not affiliated with or endorsed by MoRTH or the Government of India.

🚀 Live Demo

buildwhat-seven.vercel.app

🎯 The Problem

Every year, millions of Indians use Parivahan to renew a licence, transfer a vehicle, or check an application status. Along the way, they hit the same frustrations:

Fragmented portals — Vahan, Sarathi, and state RTO systems require separate navigation and internal jargon (Form 29, HP Termination, NOC) citizens shouldn't need to know
Unclear requirements — documents and eligibility rules surface only after a citizen commits to a flow
Errors found only after submission — mismatches and missing information cost a full rejection cycle
Payments stuck with no explanation — a documented, recurring complaint: payment succeeds, status stays "Pending" indefinitely
No safe way to get help — elderly or less digitally-confident citizens resort to sharing OTPs and passwords with family or agents
Deadlines missed silently — PUC, insurance, and licence renewals are entirely the citizen's responsibility to track
Policies nobody finds — real schemes and benefits exist but stay buried in circulars and gazette notifications

The gap isn't a lack of digital services — it's that the digital experience still makes citizens figure everything out themselves.

✨ Core Features
🗣️ Intent-First Natural Language Search

Citizens type what they need in plain words, in any of 13 Indian languages. The system resolves it directly to the correct statutory workflow — no jargon, no menu-diving.

📋 Real Government Forms, Simplified

Built on authentic form structures — Form 29 & 30 (Ownership Transfer), Form 1, 1-A & 2 (DL Renewal) — with automatic branch logic:

Age 40+ triggers the Form 1-A medical certificate requirement
Financed vehicles trigger financier NOC (Form 35) and dual-form filing
Inter-state transfers trigger NOC + re-registration sub-paths
✅ Pre-Submission Review

Catches missing answers and document mismatches before submission — not after, when it's too late to fix cheaply.

🤝 Delegated / Proxy Access

Citizens generate a secure, single-use, time-boxed link scoped to exactly one task. A trusted helper can fill it in, but nothing is submitted without the owner's explicit review and approval — replacing the insecure practice of sharing OTPs and passwords.

🔔 Proactive Expiry Reminders

Once a vehicle is linked, the system tracks PUC, insurance, and RC expiry automatically — surfacing urgent renewals (≤7 days) prominently, instead of waiting for the citizen to check.

📰 Policy & Scheme Visibility

A dedicated Announcements section surfaces real, current schemes (EV subsidies, road tax rebates, BH-series registration) so citizens know what applies to them.

🤖 Grounded AI Assistant — Powered by Codex

A scoped conversational assistant, built on Codex, that answers using the citizen's actual application state — eligibility, document requirements, policy questions — not a generic FAQ bot.

📍 Transparent Status Tracking

Every application answers four questions, always: What happened? Why? What's next? Do I need to act? No more silent "Pending."

🏗️ Tech Stack
Layer	Technology
AI / Intelligence	Codex — powers intent recognition, document review logic, and the grounded assistant
Framework	Next.js 15 (App Router)
Language	TypeScript (strict, 0 compiler errors)
Styling	Tailwind CSS
Design System	UX4G Design System, WCAG AAA-oriented
Validation	Zod
Database	MongoDB with in-memory fallback
i18n	Custom engine — 13 official Indian languages
Deployment	Vercel

📁 Project Structure
.
├── app/                      # Next.js App Router pages & routes
├── components/                # UI components (delegate modals, reminders, chat widget)
├── data/                     # Intent definitions, form schemas
├── design/                   # Stitch design references
├── lib/                      # Translations, utilities
├── images/ & public/images/  # Static assets
└── .agents/Skills/ux4g_design/ # UX4G design system reference
🔒 Honesty & Data Disclosure

In line with the hackathon's honesty requirements:

All personal data, documents, and payment flows use synthetic/mock data only
No real Aadhaar numbers, PAN details, OTPs, or payment credentials are used or stored
No official government logos, emblems, or branding implying approval or partnership are used
Where live government integration (e.g. DigiLocker, UPI) would be required in production, the flow is clearly simulated and labeled
🧭 What This Is — and Isn't

We are not rebuilding the RTO system. We're showing that a complex public service can become clearer, more predictable, and more human — one citizen journey at a time.

👥 Contributors
Aditya4453
justsamridhi
📄 License

Built for Build What Moves India — a hackathon prototype, not for production or commercial use.
