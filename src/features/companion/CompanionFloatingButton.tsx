import React from 'react';

interface CompanionFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const ghibliKeyframes = `
@keyframes vc-spirit-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@keyframes vc-spirit-blink { 0%,92%,100% { transform: scaleY(1) } 95% { transform: scaleY(0.1) } }
@keyframes vc-cloud-drift { 0%,100% { transform: translateX(0) } 50% { transform: translateX(4px) } }
@keyframes vc-sparkle { 0%,100% { opacity: 0; transform: scale(0.4) } 50% { opacity: 1; transform: scale(1) } }
@keyframes vc-leaf-sway { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(10deg) } }
.vc-spirit-bob { animation: vc-spirit-bob 3.6s ease-in-out infinite; }
.vc-spirit-eye { transform-origin: center; transform-box: fill-box; animation: vc-spirit-blink 4.5s infinite; }
.vc-cloud-drift { animation: vc-cloud-drift 6s ease-in-out infinite; }
.vc-sparkle { transform-origin: center; transform-box: fill-box; animation: vc-sparkle 2.8s ease-in-out infinite; }
.vc-leaf { transform-origin: bottom center; transform-box: fill-box; animation: vc-leaf-sway 2.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .vc-spirit-bob, .vc-spirit-eye, .vc-cloud-drift, .vc-sparkle, .vc-leaf { animation: none; }
}
`;

/** Little forest spirit (kodama-like) drawn as an inline illustration. */
const ForestSpirit: React.FC = () => (
  <svg viewBox="0 0 64 64" className="h-14 w-14 drop-shadow-[0_4px_6px_rgba(60,80,50,0.35)]" aria-hidden="true">
    <defs>
      <radialGradient id="vc-spirit-body" cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#eef3e2" />
        <stop offset="100%" stopColor="#cfdcb8" />
      </radialGradient>
    </defs>
    <g className="vc-leaf">
      <path d="M32 12 C30 6 33 2 38 1 C38 6 36 10 32 12 Z" fill="#7fae5b" stroke="#4f7a3a" strokeWidth="1" />
      <path d="M33 11 L36 4" stroke="#4f7a3a" strokeWidth="0.8" strokeLinecap="round" />
    </g>
    <path
      d="M32 11 C47 11 54 22 54 36 C54 50 45 58 32 58 C19 58 10 50 10 36 C10 22 17 11 32 11 Z"
      fill="url(#vc-spirit-body)"
      stroke="#6b7f57"
      strokeWidth="1.4"
    />
    <ellipse cx="22" cy="41" rx="4" ry="2.4" fill="#f5b9a6" opacity="0.7" />
    <ellipse cx="42" cy="41" rx="4" ry="2.4" fill="#f5b9a6" opacity="0.7" />
    <ellipse className="vc-spirit-eye" cx="25" cy="34" rx="3" ry="4" fill="#2f3a2a" />
    <ellipse className="vc-spirit-eye" cx="39" cy="34" rx="3" ry="4" fill="#2f3a2a" />
    <circle cx="26" cy="32.5" r="1" fill="#ffffff" />
    <circle cx="40" cy="32.5" r="1" fill="#ffffff" />
    <path d="M29 43 Q32 46 35 43" fill="none" stroke="#2f3a2a" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const CompanionFloatingButton: React.FC<CompanionFloatingButtonProps> = ({
  onClick,
  isOpen,
}) => {
  if (isOpen) {
    return null;
  }

  return (
    <>
      <style>{ghibliKeyframes}</style>
      <button
        type="button"
        onClick={onClick}
        aria-label="Open Cultural AI Companion"
        className="group fixed bottom-6 right-6 z-40 flex items-end gap-1 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-4 rounded-3xl"
      >
        <span className="vc-cloud-drift relative mb-3 hidden sm:block">
          <span className="relative block rounded-[22px] border-2 border-[#8a9a6f] bg-[#fffaf0] px-4 py-2 shadow-[0_6px_0_-1px_#c9d6b0,0_12px_24px_-10px_rgba(70,90,60,0.45)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <span className="block font-serif text-[15px] font-bold italic leading-tight text-[#3e5a3a]">
              AI Companion
            </span>
            <span className="block text-[11px] leading-tight text-[#7a8a66]">Hỏi mình về văn hóa nhé</span>
            <span
              aria-hidden="true"
              className="absolute -right-[7px] bottom-3 h-3 w-3 rotate-45 border-r-2 border-t-2 border-[#8a9a6f] bg-[#fffaf0]"
            />
          </span>
        </span>

        <span className="vc-spirit-bob relative flex h-[72px] w-[72px] items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-[#3e5a3a]/20 blur-[3px]"
          />
          <span className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-[#8a9a6f] bg-gradient-to-b from-[#bfe3f0] via-[#e4f2df] to-[#b9d79a] shadow-[inset_0_-6px_0_rgba(90,130,70,0.25)] transition-transform duration-300 group-hover:scale-105">
            <ForestSpirit />
          </span>
          <svg viewBox="0 0 10 10" className="vc-sparkle absolute -left-1 top-1 h-3 w-3" aria-hidden="true">
            <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#f6d77a" />
          </svg>
          <svg
            viewBox="0 0 10 10"
            className="vc-sparkle absolute -right-0.5 top-0 h-2 w-2 [animation-delay:1.3s]"
            aria-hidden="true"
          >
            <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#ffffff" />
          </svg>
        </span>
      </button>
    </>
  );
};
