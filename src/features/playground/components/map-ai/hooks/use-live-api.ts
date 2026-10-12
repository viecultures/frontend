/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { GenAILiveClient } from '../lib/genai-live-client';
import type { LiveConnectConfig, LiveServerToolCall } from '@google/genai';
import { AudioStreamer } from '../lib/audio-streamer';
import { createAudioContext, resumeAudioOutput } from '../lib/utils';
import VolMeterWorklet from '../lib/worklets/vol-meter';
import { useLogStore, useSettings, useUI } from '../lib/state';
import { buildCulturalTutorPrompt } from '../lib/constants';
import { MAP_TOOL_NAMES, type ToolContext, toolRegistry } from '../lib/tools/tool-registry';
import { debugLog } from '../lib/debug-logger';

export type UseLiveApiResults = {
  client: GenAILiveClient;
  setConfig: (config: LiveConnectConfig) => void;
  config: LiveConnectConfig;
  audioStreamer: MutableRefObject<AudioStreamer | null>;
  connect: (openingText?: string) => Promise<void>;
  sendPrompt: (text: string) => Promise<boolean>;
  pendingPrompt: string;
  connecting: boolean;
  connectionError: string | null;
  ending: boolean;
  endSession: () => Promise<void>;
  disconnect: () => void;
  connected: boolean;
  volume: number;
};

