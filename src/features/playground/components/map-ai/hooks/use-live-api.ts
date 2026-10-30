import { useLayoutEffect, useMemo, useSyncExternalStore } from 'react';
import { GenAILiveClient } from '../lib/genai-live-client';
import { ConversationAudio } from '../lib/conversation-audio';
import { SessionController, type ActiveView } from '../lib/session-controller';
import { buildSessionConfiguration } from '../lib/session-config';
import { dispatchTool } from '../lib/tools/tool-dispatcher';
import { useSettings, useTools, useUI, useMapStore } from '../lib/state';
import { debugLog } from '../lib/debug-logger';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';

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
        const settings = useSettings.getState();
        const view = controller.getSnapshot().activeView;
        client.setUsageContext({ view, tutorMode: settings.tutorMode, voiceInteractionMode: settings.voiceInteractionMode });
        const reader = useReaderHandoff.getState().context;
        const selectedLandmarkId = useMapStore.getState().selectedLandmarkId;
        const landmark = VIETNAM_LANDMARKS.find(item => item.id === selectedLandmarkId);
        const storyReference = view === 'chat' && settings.tutorMode === 'free-conversation'
          ? reader
            ? { articleId: reader.articleId, title: reader.title, summary: reader.summary ?? '', source: 'reader' as const }
            : landmark
              ? { articleId: landmark.id, title: landmark.title, summary: landmark.excerptEn, source: 'map' as const }
              : null
          : null;
        const configuration = buildSessionConfiguration(settings, useTools.getState().tools, view, storyReference);
        const configuredTool = configuration.config.tools?.[0];
        debugLog.info('Gemini Live session configuration size', {
          view,
          model: settings.model,
          tutorMode: settings.tutorMode,
          voiceInteractionMode: settings.voiceInteractionMode,
          systemPromptChars: configuration.systemPrompt.length,
          toolCount: configuredTool && 'functionDeclarations' in configuredTool
            ? configuredTool.functionDeclarations?.length ?? 0 : 0,
          storySource: storyReference?.source ?? null,
        });
        return configuration;
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
    sendImage: controller.sendImage,
    sendControlInstruction: controller.sendControlInstruction,
    changeLevel: controller.changeLevel,
    stopConversation: controller.stopConversation,
    endConversation: controller.endConversation,
    resetConversation: controller.resetConversation,
    setMicrophoneEnabled: controller.setMicrophoneEnabled,
    pressPushToTalk: controller.pressPushToTalk,
    releasePushToTalk: controller.releasePushToTalk,
    setSpeakerMuted: useUI.getState().setSpeakerMuted,
    retry: controller.retry,
  };
}
export type UseLiveApiResults = ReturnType<typeof useLiveApi>;
