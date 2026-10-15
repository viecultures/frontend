# Startup Diagnostics & Troubleshooting Guide (Frontend)

## 1. Overview
When launching `viecultures-frontend` (via `npm run dev`) or running the production build (`npm run build`), use the steps below to diagnose and resolve errors swiftly.

---

## 2. Issue 1: Missing Environment Variable / API Connection Refused

### Symptom
Console shows `[CONFIG ERROR] VITE_API_BASE_URL is missing in .env` or `net::ERR_CONNECTION_REFUSED` when fetching `/api/posts`.

### Resolution Protocol
1. Check that `.env` exists in `frontend/` and defines:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
2. Check that the Spring Boot backend is actively running on port 8080:
   * Test via browser: `http://localhost:8080/swagger-ui.html`.
3. If CORS error occurs, verify that `cors.allowed-origins` in `backend/src/main/resources/application.properties` includes the Vite client origin (typically `http://localhost:5173`).

---

## 3. Issue 2: TypeScript Compiler Errors (`tsc -b`)

### Symptom
Running `npm run build` fails with type errors:
```
error TS2322: Type '...' is not assignable to type '...'
```

### Resolution Protocol
1. Check `src/types/index.ts` and ensure DTO interfaces mirror backend changes.
2. If components pass mismatched props, inspect the type definition rather than casting with `as any`.
3. Run `npx tsc --noEmit` locally to pinpoint the exact file and line number.

---

## 4. Issue 3: Tailwind v4 Theme / Style Not Rendering

### Symptom
Custom classes like `bg-warm-ivory` or `text-heritage-green` do not apply styles.

### Resolution Protocol
1. Verify that `src/index.css` imports `@import "tailwindcss";` and defines `@theme`:
   ```css
   @theme {
     --color-warm-ivory: #FBF7EE;
     --color-rice-paper: #F6EEDC;
     --color-heritage-green: #1E4B43;
     --color-antique-gold: #D9B76A;
   }
   ```
2. Verify `vite.config.ts` includes the `@tailwindcss/vite` plugin.
