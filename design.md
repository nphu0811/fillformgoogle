# Redesign Specification (UX/UI Audit)

## 1. Executive Summary

- **Overall UX Score:** 5.5/10
- **Key Problems:**
  - **Visual Clutter:** The homepage features conflicting gradient cards and floating images that distract from the primary value proposition.
  - **Inconsistent Component States:** Buttons lack distinct focus/active states, and form inputs don't provide adequate inline validation.
  - **Information Architecture:** The primary navigation contains too many links, diluting the conversion funnel.
  - **Accessibility:** Low contrast ratios on "glassmorphism" text and missing ARIA labels on dynamic components.
- **Redesign Direction:** Transition from a chaotic, "heavy" glassmorphism style to a **Clean, Professional, Apple-inspired SaaS aesthetic**. Emphasize whitespace, precise typography, and functional clarity over decorative elements.

---

## 2. Audit Findings

### Layout & Spacing
- **Issue:** The grid system is inconsistent. The `FeaturesSection` uses a 3-column grid, while the `ServicesSection` uses a 4-column grid with varying padding (`p-8` vs `p-10`), creating a disjointed rhythm.
- **Fix:** Standardize on an 8pt grid system. Use a strict 12-column overarching grid for desktop layouts.

### Navigation
- **Issue:** The top navigation header is overcrowded with 9+ links.
- **Fix:** Condense navigation. Move secondary links (like "Giới thiệu bạn bè", "Liên hệ") to the footer. Keep the header focused on: Product, Solutions, Pricing, and Auth CTAs.

### Forms & Input
- **Issue:** Forms currently lack floating labels or clear helper text. Error states (if any) rely on standard HTML5 validation.
- **Fix:** Implement robust form components with explicit Success, Error, and Disabled states. Use inline validation before submission.

### Accessibility (WCAG 2.1 AA)
- **Issue:** Contrast ratio on white text over light gradient backgrounds (e.g., `text-white/80` on `bg-pink-500/20`) fails WCAG AA standards.
- **Fix:** Ensure all text-to-background contrast ratios are at least 4.5:1.

---

## 3. Design Principles

1. **Simplicity (Apple-level):** Remove all unnecessary decorative borders, excessive drop shadows, and complex gradients. If an element doesn't serve a functional purpose or guide the eye, remove it.
2. **Clarity > Decoration:** Content is king. Typography and whitespace must do the heavy lifting for visual hierarchy.
3. **Consistency Rules:** A button must look and behave like a button everywhere. Radii, spacing, and transition timings must use a single source of truth (Tailwind config).

---

## 4. Design System

### Colors
- **Primary:** `hsl(221, 83%, 53%)` (Crisp Blue) - Used for primary actions.
- **Background:** `hsl(0, 0%, 98%)` (Off-white) - Main app background.
- **Surface:** `hsl(0, 0%, 100%)` (Pure White) - Card and modal backgrounds.
- **Text Primary:** `hsl(222, 47%, 11%)` (Deep Slate)
- **Text Secondary:** `hsl(215, 16%, 47%)` (Muted Slate)
- **Error:** `hsl(348, 83%, 47%)`
- **Success:** `hsl(142, 71%, 45%)`

### Typography
- **Font Family:** `Inter` (Sans-serif)
- **Headings:** Tight tracking (`tracking-tight`), heavy weights (`font-semibold` to `font-extrabold`).
- **Body:** Relaxed line height (`leading-relaxed`), medium weights for readability.

### Spacing (8pt Grid)
Use Tailwind's default spacing scale which is already based on 0.25rem (4px).
- Micro: `gap-2` (8px)
- Small: `p-4` (16px)
- Medium: `p-6` (24px)
- Large: `py-12` (48px)
- Section: `py-24` (96px)

