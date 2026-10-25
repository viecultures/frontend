# VieCultures Frontend Design Notes

## AI Companion (Ghibli-inspired)

Location: `src/features/companion/`

| File | Role |
| --- | --- |
| `companionTheme.ts` | Palette + shared keyframes (`vc-*` classes), honors `prefers-reduced-motion` |
| `ForestSpirit.tsx` | Kodama-like SVG mascot (blinks, leaf sways) |
| `CompanionFloatingButton.tsx` | Launcher. Closed: spirit + cloud speech bubble. Open: compact spirit circle that collapses the window |
| `CompanionChatDrawer.tsx` | Chat window container + chat logic |
| `CompanionChatHeader.tsx` | Painted sky/meadow header, language badge, 3-dot menu, X close |
| `CompanionSettingsMenu.tsx` | Reply language radio (en / vi / bilingual), reset size, inline-confirm clear history, daily turns |
| `CompanionMessageBubble.tsx` | Message bubble, markdown sanitize, hover "Translate" (direction auto-detected from Vietnamese diacritics) |
| `useResizableWindow.ts` | Top-left grip resize, clamp, persisted in localStorage |

### Rules
- Palette: paper `#fffaf0`, moss border `#8a9a6f`, moss text `#3e5a3a`, leaf action `#5d8a45`, sky `#bfe3f0`, meadow `#b9d79a`.
- Soft "paper" depth: offset solid shadow `0 Npx 0 -1px #c9d6b0` instead of heavy blur.
- Window: anchored `right-6 bottom-[108px]` above the launcher. Default 380x560, min 320x420, max 90vw x 85vh. Double-click grip resets.
- Mobile (<640px): full screen, no resize; translate action always visible.
- UI copy: English only.
- localStorage keys: `vc-companion-window-size`, `vc-companion-language`.
