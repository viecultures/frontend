---
name: code-scaffold-ui-feature
description: Builds React feature components, pages, and modals in frontend/src/features/ following the Warm Heritage design language and role separation.
---

# Scaffold UI Feature

Generates UI components and pages within `src/features/admin/` or `src/features/user/`.

## Directives
1. **Directory Convention:**
   ```
   src/features/<role>/<feature>/
   ├── components/
   │   ├── <Feature>Card.tsx       # Presentation card with Warm Heritage tokens
   │   ├── <Feature>Modal.tsx      # Modal or slide-over drawer
   │   └── <Feature>Filter.tsx     # Filter bar (provinces, CEFR levels)
   ├── pages/
   │   └── <Feature>Page.tsx       # Main page container
   ├── services/
   │   └── <feature>Service.ts     # Typed API client
   └── types/
       └── <feature>Types.ts       # Specific interface models
   ```

2. **UI & Styling Guidelines:**
   - Always wrap feature pages in the appropriate layout (User Learner Layout with heritage navbar, or Admin Layout with sidebar).
   - Use Lucide React icons.
   - Employ smooth micro-animations using `motion/react` or CSS transitions.
   - Use warm background containers (`bg-warm-ivory`, `bg-rice-paper`) and deep heritage green (`text-heritage-green`, `bg-heritage-green`) for headers and primary CTA buttons.
