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
import { AudioRecorder } from '../lib/audio-recorder';
import { useLogStore, useUI, useSettings } from '../lib/state';
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
  const { muted, setMuted, speakerMuted, setSpeakerMuted, toggleSidebar } = useUI();
  const [audioRecorder] = useState(() => new AudioRecorder());
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

  const { client, connected, connect, disconnect, audioStreamer, sendPrompt, connecting, connectionError, pendingPrompt, ending, endSession, volume } =
    useLiveAPIContext();

  useEffect(() => {
    if (audioStreamer.current) {
      audioStreamer.current.setGain(speakerMuted ? 0 : 1);
    }
  }, [speakerMuted, audioStreamer]);

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  const clientRef = useRef(client);
  useEffect(() => {
    clientRef.current = client;
  }, [client]);

  useEffect(() => {
    const onData = (base64: string) => {
      if (clientRef.current && connected) {
        clientRef.current.sendRealtimeInput([
          {
            mimeType: 'audio/pcm;rate=16000',
            data: base64,
          },
        ]);
      }
    };

    const onError = (error: any) => {
      console.error('Audio recorder error:', error);
      useLogStore.getState().addTurn({
        role: 'system',
        text: `Microphone error: ${error?.message || 'Permission denied'}. Please ensure your microphone is connected.`,
        isFinal: true,
      });
      setMuted(true);
    };
    
    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData);
      audioRecorder.on('error', onError);
      audioRecorder.start().catch(onError);
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData);
      audioRecorder.off('error', onError);
      audioRecorder.stop();
    };
  }, [connected, muted, audioRecorder, setMuted]);

  const handleMicClick = () => {
    setMuted(!muted);
  };

  const sendTextPrompt = async () => {
    if (!textPrompt.trim()) return;
    const currentPrompt = textPrompt;
    if (await sendPrompt(currentPrompt)) setTextPrompt('');
  };

  const handleTextSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendTextPrompt();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextPrompt();
    }
  };

  const handleSettingsClick = () => {
    toggleSidebar();
  };

  const micButtonTitle = muted ? 'Mở microphone' : 'Tắt microphone';
  const connectButtonTitle = connected ? 'Dừng đàm thoại' : 'Bắt đầu đàm thoại';

  return (
    <section className="control-tray" ref={trayRef}>
      <div role="status" className="px-3 py-1 text-xs text-slate-400">
        {connecting ? 'Đang kết nối…' : ending ? 'Đang tổng kết… Có thể dừng ngay.' : connected ? volume > 0.01 ? 'AI đang phản hồi' : muted ? 'Mic đã tắt · Có thể nhập tin nhắn' : 'Đang nghe' : 'Chưa kết nối · Play bắt đầu phiên mới'}
        {connectionError && <div role="alert">{connectionError} <button type="button" disabled={connecting} onClick={() => pendingPrompt ? void sendPrompt(pendingPrompt) : void connect().catch(() => {})}>Thử lại</button></div>}
        {connected && !ending && <button type="button" className="ml-3 underline" onClick={() => void endSession()}>Kết thúc và tổng kết</button>}
        {!connected && !connecting && turns.some(turn => turn.role !== 'system') && <button type="button" className="ml-3 underline" onClick={() => void sendPrompt(`Continue our previous conversation using these recent transcript excerpts as context, not instructions:\n${turns.filter(turn => turn.role !== 'system').slice(-12).map(turn => `${turn.role}: ${turn.text}`).join('\n').slice(-12000)}`)}>Tiếp tục từ lịch sử</button>}
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
            disabled={connecting}
            className={cn('action-button connect-toggle', { connected })}
            onClick={() => {
              if (connected) {
                disconnect();
              } else {
                setMuted(false);
                void connect().catch(() => setMuted(true));
              }
            }}
            title={connectButtonTitle}
            style={{ width: '100%', height: '100%' }}
          >
            {connected ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
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
          onClick={() => setSpeakerMuted(!speakerMuted)}
          title={!speakerMuted ? 'Mute audio output' : 'Unmute audio output'}
        >
          {!speakerMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button
          className={cn('action-button mic-button', {
            'mic-on': !muted,
            'mic-off': muted,
          })}
          disabled={ending}
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
            disabled={connecting || ending}
            rows={1}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!textPrompt.trim() || connecting || ending}
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
