# Playground video shadowing

Start Vite with `npm run dev`, open `/playground`, paste a YouTube URL and request the transcript from `/api/v1/ytb-transcript` on `VITE_API_BASE_URL` (or localhost on `VITE_BACKEND_PORT`). Configure these variables using `.env.example`. The video must allow embedding. No hard-coded demo video is requested on mount.

## Workspace entry and preferences

The first screen opens with a YouTube URL field and Open video. Source settings contains transcript language, sentence grouping and music-label filtering. Loading a source opens a preparation summary; Start practice uses the existing draft validation. Invalid drafts or changes removing recorded sentences require the existing editor/acknowledgement before applying.

The navbar keeps Dictation/Shadowing and Practice settings. Settings contains sample speed, loop, auto-pause, local Paper/Dark appearance, Change video, Edit transcript and Reload transcript. These controls reuse the existing player/session hooks. Mobile settings use a bottom sheet and the video can collapse while idle. Returning from the source dialog or cancelling a draft preserves the current lesson/takes.

The learning panels use the shared workspace theme and English labels. Shadowing focuses on the active sentence, Listen and Record, with part/sentence browsers and voice replay behind expandable sections. Dictation puts listening and the answer field first; hints, answers, grading, search and transcript copying retain their existing behavior. Previous/Next sentence navigation is available in both modes. Detailed transcript editing and the player/recorder engines are retained.

## Workflow

1. Open a video, then start directly when its transcript/timing is valid, or choose Edit transcript. Review the draft: edit text and start/end in seconds, preview a sentence, add/split/merge/remove sentences.
2. Mark sentences that begin a new content part and name each part. Apply when timing is valid. New BE requests are disabled while a draft is open, so edits cannot be overwritten accidentally. Transcript JSON export contains no user recordings.
3. Record sentences at 1x with the video muted as a visual cue. One committed compressed Blob is retained per sentence. A retry only replaces it after successful completion.
4. Listen to a part or the entire video with separate original-video and voice volumes. Part playback stops at its boundary; whole-video playback continues across parts.

All timestamps are absolute on the source video. Part boundaries are derived from the first sentence in each part, with the first part starting at zero and the last extending to video duration. Part regrouping does not invalidate otherwise unchanged takes.

## Ownership and lifecycle

- `useShadowingSession` owns the lesson and take map for the whole video, outside the components for selected parts and modes. Switching parts or switching Dictation/Shadowing preserves committed takes.
- Text edits mark affected takes for review; timing edits require re-recording. Unaffected takes remain valid.
- `SentenceRecorder` owns microphone tracks, chunks and recorder callbacks. Generation guards discard callbacks after cancellation. Buffering, manual seek or leaving the active screen cancels an unfinished take without replacing an older take.
- `useSamplePlayback` controls only playback it started. It cannot pause a recorder/replay during cleanup.
- `SamplePlayback` pauses before seeking and confirms the clock near the new sentence start before enabling its end boundary. A cached time near the previous end cannot acknowledge seek. Position confirmation may arrive while buffering; the first PLAYING notification may arrive later in a short sentence. End checks run only for playing/ended states and use the full end timestamp, without subtracting 25 ms.
- `useShadowingReplay` uses the YouTube clock, pauses audio during buffering, handles seeks and ignores intentionally aborted `play()` promises. Audio URLs are owned by playback components and revoked when no longer needed.
- Audio is never uploaded, stored in localStorage/IndexedDB or evaluated by a shadowing scoring endpoint. Reloading/leaving the route loses the session. Existing Dictation word evaluation remains available.
- Limits: 60 seconds and 4 MiB per take; 32 MiB compressed payload across the entire video, including pending chunks. These do not represent a total browser-memory guarantee.

## Verification

- `npm run test:shadowing`: lesson/part validation, revision handling, RAM state, recorder lifecycle, memory limits, scoped timeline and existing Dictation tests.
- `npm run build`: TypeScript and production bundle.
- `scripts/test-shadowing-browser.mjs`: run against Vite on port 5186, or set `SHADOWING_TEST_URL`. Requires Playwright and installed Chromium. `SHADOWING_PLAYWRIGHT_MODULE` and `SHADOWING_CHROMIUM_EXECUTABLE` may point to existing installations without adding application dependencies.
- `scripts/test-shadowing-seek-browser.mjs`: the actual playground hook with delayed SDK responses and the reported 54.846–58.100 / 58.183–59.142 ranges. Covers cached end times, exact boundaries, repeated playback, rapid sentence changes and buffering. Before the fix it paused at cached time 59.125, then landed at 58.183 already paused. Run with the same Playwright environment variables and `SHADOWING_TEST_URL` (default port 5187).
- `scripts/test-shadowing-youtube-seek.mjs`: optional network test against the real YouTube SDK on its official embeddable demo. Only the transcript is mocked. Confirms seek, full end boundaries and replay; `SHADOWING_VIDEO_ID` can select another embeddable video. This does not test phonetic alignment of the reported video's captions.

The former screen (`229f67f`) scheduled pause using a wall-clock duration; the newer hook polled the SDK clock but accepted any position inside the target sentence as seek confirmation. That introduced a race when a cached timestamp was still near the target sentence's end. The fix retains media-clock end checks and adds start confirmation. Unit tests also cover looping, supported playback speeds, timeout and playback ownership.

Browser tests use BE and YouTube fixtures, with real Chromium `MediaRecorder` and a synthetic microphone. They cover multiple parts, retry/backend errors, pause/resume, timing invalidation, mic cleanup when scrolling away, route cleanup, Dictation, mobile layout and absence of uploads. YouTube SDK playback/seek/auto-pause were additionally checked against its official demo video. Safari/iPhone hardware behavior is not yet verified.


Workspace/browser checks: `scripts/test-practice-workspace.mjs` uses the same `SHADOWING_TEST_URL`, `SHADOWING_PLAYWRIGHT_MODULE` and `SHADOWING_CHROMIUM_EXECUTABLE` overrides. It covers the empty entry, source preferences, validated start, settings, Paper/Dark, mobile video collapse, editor cancellation, Dictation compatibility and layout at 320/375/768/1440px. API fixture routing follows `/api/**` and does not depend on a fixed backend port.


Live practice checks: `scripts/test-practice-live.mjs` requires the backend running at the configured API origin and internet access. It uses the real YouTube SDK, media and transcript endpoint, with Chromium synthetic microphone input only. It runs at 1440/375px, tests Start practice, adjacent/repeated sentence boundaries, Dictation exact matching, automatic recording completion, native take playback, take preservation across modes, part/full replay, pause/resume and microphone cleanup. The default official YouTube demo (`M7lc1UVf-VE`) uses SENTENCE grouping (235 sentences) to stay within the existing 300-sentence limit; `SHADOWING_VIDEO_ID` can choose another embeddable video. It does not measure pronunciation or prove source-caption/audio alignment. Screenshots are under ignored `docs/ai_log/practice-live/`.

`scripts/test-player-recovery-browser.mjs` uses deterministic API/player fixtures to reproduce YouTube error/autoplay-blocked events. Failed players disable practice playback/recording; a successful manual Play clears the error and restores readiness. This complements the live media check. Both scripts accept the existing Playwright/Chromium path and server URL environment overrides.
