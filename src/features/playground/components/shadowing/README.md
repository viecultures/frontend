# Playground video shadowing

Start Vite with `npm run dev`, open `/playground`, paste a YouTube URL and request the transcript from the existing `http://localhost:8080/api/v1/ytb-transcript` endpoint. The video must allow embedding. No hard-coded demo video is requested on mount.

## Workflow

1. Review the BE draft: edit text and start/end in seconds, preview a sentence, add/split/merge/remove sentences.
2. Mark sentences that begin a new content part and name each part. Apply when timing is valid. New BE requests are disabled while a draft is open, so edits cannot be overwritten accidentally. Transcript JSON export contains no user recordings.
3. Record sentences at 1x with the video muted as a visual cue. One committed compressed Blob is retained per sentence. A retry only replaces it after successful completion.
4. Listen to a part or the entire video with separate original-video and voice volumes. Part playback stops at its boundary; whole-video playback continues across parts.

All timestamps are absolute on the source video. Part boundaries are derived from the first sentence in each part, with the first part starting at zero and the last extending to video duration. Part regrouping does not invalidate otherwise unchanged takes.

## Ownership and lifecycle

- `useShadowingSession` owns the lesson and take map for the whole video, outside the components for selected parts and modes. Switching parts or switching Dictation/Shadowing preserves committed takes.
- Text edits mark affected takes for review; timing edits require re-recording. Unaffected takes remain valid.
- `SentenceRecorder` owns microphone tracks, chunks and recorder callbacks. Generation guards discard callbacks after cancellation. Buffering, manual seek or leaving the active screen cancels an unfinished take without replacing an older take.
- `useSamplePlayback` controls only playback it started. It cannot pause a recorder/replay during cleanup.
- `useShadowingReplay` uses the YouTube clock, pauses audio during buffering, handles seeks and ignores intentionally aborted `play()` promises. Audio URLs are owned by playback components and revoked when no longer needed.
- Audio is never uploaded, stored in localStorage/IndexedDB or evaluated by a shadowing scoring endpoint. Reloading/leaving the route loses the session. Existing Dictation word evaluation remains available.
- Limits: 60 seconds and 4 MiB per take; 32 MiB compressed payload across the entire video, including pending chunks. These do not represent a total browser-memory guarantee.

## Verification

- `npm run test:shadowing`: lesson/part validation, revision handling, RAM state, recorder lifecycle, memory limits, scoped timeline and existing Dictation tests.
- `npm run build`: TypeScript and production bundle.
- `scripts/test-shadowing-browser.mjs`: run against Vite on port 5186, or set `SHADOWING_TEST_URL`. Requires Playwright and installed Chromium. `SHADOWING_PLAYWRIGHT_MODULE` and `SHADOWING_CHROMIUM_EXECUTABLE` may point to existing installations without adding application dependencies.

Browser tests use BE and YouTube fixtures, with real Chromium `MediaRecorder` and a synthetic microphone. They cover multiple parts, retry/backend errors, pause/resume, timing invalidation, mic cleanup when scrolling away, route cleanup, Dictation, mobile layout and absence of uploads. YouTube SDK playback/seek/auto-pause were additionally checked against its official demo video. Safari/iPhone hardware behavior is not yet verified.