### Components (States)
- **Primary Button:** 
  - *Default:* `bg-blue-600 text-white rounded-lg px-4 py-2 font-medium transition-all`
  - *Hover:* `bg-blue-700 shadow-md transform -translate-y-[1px]`
  - *Active:* `bg-blue-800 scale-[0.98]`
  - *Disabled:* `bg-slate-200 text-slate-400 cursor-not-allowed`

---

## 5. Screen-by-Screen Redesign

### 5.1 Homepage (`/`)

#### Current Issues
- Overly complex hero section with rotating images and multiple gradients.
- Redundant buttons ("Bắt đầu ngay" vs "Xem báo giá").
- *Screenshot ref:* `/screenshots/home/hero.png`

#### New Layout (Textual Wireframe)
```
[Header: Logo | Product | Pricing | Login | [Get Started ->]]
--------------------------------------------------------------
[Hero Section]
(Center Aligned, Massive Whitespace)
H1: Automate Google Forms. Flawlessly.
Sub: The enterprise-grade engine for rapid data population.
[ Input: Paste Google Form URL... ] [ Button: Start Magic ]

[Social Proof: "Trusted by 10,000+ researchers"]
--------------------------------------------------------------
[Features Grid]
(3 columns, minimalist icons, no glassmorphism cards, just pure white cards with a subtle 1px border)
--------------------------------------------------------------
[Footer]
```

#### UX Improvements
- Implement a Product-Led Growth hook right in the hero section by letting users paste a URL immediately instead of just clicking "Start".
- Remove rotating hero images to reduce cognitive load.

### 5.2 Login/Auth (`/login`)

#### Current Issues
- Standard, uninspired login form.
- *Screenshot ref:* `/screenshots/login/full.png`

#### New Layout
- Split screen: Left side features a beautiful, serene illustration or product screenshot on a solid brand-color background. Right side is the clean, minimalist login form centered vertically.
- Use Social Logins (Google) prominently at the top, followed by a "or continue with email" divider.

### 5.3 Pricing (`/#price`)

#### Current Issues
- The cards are heavily styled with indigo/purple borders and backgrounds, distracting from the actual numbers.

#### New Layout
- Minimalist pricing table.
- Use a simple toggle switch for "Monthly" vs "Yearly" (if applicable) or "Pay as you go" vs "Subscription".
- The "Phổ biến" (Popular) badge should be a subtle, elegant tag, not a massive banner.

---

## 6. Interaction & Motion

- **Easing:** Use `cubic-bezier(0.4, 0, 0.2, 1)` for all UI transitions.
- **Duration:** 
  - Micro-interactions (hover, focus): `150ms`
  - Modals/Drawers entering: `300ms`
- **Loading UX:** Replace generic spinners with highly polished Skeleton screens (`animate-pulse` on grey blocks matching component shapes).

---

## 7. Accessibility Spec

- **Focus Rings:** ALL interactive elements must have a highly visible focus ring: `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`. Do NOT use `outline-none` without replacing it.
- **ARIA:** Modals must use `role="dialog"` and `aria-modal="true"`. Forms must map `aria-describedby` to error messages.

---

## 8. Responsive Strategy

- **Mobile-First:** Design components for `w-full` first, then add constraints at `md:` and `lg:` breakpoints.
- **Navigation:** Convert the header links to a sleek hamburger drawer on mobile.
- **Grids:** All grids (Features, Services) collapse to 1 column on `< 768px`.

---

## 9. Implementation Guide

**Tailwind Extensions (`tailwind.config.ts`):**
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6', // The new brand blue
        600: '#2563eb',
        900: '#1e3a8a',
      }
    },
    animation: {
      'fade-in-up': 'fadeInUp 0.5s ease-out',
    }
  }
}
```

**Developer Action Plan:**
1. Strip all `glass-*` classes from `globals.css` and the codebase.
2. Update the color palette in Tailwind config.
3. Rebuild the `HeroSection` in `page.tsx` using the new minimalist spec.
4. Convert standard inputs to accessible, stateful React components.
