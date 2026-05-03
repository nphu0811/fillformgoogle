# User Flow Analysis

This document maps the core user journeys across the application, identifying friction points, drop-off risks, and outlining an optimized flow for the upcoming redesign.

## 1. Guest Flow (Acquisition & Discovery)

**Current Flow Steps:**
1. Lands on `HomePage` (`/`) via organic search, direct link, or ad.
2. Explores Hero section, Features, and Services (e.g., `/dien-form-theo-ti-le`).
3. Scrolls down to the Pricing section (`/#price`).
4. Clicks "Bắt đầu ngay" (Start Now) or "Liên hệ Fanpage" (Contact).
5. Redirected to Auth Flow (`/login` or `/register`).

**UX Friction Points & Drop-off Risks:**
- **Navigation Overload:** The header navigation contains too many items, confusing the user's mental model.
- **Ambiguous CTAs:** "Bắt đầu ngay" implies immediate action without account creation, but it forces a login abruptly, creating a high bounce risk.
- **Pricing Clarity:** The pricing packages blend visually with other cards. Users might miss the distinction between "Tự thao tác" (Self-service) and "Thao tác hộ" (Full-service).

**Optimized Flow Recommendation:**
- *Landing → Action → Conversion:* Allow guests to paste a Google Form URL directly on the homepage hero section. Once they click "Start Auto Fill", show a preview of what the tool *could* do, and *then* ask them to create an account to save their progress. This is the **Product-Led Growth (PLG)** approach.

---

## 2. Authentication Flow (Onboarding)

**Current Flow Steps:**
1. Guest navigates to `/login`.
2. Chooses to log in via Email/Password or third-party (if implemented).
3. If no account, clicks "Tạo tài khoản" to navigate to `/register`.
4. Fills out Name, Email, Password, and Confirm Password.
5. Clicks "Register", gets redirected to `/dashboard`.

**UX Friction Points & Drop-off Risks:**
- **High Friction Forms:** Asking for Name, Email, and two Password fields upfront reduces conversion.
- **Lack of Social Login:** If Google/Facebook OAuth isn't visually prioritized, mobile users will drop off.
- **Blank State Post-Login:** After registration, users land on the dashboard with zero context or onboarding tutorials.

**Optimized Flow Recommendation:**
- Implement seamless Google OAuth as the primary option (1-click login).
- For email registration, only ask for Email initially (passwordless magic link) or Email + Password. Collect the name later during onboarding.

---

## 3. Core Product Flow (User Dashboard - Auto Filling)

**Current Flow Steps (Hypothesized based on service offerings):**
1. User logs into `/dashboard`.
2. Clicks "New Campaign" or "Thêm Form Mới".
3. Pastes Google Form URL.
4. System parses the form.
5. User configures settings:
   - Target response count.
   - Delay/Distribution (Random vs Fixed).
   - Answer ratios (e.g., 60% Option A, 40% Option B).
6. User pays (deducts credits).
7. System starts the automated fill agent.
8. User monitors progress on the dashboard.

**UX Friction Points & Drop-off Risks:**
- **Complex Configuration:** Setting ratios for a 20-question form manually is tedious.
- **Credit Anxiety:** Users might not understand how many credits they need before configuring the entire form.
- **Feedback Deficit:** While the agent runs, if there are no visual indicators (e.g., progress bars, real-time logs), the user might think the system is broken.

**Optimized Flow Recommendation:**
- Introduce a **Wizard UI (Stepper)** for form configuration (Step 1: Link → Step 2: Settings → Step 3: Confirmation).
- Use **Smart Defaults:** Pre-fill random ratios automatically, allowing the user to tweak them rather than starting from scratch.
- Real-time animated progress ring on the dashboard card while a campaign is running.

---

## 4. Admin Flow (Management)

**Current Flow Steps:**
1. Admin accesses restricted `/admin` or dashboard area.
2. Views system-wide metrics, active campaigns, and user credits.
3. Manages manual support tickets ("Thao tác hộ").

**UX Friction Points & Drop-off Risks:**
- Data density. Without proper charts and data tables, identifying stuck campaigns is difficult.

**Optimized Flow Recommendation:**
- Use a dedicated Data Table component with sortable columns and batch actions.
- Implement a global command palette (Cmd+K) for quick navigation.