export function useLiveApi({
  apiKey,
}: {
  apiKey: string;
}): UseLiveApiResults {
  const { model } = useSettings();
  const client = useMemo(() => new GenAILiveClient(apiKey, model), [apiKey, model]);

  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const connectionAttempt = useRef<Promise<void> | null>(null);
  const lifecycle = useRef(0);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState('');
  const sending = useRef(false);
  const [ending, setEnding] = useState(false);
  const endingRef = useRef(false);
  const summaryComplete = useRef(false);

  const [volume, setVolume] = useState(0);
  const [connected, setConnected] = useState(false);
  const [, setStreamerReady] = useState(false);
  const [config, setConfig] = useState<LiveConnectConfig>({});

  // No output AudioContext is created at mount. Play/text/map actions unlock it.
  useEffect(() => {
    return () => {
      lifecycle.current += 1;
      const streamer = audioStreamerRef.current;
      audioStreamerRef.current = null;
      streamer?.stop();
      void streamer?.context.close().catch(() => {});
    };
  }, []);

  const prepareAudioOutput = () => {
    let streamer = audioStreamerRef.current;
    if (!streamer || streamer.context.state === 'closed') {
      streamer = new AudioStreamer(createAudioContext());
      audioStreamerRef.current = streamer;
      streamer.setGain(useUI.getState().speakerMuted ? 0 : 1);
      setStreamerReady(true);
      // Metering is optional; failure must not block conversation playback.
      void streamer.addWorklet('vumeter-out', VolMeterWorklet, (event: { data: { volume: number } }) => {
        setVolume(event.data.volume);
      }).catch(err => debugLog.error('Audio output meter', err));
    }
    // Called before any network await, while the initiating gesture is active.
    return resumeAudioOutput(streamer.context);
  };

  // Main Event Handlers
  useEffect(() => {
    const onOpen = () => {
      debugLog.ws('WebSocket kết nối thành công', { model: client.model }, 'success');
    };

    const onSetupComplete = () => {
      debugLog.ws('Setup hoàn tất');
    };

    const onError = (error: ErrorEvent) => {
      setConnectionError(error.message || 'Không thể kết nối. Hãy thử lại.');
      setConnected(false);
      useUI.getState().setMuted(true);
      audioStreamerRef.current?.stop();
      debugLog.error('WebSocket LiveClient', {
        message: error?.message || 'WebSocket Error',
        type: error?.type,
      });
    };

    const onClose = (event: CloseEvent) => {
      setConnected(false);
      useUI.getState().setMuted(true);
      setEnding(false);
      endingRef.current = false;
      stopAudioStreamer();
      debugLog.ws(
        'WebSocket đóng kết nối',
        {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        },
        event.wasClean ? 'info' : 'error'
      );
      if (!event.wasClean) setConnectionError('Kết nối bị gián đoạn. Thử lại hoặc tiếp tục từ lịch sử.');
    };

    const stopAudioStreamer = () => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.stop();
      }
    };

    const onInterrupted = () => {
      stopAudioStreamer();
      debugLog.audio('Server audio bị ngắt quãng (Interrupted)');
      const { updateLastTurn, turns } = useLogStore.getState();
      const lastTurn = turns[turns.length - 1];
      if (lastTurn && !lastTurn.isFinal) {
        updateLastTurn({ isFinal: true });
      }
    };

    const onAudio = (data: ArrayBuffer) => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.addPCM16(new Uint8Array(data));
      }
    };

    const onToolCall = async (toolCall: LiveServerToolCall) => {
      const { setIsAwaitingFunctionResponse } = useLogStore.getState();
      setIsAwaitingFunctionResponse(true, 'batch');

      const toolNames = toolCall.functionCalls?.map(fc => fc.name) || [];
      debugLog.ws('Nhận yêu cầu gọi tool từ Agent', {
        count: toolNames.length,
        tools: toolNames,
      });

      try {
        const functionResponses: any[] = [];
        const toolContext: ToolContext = {
          allowMapTools: useSettings.getState().mapContextMode !== 'off',
        };

        for (const fc of toolCall.functionCalls || []) {
          const fcName = fc.name || 'unknown';
          setIsAwaitingFunctionResponse(true, fcName);
          debugLog.tool(fcName, 'calling', fc.args);

          useLogStore.getState().mergeIntoLastAgentTurn({
            actualToolCalls: [{ name: fcName, args: fc.args }],
          });

          let toolResponse: string | object = 'ok';
          try {
            if (MAP_TOOL_NAMES.has(fcName) && !toolContext.allowMapTools) {
              toolResponse = 'Map context is disabled for this conversation. Continue without changing the map.';
              functionResponses.push({ id: fc.id, name: fcName, response: { result: toolResponse } });
              debugLog.tool(fcName, 'success', fc.args, toolResponse);
              continue;
            }
            const toolImplementation = fc.name ? toolRegistry[fc.name] : undefined;
            if (useSettings.getState().tutorMode === 'free-conversation' && ['listCulturalLessons', 'loadLessonDiscussionPlan', 'recordLessonQuizResult'].includes(fcName)) {
              functionResponses.push({ id: fc.id, name: fcName, response: { result: 'This tool is unavailable in free conversation.' } });
              continue;
            }
            if (toolImplementation) {
              toolResponse = await toolImplementation(fc.args, toolContext);
              debugLog.tool(fcName, 'success', fc.args, toolResponse);
            } else {
              toolResponse = `Unknown tool called: ${fcName}.`;
              debugLog.tool(fcName, 'error', fc.args, toolResponse);
              console.warn(toolResponse);
            }

            functionResponses.push({
              id: fc.id,
              name: fcName,
              response: { result: toolResponse },
            });
          } catch (err: any) {
            console.error(`Error executing tool ${fcName}:`, err);
            debugLog.tool(fcName, 'error', fc.args, err?.message || String(err));
            functionResponses.push({
              id: fc.id,
              name: fcName,
              response: { error: err?.message || String(err) },
            });
          }
        }

        if (functionResponses.length > 0) {
          client.sendToolResponse({ functionResponses });
          debugLog.ws('Đã gửi phản hồi tool về Gemini', {
            responsesCount: functionResponses.length,
          });
        }
      } catch (err) {
        console.error('Error handling toolCall event:', err);
        debugLog.error('onToolCall batch handler', err);
      } finally {
        setIsAwaitingFunctionResponse(false);
      }
    };

    client.on('open', onOpen);
    client.on('setupcomplete', onSetupComplete);
    client.on('error', onError);
    client.on('close', onClose);
    client.on('interrupted', onInterrupted);
    client.on('audio', onAudio);
    client.on('toolcall', onToolCall);
    const onTurnComplete = () => { if (endingRef.current) summaryComplete.current = true; };
    client.on('turncomplete', onTurnComplete);

    return () => {
      client.off('open', onOpen);
      client.off('setupcomplete', onSetupComplete);
      client.off('error', onError);
      client.off('close', onClose);
      client.off('interrupted', onInterrupted);
      client.off('audio', onAudio);
      client.off('toolcall', onToolCall);
      client.off('turncomplete', onTurnComplete);
      client.disconnect();
      stopAudioStreamer();

    };
  }, [client]);

  const connect = async (openingText = 'Start a friendly conversation about Vietnam. Ask me what I would like to talk about.') => {
    if (connectionAttempt.current) return connectionAttempt.current;
    const generation = lifecycle.current;
    setConnecting(true);
    setConnectionError(null);
    const attempt = (async () => {
      await prepareAudioOutput();
      if (generation !== lifecycle.current) throw new Error('Phiên đã được hủy.');
      if (client.status === 'connected') return;
      const settings = useSettings.getState();
      const systemPrompt = buildCulturalTutorPrompt(settings.systemPrompt, { mode: settings.tutorMode, correctionMode: settings.correctionMode, mapContextMode: settings.mapContextMode, level: settings.proficiencyLevel });
      const currentConfig = {
        ...config,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      };

      const ready = await client.connect(currentConfig);
      if (generation !== lifecycle.current) { client.disconnect(); throw new Error('Phiên đã được hủy.'); }
      if (!ready) throw new Error('Kết nối chưa sẵn sàng. Hãy thử lại.');
      setConnected(true);
      useLogStore.setState({ sessionMetadata: { sessionId: crypto.randomUUID(), startedAt: new Date(), systemPrompt, model } });
      if (openingText) client.send({ text: openingText });
    })();
    connectionAttempt.current = attempt;
    try { await attempt; }
    catch (err) { setConnectionError(err instanceof Error ? err.message : 'Kết nối thất bại'); throw err; }
    finally { connectionAttempt.current = null; setConnecting(false); }
  };

  const sendPrompt = async (text: string) => {
    if (!text.trim() || sending.current || endingRef.current) return false;
    sending.current = true;
    setPendingPrompt(text);
    try {
      await connect('');
      client.interrupt();
      client.send({ text });
      useLogStore.getState().addTurn({ role: 'user', text, isFinal: true });
      setPendingPrompt('');
      return true;
    } catch { return false; }
    finally { sending.current = false; }
  };

  const disconnect = () => {
    lifecycle.current += 1;
    setConnected(false);
    endingRef.current = false;
    setEnding(false);
    useUI.getState().setMuted(true);
    audioStreamerRef.current?.stop();
    if (client) {
      client.disconnect();
    }
  };

  const endSession = async () => {
    if (!connected || endingRef.current) return;
    useUI.getState().setMuted(true);
    client.interrupt();
    summaryComplete.current = false;
    endingRef.current = true;
    setEnding(true);
    client.send({ text: 'End our conversation now. Briefly summarize the topics and useful vocabulary. Include corrections only if our correction setting is end-of-session. Do not ask another question.' });
  };

  useEffect(() => {
    if (!ending) return;
    const startedAt = Date.now();
    const timer = setInterval(() => {
      if ((summaryComplete.current && !audioStreamerRef.current?.playing) || Date.now() - startedAt > 60000) disconnect();
    }, 250);
    return () => clearInterval(timer);
  }, [ending]);

  return {
    client,
    config,
    setConfig,
    connected,
    connect,
    sendPrompt,
    pendingPrompt,
    connecting,
    connectionError,
    ending,
    endSession,
    disconnect,
    volume,
    audioStreamer: audioStreamerRef,
  };
}
