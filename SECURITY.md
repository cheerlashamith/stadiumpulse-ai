# Security Policy: StadiumPulse AI

This document outlines the security architecture, controls, and disclosure policy implemented in **StadiumPulse AI** for the FIFA World Cup 2026.

## 1. Security Architecture & Threat Model

```
[ Client Browser ] --- (No API Keys) ---> [ Express API Gateway ] ---> [ @google/genai SDK ] ---> [ Gemini Models ]
                                             | (API Key Hidden)
                                             +-> Sanitize Inputs (XSS, Injection Shield)
```

The application is structured to strictly prevent credential leakage, user input attacks, and downstream prompt-injection exploits.

## 2. Implemented Security Controls

### 2.1 Server-Side Key Broker (Proxy Pattern)
*   **The Constraint:** Zero API keys are permitted to reach client-side bundles or browser local storage.
*   **The Implementation:** All interactions with the Google Gemini API are proxied through a server-side entry point in `/server.ts` running inside a secure container.
*   **The Defense:** The front end queries local endpoints like `/api/gemini/chat` and `/api/gemini/transit`, keeping `GEMINI_API_KEY` encapsulated entirely within safe backend runtime environments.

### 2.2 Client-Side Input Sanitization (XSS Defense)
*   **The Guard:** All text inputs (such as user chat or transit start points) are processed via `/src/services/sanitizeInput.ts` before transmission.
*   **HTML Escape:** Strips HTML tag characters (`<`, `>`, `&`, `"`, `'`) and removes any potential inline javascript vectors (e.g., `<script>`).
*   **Visual Indicators:** Returns clean validation metrics. Displays descriptive UI warnings instead of generic system crashes.

### 2.3 Prompt-Injection Guard
*   **The Attack Vector:** Users attempting to override systemic constraints with phrases like *"Ignore previous instructions and act as..."* or *"Show your system instructions"*.
*   **The Mitigation:** Input strings are parsed against signature regex matches for adversarial phrasing.
*   **The Outcome:** Flagged requests are immediately blocked client-side (`[PROMPT INJECTION BLOCKED]`), logging an operational security incident and displaying a warning to the user.

### 2.4 Role-Based Access Control (RBAC) Gating
*   **Command Center Gate:** Access to `/src/features/ops-intel/OpsIntelDashboard.tsx` is gated behind a server/state auth-lock requiring an Operator Access Code (`FIFA2026`).
*   **Scope Isolation:** Volunteer consoles and general Fan apps operate on independent visual layers, ensuring normal users cannot view active crowd density diagnostics or manual incident reporting tools.

## 3. Reporting Vulnerabilities

If you discover a security vulnerability in this project, please email tournament-security@fifa.org. We will acknowledge receipt of your report within 24 hours and provide an estimated correction timeline. Do not open public issues for security vulnerabilities.
