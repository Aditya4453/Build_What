# 🇮🇳 Parivahan Path

### An AI-powered, citizen-first reimagining of India's vehicle & driving licence services.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Parivahan%20Path-6C4DF6?style=for-the-badge)](https://buildwhat-seven.vercel.app/)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

> **Built for Build What Moves India**
>
> Parivahan Path reimagines India's fragmented transport-service experience into a single, accessible, intent-driven citizen journey.

---

## 🚀 Live Demo

**[→ Open Parivahan Path](https://buildwhat-seven.vercel.app/)**

> ⚠️ **Hackathon Prototype:** Parivahan Path is a prototype created for the **Build What Moves India** hackathon. It is **not an official Government of India or MoRTH product**, and is not affiliated with or endorsed by the Government of India.

---

# 🎯 The Vision

Accessing a government transport service should not require a citizen to understand how the government is organized.

Today, completing a seemingly simple task can mean navigating different systems, understanding unfamiliar terminology, finding the correct form, selecting the correct jurisdiction, uploading the right documents, and figuring out what to do when something goes wrong.

**Parivahan Path changes the starting point.**

Instead of asking citizens:

> *"Which government system or form do you need?"*

we ask:

> **"What do you need to do?"**

A citizen describes their need in plain language, and Parivahan Path guides them through the relevant statutory workflow — step by step.

---

# 🧩 The Problem

Millions of citizens use transport services for tasks such as:

- Renewing a Driving Licence
- Transferring vehicle ownership
- Checking application status
- Managing vehicle documents
- Understanding eligibility and requirements
- Keeping track of renewals and expiries

But the current digital experience can create unnecessary friction.

### Key citizen pain points

| Problem | What the citizen experiences |
|---|---|
| **Fragmented portals** | Vahan, Sarathi and state-level systems require citizens to understand where a service belongs |
| **Government jargon** | Citizens encounter terms such as Form 29, Form 30, NOC, hypothecation, etc. before understanding what applies to them |
| **Poor service discovery** | Users have to navigate menus and remember internal service names instead of simply describing their need |
| **Jurisdiction friction** | State/RTO selection can appear before the system understands the citizen's actual intent |
| **Unclear requirements** | Eligibility and document requirements can become apparent only after entering a workflow |
| **Late error detection** | Missing information or document mismatches can result in avoidable rejection cycles |
| **Status opacity** | A citizen may see a generic "Pending" status without understanding what happened or what they should do next |
| **No formal delegation** | Elderly or less digitally-confident users often depend on family members or agents for assistance |
| **Missed renewals** | Citizens are expected to remember PUC, insurance, RC and licence expiry dates themselves |
| **Hidden policies** | Schemes, benefits and transport policies can remain buried in lengthy government notifications and circulars |

### The fundamental gap

> **The problem is not the lack of digital services.  
> The problem is making citizens figure everything out themselves.**

---

# ✨ What is Parivahan Path?

Parivahan Path is an **AI-powered citizen experience layer** designed around the way people actually think and communicate.

Instead of forcing citizens to understand the structure of government services, the platform adapts the journey around the citizen's intent.

### The experience

**Citizen Intent → Intelligent Routing → Guided Workflow → Validation → Review → Submission → Transparent Tracking**

---

# 🌟 Core Features

## 1. 🗣️ Intent-First Natural Language Search

Citizens don't need to know whether their task belongs to Vahan, Sarathi, or a specific form.

They simply describe what they need.

For example:

> **"I want to renew my driving licence."**

or

> **"I bought a second-hand car and want to transfer it to my name."**

Parivahan Path identifies the relevant intent and routes the citizen into the appropriate workflow.

### Key capabilities

- Natural-language service discovery
- Intent recognition
- Plain-language guidance
- Support for **13 Indian languages**
- Reduced dependency on government terminology
- Guided follow-up questions instead of overwhelming forms

---

# 2. 📋 Real Government Forms — Simplified

Parivahan Path does **not** remove the underlying statutory requirements.

Instead, it makes them understandable.

The prototype models authentic government form structures including:

### Vehicle Ownership Transfer

- **Form 29**
- **Form 30**
- **Form 35** for relevant hypothecation/financier cases

### Driving Licence Renewal

- **Form 2**
- **Form 1**
- **Form 1-A** medical certificate where applicable

The system dynamically determines which branches apply to the citizen.

### Example

A citizen renewing a Driving Licence:

```text
Age < 40
     ↓
Standard renewal requirements

Age ≥ 40
     ↓
Form 1-A Medical Certificate
     ↓
Continue renewal workflow
````

Similarly:

```text
Vehicle financed?
     ↓
Yes → Financier / Hypothecation requirements
     ↓
Relevant NOC / Form 35 workflow
```

And:

```text
Inter-state transfer?
     ↓
Yes → NOC + re-registration pathway
```

The citizen does not need to understand the form numbers beforehand.

---

# 3. ✅ Pre-Submission Review

One of the biggest sources of frustration is discovering a problem **after** submission.

Parivahan Path introduces a review layer before submission.

The system checks for:

* Missing required information
* Invalid inputs
* Document requirements
* Document readability
* Signature presence where applicable
* Potential information mismatches
* Relevant workflow conditions

### Instead of:

```text
Submit
  ↓
Error / Rejection
  ↓
Start Again
```

Parivahan Path aims for:

```text
Fill Details
  ↓
Review & Validate
  ↓
Fix Issues
  ↓
Submit
```

This shifts error detection from **post-submission** to **pre-submission**.

---

# 4. 🤝 Delegated / Proxy Access

### Built for citizens who need help.

An elderly citizen or a less digitally-confident user may need assistance from:

* A son or daughter
* A spouse
* A trusted family member
* Another authorized helper

But assistance should not require handing over:

* Passwords
* OTPs
* Account credentials

### Parivahan Path introduces formal delegated access.

The citizen can generate a:

* **Single-use**
* **Task-specific**
* **Time-limited**

secure helper link.

The helper can complete the required information, but **cannot submit the application on behalf of the owner**.

### Owner approval flow

```text
Citizen
   ↓
Creates delegated task
   ↓
Generates secure time-limited link
   ↓
Trusted helper fills required information
   ↓
Application becomes "Pending Owner Approval"
   ↓
Citizen reviews submitted information
   ↓
     ┌───────────────┐
     │               │
  APPROVE         REJECT / EDIT
     │               │
     ↓               ↓
Submit          Return to Draft
```

### Why this matters

It preserves the convenience of asking someone for help while keeping the **citizen in control of final submission**.

---

# 5. 🔔 Proactive Expiry Reminders

Government services should not only respond when citizens ask.

They should also help citizens avoid preventable problems.

Once a vehicle is linked, Parivahan Path surfaces upcoming expiries such as:

* PUC
* Insurance
* RC-related renewals
* Driving Licence-related deadlines

### Urgency hierarchy

```text
≤ 7 days
   ↓
URGENT
Prominent alert

8–30 days
   ↓
UPCOMING
Standard reminder
```

Citizens can also enable reminders ahead of the actual deadline.

### The principle

> **The citizen shouldn't have to remember the system.
> The system should remember for the citizen.**

---

# 6. 📰 Policy & Scheme Visibility

Important government policies and schemes can be difficult for ordinary citizens to discover.

Parivahan Path introduces a dedicated **Announcements** section that brings relevant information closer to the citizen.

Examples include:

* EV incentives and subsidy programs
* Road-tax related benefits
* BH-series registration information
* New transport policies
* Registration-related updates

Instead of expecting citizens to search through circulars and notifications, relevant information is surfaced directly in the experience.

---

# 7. 🤖 Grounded AI Assistant

Parivahan Path includes an AI assistant designed around the citizen's **actual application context**.

It can help answer questions such as:

> "Why is my application still pending?"

> "Which documents do I need?"

> "Why do I need Form 1-A?"

> "Am I eligible for this scheme?"

> "What do I need to do next?"

The goal is not to create another generic chatbot.

The assistant is designed to work with:

* Application state
* Workflow context
* Eligibility information
* Document requirements
* Policy and scheme information

### From:

> Generic FAQ chatbot

### To:

> **Context-aware citizen assistance**

---

# 8. 📍 Transparent Application Tracking

A status such as:

> **Pending**

doesn't tell a citizen much.

Parivahan Path's tracking experience is designed around four questions:

### 1. What happened?

What stage has the application reached?

### 2. Why?

Why is it currently in this state?

### 3. What's next?

What will happen after this?

### 4. Do I need to act?

Does the citizen need to upload, correct, approve, or do anything else?

The goal is to transform:

```text
Pending
```

into:

```text
Current Stage
     ↓
What happened
     ↓
Why
     ↓
What's next
     ↓
Citizen action required?
```

---

# 9. 🌐 Multilingual & Accessible by Design

Government services should be usable regardless of:

* Language
* Age
* Digital literacy
* Accessibility needs

Parivahan Path supports **13 Indian languages**:

* English
* Hindi
* Tamil
* Telugu
* Marathi
* Bengali
* Gujarati
* Kannada
* Punjabi
* Odia
* Malayalam
* Assamese
* Other supported regional language flows within the prototype

### Accessibility features

* Font resizing
* Screen-reader-friendly structure
* Keyboard-friendly navigation
* Light / Dark mode
* Clear visual hierarchy
* Accessible interaction patterns
* UX4G-oriented design principles

---

# 🏛️ UX4G-Oriented Design

Parivahan Path follows the principles of the **UX4G Design System** to create a more consistent government-service experience.

The interface focuses on:

* Accessibility
* Clear hierarchy
* Consistent components
* Citizen-centric language
* Strong contrast
* Responsive layouts
* Predictable interactions
* Reduced cognitive load

---

# 🧠 Architecture

At a high level, the platform follows this structure:

```text
                    ┌──────────────────────┐
                    │      CITIZEN         │
                    └──────────┬───────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │ Intent / Natural        │
                  │ Language Input          │
                  └──────────┬──────────────┘
                             │
                             ▼
                  ┌─────────────────────────┐
                  │ Intent Recognition      │
                  │ & Service Routing       │
                  └──────────┬──────────────┘
                             │
                             ▼
                  ┌─────────────────────────┐
                  │ Guided Government       │
                  │ Service Workflow        │
                  └──────────┬──────────────┘
                             │
                             ▼
                  ┌─────────────────────────┐
                  │ Rules & Validation      │
                  │ Engine                  │
                  └──────────┬──────────────┘
                             │
                             ▼
                  ┌─────────────────────────┐
                  │ Pre-Submission Review   │
                  └──────────┬──────────────┘
                             │
                             ▼
                  ┌─────────────────────────┐
                  │ Citizen Approval /      │
                  │ Submission              │
                  └──────────┬──────────────┘
                             │
                             ▼
                  ┌─────────────────────────┐
                  │ Transparent Tracking     │
                  └─────────────────────────┘
```

Supporting services include:

```text
AI Assistant
     │
     ├── Application Context
     ├── Eligibility
     ├── Documents
     └── Policy / Schemes

Delegated Access
     │
     ├── Secure Token
     ├── Helper Workflow
     └── Owner Approval

Proactive Reminders
     │
     ├── Expiry Detection
     ├── Urgency Classification
     └── Citizen Notification
```

---

# 🛠️ Technology Stack

| Layer                    | Technology                                          |
| ------------------------ | --------------------------------------------------- |
| **Framework**            | Next.js 15 — App Router                             |
| **Language**             | TypeScript                                          |
| **AI / Intelligence**    | Codex-assisted development and product intelligence |
| **Styling**              | Tailwind CSS                                        |
| **Design System**        | UX4G-oriented design system                         |
| **Validation**           | Zod                                                 |
| **Database**             | MongoDB                                             |
| **Fallback Storage**     | In-memory fallback                                  |
| **Internationalization** | Custom i18n engine                                  |
| **Languages**            | 13 Indian languages                                 |
| **Deployment**           | Vercel                                              |

---

# 🤖 Role of Codex

Codex was used as a core part of both the **development process** and the product implementation.

It contributed to:

* Intent recognition logic
* Workflow development
* Pre-submission validation logic
* AI assistant implementation
* Component development
* Debugging and iteration
* Application architecture
* Feature integration

The prototype demonstrates how AI-assisted development can be used to build a citizen-facing public-service experience while keeping the underlying statutory workflow explicit.

---

# 📁 Project Structure

```text
.
├── app/
│   ├── delegate/
│   │   └── [token]/
│   ├── applications/
│   ├── track/
│   └── ...
│
├── components/
│   ├── chat-widget.tsx
│   ├── delegate-help-modal.tsx
│   ├── delegate-approval-modal.tsx
│   ├── proactive-reminders.tsx
│   ├── flow-ui.tsx
│   └── ...
│
├── data/
│   ├── intents.json
│   ├── forms.ts
│   └── ...
│
├── design/
│   └── stitch_parivahan_path_...
│
├── lib/
│   ├── translations.ts
│   └── ...
│
├── images/
│
├── public/
│   └── images/
│
├── agents/
│   └── Skills/
│       └── ux4g_design/
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have installed:

* Node.js 18+
* npm
* MongoDB (optional — the prototype includes an in-memory fallback)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Aditya4453/Build_What.git
```

Navigate into the project:

```bash
cd Build_What
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env.local` file if your local configuration requires environment variables.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
```

> The application includes an in-memory fallback for environments where MongoDB is unavailable.

---

## Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Build & Validation

The prototype is designed with strict TypeScript checking.

Run:

```bash
npx tsc --noEmit
```

Build the production application:

```bash
npm run build
```

Start the production build:

```bash
npm start
```

---

# 🔐 Honesty & Data Disclosure

This project follows the hackathon's requirement for transparent use of data.

### Synthetic data only

The prototype does **not** use real citizen personal information.

No real:

* Aadhaar numbers
* PAN details
* OTPs
* Payment credentials
* Personal identity documents

are used or stored as part of the demonstration.

### Government integrations

Where a real production implementation would require services such as:

* DigiLocker
* UPI
* Government databases
* Official authentication systems
* Live Parivahan APIs

the prototype uses **synthetic/mock flows**.

These are clearly represented as prototype functionality rather than being presented as live government integrations.

### Government branding

The project does not claim official Government of India or MoRTH approval, partnership, or endorsement.

---

# 📌 Prototype Scope

Parivahan Path is **not attempting to replace or rebuild the underlying RTO infrastructure**.

The prototype focuses on the **citizen experience layer**:

```text
Existing Government Infrastructure
             │
             ▼
      ┌───────────────┐
      │ Parivahan Path│
      │ Citizen Layer │
      └───────┬───────┘
              │
              ▼
      Simpler Citizen Journey
```

The objective is to demonstrate how existing government services could become:

* Easier to discover
* Easier to understand
* Easier to complete
* Easier to track
* More accessible
* More predictable
* Safer to delegate

---

# 💡 What Makes Parivahan Path Different?

Parivahan Path is not simply a visual redesign.

The prototype changes the **interaction model**.

### Traditional experience

```text
Know the service
      ↓
Find the correct portal
      ↓
Understand government terminology
      ↓
Choose the correct form
      ↓
Understand eligibility
      ↓
Fill everything
      ↓
Submit
      ↓
Hope nothing went wrong
      ↓
Check status manually
```

### Parivahan Path

```text
Tell us what you need
      ↓
Understand your situation
      ↓
Show only what applies
      ↓
Validate before submission
      ↓
Review
      ↓
Submit
      ↓
Track transparently
      ↓
Get reminders before the next deadline
```

---

# 🏆 Hackathon Focus

Built for:

## **Build What Moves India**

The project explores how AI-assisted development and citizen-centric design can improve access to India's public transport infrastructure.

### Three flagship innovations

#### 🤝 Delegated Access

Helping citizens get assistance **without sharing credentials**.

#### 🔔 Proactive Reminders

Moving from a system citizens must remember to a system that **remembers for citizens**.

#### 🤖 Policy-Aware AI Assistance

Turning complex government information into **contextual, understandable answers**.

Together with intent-driven navigation, pre-submission validation, transparent tracking, multilingual accessibility, and simplified statutory workflows, these features form the core of Parivahan Path.

---

# 🧭 What This Is — And What It Isn't

### This IS:

* A working hackathon prototype
* A citizen-centric service experience
* An AI-assisted public-service interface
* A demonstration of simplified government workflows
* A prototype using real statutory form structures
* A demonstration using synthetic/mock data

### This IS NOT:

* An official Government of India application
* An official MoRTH product
* A replacement for Vahan or Sarathi
* A live government database
* A production payment system
* A source of real citizen records

---

# 👥 Contributors

### Aditya4453

**Aditya**

### justsamridhi

**Samridhi**

Built collaboratively for **Build What Moves India**.

---

# 📄 License

This project was built for the **Build What Moves India hackathon**.

It is a **hackathon prototype and is not intended for production or commercial use**.

Unless otherwise specified, the project and its source code are provided for hackathon evaluation, demonstration, and educational purposes.

---

# 🇮🇳 Parivahan Path

> **Government services should adapt to citizens — not the other way around.**

**One citizen. One intent. One guided journey.**

[🚀 Try the Live Demo →](https://buildwhat-seven.vercel.app/)

[💻 View the Repository →](https://github.com/Aditya4453/Build_What)

```
```
