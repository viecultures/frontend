# AI Map conversation refactor — verification

## AI Map Chat panels (2026-10-19)

AI Map Chat starts with the conversation at full width. `openMap({ provinceName? , region? })` opens the map; pass either a province or a region, or omit both for the whole country. Existing `highlightMapProvince` and `focusMapRegion` calls also reveal the map in chat. `getVieCultureArticles` continues to return library suggestions; `openArticleDetail({ articleId })` opens bilingual details from that catalog inside the chat, with a link to the full Reader. Closing the panel or pressing Escape returns to the full-width chat. New conversation closes the panel.

The new declarations and panel instructions are available only in chat sessions. Immersive keeps its existing map, UI, prompt and tool declarations.

Validation: `npm run test:map-ai`, `npm run build`, and `node scripts/test-map-ai-panels.mjs` (Vite on port 5196, or set `MAP_AI_BASE_URL`). The browser script uses the existing `PLAYWRIGHT_MODULE` / `PLAYWRIGHT_EXECUTABLE_PATH` overrides. It exercises the real session controller and tool dispatcher with mocked Gemini transport at 1440px and 390px, including panel open/close, article cards, map selection and immersive isolation. Live Gemini tool choice and voice recognition require a live session.

Date: 2026-10-13. Frontend-only; no new SDK/dependencies, backend changes, transcript persistence, model changes, or Reader edits.

## Implementation / review slices

1. Shared conversation runtime: Playground owns `LiveAPIProvider`; `use-live-api` subscribes to `SessionController`. Only the active screen renders/enables controls. The controller owns listeners, connection generations, tool cancellation, settings snapshots, action results and session metadata. `ConversationAudio` owns recorder/playback; a stopped permission request releases any late stream immediately. Audio worklet URLs are revoked and the context registry is weakly referenced.
2. Map synchronization: atomic actions live in `map-state`; `useVietnamMap` distinguishes uncontrolled `undefined` from controlled `null`/IDs. Landmark callback remains `(landmark, province)`; Discovery forwards the province explicitly. Tools share the actions and validate arguments/policy before writes; optional SVG AI markers use the existing projection.
3. Session behavior: immutable history keeps the latest 12 eligible turns within 12,000 UTF-16 characters, without broken surrogate pairs. Resume waits for setup, prefills role-preserving turns with `turnComplete: false`, then sends one new request. Stable transcript IDs and completed-turn targets handle late transcription. Selection freezes rendered message snapshots, not the store; portal lookups are invalidated on close/reset/view/scroll/resize.

Stop/view-change closes socket, mic tracks and output contexts; history remains in memory. New conversation also clears metadata and AI markers, preserving settings/map selection. End disables mic, drains any in-flight server turn before sending the summary once, then waits for summary completion and queued playback; the whole operation has a 60-second timeout and can be stopped immediately.

## Automated evidence

- `npm run test:map-ai`: 78 passing tests, including actual SDK prefill serialization, resume bounds/identity, setup cancellation, stale callbacks/tools, interrupted summary boundaries/timeouts, late input/output transcription, late mic permission, controlled map behavior, map-off policy and projection.
- TypeScript: passes (`npx tsc --noEmit -p tsconfig.app.json` and production build).
- `npm run build`: passes. Existing large-chunk warning remains (~1.78 MB main JS, ~499 KB gzip); code-splitting is outside this refactor.
- `git diff --check`: passes.

## Chromium browser evidence

Start Vite, then run the scripts with an existing Playwright installation. The repository does not add Playwright as a dependency. `PLAYWRIGHT_MODULE` and `PLAYWRIGHT_EXECUTABLE_PATH` can select installed tooling.

```sh
node scripts/test-map-ai-ui.mjs http://127.0.0.1:5173
# runtime script defaults to localhost:5173; optionally set MAP_AI_BASE_URL
node scripts/test-map-ai-runtime.mjs
```

- UI suite: desktop 1600×1000, mobile-sized portrait 390×844 and landscape 844×390. Actual mouse double-click/native selection, streaming freeze/release, dictionary portal controls, viewport/view invalidation, retry draft preservation, auto-scroll/new-message button and inactive-screen gating pass. This suite mocks the runtime and blocks external network requests.
- Runtime suite: real Chromium WebAudio, recorder and AudioWorklets with Chromium's fake microphone device; SDK network transport alone is mocked. Output context creation occurs during user activation before setup. Screen changes close contexts/stop tracks without reconnecting. Resume sends prefill before one fresh request; explicit stop cleans up again. No uncaught page errors.
- Landing and Discovery smoke checks: both render all 34 provinces and apply selection after a DOM click. Full landmark/carousel interactions still benefit from manual regression testing.

## Not yet verified / manual release checks

- Gemini Live service: actual model behavior after resume (no repeated greeting/old answers), tool requests and end-summary quality. Wire protocol is tested, but mocked transport does not establish model behavior.
- Real microphone hardware, OS permission prompts, browser denied-permission UX and audible output on user devices. Fake-device Chromium tests do not substitute for these.
- Safari/iOS and native touch selection/long-press. Mobile viewport tests use desktop Chromium and mouse input, not iOS/touch hardware.
- Dictionary provider response quality/network failures against the live provider; UI tests block external requests.

Suggested manual flow: ask about a landmark → speak → select a streaming word → stop/change screen → resume by Play and by a new typed question → repeat twice → guided lesson → summary → new conversation → refresh. Confirm no auto-reconnect, duplicate transcript/context bubbles, stale popup or map selection reset. Separately exercise province/landmark exploration on Landing and Discovery.
