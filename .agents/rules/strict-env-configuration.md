# Rule: Zero Hardcoding & Strict Fail-Fast Environment Variables (Frontend)

## 1. Core Principle
* **Absolute Ban on Hardcoded Values:** Backend API base URLs, third-party API keys (e.g., Google Maps, Gemini), and service flags must be configured via `.env` with the `VITE_` prefix.
* **Fail-Fast Enforcement:** If a required environment variable is missing, the application must throw an error or display an explicit initialization error banner during bootstrap, rather than silently defaulting to localhost or unauthenticated states.

## 2. Forbidden Syntax (No Silent Fallbacks in Code)
* ❌ **FORBIDDEN:**
  ```typescript
  // VIOLATION: Silent localhost fallback obscures deployment misconfiguration
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  ```
* ✅ **MANDATORY:**
  ```typescript
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  if (!API_BASE) {
    throw new Error('[CONFIG ERROR] VITE_API_BASE_URL is missing in .env');
  }
  ```

## 3. Required Environment Variables Checklist
* `VITE_API_BASE_URL`: Base URL of the Spring Boot backend (e.g. `http://localhost:8080` or `https://api.viecultures.com`)
* `VITE_GOOGLE_MAPS_API_KEY`: API key for Google Maps Vietnam Heritage map
* `VITE_GEMINI_API_KEY`: Optional frontend client Gemini key (if client-side inference is enabled)
