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
import { type ToolContext, toolRegistry } from '../lib/tools/tool-registry';

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
    };

    const onSetupComplete = () => {
      client.sendRealtimeText('hello');
    };

    const onClose = (event: CloseEvent) => {
      setConnected(false);
      stopAudioStreamer();
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

      try {
        const functionResponses: any[] = [];
        const toolContext: ToolContext = {};

        for (const fc of toolCall.functionCalls || []) {
          const fcName = fc.name || 'unknown';
          setIsAwaitingFunctionResponse(true, fcName);
          useLogStore.getState().mergeIntoLastAgentTurn({
            actualToolCalls: [{ name: fcName, args: fc.args }],
          });

          let toolResponse: string | object = 'ok';
          try {
            const toolImplementation = fc.name ? toolRegistry[fc.name] : undefined;
            if (toolImplementation) {
              toolResponse = await toolImplementation(fc.args, toolContext);
            } else {
              toolResponse = `Unknown tool called: ${fcName}.`;
              console.warn(toolResponse);
            }

            functionResponses.push({
              id: fc.id,
              name: fcName,
              response: { result: toolResponse },
            });
          } catch (err: any) {
            console.error(`Error executing tool ${fcName}:`, err);
            functionResponses.push({
              id: fc.id,
              name: fcName,
              response: { error: err?.message || String(err) },
            });
          }
        }

        if (functionResponses.length > 0) {
          client.sendToolResponse({ functionResponses });
        }
      } catch (err) {
        console.error('Error handling toolCall event:', err);
      } finally {
        setIsAwaitingFunctionResponse(false);
      }
    };

    client.on('open', onOpen);
    client.on('setupcomplete', onSetupComplete);
    client.on('close', onClose);
    client.on('interrupted', onInterrupted);
    client.on('audio', onAudio);
    client.on('toolcall', onToolCall);

    return () => {
      client.off('open', onOpen);
      client.off('setupcomplete', onSetupComplete);
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
