/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import cn from 'classnames';
import React, { memo, useCallback, useEffect, useRef, useState, type FormEvent, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SlidersHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  Loader2,
  Keyboard,
  Send,
  ImagePlus,
  RotateCcw,
} from 'lucide-react';
import { AI_SPEAKING_PACES, useLogStore, useUI, useSettings } from '../lib/state';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';
import { useImagePreviewStore } from '../lib/image-previews';
import { TwoPassVoiceDetector } from '../lib/two-pass-vad';
import { twoPassSttService, type TwoPassSttData } from '../services/twoPassSttService';
import type { TwoPassVisualizerState } from './TwoPassSpeechVisualizer';

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
  const { t, i18n } = useTranslation('playground');
  const { speakerMuted, toggleSidebar, isSidebarOpen } = useUI();
  const voiceInteractionMode = useSettings(state => state.voiceInteractionMode);
  const tutorMode = useSettings(state => state.tutorMode);
  const aiSpeakingPace = useSettings(state => state.aiSpeakingPace);
  const setAiSpeakingPace = useSettings(state => state.setAiSpeakingPace);
  const pushToTalk = voiceInteractionMode === 'push-to-talk';
  const heldKey = useRef(false);
  const [textPrompt, setTextPrompt] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageStatus, setImageStatus] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  useEffect(() => setImageStatus(null), [tutorMode]);
  const handoffRevision = useReaderHandoff(state => state.draftRevision);
  const connectButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px), (orientation: landscape) and (max-height: 768px)');
  const [isTextEntryVisible, setIsTextEntryVisible] = useState(false);

  // Smart Two-Pass STT states
  const vadDetectorRef = useRef<TwoPassVoiceDetector | null>(null);
  const [twoPassActive, setTwoPassActive] = useState(false);
  const [twoPassState, setTwoPassState] = useState<TwoPassVisualizerState>('idle');
  const [twoPassVolume, setTwoPassVolume] = useState(0);
  const [twoPassError, setTwoPassError] = useState<string | undefined>(undefined);
  const [twoPassResult, setTwoPassResult] = useState<TwoPassSttData | null>(null);
  const [smartCleanup, setSmartCleanup] = useState<boolean>(true);
  const smartCleanupRef = useRef(smartCleanup);
  smartCleanupRef.current = smartCleanup;

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
    startConversation, resumeConversation, sendMessage, sendImage, stopConversation, resetConversation,
    endConversation, setMicrophoneEnabled, setSpeakerMuted, retry,
    pressPushToTalk, releasePushToTalk,
  } = useLiveAPIContext();
  const active = activeView === 'chat';
  const busy = connecting || ending || isSending || isRestoringContext;
  const speakingPaceLocked = connected || busy;
  const speakingPaceLabel = t(`playground.tray_controls.speaking_pace_${aiSpeakingPace}`);
  const speakingPaceTitle = t(speakingPaceLocked
    ? 'playground.tray_controls.speaking_pace_locked'
    : 'playground.tray_controls.speaking_pace_title', { pace: speakingPaceLabel });
  const muted = !recording;
  const hasHistory = turns.some(turn => turn.role !== 'system');

  useEffect(() => {
    if (imageStatus?.kind !== 'success') return;
    const timer = window.setTimeout(() => setImageStatus(current => current === imageStatus ? null : current), 4000);
    return () => window.clearTimeout(timer);
  }, [imageStatus]);

  const stopTwoPassVad = useCallback(() => {
    if (vadDetectorRef.current) {
      vadDetectorRef.current.stop(false);
    }
    setTwoPassVolume(0);
  }, []);

  const handleStopTwoPassRecording = useCallback(() => {
    if (vadDetectorRef.current) {
      vadDetectorRef.current.stop(true);
    }
    setTwoPassVolume(0);
  }, []);

  const startTwoPassVad = useCallback(async () => {
    setTwoPassError(undefined);
    setTwoPassState('listening');
    setTwoPassActive(true);
    setIsTextEntryVisible(true);

    const callbacks = {
      onSpeechStart: () => {
        setTwoPassState('listening');
      },
      onVolumeChange: (vol: number) => {
        setTwoPassVolume(vol);
      },
      onSpeechEnd: async (wavBlob: Blob) => {
        setTwoPassState('refining');
        setTwoPassVolume(0);

        try {
          const res = await twoPassSttService.transcribeTwoPass(wavBlob, {
            language: i18n.language || 'vi',
            promptContext: 'Vietnam culture, geography and travel companion',
            smartCleanup: smartCleanupRef.current,
          });

          if (res.success && res.data) {
            if (!res.data.cleanedText.trim()) {
              setTwoPassState('idle');
              setTwoPassActive(false);
            } else {
              setTwoPassResult(res.data);
              setTextPrompt(res.data.cleanedText);
              setIsTextEntryVisible(true);
              setTwoPassState('idle');
              setTwoPassActive(false);
            }
          } else {
            setTwoPassState('idle');
            setTwoPassActive(false);
            setTwoPassError(res.message || t('playground.two_pass_stt.state_error_desc'));
          }
        } catch (err) {
          setTwoPassState('idle');
          setTwoPassActive(false);
          setTwoPassError(err instanceof Error ? err.message : String(err));
        }
      },
      onError: (err: Error) => {
        setTwoPassState('idle');
        setTwoPassActive(false);
        setTwoPassError(err.message);
      },
    };

    if (!vadDetectorRef.current) {
      vadDetectorRef.current = new TwoPassVoiceDetector(callbacks, {
        silenceThresholdMs: 800,
      });
    } else {
      vadDetectorRef.current.setCallbacks(callbacks);
    }

    try {
      await vadDetectorRef.current.start();
    } catch (err) {
      setTwoPassState('idle');
      setTwoPassActive(false);
      setTwoPassError(err instanceof Error ? err.message : String(err));
    }
  }, [i18n.language, t]);

  useEffect(() => {
    return () => {
      if (vadDetectorRef.current) {
        vadDetectorRef.current.dispose();
        vadDetectorRef.current = null;
      }
    };
  }, []);

  const handleToggleTwoPass = () => {
    if (twoPassState === 'listening') {
      handleStopTwoPassRecording();
      // VAD bỏ qua âm quá ngắn (không gọi onSpeechEnd) -> tự reset để nút không bị kẹt ở trạng thái listening
      setTwoPassState(prev => (prev === 'listening' ? 'idle' : prev));
      setTwoPassActive(false);
    } else if (twoPassActive) {
      stopTwoPassVad();
      setTwoPassActive(false);
      setTwoPassState('idle');
    } else {
      void startTwoPassVad();
    }
  };

  const handleTwoPassRetry = () => {
    stopTwoPassVad();
    setTwoPassResult(null);
    setTwoPassError(undefined);
    void startTwoPassVad();
  };

  const handleMicClick = () => {
    if (pushToTalk) return;
    if (!active || busy) return;
    if (!connected) {
      const p = hasHistory
        ? resumeConversation({ input: 'voice' })
        : startConversation({ input: 'voice' });
      p.then(result => {
        if (result?.status === 'error') {
          console.error('[ControlTray] Voice start failed:', result.message);
        } else if (result?.status === 'cancelled') {
          console.warn('[ControlTray] Voice start cancelled:', result.message);
        }
      }).catch(err => {
        console.error('[ControlTray] Voice start rejected:', err);
      });
      return;
    }
    void setMicrophoneEnabled(!recording);
  };

  useEffect(() => {
    if (!active || !pushToTalk) return;
    const release = () => {
      if (!heldKey.current) return;
      heldKey.current = false;
      releasePushToTalk();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'KeyV' || event.repeat || heldKey.current || isSidebarOpen ||
        event.ctrlKey || event.altKey || event.metaKey ||
        (event.target instanceof HTMLElement && !!event.target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'))) return;
      event.preventDefault();
      heldKey.current = true;
      void pressPushToTalk();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'KeyV' && heldKey.current) { event.preventDefault(); release(); }
    };
    const onVisibilityChange = () => { if (document.hidden) release(); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', release);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      release();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', release);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [active, pushToTalk, isSidebarOpen, pressPushToTalk, releasePushToTalk]);

  const sendTextPrompt = async () => {
    console.log('[ControlTray] sendTextPrompt triggered:', { textPrompt, active, busy });
    if (!active || busy || !textPrompt.trim()) return;
    const currentPrompt = textPrompt;
    const result = await sendMessage({ text: currentPrompt, source: 'composer' });
    console.log('[ControlTray] sendMessage result:', result);
    if (result.status === 'ok') {
      setTextPrompt(value => value === currentPrompt ? '' : value);
      setTwoPassResult(null);
    } else if (result.status === 'error') {
      console.error('[ControlTray] sendMessage failed with error:', result.message);
    } else if (result.status === 'cancelled') {
      console.warn('[ControlTray] sendMessage was cancelled:', result.message);
    }
  };

  const handleRetry = async () => {
    if (!active || busy) return;
    const retriedPrompt = pendingPrompt;
    console.log('[ControlTray] handleRetry triggered with prompt:', retriedPrompt);
    const result = await retry();
    console.log('[ControlTray] retry result:', result);
    if (result.status === 'ok' && retriedPrompt) {
      setTextPrompt(value => value.trim() === retriedPrompt.trim() ? '' : value);
    } else if (result.status === 'error') {
      console.error('[ControlTray] retry failed:', result.message);
    }
  };

  const handleTextSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendTextPrompt();
  };

  const handleSelectedImage = async (file?: File) => {
    if (!file || !active || !connected || busy || tutorMode !== 'open-conversation') return;
    setImageStatus(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5_000_000) {
      setImageStatus({ kind: 'error', message: t('playground.tray_controls.image_invalid') });
      return;
    }
    let previewUrl: string | null = null;
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const data = canvas.toDataURL('image/jpeg', 0.78).split(',')[1];
      if (!data || data.length > 1_500_000) throw new Error('Image too large');
      const prompt = textPrompt.trim() || t('playground.tray_controls.image_default_prompt');
      previewUrl = URL.createObjectURL(file);
      const result = sendImage({ data, text: prompt });
      if (result.status !== 'ok' || !result.turnId) throw new Error(result.message);
      useImagePreviewStore.getState().addPreview(result.turnId, previewUrl);
      previewUrl = null;
      setTextPrompt('');
      setImageStatus({ kind: 'success', message: t('playground.tray_controls.image_sent') });
    } catch {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setImageStatus({ kind: 'error', message: t('playground.tray_controls.image_failed') });
    }
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

  const handleNewConversation = () => {
    if (connected || busy) return;
    resetConversation();
    setTextPrompt('');
    setImageStatus(null);
    setTwoPassResult(null);
  };

  const micButtonTitle = pushToTalk ? t('playground.tray.hold_to_talk') : muted ? t('playground.tray.mic_on_title') : t('playground.tray.mic_off_title');
  const connectButtonTitle = connected || connecting || ending ? t('playground.tray.pause_convo_title') : hasHistory ? t('playground.tray.resume_convo_title') : t('playground.tray.start_speaking_title');
  const trayStatus = connecting ? t('playground.tray.connecting')
    : ending ? t('playground.tray.wrapping_up')
      : isRestoringContext ? t('playground.tray.restoring_context')
        : isPlaying ? t('playground.tray.ai_speaking')
          : isAwaitingResponse || isSending ? t('playground.tray.waiting_reply')
            : pushToTalk ? recording ? t('playground.tray.release_to_reply') : t('playground.tray.hold_to_talk')
              : connected ? recording ? t('playground.tray.listening') : t('playground.tray.mic_off')
                : hasHistory ? t('playground.tray.paused') : t('playground.tray.ready');

  if (!active) return null;

  return (
    <section className="control-tray" ref={trayRef}>
      <div className="ai-tray-status-row">
        <div className="ai-tray-status-content">
          <span className="ai-tray-current-status" role="status">{trayStatus}</span>
          {recording && <meter className="ai-tray-meter" min={0} max={1} value={inputVolume} aria-label={t('playground.tray.mic_meter_aria')} />}
          {imageStatus && <span className={cn('ai-tray-image-notice', `ai-tray-image-notice--${imageStatus.kind}`)} role={imageStatus.kind === 'error' ? 'alert' : 'status'}>{imageStatus.message}</span>}
          {connectionError && <span className="ai-tray-error" role="alert">{connectionError} <button type="button" disabled={busy} onClick={() => void handleRetry()}>{t('playground.tray_controls.retry')}</button></span>}
        </div>
        <div className="ai-tray-session-actions">
          {connected && !busy && <button type="button" onClick={() => void endConversation()}>{t('playground.tray_controls.finish_recap')}</button>}
          {!connected && !busy && hasHistory && <>
            {!connectionError && <button type="button" onClick={() => void resumeConversation({ input: 'voice' })}>{t('playground.tray_controls.resume_conversation')}</button>}
            <button type="button" onClick={handleNewConversation}><RotateCcw size={14} aria-hidden="true" />{t('playground.sidebar.new_conversation')}</button>
          </>}
        </div>
      </div>

      <nav className={cn('actions-nav', { 'text-entry-visible-landscape': isLandscape && isTextEntryVisible })}>
        <button
          className={cn('action-button')}
          onClick={handleSettingsClick}
          title={t('playground.tray_controls.speaking_settings')}
          aria-label={t('playground.tray_controls.settings_aria')}
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
            !speakerMuted ? t('playground.tray_controls.audio_output_on') : t('playground.tray_controls.audio_output_off')
          }
          className={cn('action-button', {
            'speaker-on': !speakerMuted,
            'speaker-off': speakerMuted,
          })}
          onClick={() => void setSpeakerMuted(!speakerMuted)}
          title={!speakerMuted ? t('playground.tray_controls.mute_audio') : t('playground.tray_controls.unmute_audio')}
        >
          {!speakerMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button
          type="button"
          className="action-button ai-speaking-pace-button"
          aria-disabled={speakingPaceLocked}
          onClick={() => {
            if (speakingPaceLocked) return;
            const index = AI_SPEAKING_PACES.indexOf(aiSpeakingPace);
            setAiSpeakingPace(AI_SPEAKING_PACES[(index + 1) % AI_SPEAKING_PACES.length]);
          }}
          title={speakingPaceTitle}
          aria-label={speakingPaceTitle}
        >
          {speakingPaceLabel}
        </button>
        <button
          className={cn('action-button mic-button relative', {
            'mic-on ring-2 ring-red-400': !muted,
            'mic-off': muted,
          })}
          disabled={busy && !pushToTalk}
          onClick={handleMicClick}
          onPointerDown={event => {
            if (!pushToTalk || event.button !== 0) return;
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            void pressPushToTalk();
          }}
          onPointerUp={() => { if (pushToTalk) releasePushToTalk(); }}
          onPointerCancel={() => { if (pushToTalk) releasePushToTalk(); }}
          onLostPointerCapture={() => { if (pushToTalk) releasePushToTalk(); }}
          title={micButtonTitle}
          aria-label={micButtonTitle}
        >
          {!muted ? (
            <div className="relative flex items-center justify-center">
              <Mic className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            </div>
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </button>

        {/* Smart Two-Pass STT Button */}
        <button
          type="button"
          className={cn('action-button two-pass-toggle-button relative transition-all duration-200', {
            'two-pass-listening bg-red-50 dark:bg-red-950/60 border-red-500 text-red-600 ring-2 ring-red-400': twoPassState === 'listening',
            'two-pass-refining bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-600 ring-2 ring-amber-300': twoPassState === 'refining',
            'two-pass-active text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-700': twoPassActive && twoPassState !== 'listening' && twoPassState !== 'refining',
          })}
          disabled={(busy && twoPassState !== 'listening') || twoPassState === 'refining'}
          onClick={handleToggleTwoPass}
          title={
            twoPassState === 'listening'
              ? 'Đang thu âm... Nhấn để dừng và chuyển thành văn bản'
              : twoPassState === 'refining'
              ? 'AI đang tinh chỉnh câu nói...'
              : t('playground.two_pass_stt.toggle_button_title', 'Smart Two-Pass STT (Tự động lọc từ thừa)')
          }
          aria-label={t('playground.two_pass_stt.toggle_button_title', 'Smart Two-Pass STT (Tự động lọc từ thừa)')}
          aria-pressed={twoPassActive || twoPassState === 'listening'}
        >
          {twoPassState === 'listening' ? (
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-red-600 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            </div>
          ) : twoPassState === 'refining' ? (
            <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
        </button>

        <button
          className={cn('action-button keyboard-toggle-button')}
          onClick={() => setIsTextEntryVisible(!isTextEntryVisible)}
          title={t('playground.tray_controls.toggle_text_input')}
          aria-label={t('playground.tray_controls.toggle_text_input')}
          aria-expanded={isTextEntryVisible}
        >
          <Keyboard className="w-5 h-5" />
        </button>
        {tutorMode === 'open-conversation' && <>
          <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden
            onChange={event => {
              const file = event.target.files?.[0];
              event.target.value = '';
              void handleSelectedImage(file);
            }} />
          <button type="button" className="action-button" disabled={!connected || busy}
            onClick={() => imageInputRef.current?.click()}
            title={t('playground.tray_controls.send_image')}
            aria-label={t('playground.tray_controls.send_image')}>
            <ImagePlus className="w-5 h-5" />
          </button>
        </>}
      </nav>

      {(!isMobile || isTextEntryVisible) && (
        <form className="prompt-form" onSubmit={handleTextSubmit}>
          <textarea
            ref={textareaRef}
            className="prompt-input"
            placeholder={
              connected ? t('playground.tray_controls.placeholder_connected') : t('playground.tray_controls.placeholder_initial')
            }
            value={textPrompt}
            onChange={e => setTextPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={t('playground.tray_controls.text_prompt_aria')}
            disabled={busy}
            rows={1}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!textPrompt.trim() || busy}
            aria-label={t('playground.tray_controls.send_aria')}
            title={
              !connected
                ? t('playground.tray_controls.connect_and_send')
                : !textPrompt.trim()
                ? t('playground.tray_controls.type_to_send')
                : t('playground.tray_controls.send')
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
