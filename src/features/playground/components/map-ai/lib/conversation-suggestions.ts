import type { ConversationTurn } from './conversation-state';

type ChatMode = 'free-conversation' | 'open-conversation';

const suggestions = {
  chooseStory: { id: 'chooseStory', text: 'Help me choose one story from the VieCultures library to practise.' },
  findTopic: { id: 'findTopic', text: 'Find a VieCultures story about a topic I can discuss.' },
  openMap: { id: 'openMap', text: 'Open the map so I can choose a place and story.' },
  simplerStory: { id: 'simplerStory', text: 'Explain your last answer about this story in simpler words.' },
  expressStory: { id: 'expressStory', text: 'Let me explain my own opinion about this story. Respond to my idea first.' },
  exampleStory: { id: 'exampleStory', text: 'Give me one short example using a useful word from this story.' },
  deeperStory: { id: 'deeperStory', text: 'Tell me more about the point from this story we just discussed.' },
  rephraseStory: { id: 'rephraseStory', text: 'Help me say my last idea about this story more naturally in English.' },
  continueTale: { id: 'continueTale', text: 'Continue the story you were telling me from where you stopped.' },
  anotherAngle: { id: 'anotherAngle', text: 'Show me another point of view on what we just discussed.' },
  tellMore: { id: 'tellMore', text: 'Tell me a little more about your last answer.' },
  trySpeaking: { id: 'trySpeaking', text: 'Let me try expressing my opinion about this in English. Give me room to speak.' },
  simplerTalk: { id: 'simplerTalk', text: 'Explain your last answer in simpler words with one short example.' },
  rephraseTalk: { id: 'rephraseTalk', text: 'Help me say my last idea more naturally in English.' },
  discussSource: { id: 'discussSource', text: 'Explain what the source you found supports and what remains uncertain.' },
  checkSource: { id: 'checkSource', text: 'Check the main factual claim in your last answer with a Wikipedia source.' },
} as const;

export type ConversationSuggestion = (typeof suggestions)[keyof typeof suggestions];

function contains(text: string, pattern: RegExp): boolean {
  return pattern.test(text.toLocaleLowerCase());
}

/** Uses explicit recent signals only; this never asks a model to generate UI actions. */
export function getConversationSuggestions(
  mode: ChatMode,
  hasStory: boolean,
  turns: readonly ConversationTurn[],
): ConversationSuggestion[] {
  const dialogue = turns.filter(turn => turn.role === 'user' || turn.role === 'agent');
  const last = dialogue.at(-1);
  if (!last || last.role !== 'agent' || !last.isFinal || last.interrupted || !last.text.trim()) return [];

  const lastUser = [...dialogue].reverse().find(turn => turn.role === 'user');
  if (!lastUser) return [];

  if (mode === 'free-conversation') {
    if (!hasStory) return [suggestions.chooseStory, suggestions.findTopic, suggestions.openMap];
    if (contains(lastUser.text, /\b(opinion|express|phrase|wording|say|write)\b|quan điểm|diễn đạt|viết/iu)) {
      return [suggestions.rephraseStory, suggestions.exampleStory, suggestions.deeperStory];
    }
    if (contains(lastUser.text, /\b(explain|meaning|understand|why|how)\b|giải thích|ý nghĩa|tại sao|như thế nào/iu)) {
      return [suggestions.simplerStory, suggestions.exampleStory, suggestions.expressStory];
    }
    return [suggestions.expressStory, suggestions.simplerStory, suggestions.exampleStory];
  }

  const lastUserIndex = turns.map(turn => turn.id).lastIndexOf(lastUser.id);
  const foundSource = turns.slice(lastUserIndex + 1).some(turn => {
    const result = turn.toolResponse;
    return turn.role === 'system' && result && typeof result === 'object'
      && 'type' in result && result.type === 'wikipedia_sources'
      && 'sources' in result && Array.isArray(result.sources) && result.sources.length > 0;
  });
  if (foundSource) return [suggestions.discussSource, suggestions.anotherAngle, suggestions.trySpeaking];
  if (contains(lastUser.text, /\b(source|citation|verify|fact.?check)\b|nguồn|kiểm chứng|xác minh/iu)) {
    return [suggestions.checkSource, suggestions.anotherAngle, suggestions.trySpeaking];
  }
  if (contains(lastUser.text, /\b(story|storytelling|roleplay|imagine)\b|kể chuyện|câu chuyện|nhập vai/iu)) {
    return [suggestions.continueTale, suggestions.anotherAngle, suggestions.trySpeaking];
  }
  if (contains(lastUser.text, /\b(opinion|express|phrase|wording|say|write)\b|quan điểm|diễn đạt|viết/iu)) {
    return [suggestions.rephraseTalk, suggestions.anotherAngle, suggestions.trySpeaking];
  }
  if (contains(lastUser.text, /\b(explain|meaning|understand|why|how)\b|giải thích|ý nghĩa|tại sao|như thế nào/iu)) {
    return [suggestions.simplerTalk, suggestions.trySpeaking, suggestions.anotherAngle];
  }
  return [suggestions.tellMore, suggestions.anotherAngle, suggestions.trySpeaking];
}
