import { useEffect, useRef, useState } from 'react';
import type { ShadowingPlayer } from '../types/shadowing';

interface PlayerEvent { target: ShadowingPlayer; data: number }
interface YouTubeAPI {
  Player: new (element: HTMLElement, options: {
    videoId: string; host: string; playerVars: Record<string, string | number>;
    events: { onReady(event: PlayerEvent): void; onStateChange(event: PlayerEvent): void; onError(event: PlayerEvent): void; onAutoplayBlocked(): void };
  }) => ShadowingPlayer;
}
type YouTubeWindow = Window & { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void };
let apiPromise: Promise<YouTubeAPI> | null = null;

function loadYouTubeAPI(): Promise<YouTubeAPI> {
  const host = window as YouTubeWindow;
  if (host.YT?.Player) return Promise.resolve(host.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<YouTubeAPI>((resolve, reject) => {
    const previous = host.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(() => { cleanup(); reject(new Error('YouTube could not load. Check your connection and reload the player.')); }, 20000);
    const ready = () => {
      try { previous?.(); } finally {
        cleanup();
        if (host.YT?.Player) resolve(host.YT); else reject(new Error('The YouTube player is not ready.'));
      }
    };
    function cleanup() {
      window.clearTimeout(timeout);
      if (host.onYouTubeIframeAPIReady === ready) host.onYouTubeIframeAPIReady = previous;
    }
    host.onYouTubeIframeAPIReady = ready;
    let script = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; script.async = true;
      script.onerror = () => { cleanup(); script?.remove(); reject(new Error('Unable to connect to YouTube.')); };
      document.head.appendChild(script);
    }
  }).catch(error => { apiPromise = null; throw error; });
  return apiPromise;
}

export function useYouTubePlayer(videoId: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ShadowingPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState(-1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let instance: ShadowingPlayer | null = null;
    let interval: ReturnType<typeof setInterval> | undefined;
    setReady(false); setState(-1); setTime(0); setDuration(0); setError(null);
    const mount = containerRef.current;
    if (!mount) return;
    if (!videoId) return;
    const node = document.createElement('div'); mount.appendChild(node);
    loadYouTubeAPI().then(api => {
      if (cancelled) return;
      instance = new api.Player(node, {
        videoId, host: 'https://www.youtube-nocookie.com',
        playerVars: { origin: window.location.origin, playsinline: 1, rel: 0 },
        events: {
          onReady: event => {
            if (cancelled) return;
            playerRef.current = event.target; setReady(true); setDuration(event.target.getDuration());
            const iframe = mount.querySelector('iframe');
            if (iframe) { iframe.title = 'Practice video'; iframe.className = 'w-full h-full'; }
          },
          onStateChange: event => { if (!cancelled) {
            setState(event.data); setDuration(event.target.getDuration()); setTime(event.target.getCurrentTime());
            // A successful manual Play recovers from autoplay/network failures.
            if (event.data === 1) { setError(null); setReady(true); }
          } },
          onError: event => { if (!cancelled) {
            setState(-1); setReady(false);
            setError(event.data === 101 || event.data === 150
              ? `This video does not allow embedded playback (YouTube ${event.data}). Choose another video.`
              : `YouTube could not play this video (code ${event.data}). Reload the player or choose another video.`);
          } },
          onAutoplayBlocked: () => { if (!cancelled) { setState(2); setReady(false); setError('Playback was blocked by the browser. Press Play on the video, then try again.'); } },
        },
      });
      interval = setInterval(() => {
        if (cancelled || !playerRef.current) return;
        setTime(playerRef.current.getCurrentTime()); setDuration(playerRef.current.getDuration());
      }, 100);
    }).catch(reason => { if (!cancelled) setError(reason instanceof Error ? reason.message : 'Unable to load the video player.'); });
    return () => {
      cancelled = true; clearInterval(interval); playerRef.current = null;
      instance?.destroy(); node.remove(); mount.replaceChildren();
    };
  }, [videoId, retry]);

  return { containerRef, playerRef, ready, state, time, duration, error, retry: () => setRetry(value => value + 1) };
}
