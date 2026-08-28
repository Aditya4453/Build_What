---
name: Parivahan Path
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fa'
  on-surface: '#111c2c'
  on-surface-variant: '#43474e'
  inverse-surface: '#263142'
  inverse-on-surface: '#ebf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#13696a'
  on-secondary: '#ffffff'
  secondary-container: '#a2eded'
  on-secondary-container: '#1a6d6e'
  tertiary: '#1d2123'
  on-tertiary: '#ffffff'
  tertiary-container: '#323638'
  on-tertiary-container: '#9b9fa1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#a5eff0'
  secondary-fixed-dim: '#89d3d4'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f50'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c3c7c9'
  on-tertiary-fixed: '#181c1e'
  on-tertiary-fixed-variant: '#434749'
  background: '#f9f9ff'
  on-background: '#111c2c'
  surface-variant: '#d8e3fa'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is built on the philosophy of **Calm Civic Infrastructure**. It prioritizes clarity over decoration, aiming to reduce the cognitive load often associated with government and civic services. The aesthetic is modern, professional, and deeply rooted in accessibility, ensuring that users feel supported and informed at every step of their journey.

The style is **Corporate / Modern** with a humanist touch. It utilizes a structured grid, generous whitespace, and a high-contrast palette to establish authority while remaining approachable. Visual flourishes are replaced by functional clarity—using subtle borders and purposeful alignment to guide the eye. The emotional response should be one of stability, trust, and ease.

## Colors
The color palette is grounded in **Deep Blue**, representing the stability and reliability of civic institutions. This is paired with a **Warm White** background to prevent the "starkness" of pure white, making long reading sessions more comfortable.

- **Primary (Deep Blue):** Used for navigation, primary headers, and high-importance interactions.
- **Supporting (Muted Teal):** Used for secondary actions, accents, and progress indicators.
- **Surface (Warm White):** Used for the main canvas to create an approachable, paper-like feel.
- **Semantic Colors:** Chosen for high legibility against the background. Success, Attention, Error, and Info colors are slightly desaturated to fit the "Calm" aesthetic while maintaining WCAG AAA contrast ratios.

## Typography
This design system utilizes **Inter** for its exceptional legibility across both Latin and Devanagari scripts (when paired with suitable fallbacks or Google Fonts counterparts). The hierarchy is strict to ensure users can scan complex documents easily.

- **Body Text:** Never drops below 16px to ensure accessibility for all age groups.
- **Line Length:** Kept between 45–75 characters for optimal readability.
- **Line Height:** Set to 1.6 for body copy to provide "breathing room" between lines of information.
- **Multilingual Support:** When rendering Hindi text, the line height should be increased by 10% to accommodate the Matra (vowel signs) without crowding the lines.

## Layout & Spacing
The system uses a **Fixed Grid** on desktop and a **Fluid Grid** on mobile.

- **Desktop:** A 12-column grid centered in a 1200px container. Large margins (48px) create a focused, "letter" feel for civic forms.
- **Mobile:** A single-column layout with 16px margins.
- **Rhythm:** An 8px base unit governs all padding and margins. 
- **Task Flows:** All transactional flows (forms, applications) must be contained in a single-column layout centered on the screen to minimize eye tracking and peripheral distraction.

## Elevation & Depth
To maintain a professional and trustworthy feel, this design system avoids heavy shadows. Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** The Warm White surface.
- **Level 1 (Cards):** Use a 1px solid border in a soft grey (`#E2E8F0`) with no shadow. 
- **Level 2 (Active/Hover):** A very subtle, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)) to indicate interactivity.
- **Disclaimers:** The persistent prototype disclaimer sits in a fixed, semi-transparent footer bar with a subtle top border to separate it from the content without obscuring it.

## Shapes
The shape language is **Soft**. A 4px (0.25rem) radius is applied to buttons, input fields, and small UI elements. Larger components like cards use an 8px radius. This provides a modern, friendly feel without appearing overly "bubbly" or informal, maintaining a serious civic tone.

## Components
- **Buttons:** Primary buttons use the Deep Blue background with White text. In mobile views, the primary CTA is "Sticky" to the bottom of the viewport for easy thumb access.
- **Icons:** Must never appear alone. Icons are always paired with a Text Label to ensure clarity and accessibility.
- **Document Cards:** Feature a clear status indicator (e.g., "Pending", "Approved") in the top-right corner using semantic colors. All details on the card should follow a strict label-value pair format.
- **Progress Trackers:** Vertical for mobile, horizontal for desktop. Each step includes a "Why this matters" tooltip or sub-text to keep the user informed and reduce anxiety.
- **Input Fields:** Use 1px borders. The active state uses a 2px Deep Blue border. Labels are always visible (avoiding disappearing placeholders).
- **Prototype Disclaimer:** A persistent bar at the bottom: `HACKATHON PROTOTYPE • SYNTHETIC DATA • NOT AN OFFICIAL SERVICE`. It uses the `caption` typography style in a muted grey to remain visible but non-distracting.