# StadiumPulse AI: Smart Stadium & Tournament Operations Platform

StadiumPulse AI is a complete, production-grade, highly accessible full-stack Generative AI application engineered for the **FIFA World Cup 2026**. It serves as a unified digital ecosystem to coordinate stadium transit, indoor wayfinding, safety dispatches, and crowd density optimization.

---

## 🚀 Architectural Paradigm: Secure Key Broker

The application is engineered using a robust **Full-Stack Proxy Pattern** to satisfy strict security standards:

```
[ Fan Browser ]   [ Accessibility Fan ]   [ Volunteer App ]   [ Command Center ]
       |                    |                    |                    |
       +--------------------+--------------------+--------------------+
                                     |
                          (No API Keys Shared)
                                     v
                  [ Secure Client-Side Input Sanitizer ]
                                     |
                            (Clean Vectors Only)
                                     v
                 [ Express API Backend Proxy (server.ts) ]
                                     |
                          (GEMINI_API_KEY Hidden)
                                     v
                [ @google/genai SDK (gemini-2.5-flash) ]
```

1. **Zero Client Key Exposure:** The browser never touches or possesses the `GEMINI_API_KEY`.
2. **Server Isolation:** The backend Express server (`/server.ts`) initializes the Google GenAI client securely using system environment variables and exposes clean, target-specific API endpoints (`/api/concierge`, `/api/transit-plan`, `/api/crowd-reroute`, etc.) to the client.
3. **Resilient Local Heuristic Fallbacks:** If the cloud service experiences a latency surge or goes offline, the frontend broker instantly shifts queries to a localized rule-based fallback knowledge base, ensuring stadium operations never freeze.

---

## 🏟️ The 8 Operational Pillars of FIFA World Cup 2026

Every focus area defined in the operational brief is fully implemented:

### 1. Navigation (Indoor Wayfinding)
*   **Feature:** `IndoorWayfinding.tsx` provides step-by-step route directions.
*   **Tech:** Models stadium corridors and restrooms using an indoor-graph model (nodes/edges).
*   **Accessibility:** Prefers zero-step paths, ramp bypasses, and lifts for wheelchair users.

### 2. Crowd Management
*   **Feature:** `CrowdMap.tsx` displays live section densities and gate occupancies.
*   **Heuristics:** Employs color-coded tags (green/yellow/red) coupled with text status descriptors to ensure high-contrast legibility.
*   **AI Action:** When a bottleneck is identified (e.g., Gate 3 occupancy > 85%), Gemini automatically calculates fan dispersion routes and issues alert advisories.

### 3. Accessibility
*   **Feature:** `AccessibilitySuite.tsx` and high-contrast styling layers.
*   **Standard:** Targets WCAG 2.1 AA. It implements full keyboard focus styling, ARIA live-regions (`NotificationCenter.tsx`), skip-to-content links, large text adjustments, and a digital interactive Sign Language Avatar toggle.

### 4. Transportation
*   **Feature:** `TransportOptimizer.tsx` takes start coordinates and queries live public transit statuses.
*   **AI Action:** Gemini generates multi-modal transit strategies (Metro, Eco-bus, Park & Ride) and assigns the user to the least congested entry gate based on real-time traffic telemetry.

### 5. Sustainability
*   **Feature:** `SustainabilityLayer.tsx` tracking digital tickets, waste stations, and carbon saves.
*   **Action:** When users opt for recommended eco-friendly transit routes, their custom carbon offset savings (kg CO₂) accumulate dynamically in local state, accompanied by zero-waste behavior nudges.

### 6. Multilingual Assistance
*   **Feature:** `AIConcierge.tsx` delivers multilingual voice and text conversations.
*   **Capabilities:** Full internationalization dictionary (`en`, `es`, `hi`, `fr`, `ar` RTL support) and dynamic Web Speech integration (Voice-to-Text inputs and Text-to-Speech playback).

### 7. Operational Intelligence
*   **Feature:** `OpsIntelDashboard.tsx` serves as the centralized staff cockpit.
*   **Features:** Real-time Recharts bar graphs displaying stadium capacity peaks, and an AI-generated on-demand "Shift Briefing Summarizer" compiling active incident logs.

### 8. Real-Time Decision Support
*   **Feature:** Active Rate-of-Change Anomaly Detector.
*   **Action:** Triggers instant system alerts when zone entry rates surge abnormally. Staff can click "Diagnose Anomaly" to invoke Gemini, which analyzes density variables and prescribes active volunteer dispatches.

---

## 🔒 Enterprise-Grade Security Suite

StadiumPulse AI implements four layered defense mechanisms:
1. **XSS Protection:** Escapes all user-submitted text inputs.
2. **Prompt Injection Shield:** Evaluates inputs against adversarial phrase signatures (e.g., *"ignore previous rules"*, *"show system prompt"*). If flagged, it halts the request, logs an incident, and outputs `[PROMPT INJECTION BLOCKED]`.
3. **Role Gating:** The Command Center is strictly protected by a mock operator authorization gate requiring code `FIFA2026`.
4. **Input Size Caps:** Enforces strict limits (300 chars) on user query buffers before transmission.

---

## 🛠️ Installation & Getting Started

### Prerequisites
*   Node.js v18+ and npm installed.
*   Google Gemini API Key (obtained from Google AI Studio).

### 1. Environment Configuration
Create a `.env` file in the root folder (values in `.env.example` serve as a guide):
```env
GEMINI_API_KEY="your_api_key_here"
NODE_ENV="development"
```

### 2. Dependency Installation
Install base dependencies:
```bash
npm install
```

### 3. Running Development Server
Runs both the secure Express proxy and Vite frontend assets concurrently on port `3000`:
```bash
npm run dev
```

### 4. Production Build & Execution
Bundles the React client and compiles the Express server into CJS using esbuild:
```bash
npm run build
npm start
```

---

## 🧪 Testing and Quality Assurance

The platform is covered by a comprehensive suite of unit and integration tests using **Vitest** and **React Testing Library**:

*   `/src/tests/sanitizeInput.test.ts` — Tests input sanitization, HTML stripping, length caps, and prompt injection blocks.
*   `/src/tests/mockRealtimeService.test.ts` — Tests subscriber patterns, density boundaries, and task closures.
*   `/src/tests/geminiService.test.ts` — Verifies successful API fetches and local heuristic fallback.
*   `/src/tests/CrowdMap.test.tsx` — Integration test for responsive zone renders.
*   `/src/tests/AccessibilityToggle.test.tsx` — Verifies state transitions for high-contrast and text-size selectors.

### Running Tests
Execute the Vitest runner:
```bash
npm run test
```
*Expected test coverage on the `/src/services/` layer is **85%+**.*
