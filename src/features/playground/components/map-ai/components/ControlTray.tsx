/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import cn from 'classnames';
import React, { memo, useEffect, useRef, useState, type FormEvent, type Ref } from 'react';
import {
  SlidersHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Keyboard,
  Send,
} from 'lucide-react';
import { useLogStore, useUI } from '../lib/state';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export type ControlTrayProps = {
  trayRef?: Ref<HTMLElement>;
};

export function ControlTray({ trayRef }: ControlTrayProps) {
  const { speakerMuted, toggleSidebar } = useUI();
  const [textPrompt, setTextPrompt] = useState('');
  const handoffRevision = useReaderHandoff(state => state.draftRevision);
  const connectButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px), (orientation: landscape) and (max-height: 768px)');
  const [isTextEntryVisible, setIsTextEntryVisible] = useState(false);
  useEffect(() => {
    const { draft, draftMode } = useReaderHandoff.getState();
    if (draft) {
      setTextPrompt(current => draftMode === 'append' && current.trim()
        ? `${current.trimEnd()} ${draft}`
        : draft);
      setIsTextEntryVisible(true);
      useReaderHandoff.getState().consumeDraft(handoffRevision);
    }
  }, [handoffRevision]);
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 768px)');
  const turns = useLogStore(state => state.turns);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 48), 144)}px`;
      textarea.style.overflowY = textarea.scrollHeight > 144 ? 'auto' : 'hidden';
    }
  }, [textPrompt]);

  const {
    activeView, connected, connecting, ending, connectionError, pendingPrompt, isSending,
    isRestoringContext, isAwaitingResponse, isPlaying, recording, inputVolume,
    startConversation, resumeConversation, sendMessage, stopConversation,
    endConversation, setMicrophoneEnabled, setSpeakerMuted, retry,
  } = useLiveAPIContext();
  const active = activeView === 'chat';
  const busy = connecting || ending || isSending || isRestoringContext;
  const muted = !recording;
  const hasHistory = turns.some(turn => turn.role !== 'system');
  const handleMicClick = () => {
    if (active && !busy) void setMicrophoneEnabled(!recording);
  };

  const sendTextPrompt = async () => {
    if (!active || busy || !textPrompt.trim()) return;
    const currentPrompt = textPrompt;
    const result = await sendMessage({ text: currentPrompt, source: 'composer' });
    if (result.status === 'ok') setTextPrompt(value => value === currentPrompt ? '' : value);
  };

  const handleRetry = async () => {
    if (!active || busy) return;
    const retriedPrompt = pendingPrompt;
    const result = await retry();
    if (result.status === 'ok' && retriedPrompt) {
      setTextPrompt(value => value.trim() === retriedPrompt.trim() ? '' : value);
    }
  };

  const handleTextSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendTextPrompt();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (active && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendTextPrompt();
    }
  };

  const handleSettingsClick = () => {
    toggleSidebar();
  };

  const micButtonTitle = muted ? 'Turn microphone on' : 'Turn microphone off';
  const connectButtonTitle = connected || connecting || ending ? 'Pause conversation' : hasHistory ? 'Resume conversation' : 'Start speaking';

  if (!active) return null;

  return (
    <section className="control-tray" ref={trayRef}>
      <div role="status" className="px-3 py-1 text-xs text-slate-400">
        {connecting ? 'Connecting…' : ending ? 'Wrapping up… You can stop now.' : isRestoringContext ? 'Restoring context…' : isPlaying ? 'AI is speaking' : isAwaitingResponse || isSending ? 'Waiting for a reply…' : connected ? recording ? 'Listening' : 'Mic off · You can type a message' : hasHistory ? 'Paused · Press Play to resume' : 'Ready when you are · Press Play to speak'}
        {recording && <meter className="ml-2 w-16" min={0} max={1} value={inputVolume} aria-label="Âm lượng microphone" />}
        {connectionError && <div role="alert">{connectionError} <button type="button" disabled={busy} onClick={() => void handleRetry()}>Retry</button></div>}
        {connected && !busy && <button type="button" className="ml-3 underline" onClick={() => void endConversation()}>Finish and recap</button>}
        {!connected && !busy && hasHistory && <button type="button" className="ml-3 underline" onClick={() => void resumeConversation({ input: 'text' })}>Resume conversation</button>}
      </div>
      <nav className={cn('actions-nav', { 'text-entry-visible-landscape': isLandscape && isTextEntryVisible })}>
        <button
          className={cn('action-button')}
          onClick={handleSettingsClick}
          title="Speaking settings"
          aria-label="Settings"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
        <div className="connect-button-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            ref={connectButtonRef}
            className={cn('action-button connect-toggle', { connected })}
            onClick={() => {
              if (!active) return;
              if (connected || connecting || ending) stopConversation();
              else if (hasHistory) void resumeConversation({ input: 'voice' });
              else void startConversation({ input: 'voice' });
            }}
            title={connectButtonTitle}
            aria-label={connectButtonTitle}
            style={{ width: '100%', height: '100%' }}
          >
            {connected || connecting || ending ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>

        </div>
        <button
          type="button"
          aria-label={
            !speakerMuted ? 'Audio output on' : 'Audio output off'
          }
          className={cn('action-button', {
            'speaker-on': !speakerMuted,
            'speaker-off': speakerMuted,
          })}
          onClick={() => void setSpeakerMuted(!speakerMuted)}
          title={!speakerMuted ? 'Mute audio output' : 'Unmute audio output'}
        >
          {!speakerMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button
          className={cn('action-button mic-button', {
            'mic-on': !muted,
            'mic-off': muted,
          })}
          disabled={busy || !connected}
          onClick={handleMicClick}
          title={micButtonTitle}
          aria-label={micButtonTitle}
        >
          {!muted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button
          className={cn('action-button keyboard-toggle-button')}
          onClick={() => setIsTextEntryVisible(!isTextEntryVisible)}
          title="Toggle text input"
          aria-label="Toggle text input"
          aria-expanded={isTextEntryVisible}
        >
          <Keyboard className="w-5 h-5" />
        </button>
      </nav>

      {(!isMobile || isTextEntryVisible) && (
        <form className="prompt-form" onSubmit={handleTextSubmit}>
          <textarea
            ref={textareaRef}
            className="prompt-input"
            placeholder={
              connected ? 'Type a message…' : 'Type a message to begin…'
            }
            value={textPrompt}
            onChange={e => setTextPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Text prompt"
            disabled={busy}
            rows={1}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!textPrompt.trim() || busy}
            aria-label="Send message"
            title={
              !connected
                ? 'Connect and send'
                : !textPrompt.trim()
                ? 'Type a message to send'
                : 'Send message'
            }
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </section>
  );
}

export default memo(ControlTray);
