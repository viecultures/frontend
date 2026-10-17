import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Mascot } from 'page-mascot';
import { Sparkles, Star } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import './owl-mascot.css';

export type OwlState = 'idle' | 'talking' | 'celebrating' | 'sleeping';

interface OwlMascotProps {
  state: OwlState;
  size?: number;
  reducedMotion?: boolean;
  active?: boolean;
  onWake: () => void;
}

const DIRECTIONS = `${import.meta.env.BASE_URL}mascots/owl-directions.webp`;
const REACTIONS = `${import.meta.env.BASE_URL}mascots/owl-reactions.webp`;
// Reuse the original atlas cells; null means the neutral, closed-beak direction.
const TALK_FRAMES = [null, 3, null, 3, 8, null, null, 3] as const;
const CELEBRATION_FRAMES = [8, 8, 2, 2, 1, 1, 8, 8] as const;

function spriteStyle(index: number, reactions: boolean): CSSProperties {
  return {
    backgroundImage: `url("${reactions ? REACTIONS : DIRECTIONS}")`,
    backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`,
  };
}

export function OwlMascot({ state, size = 280, reducedMotion = false, active = true, onWake }: OwlMascotProps) {
  const systemReducedMotion = useReducedMotion();
  const motionReduced = reducedMotion || Boolean(systemReducedMotion);
  const [frame, setFrame] = useState(0);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    setFrame(0);
    if (!active || motionReduced || (state !== 'talking' && state !== 'celebrating')) return;
    const timer = window.setInterval(() => setFrame(value => value + 1), state === 'talking' ? 185 : 400);
    return () => window.clearInterval(timer);
  }, [state, motionReduced, active]);

  useEffect(() => {
    setBlinking(false);
    if (!active || state !== 'idle' || motionReduced) return;
    let blinkEnd: number | undefined;
    const timer = window.setInterval(() => {
      setBlinking(true);
      blinkEnd = window.setTimeout(() => setBlinking(false), 145);
    }, 4200);
    return () => { window.clearInterval(timer); window.clearTimeout(blinkEnd); };
  }, [state, motionReduced, active]);

  const reaction = state === 'sleeping' ? 6
    : state === 'celebrating' ? CELEBRATION_FRAMES[frame % CELEBRATION_FRAMES.length]
    : state === 'talking' ? TALK_FRAMES[frame % TALK_FRAMES.length] : null;

  return (
    <div className="owl-mascot" data-state={state} data-reduced={motionReduced} data-paused={!active} style={{ width: size, height: size }}>
      <div className="owl-mascot__body">
        {active && state === 'idle' && !motionReduced ? (
          <div className="owl-mascot__idle" data-blinking={blinking}>
            <Mascot directions={DIRECTIONS} reactions={REACTIONS} size={size} label="cú mèo — chạm để chớp mắt" />
            {blinking && <span aria-hidden="true" className="owl-mascot__sprite owl-mascot__blink" style={spriteStyle(0, true)} />}
          </div>
        ) : (
          <button
            type="button"
            className="owl-mascot__pose"
            aria-label={state === 'sleeping' ? 'Đánh thức cú mèo' : 'Chạm vào cú mèo'}
            onClick={onWake}
          >
            <span aria-hidden="true" className="owl-mascot__sprite" style={spriteStyle(reaction ?? 4, reaction !== null)} />
          </button>
        )}
      </div>
      {state === 'celebrating' && <div className="owl-mascot__sparkles" aria-hidden="true">
        <Sparkles /><Star /><Sparkles /><Star />
      </div>}
      {state === 'talking' && <div className="owl-mascot__voice" aria-hidden="true">
        {[0, 1, 2, 3, 4].map(index => <span key={index} style={{ animationDelay: `${index * 110}ms` }} />)}
      </div>}
    </div>
  );
}
