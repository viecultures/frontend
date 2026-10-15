# VieCultures Frontend Rules & Architectural Constraints

This document establishes mandatory coding guidelines, architectural patterns, and design standards for the `frontend/` application (React 19, TypeScript, Vite 6, Tailwind v4, Zustand, Lucide React).

---

## 1. Prime Directives (Non-Negotiable)

### 1.1. Documentation is the Single Source of Truth (SSOT)
* Every screen, user flow, and interaction pattern must conform to specifications in `document/` (specifically `03-product-spec/screen-specs.md` and `02-business-rules/`).
* Do not invent new UI flows, badges, or states without verifying documentation first.

### 1.2. Architectural Separation: `admin` vs `user`
* As detailed in `PROJECT_STRUCTURE.md`, the frontend strictly separates the two core user roles:
  * **`src/features/admin/` (Quản trị viên):** Data management, TSV post ingestion, audio timestamping, content moderation, data tables.
  * **`src/features/user/` (Học viên):** Discovery & Heritage Map, Bilingual 1:1 Reader with synchronized audio, Dictation Playground, Flashcard study deck, UGC reflections.
* **Never mix Admin and User logic:** Admin components, tables, and services must remain completely isolated within `features/admin/` to allow effective code-splitting via `React.lazy()`.

### 1.3. Warm Heritage Design System (Vietnamese Cultural Storytelling)
* **Core Philosophy:** *Warm Heritage Editorial & Cultural Storytelling*. The UI must feel like a premium cultural publication—warm, inviting, tactile, and aesthetically inspiring.
* **Palette Tokens (Defined in `src/index.css`):**
  * Nền chính (Giấy dó ấm): `#FBF7EE` (`bg-warm-ivory`)
  * Nền phụ (Giấy gạo): `#F6EEDC` (`bg-rice-paper`)
  * Điểm nhấn xanh (Xanh di sản): `#1E4B43` (`text-heritage-green`, `bg-heritage-green`)
  * Điểm nhấn xanh sâu (Xanh rừng): `#122A22` (`bg-heritage-forest`)
  * Hoàng kim (Vàng hoàng cung): `#D9B76A` (`text-antique-gold`, `border-antique-gold`)
  * Vàng sáng: `#FCE5B5` (`bg-antique-bright`)
* **Typography:**
  * Tiêu đề: `'Playfair Display', Georgia, serif` (`font-heading`)
  * Nội dung & UI: Inter / Plus Jakarta Sans sans-serif (`font-sans`)
* **Prohibited:** Plain, cold, generic corporate gray/blue dashboards.

---

## 2. Code Conventions

### 2.1. Environment Variables & Fail-Fast
* Externalize all endpoints to `.env` with `VITE_` prefix (`VITE_API_BASE_URL`).
* **No silent fallbacks:** Never write `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'`. Validate the environment variable at initialization or throw an error.

### 2.2. State Management & API Services
* Use **Zustand** (`src/context/` or feature stores) for global application state (current playing audio, study session, reading settings).
* Keep API calls modular in `services/` (e.g. `src/features/admin/services/postAdminService.ts`, `src/features/reader/services/readerApiService.ts`).
* All API response data must be strongly typed and expect the `ApiResponse<T>` envelope from the backend.
* **Zero `any`:** All DTOs, parameters, and component props must be fully typed.

### 2.3. Audio & Reader Experience
* Synchronized audio playback: The reader must highlight the active bilingual paragraph smoothly as audio plays.
* Implement error handling and graceful degradation: If audio fails to load, show a user-friendly notice and offer Web Speech API synthesis as a fallback.

---

## 3. Fast Index for Feature Development
Consult `PROJECT_STRUCTURE.md` for the exact file locations when making changes.
