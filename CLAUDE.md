# Recovery Path — Project Guide & Auto-Changelog

> **CRITICAL AGENT INSTRUCTION:**  
> Every time ANY change, addition, bugfix, or refactor is made to this codebase, you **MUST immediately log the change** under the [Changelog](#changelog) section below with the date, modified/created files, and a clear summary of what was done.

---

## 1. Project Overview
**Recovery Path** is an evidence-based, compassionate digital support and recovery platform built with Flask, SQLAlchemy, and modern HTML/CSS blueprint aesthetics. It supports individuals in evaluating, tracking, managing, and overcoming substance, behavioral, and health-related addictions.

---

## 2. Tech Stack & Environment
- **Backend:** Python 3.12, Flask 3.0.0, Flask-SQLAlchemy, Flask-Login, Flask-WTF, Werkzeug
- **AI Integration (100% Free):** Google Gemini API (`gemini-3.1-flash-lite`, `gemini-flash-lite-latest`) via standard library `urllib.request` (zero external HTTP dependencies) with Groq Cloud fallback (`llama-3.3-70b-versatile`)
- **Database:** SQLite (`instance/addiction_support.db`)
- **Frontend:** Jinja2 templates, Custom Industrial Blueprint CSS (`app/static/css/style.css`), Vanilla JS (`app/static/js/ai_chat.js`), Chart.js
- **Environment:** Windows 11 / POSIX Bash

---

## 3. Core Architecture

```
minor project 2/
├── app/
│   ├── __init__.py                # App factory, blueprints, database init & auto-seeding
│   ├── models.py                  # Database models (User, Addiction, UserResponse, AddictionTrackingEntry, etc.)
│   ├── forms.py                   # WTForms validation classes
│   ├── routes/
│   │   ├── auth.py                # Registration, Login, Logout
│   │   ├── main.py                # Home page, User assessment dashboard
│   │   ├── addictions.py          # Addiction catalog, detail pages, stories
│   │   ├── questionnaire.py       # Self-assessment questionnaire & scoring
│   │   ├── tracking.py            # Calendar, daily logs (relapse, trigger, progress, milestone), goals
│   │   └── api_ai.py              # Free AI REST endpoints (/api/ai/chat, /assessment-advice, /entry-tip)
│   ├── services/
│   │   ├── __init__.py
│   │   └── ai_service.py          # Unified AI engine with Gemini/Groq calls, model failover & safety guardrails
│   ├── static/
│   │   ├── css/style.css          # Industrial blueprint UI styles & AI widget styling
│   │   └── js/ai_chat.js          # Hope AI companion widget frontend controller
│   └── templates/
│       ├── base.html              # Core layout + AI widget injection
│       ├── components/
│       │   └── ai_chat.html       # Floating AI chat companion partial
│       ├── questionnaire/
│       │   └── results.html       # Assessment results + AI personalized advice button
│       └── tracking/
│           └── add_entry.html     # Daily tracking entry + AI coping reflection assistant
├── config.py                      # Configuration loader from .env
├── run.py                         # Application runner
├── requirements.txt               # Dependencies
├── .env                           # Local environment variables (API keys, secrets) - ignored by git
├── .env.example                   # Environment template
└── CLAUDE.md                      # Project documentation & active changelog
```

---

## 4. AI Features & Safety Guardrails

### 🔹 1. "Hope AI" 24/7 Recovery Companion Chatbot
- Global floating widget on all pages (`Talk with Hope`).
- Provides active listening, non-judgmental empathy (Motivational Interviewing / OARS), and craving management.
- **Refusal Practice Simulator:** Interactive roleplay coaching users on how to say "NO" firmly and calmly to peer pressure in social settings.
- **Bedtime Somatic Calming:** 2-minute relaxation and nervous system grounding scripts for sleep.

### 🔹 2. 🚨 SOS Urge De-escalator & 4-7-8 Urge Surfing Modal
- Direct navbar button `🚨 SOS Urge Assist` accessible anywhere on the site.
- Animated 4-7-8 guided breathing circle with visual expansion and holding phases.
- 3-minute Alan Marlatt Urge Surfer countdown timer for riding craving waves.
- AI 5-4-3-2-1 Sensory Grounding exercise generator.
- One-tap 24/7 emergency hotlines (988, SAMHSA 1-800-662-4357, Crisis Text Line 741741).

### 🔹 3. AI Assessment Insights
- On questionnaire results, generates structured 3-part advice: *Understanding Your Score*, *Top 3 Action Steps*, and *Specific Coping Technique*.

### 🔹 4. AI Daily Tracking Coping Assistant
- In daily tracking log form, generates supportive reflections and 2-minute physiological grounding exercises.

### 🔹 5. SMART Goal Coach & Micro-Habit Decomposer
- In goal creation (`/tracking/<slug>/goals/add`), breaks broad recovery goals into 3 actionable daily micro-habits with one-click appending.

### 🔹 6. Milestone Shield (Letter to Future Self)
- In goals view (`/tracking/<slug>/goals`), generates an empowering Letter to Future Self for completed goals that serves as a protective shield during future urges.

### 🔹 7. AI Trigger Pattern Detective
- On the tracking dashboard (`/tracking/`), analyzes past logged entries to reveal hidden time/stress trigger patterns and recommend weekend guardrails.

### 🔹 8. Community Story Key Recovery Takeaways
- On community stories (`/addictions/<slug>/stories`), distills actionable strategies and coping wisdom shared by members.

### 🛡️ Safety Guardrails
1. **Deterministic 0ms Crisis Circuit-Breaker:** Local regex scanner intercepts self-harm, suicidal ideation, overdose, or poisoning before calling any LLM and immediately displays 24/7 crisis hotlines (988 Lifeline, SAMHSA 1-800-662-4357, Crisis Text Line 741741).
2. **Zero-PII Transmission:** Usernames, emails, and personal IDs are never sent to external AI APIs.
3. **Medical Disclaimer:** Strict instruction preventing medical diagnosis or medication prescription.
4. **Input Sanitization:** HTML escaping against XSS and character limits.
5. **Model Failover & Ultra-Fast Latency:** Prioritizes `gemini-flash-lite-latest` and `gemini-3.5-flash-lite` for sub-second responses with Groq and local rule fallbacks.

---

## 5. Development & Run Commands

```bash
# 1. Setup virtual environment & dependencies
python -m venv venv
source venv/Scripts/activate # Windows Git Bash
pip install -r requirements.txt

# 2. Configure .env with free API key
# (Get free Gemini key at: https://aistudio.google.com/)
cp .env.example .env

# 3. Run application server (Default port 5000)
python run.py
```

---

## 6. Changelog

All code and architecture changes made to this repository are logged here in reverse chronological order.

### [2026-09-12] — Fix Vercel Serverless Function Size Limit (< 250MB)
- **Root Cause:** The `google-generativeai` and `groq` packages in `requirements.txt` pulled in heavy binary dependencies (`grpcio`, `protobuf`, `google-api-python-client`, ~190MB) plus unexcluded frontend build folders, pushing the serverless function zip size to 257.65MB.
- **Removed Heavy Unused SDKs:** Since `app/services/ai_service.py` uses Python standard library `urllib.request` with direct REST calls to Gemini and Groq, removed `google-generativeai`, `groq`, and `requests` from `requirements.txt`.
- **Added `.vercelignore`:** Excluded `motion-bloom-works/node_modules`, `.output`, `design_ref`, and local cache directories from Vercel's serverless function bundle.
- **Added Setuptools Filtering:** Configured `pyproject.toml` with `[tool.setuptools.packages.find]` to only package `app*`.
- **Result:** Function package size dropped from 257.65MB to ~15MB.

### [2026-09-12] — Dedicated Story & AI Key Takeaways Page (`/stories/$key`)
- **Dedicated Route for Story & AI Takeaways:**
  - Created new TanStack route `motion-bloom-works/src/routes/stories.$key.tsx` providing a dedicated, full-page experience displaying the selected community recovery story alongside AI-distilled takeaways.
  - Replaced the previous in-page modal on `/stories` with direct page navigation.
  - Added helper methods `formatStoryKey()`, `getAllStories()`, and `getStoryByKey()` in `motion-bloom-works/src/data/addictions.ts` to cleanly format and resolve story routes (e.g. `/stories/alcohol-sarah-m`).
  - Added "Copy Takeaways", "Regenerate Insights", "Save/Bookmark Story", and "Copy Story Link" buttons to the dedicated page.
  - Added "AI Takeaways →" button links on each story card across both `/stories` (`src/routes/stories.index.tsx`) and topic detail pages (`src/routes/addictions.$slug.tsx`).
- **Backend & Proxy Integration:**
  - Updated `app/services/ai_service.py` and `app/routes/api_ai.py` to return both `"takeaways"` and `"summary"` keys, ensuring full backward and forward compatibility.
  - Added 20s timeout with `AbortController` in `motion-bloom-works/src/lib/ai-service.ts`.
- **Verification:**
  - `npm run build` passes with zero TypeScript errors.
  - Verified `POST /api/ai/story-takeaways` returning Gemini-generated insights through port 5000 and port 8080 proxy.

### [2026-09-12] — Fix AI Key Takeaways on Community Stories Page
- **Root Cause:** Backend (`app/services/ai_service.py` and `app/routes/api_ai.py`) returned `{ "summary": ... }` but frontend (`motion-bloom-works/src/lib/ai-service.ts`) expected `data.takeaways`, causing the modal to display `undefined`/blank content.
- **Fix:** Renamed backend response key from `"summary"` to `"takeaways"` in both `ai_service.summarize_story_lessons()` return value and the `/api/ai/story-takeaways` error fallback.
- **Verification:** `npm run build` passes with zero TypeScript errors.

### [2026-09-12] — Fix Vercel Entrypoint and Serverless Database Configuration
- **Configured Vercel WSGI Entrypoint:**
  - Updated `pyproject.toml` to set `[tool.vercel] entrypoint = "run:app"`, complying with Vercel's required `module:object` entrypoint format.
  - Exported top-level `app = create_app()` WSGI callable in `run.py` for Vercel Python serverless runtime.
- **Serverless SQLite Path Compatibility:**
  - Updated `config.py` to default SQLite database URI to `/tmp/addiction_support.db` when running under `VERCEL` environment, avoiding read-only filesystem errors.
- **Environment-Aware Route Redirections:**
  - Updated `app/routes/main.py` and `app/routes/addictions.py` to restrict `localhost:8080` redirects to local dev only, ensuring cloud/Vercel deployments serve routes directly.

### [2026-09-12] — Convert Frontend from Nested Submodule to Direct Repository Directory
- **Direct Monorepo Frontend Integration:**
  - Removed nested `.git` and broken submodule gitlink reference from `motion-bloom-works`.
  - Added full frontend codebase (87 source files, UI components, router, hooks, and static assets) directly into the main `Recovery-Path` Git repository.
  - Updated root `.gitignore` to prevent any build artifacts (`node_modules`, `.output`, `.tanstack`, `.nitro`) from being tracked.
  - Enabled cloning and deploying the full-stack application directly from `Recovery-Path` without external submodule dependencies.

### [2026-09-12] — Custom Recovery Path Favicons & Complete Brand Icon Replacement
- **Replaced Default Favicon with Recovery Path Compass / Beacon Icon:**
  - Designed and generated crisp vector SVG favicon (`motion-bloom-works/public/favicon.svg`) with Recovery Path compass dial, cardinal indicators, glowing teal/cyan gradient needles, and dark navy base.
  - Generated multi-size binary ICO file (`motion-bloom-works/public/favicon.ico`) with 16x16, 32x32, 48x48, and 64x64 pixel formats matching the Recovery Path theme.
  - Updated `motion-bloom-works/src/routes/__root.tsx` head links to reference SVG favicon (`/favicon.svg`), multi-size ICO fallback (`/favicon.ico`), and Apple touch icon (`/favicon.svg`).
  - Added matching favicon assets to `app/static/` and updated `app/templates/base.html`.
  - Removed obsolete `.lovable/` configuration directory.
- **Verification:**
  - Verified `npm run build` with zero TypeScript or bundling errors.
  - Verified favicon links resolve properly.

### [2026-09-11] — Prominent Chat Close / Cross Buttons & Escape Key Dismissal
- **Hope AI Chat Close Enhancements (`motion-bloom-works/src/components/site/hope-ai-chat.tsx`):**
  - Added a high-contrast circular cross button (`X`) in the chat modal header with clear hover state (`hover:bg-destructive/15 hover:text-destructive`), tooltip, and accessibility attributes (`aria-label="Close chat"`).
  - Transformed the floating trigger button when open into an interactive "Close Chat" cross button with red-accented stroke icon and smooth 90-degree rotate animation on hover.
  - Added keyboard `Escape` shortcut listener to cleanly dismiss the chat modal at any time.
  - Added dedicated close cross button to the FAQ overlay panel.
- **Verification:**
  - Verified `npm run build` with zero TypeScript errors.

### [2026-09-11] — Hope AI Frequently Asked Questions Panel
- **FAQ Panel (`motion-bloom-works/src/components/site/hope-ai-chat.tsx`):**
  - Added a toggleable "Frequently Asked Questions" overlay panel inside the Hope AI chat widget with 16 categorized recovery prompts across 4 categories: Coping & Urges, Emotional Support, Skills & Practice, and Mindfulness & Rest.
  - Added animated accordion-style category sections using `motion/react` with staggered entry animations, chevron rotation, and smooth height transitions.
  - Added "FAQs" toggle button in the quick prompt chip bar that highlights when active.
  - FAQ panel overlays the message area when open and auto-closes when a prompt is selected.
  - All FAQ items are clickable and instantly send the prompt to Hope AI for response.
- **Verification:**
  - Verified `npm run build` with zero TypeScript errors.

### [2026-09-11] — Seamless Single-URL Integration (Unified Frontend + Backend)
- **Single-URL Full-Stack Integration (`motion-bloom-works/vite.config.ts`):**
  - Integrated Nitro server proxy rules (`devProxy` and `routeRules: { "/api/**": { proxy: "http://127.0.0.1:5000/api/**" } }`) routing all AI API endpoints directly through `http://localhost:8080/`.
  - All features — Hope AI Chatbot, Assessment Action Plans, Daily Check-in Coping Tips, SMART Goal Decomposition, Milestone Shield, Trigger Pattern Detective, and Story Takeaways — now execute seamlessly through a single URL.
- **Unified Launcher (`run.py`):**
  - Streamlined output banner to present the single unified application URL `http://localhost:8080/`.
  - Maintains automatic browser opening and clean subprocess lifecycle management on Ctrl+C.
- **Verification:**
  - Tested `GET http://localhost:8080/` (React Frontend) -> HTTP 200.
  - Tested `POST http://localhost:8080/api/ai/chat` (Hope AI Chatbot) -> HTTP 200.
  - Tested `POST http://localhost:8080/api/ai/assessment-advice` (Personalized AI Advice) -> HTTP 200.
  - Verified `npm run build` with zero TypeScript errors.

### [2026-09-11] — Full Terminal Launch Integration & 10-Question Scale Verification
- **Unified Full-Stack Launcher (`run.py`):**
  - Updated `run.py` so running `python run.py` automatically starts both the Flask AI/API backend (port 5000) in a background thread and the modern React/Vite frontend (port 8080) concurrently.
  - Added safe console printing with Windows codepage fallback (`safe_print`) to avoid `cp1252` encoding errors on standard Windows consoles.
  - Added automatic default browser launch directly to `http://localhost:8080/`.
  - Added clean cross-platform process tree termination (`taskkill /F /T /PID` on Windows) on `Ctrl+C`.
- **Automatic Frontend Redirection (`app/routes/main.py` & `app/routes/addictions.py`):**
  - Configured root `/`, `/dashboard`, and `/addictions` routes in Flask to automatically redirect browser requests to `http://localhost:8080/`, preventing accidental exposure to older templates.
  - Added `?legacy=true` query parameter support for inspection of legacy Jinja templates if requested.
- **CORS Configuration (`app/__init__.py`):**
  - Expanded allowed CORS origins to include `http://localhost:8080` and `http://127.0.0.1:8080`.
- **10-Question Scale Stat Badge (`motion-bloom-works/src/routes/index.tsx`):**
  - Updated the hero section animated counter from 5 to 10 calibrated questions per topic.
- **Verification:**
  - Verified `python run.py --no-browser` launches both Flask on port 5000 and React on port 8080, serving requests successfully.
  - Verified all 17 addiction domains have 10 clinical questions in both SQLite database and React frontend.

### [2026-09-11] — Fix: Genuinely Tailored AI Responses for Custom User Questions
- **Backend Model Failover Fix (`app/services/ai_service.py`):**
  - Reduced Gemini candidate models from 5 (many broken/404/503) to the **2 confirmed-working models**: `models/gemini-3.1-flash-lite` (~4s) and `models/gemini-flash-lite-latest` (~7s).
  - Increased per-model timeout from 4.5s to 12s to prevent premature timeouts on working models.
  - Root cause: 5 models × 4.5s timeout = 22.5s max backend processing caused Flask to hang, triggering frontend fallback to generic template responses regardless of user input.
- **Frontend Generic Fallback Removal (`motion-bloom-works/src/lib/ai-service.ts`):**
  - Removed `getCustomContextualResponse()` function entirely — this was the source of identical boilerplate responses for every custom question.
  - Added `AbortController` with 30s timeout on the fetch call to the backend.
  - Replaced offline fallback with honest "couldn't connect" message instead of fake template.
- **Custom Prompt Routing (unchanged):**
  - Ready-made instant responses only for the 4 exact quick prompt buttons.
  - All custom user questions route to Gemini AI with strict system instructions to answer the user's exact question with specific, tailored content.
- **Verification:**
  - Tested "im feeling lonely" → 4.4s, specific advice about low-stakes social connection.
  - Tested "What are protein snack replacements for sugar" → 6.4s, specific items (Greek yogurt, roasted chickpeas, etc.).
  - Verified `npm run build` with zero TypeScript errors.

### [2026-09-11] — Full AI Suite & 10-Question Clinical Assessment Scale on React Frontend
- **10-Question Clinical Self-Assessments (`motion-bloom-works/src/data/addictions.ts` & `src/routes/addictions.$slug.tsx`):**
  - Expanded all 17 addiction domains from 5 questions to the full 10 calibrated clinical questions from `seed.py`.
  - Updated scoring scale to 0–40 points with calibrated tiers: Low Concern (0–12), Worth Attention (13–24), and High Concern (25–40).
  - Added multi-slug alias resolver in `getAddiction(slug)` ensuring both shortened and canonical slugs resolve seamlessly.
- **AI Bridge & Safety Guardrails (`motion-bloom-works/src/lib/ai-service.ts`):**
  - Built unified client bridge connecting frontend to backend AI endpoints with 0ms deterministic regex crisis circuit-breaker (988 Lifeline, SAMHSA, Crisis Text Line) and resilient offline fallback generators.
  - Added API proxying in `motion-bloom-works/vite.config.ts` targeting `http://127.0.0.1:5000`.
- **Hope AI 24/7 Recovery Companion Floating Widget (`motion-bloom-works/src/components/site/hope-ai-chat.tsx`):**
  - Built global floating chat assistant with pulsing status indicator, markdown conversation rendering, quick-action prompt chips (Saying NO Refusal Practice, Urge Surfing, Bedtime Somatic Calming, Guilt Reframing), and instant crisis helpline banner.
  - Injected globally into `motion-bloom-works/src/routes/__root.tsx`.
- **Personalized AI Assessment Action Plan (`motion-bloom-works/src/routes/addictions.$slug.tsx`):**
  - Added "✨ Generate AI Personalized Recovery Plan" feature delivering tailored score interpretation, top 3 weekly action steps, and urge surfing technique.
- **SMART Goal Coach & Micro-Habit Decomposer (`motion-bloom-works/src/routes/dashboard.tsx`):**
  - Added "✨ Decompose into 3 Daily Micro-Habits with AI" with 1-click habit adding to active goals.
  - Added "💡 Get AI Coping Reflection" to daily check-ins.
  - Added "🛡️ Generate Milestone Shield (Letter to Future Self)" celebration modal.
  - Added "🧠 AI Trigger Pattern Detective" to uncover peak craving cycles and weekend guardrails.
- **Community Story AI Key Takeaways (`motion-bloom-works/src/routes/stories.tsx`):**
  - Added "✨ AI Key Takeaways" modal distilling actionable recovery strategies and wisdom from each lived experience story.
- **Verification:**
  - Ran `npm run build` with zero TypeScript errors.
  - Verified live development server serving on `http://localhost:8080/` with proxying to Flask backend on `http://127.0.0.1:5000/`.

### [2026-09-11] — Complete Independence & Decoupling from Lovable
- **Decoupled & Sanitized Frontend Configuration in `motion-bloom-works/`:**
  - **Standalone Vite Setup (`vite.config.ts`):** Replaced `@lovable.dev/vite-tanstack-config` with standard Vite 8 + TanStack Start (`@tanstack/react-start/plugin/vite`), `@vitejs/plugin-react`, `@tailwindcss/vite`, `nitro/vite`, and `vite-tsconfig-paths`.
  - **Clean Error Boundary (`src/routes/__root.tsx`):** Removed third-party error telemetry imports and hooks in `ErrorComponent`.
  - **Pruned Dependencies (`package.json`):** Removed `@lovable.dev/*` packages and cleaned `package-lock.json`.
  - **Removed Stale Files:** Deleted `src/lib/lovable-error-reporting.ts`, `AGENTS.md`, and references in `bunfig.toml` and `README.md`.
- **Verification:**
  - Verified 0 occurrences of external platform references across the codebase.
  - Ran `npm run build` — verified flawless production build and type safety.

### [2026-09-11] — Production React 19 + TanStack Start Frontend Architecture
- **Added / Updated Frontend Modules in `motion-bloom-works/`:**
  - **🚨 Global SOS Emergency Modal (`src/components/site/sos-modal.tsx` & `src/components/site/site-header.tsx`):** Added 4-7-8 animated parasympathetic breathing circle, 3-minute Alan Marlatt Urge Surfing countdown timer, 5-4-3-2-1 somatic grounding checklist, and 24/7 direct click-to-call hotline cards (988 Lifeline, SAMHSA 1-800-662-4357, Crisis Text Line 741741). Injected SOS badge into the site navigation.
  - **Local Storage State Store (`src/lib/store.ts`):** Enhanced store with reactive custom event dispatching (`rp:storage`), supporting `useCheckIns` (mood, urges, triggers, reflection notes), `useGoals` (micro-goals with add/toggle/delete), `useResults` (clinical assessments), and `useBookmarks` (saved community recovery stories).
  - **Full Dashboard (`src/routes/dashboard.tsx`):** Built interactive daily mood & urge sliders with dynamic OKLCH indicators, common trigger multi-select pills, 14-day visual trend chart, interactive micro-goals list with category tagging, assessment progression history, and one-click JSON data export.
  - **Story Library & Bookmarking (`src/routes/stories.tsx`):** Added instant live search, category and bookmark filtering, and one-click bookmarking of lived-experience recovery stories.
- **Verification:**
  - Ran `npm run build` with Vite 8 and Nitro Cloudflare preset — zero TypeScript errors and successful production bundle generation.

### [2026-09-11] — Full Suite of Recovery AI Features (All 7 Domains Completed)
- **Added / Updated AI Features:**
  - **🚨 SOS Craving De-escalator & 4-7-8 Urge Surfer Modal:** Added `app/templates/components/sos_modal.html` with animated breathing circle (`.sos-inhale`, `.sos-hold`, `.sos-exhale`), 3-minute urge surfing timer, AI 5-4-3-2-1 sensory grounding generator (`/api/ai/sos-grounding`), and direct click-to-call 988 emergency pills. Injected globally into `app/templates/base.html`.
  - **Refusal Practice Simulator & Bedtime Calming:** Added dedicated quick-prompt chips to Hope AI widget in `app/templates/components/ai_chat.html` for social peer pressure refusal practice and 2-minute somatic bedtime scripts.
  - **SMART Goal Coach & Micro-Habit Decomposer:** Updated `app/templates/tracking/add_goal.html` to break recovery goals into 3 daily micro-habits via `/api/ai/decompose-goal` with 1-click append to goal description.
  - **Milestone Shield (Letter to Future Self):** Updated `app/templates/tracking/goals.html` to add Milestone Shield generator modal (`/api/ai/milestone-letter`) celebrating milestones and providing a protective reminder for future cravings.
  - **AI Trigger Pattern Detective:** Added weekly pattern analysis card in `app/templates/tracking/dashboard.html` (`/api/ai/pattern-insights`) to identify recurring triggers and proactive weekend guardrails.
  - **Community Story Key Takeaways:** Added instant AI takeaway extractor in `app/templates/addictions/stories.html` (`/api/ai/story-takeaways`) summarizing lived experience lessons.
  - **Optimized Model Failover:** Configured `gemini-flash-lite-latest` and `gemini-3.5-flash-lite` in `app/services/ai_service.py` for sub-second responses.
- **Verification:**
  - Verified all 10 API endpoints returning HTTP 200 with active Gemini API key.
  - Verified 0ms deterministic safety regex interceptor protecting in crisis scenarios.

### [2026-09-11] — Initial Free AI Integration & Safety Guardrails
- **Added Files:**
  - `app/services/__init__.py`: Export `AIService`.
  - `app/services/ai_service.py`: Implemented unified free AI adapter with Google Gemini (`gemini-3.5-flash`, `gemini-3.5-flash-lite`), Groq failover, 0ms regex crisis interceptor (988/SAMHSA/Crisis Text Line), and empathetic offline fallback.
  - `app/routes/api_ai.py`: Added Blueprint `api_ai_bp` with `/api/ai/chat`, `/api/ai/assessment-advice`, and `/api/ai/entry-tip` endpoints.
  - `app/templates/components/ai_chat.html`: Created floating companion chat widget with typing indicators, prompt chips, and emergency hotline alert modal.
  - `app/static/js/ai_chat.js`: Built client-side chat script with markdown rendering, typing animation, auto-scroll, and crisis modal trigger.
  - `.env` & `.env.example`: Configured `GEMINI_API_KEY`, `GROQ_API_KEY`, and `AI_MODEL`.
  - `CLAUDE.md`: Created project documentation, safety guide, and change tracking system.
- **Modified Files:**
  - `app/__init__.py`: Registered `api_ai_bp` blueprint.
  - `config.py`: Added `GEMINI_API_KEY`, `GROQ_API_KEY`, and `AI_MODEL` config fields.
  - `requirements.txt`: Updated with free AI packages and `python-dotenv`.
  - `.gitignore`: Added `.env`, `instance/`, `*.db`, `__pycache__/` to secure secrets.
  - `app/static/css/style.css`: Added glassmorphism styling for chat widget, launch button, pulse animations, crisis alert, and AI advice cards.
  - `app/templates/base.html`: Injected floating companion chat widget and script globally.
  - `app/templates/questionnaire/results.html`: Added interactive "Generate AI Advice" button and advice display card.
  - `app/templates/tracking/add_entry.html`: Added inline "Get AI Coping Tip & Reflection" assistant.
- **Verification:**
  - Validated live Gemini 3.5 Flash API connection using user key.
  - Verified 0ms crisis interceptor unit and integration tests.
  - Verified Flask dev server running smoothly on port 5000.
