/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { GenAILiveClient } from '../lib/genai-live-client';
import type { LiveConnectConfig, LiveServerToolCall } from '@google/genai';
import { AudioStreamer } from '../lib/audio-streamer';
import { audioContext } from '../lib/utils';
import VolMeterWorklet from '../lib/worklets/vol-meter';
import { useLogStore, useSettings } from '../lib/state';
import { MAP_TOOL_NAMES, type ToolContext, toolRegistry } from '../lib/tools/tool-registry';
import { debugLog } from '../lib/debug-logger';

export type UseLiveApiResults = {
  client: GenAILiveClient;
  setConfig: (config: LiveConnectConfig) => void;
  config: LiveConnectConfig;
  audioStreamer: MutableRefObject<AudioStreamer | null>;
  connect: () => Promise<void>;
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
  const pendingInputQueue = useRef<string[]>([]);

  const [volume, setVolume] = useState(0);
  const [connected, setConnected] = useState(false);
  const [, setStreamerReady] = useState(false);
  const [config, setConfig] = useState<LiveConnectConfig>({});

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: 'audio-out' }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        setStreamerReady(true);
        audioStreamerRef.current
          .addWorklet<any>('vumeter-out', VolMeterWorklet, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .catch(err => {
            console.error('Error adding worklet:', err);
          });
      });
    }
  }, []);

  // Main Event Handlers
  useEffect(() => {
    const onOpen = () => {
      setConnected(true);
      debugLog.ws('WebSocket kết nối thành công', { model: client.model }, 'success');
    };

    const onSetupComplete = () => {
      debugLog.ws('Setup hoàn tất - Gửi tín hiệu chào ban đầu');
      client.sendRealtimeText('hello');
    };

    const onError = (error: ErrorEvent) => {
      debugLog.error('WebSocket LiveClient', {
        message: error?.message || 'WebSocket Error',
        type: error?.type,
      });
    };

    const onClose = (event: CloseEvent) => {
      setConnected(false);
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
      const reason = "Session ended. Press 'Play' to start a new speaking practice session. " + event.reason;
      useLogStore.getState().addTurn({
        role: 'agent',
        text: reason,
        isFinal: true,
      });
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

    return () => {
      client.off('open', onOpen);
      client.off('setupcomplete', onSetupComplete);
      client.off('error', onError);
      client.off('close', onClose);
      client.off('interrupted', onInterrupted);
      client.off('audio', onAudio);
      client.off('toolcall', onToolCall);

    };
  }, [client]);

  const connect = async () => {
    if (connected) return;
    try {
      const { systemPrompt } = useSettings.getState();
      const currentConfig = {
        ...config,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      };

      await client.connect(currentConfig);

      if (pendingInputQueue.current.length > 0) {
        for (const input of pendingInputQueue.current) {
          client.sendRealtimeText(input);
        }
        pendingInputQueue.current = [];
      }
    } catch (err) {
      console.error('Failed to connect to Live API:', err);
      throw err;
    }
  };

  const disconnect = () => {
    if (client) {
      client.disconnect();
    }
  };

  return {
    client,
    config,
    setConfig,
    connected,
    connect,
    disconnect,
    volume,
    audioStreamer: audioStreamerRef,
  };
}
