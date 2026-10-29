/**
 * Shared Ghibli-inspired palette and keyframes for the AI Companion feature.
 * Injected once via <CompanionThemeStyles /> to avoid duplicated <style> tags.
 */
export const companionPalette = {
  paper: '#fffaf0',
  paperDeep: '#f6efdc',
  moss: '#8a9a6f',
  mossDark: '#3e5a3a',
  mossMuted: '#7a8a66',
  leaf: '#7fae5b',
  sky: '#bfe3f0',
  meadow: '#b9d79a',
  sun: '#f6d77a',
} as const;

export const companionKeyframes = `
@keyframes vc-spirit-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@keyframes vc-spirit-blink { 0%,92%,100% { transform: scaleY(1) } 95% { transform: scaleY(0.1) } }
@keyframes vc-cloud-drift { 0%,100% { transform: translateX(0) } 50% { transform: translateX(4px) } }
@keyframes vc-cloud-slide { 0% { transform: translateX(-30%) } 100% { transform: translateX(130%) } }
@keyframes vc-leaf-sway { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(10deg) } }
@keyframes vc-window-pop {
  0% { opacity: 0; transform: translateY(16px) scale(0.86) }
  60% { opacity: 1; transform: translateY(-3px) scale(1.01) }
  100% { opacity: 1; transform: translateY(0) scale(1) }
}
@keyframes vc-menu-in { 0% { opacity: 0; transform: translateY(-4px) scale(0.97) } 100% { opacity: 1; transform: none } }
@keyframes vc-msg-in { 0% { opacity: 0; transform: translateY(6px) } 100% { opacity: 1; transform: none } }
@keyframes vc-dot-hop { 0%,60%,100% { transform: translateY(0); opacity: .5 } 30% { transform: translateY(-4px); opacity: 1 } }
@keyframes vc-bubble-in {
  0% { opacity: 0; transform: translateX(12px) scale(0.6) }
  60% { opacity: 1; transform: translateX(-2px) scale(1.04) }
  100% { opacity: 1; transform: none }
}
.vc-bubble-in { transform-origin: bottom right; animation: vc-bubble-in .6s cubic-bezier(.2,.9,.3,1.3) .8s both; }
.vc-spirit-bob { animation: vc-spirit-bob 3.6s ease-in-out infinite; }
.vc-spirit-eye { transform-origin: center; transform-box: fill-box; animation: vc-spirit-blink 4.5s infinite; }
.vc-cloud-drift { animation: vc-cloud-drift 6s ease-in-out infinite; }
.vc-cloud-slide { animation: vc-cloud-slide 28s linear infinite; }
.vc-leaf { transform-origin: bottom center; transform-box: fill-box; animation: vc-leaf-sway 2.6s ease-in-out infinite; }
.vc-window-pop { transform-origin: bottom right; animation: vc-window-pop .42s cubic-bezier(.2,.9,.3,1.2) both; }
.vc-menu-in { transform-origin: top right; animation: vc-menu-in .16s ease-out both; }
.vc-msg-in { animation: vc-msg-in .28s ease-out both; }
.vc-dot-hop { animation: vc-dot-hop 1.2s ease-in-out infinite; }
.vc-scroll::-webkit-scrollbar { width: 8px; }
.vc-scroll::-webkit-scrollbar-thumb { background: #d6dcc4; border-radius: 9999px; border: 2px solid #fffaf0; }
@media (prefers-reduced-motion: reduce) {
  .vc-spirit-bob, .vc-spirit-eye, .vc-cloud-drift, .vc-cloud-slide, .vc-leaf,
  .vc-window-pop, .vc-menu-in, .vc-msg-in, .vc-dot-hop, .vc-bubble-in { animation: none; }
}
`;
