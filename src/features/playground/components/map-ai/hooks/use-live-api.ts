import { useLayoutEffect, useMemo, useSyncExternalStore } from 'react';
import { GenAILiveClient } from '../lib/genai-live-client';
import { ConversationAudio } from '../lib/conversation-audio';
import { SessionController, type ActiveView } from '../lib/session-controller';
import { buildSessionConfiguration } from '../lib/session-config';
import { dispatchTool } from '../lib/tools/tool-dispatcher';
import { useSettings, useTools, useUI, useMapStore } from '../lib/state';

export function useLiveApi({ apiKey, activeView }: { apiKey: string; activeView: ActiveView }) {
  const model = useSettings(state => state.model);
  const speakerMuted = useUI(state => state.speakerMuted);
  const runtime = useMemo(() => {
    // Defer missing-key validation to a user action so the map remains usable offline.
    const client = new GenAILiveClient(apiKey || 'missing-key', model);
    const audio = new ConversationAudio(state => controller.updateAudio(state));
    const controller: SessionController = new SessionController({
      client, audio,
      configuration: () => {
        if (!apiKey) throw new Error('Vui lòng nhập Gemini API key trong Cài đặt để bắt đầu.');
        return buildSessionConfiguration(useSettings.getState(), useTools.getState().tools, controller.getSnapshot().activeView);
      },
      toolPolicy: () => ({
        allowMapTools: useSettings.getState().mapContextMode !== 'off',
        tutorMode: useSettings.getState().tutorMode,
      }),
      dispatchTool,
      setLevel: level => useSettings.getState().setProficiencyLevel(level),
      setMuted: muted => useUI.getState().setMuted(muted),
      clearMarkers: () => useMapStore.getState().clearMarkers(),
    });
    return { client, audio, controller };
  }, [apiKey, model]);
  const { controller, audio, client } = runtime;
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  useLayoutEffect(() => {
    controller.attach();
    return () => controller.dispose();
  }, [controller]);
  useLayoutEffect(() => { controller.setActiveView(activeView); }, [controller, activeView]);
  useLayoutEffect(() => { audio.setMuted(speakerMuted); }, [audio, speakerMuted]);

  return {
    ...state, activeView,
    client,
    connected: state.connectionStatus === 'connected' || state.connectionStatus === 'ending',
    connecting: state.connectionStatus === 'connecting' || state.isRestoringContext,
    ending: state.connectionStatus === 'ending',
    startConversation: controller.startConversation,
    resumeConversation: controller.resumeConversation,
    sendMessage: controller.sendMessage,
    sendControlInstruction: controller.sendControlInstruction,
    changeLevel: controller.changeLevel,
    stopConversation: controller.stopConversation,
    endConversation: controller.endConversation,
    resetConversation: controller.resetConversation,
    setMicrophoneEnabled: controller.setMicrophoneEnabled,
    setSpeakerMuted: useUI.getState().setSpeakerMuted,
    retry: controller.retry,
  };
}
export type UseLiveApiResults = ReturnType<typeof useLiveApi>;
