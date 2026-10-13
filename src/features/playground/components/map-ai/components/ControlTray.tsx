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
  Sparkles,
} from 'lucide-react';
import { useLogStore, useUI } from '../lib/state';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';

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
  const connectButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px), (orientation: landscape) and (max-height: 768px)');
  const [isTextEntryVisible, setIsTextEntryVisible] = useState(false);
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 768px)');
  const turns = useLogStore(state => state.turns);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      if (!textPrompt) {
        textarea.style.height = '20px';
      } else {
        textarea.style.height = '20px';
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = `${Math.min(scrollHeight, 120)}px`;
      }
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

  const micButtonTitle = muted ? 'Mở microphone' : 'Tắt microphone';
  const connectButtonTitle = connected || connecting || ending ? 'Dừng đàm thoại' : hasHistory ? 'Tiếp tục đàm thoại' : 'Bắt đầu đàm thoại';

  if (!active) return null;

  return (
    <section className="control-tray" ref={trayRef}>
      <div role="status" className="px-3 py-1 text-xs text-slate-400">
        {connecting ? 'Đang kết nối…' : ending ? 'Đang tổng kết… Có thể dừng ngay.' : isRestoringContext ? 'Đang khôi phục ngữ cảnh…' : isPlaying ? 'AI đang nói' : isAwaitingResponse || isSending ? 'Đang chờ AI phản hồi…' : connected ? recording ? 'Đang nghe' : 'Mic đã tắt · Có thể nhập tin nhắn' : hasHistory ? 'Chưa kết nối · Play để tiếp tục' : 'Chưa kết nối · Play bắt đầu phiên mới'}
        {recording && <meter className="ml-2 w-16" min={0} max={1} value={inputVolume} aria-label="Âm lượng microphone" />}
        {connectionError && <div role="alert">{connectionError} <button type="button" disabled={busy} onClick={() => void handleRetry()}>Thử lại</button></div>}
        {connected && !busy && <button type="button" className="ml-3 underline" onClick={() => void endConversation()}>Kết thúc và tổng kết</button>}
        {!connected && !busy && hasHistory && <button type="button" className="ml-3 underline" onClick={() => void resumeConversation({ input: 'text' })}>Tiếp tục từ lịch sử</button>}
      </div>
      <nav className={cn('actions-nav', { 'text-entry-visible-landscape': isLandscape && isTextEntryVisible })}>
        <button
          className={cn('action-button')}
          onClick={handleSettingsClick}
          title="Cài đặt buổi học"
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
          {!connected && turns.length === 0 && (
            <div
              className="start-here-bubble animate-bounce flex items-center gap-1.5"
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '-12px',
                marginBottom: '20px',
                background: '#1E4B43',
                color: '#D4AF37',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                boxShadow: '0 6px 16px rgba(30, 75, 67, 0.5)',
                pointerEvents: 'none',
                zIndex: 1000,
              }}
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Bắt đầu luyện nói tại đây</span>
            </div>
          )}
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
        >
          {!muted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button
          className={cn('action-button keyboard-toggle-button')}
          onClick={() => setIsTextEntryVisible(!isTextEntryVisible)}
          title="Toggle text input"
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
              connected ? 'Nhập tin nhắn đàm thoại...' : 'Nhập câu hỏi để bắt đầu bằng bàn phím...'
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
                ? 'Kết nối và gửi câu hỏi'
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
