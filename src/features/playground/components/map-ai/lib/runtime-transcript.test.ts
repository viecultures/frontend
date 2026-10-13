import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { useLogStore, type ConversationTurn, type ConversationTurnSource } from './conversation-state';
import { buildResumeHistory } from './conversation-history';

const config = { systemPrompt: 'Discuss Vietnamese culture.', model: 'test-model' };
const log = () => useLogStore.getState();
beforeEach(() => log().clearTurns());

test('legacy addTurn works without metadata or settings/session initialization', () => {
  log().addTurn({ role: 'user', text: 'Hello', isFinal: true });
  log().addTurn({ role: 'system', text: 'Vocabulary card', isFinal: true });
  const [user, card] = log().turns;
  assert.ok(user.id);
  assert.notEqual(user.id, card.id);
  assert.ok(user.timestamp instanceof Date);
  assert.equal(user.source, 'composer');
  assert.equal(card.source, 'system');
  assert.equal(log().sessionMetadata, null);
});

test('active agent survives vocabulary cards, tool calls, and transcription completion', () => {
  log().appendTranscription('agent', 'Vietnam', false);
  const id = log().activeAgentTurnId;
  log().addTurn({ role: 'system', text: 'Vocabulary card', isFinal: true });
  const card = log().turns[1];
  log().mergeIntoLastAgentTurn({ actualToolCalls: [{ name: 'displayCulturalVocab', args: { word: 'culture' } }] });
  log().appendTranscription('agent', 'ese culture', true);
  assert.equal(log().turns.length, 2);
  assert.equal(log().turns[0].id, id);
  assert.equal(log().turns[0].text, 'Vietnamese culture');
  assert.equal(log().turns[0].transcriptionFinished, true);
  assert.equal(log().turns[0].isFinal, false);
  assert.equal(log().activeAgentTurnId, id);
  assert.equal(log().turns[1], card);
  log().appendTranscription('agent', ' is diverse.', false);
  assert.equal(log().turns[0].id, id);
  assert.equal(log().turns[0].transcriptionFinished, false);
  log().finalizeTurns();
  assert.equal(log().turns[0].isFinal, true);
  assert.equal(log().activeAgentTurnId, null);
  assert.equal(log().turns[1], card);
  log().beginAgentTurn();
  log().appendTranscription('agent', 'Next response', true);
  assert.notEqual(log().activeAgentTurnId, id);
});

test('late output updates the completed agent by ID without reopening it or changing other rows', () => {
  log().appendTranscription('agent', 'Vietnamese', false);
  const original = log().turns[0];
  log().addTurn({ role: 'system', text: 'Vocabulary card', isFinal: true });
  const card = log().turns[1];
  log().finalizeTurns();
  log().appendTranscription('agent', ' cultural', false);
  log().appendTranscription('agent', ' heritage.', true);
  assert.equal(log().turns.length, 2);
  assert.equal(log().turns[0].id, original.id);
  assert.equal(log().turns[0].timestamp, original.timestamp);
  assert.equal(log().turns[0].text, 'Vietnamese cultural heritage.');
  assert.equal(log().turns[0].isFinal, true);
  assert.equal(log().turns[0].transcriptionFinished, true);
  assert.equal(log().turns[1], card);
  assert.equal(log().activeAgentTurnId, null);
  const settled = log();
  log().finalizeTurns();
  assert.equal(log(), settled);
});

test('all output transcription may arrive after turncomplete without leaving an active row', () => {
  log().beginAgentTurn();
  log().finalizeTurns();
  assert.deepEqual(log().turns, []);
  log().appendTranscription('agent', '', true);
  assert.deepEqual(log().turns, []);
  log().appendTranscription('agent', 'A late transcript', false);
  const id = log().turns[0].id;
  log().appendTranscription('agent', '.', true);
  assert.equal(log().turns.length, 1);
  assert.equal(log().turns[0].id, id);
  assert.equal(log().turns[0].text, 'A late transcript.');
  assert.equal(log().turns[0].isFinal, true);
  assert.equal(log().activeAgentTurnId, null);
});

test('empty late finished marker updates the completed turn rather than adding a row', () => {
  log().appendTranscription('agent', 'Done', false);
  log().finalizeTurns();
  const id = log().turns[0].id;
  log().appendTranscription('agent', '', true);
  assert.equal(log().turns.length, 1);
  assert.equal(log().turns[0].id, id);
  assert.equal(log().turns[0].transcriptionFinished, true);
  assert.equal(log().turns[0].isFinal, true);
  assert.equal(log().activeAgentTurnId, null);
});

test('explicit new response boundary keeps a summary separate from the completed response', () => {
  log().appendTranscription('agent', 'Old answer', false);
  log().finalizeTurns();
  const old = log().turns[0];
  log().beginAgentTurn();
  log().appendTranscription('agent', 'Summary', true);
  assert.equal(log().turns.length, 2);
  assert.equal(log().turns[0], old);
  assert.notEqual(log().turns[1].id, old.id);
  assert.equal(log().turns[1].isFinal, false);
  assert.equal(log().activeAgentTurnId, log().turns[1].id);
});

test('new typed and spoken user turns reset the completed response target automatically', () => {
  for (const input of ['typed', 'spoken']) {
    log().clearTurns();
    log().appendTranscription('agent', 'Previous response', false);
    log().finalizeTurns();
    const old = log().turns[0];
    if (input === 'typed') log().addTurn({ role: 'user', source: 'composer', text: 'Next question', isFinal: true });
    else log().appendTranscription('user', 'Next question', true);
    log().appendTranscription('agent', 'New response', false);
    assert.equal(log().turns.length, 3);
    assert.equal(log().turns[0], old);
    assert.equal(log().turns[2].isFinal, false);
    assert.equal(log().activeAgentTurnId, log().turns[2].id);
  }
});

test('interruption, reconnect, and clear discard completed response targets', () => {
  const boundaries = [
    () => log().finalizeTurns(true),
    () => log().recordConnection(config),
    () => log().clearTurns(),
  ];
  for (const boundary of boundaries) {
    log().clearTurns();
    log().appendTranscription('agent', 'Old response', false);
    log().finalizeTurns();
    const id = log().turns[0].id;
    boundary();
    log().appendTranscription('agent', 'New response', false);
    const next = log().turns.at(-1)!;
    assert.notEqual(next.id, id);
    assert.equal(next.text, 'New response');
    assert.equal(next.isFinal, false);
  }
});

test('late speech can complete a finalized tool-only placeholder', () => {
  log().mergeIntoLastAgentTurn({ actualToolCalls: [{ name: 'map', args: {} }] });
  const placeholder = log().turns[0];
  log().finalizeTurns();
  log().appendTranscription('agent', 'Here is Huế.', true);
  assert.equal(log().turns.length, 1);
  assert.equal(log().turns[0].id, placeholder.id);
  assert.equal(log().turns[0].actualToolCalls, placeholder.actualToolCalls);
  assert.equal(log().turns[0].isFinal, true);
});

test('input uses its active ID across cards and closes when transcription finishes', () => {
  log().appendTranscription('user', 'Xin ', false);
  const id = log().activeUserTurnId;
  log().addTurn({ role: 'system', text: 'Card', isFinal: true });
  const card = log().turns[1];
  log().appendTranscription('user', 'chào 👋', true);
  assert.equal(log().turns.length, 2);
  assert.equal(log().turns[0].id, id);
  assert.equal(log().turns[0].text, 'Xin chào 👋');
  assert.equal(log().turns[0].isFinal, true);
  assert.equal(log().activeUserTurnId, null);
  assert.equal(log().turns[1], card);
  log().appendTranscription('user', 'Another utterance', false);
  assert.notEqual(log().activeUserTurnId, id);
});

test('agent output closes pending user input even behind a system card', () => {
  log().appendTranscription('user', 'Huế', false);
  log().addTurn({ role: 'system', text: 'Card', isFinal: true });
  const card = log().turns[1];
  log().appendTranscription('agent', 'Huế is beautiful.', false);
  assert.equal(log().turns[0].isFinal, true);
  assert.equal(log().activeUserTurnId, null);
  assert.equal(log().turns[1], card);
});

test('empty completion events never create turns and still complete active transcription', () => {
  log().appendTranscription('user', '', true);
  log().appendTranscription('agent', '  ', true);
  log().mergeIntoLastAgentTurn({ text: '', isFinal: true });
  log().finalizeTurns(true);
  assert.equal(log().turns.length, 0);
  log().appendTranscription('agent', 'Hello', false);
  log().appendTranscription('agent', '', true);
  assert.equal(log().turns[0].transcriptionFinished, true);
  assert.equal(log().turns[0].isFinal, false);
  log().finalizeTurns();
  assert.equal(log().turns[0].isFinal, true);
});

test('interruption closes both active roles and clears tool state without changing old rows', () => {
  log().addTurn({ role: 'user', text: 'Earlier', isFinal: true });
  const earlier = log().turns[0];
  log().appendTranscription('agent', 'Response', true);
  log().appendTranscription('user', 'Barge in', false);
  log().addTurn({ role: 'system', text: 'Card', isFinal: true });
  const card = log().turns[3];
  log().setIsAwaitingFunctionResponse(true, 'displayCulturalVocab');
  log().finalizeTurns(true);
  assert.equal(log().turns[0], earlier);
  assert.equal(log().turns[3], card);
  for (const turn of log().turns.slice(1, 3)) {
    assert.equal(turn.isFinal, true);
    assert.equal(turn.interrupted, true);
  }
  assert.equal(log().activeAgentTurnId, null);
  assert.equal(log().activeUserTurnId, null);
  assert.equal(log().isAwaitingFunctionResponse, false);
  assert.equal(log().awaitingToolType, null);
  const settled = log();
  log().finalizeTurns(true);
  assert.equal(log(), settled);
});

test('legacy agent merge accumulates tools and text on a stable turn behind cards', () => {
  log().mergeIntoLastAgentTurn({ toolUseRequest: { functionCalls: [{ name: 'first', args: {} }] } });
  const id = log().activeAgentTurnId;
  assert.equal(log().turns[0].source, 'tool');
  assert.deepEqual(buildResumeHistory(log().turns), []);
  log().mergeIntoLastAgentTurn({ actualToolCalls: [{ name: 'first', args: {} }], toolResponse: 'ok' });
  log().addTurn({ role: 'system', text: 'Card', isFinal: true });
  const card = log().turns[1];
  log().mergeIntoLastAgentTurn({ text: 'Hello', actualToolCalls: [{ name: 'second', args: {} }] });
  log().mergeIntoLastAgentTurn({ text: 'world' });
  log().mergeIntoLastAgentTurn({ text: '!', isFinal: true });
  const agent = log().turns[0];
  assert.equal(agent.id, id);
  assert.equal(agent.text, 'Hello world!');
  assert.equal(agent.toolResponse, 'ok');
  assert.deepEqual(agent.actualToolCalls?.map(call => call.name), ['first', 'second']);
  assert.equal(log().turns[1], card);
  assert.equal(log().activeAgentTurnId, null);
  assert.deepEqual(buildResumeHistory(log().turns), [{ role: 'model', parts: [{ text: 'Hello world!' }] }]);
});

test('tool-only agent placeholder becomes the active transcript when speech arrives', () => {
  log().mergeIntoLastAgentTurn({ actualToolCalls: [{ name: 'map', args: {} }] });
  const placeholder = log().turns[0];
  log().appendTranscription('agent', 'Here is Huế.', false);
  assert.equal(log().turns.length, 1);
  assert.equal(log().turns[0].id, placeholder.id);
  assert.equal(log().turns[0].source, 'transcription');
  assert.equal(log().turns[0].actualToolCalls, placeholder.actualToolCalls);
});

test('updateLastTurn replaces only its target and cannot change the stable ID', () => {
  log().addTurn({ role: 'user', text: 'First', isFinal: true });
  log().addTurn({ role: 'agent', text: 'Second', isFinal: false });
  const [first, second] = log().turns;
  log().updateLastTurn({ id: 'replacement', text: 'Updated', isFinal: true });
  assert.equal(log().turns[0], first);
  assert.equal(log().turns[1].id, second.id);
  assert.equal(second.text, 'Second');
  assert.equal(log().turns[1].text, 'Updated');
  assert.equal(log().activeAgentTurnId, null);
});

test('initSession is idempotent and connection records preserve session identity on resume', () => {
  log().initSession(config);
  const session = log().sessionMetadata!;
  log().initSession({ systemPrompt: 'Ignored', model: 'another' });
  assert.equal(log().sessionMetadata, session);
  log().recordConnection({ ...config, connectionId: 'runtime-connection' });
  log().addTurn({ role: 'user', text: 'Hello', isFinal: true, source: 'composer' });
  const first = log().turns[0];
  assert.equal(first.sessionId, session.sessionId);
  assert.equal(first.connectionId, 'runtime-connection');
  log().recordConnection({ systemPrompt: 'Updated', model: 'new-model' });
  const resumed = log().sessionMetadata!;
  assert.equal(resumed.sessionId, session.sessionId);
  assert.equal(resumed.startedAt, session.startedAt);
  assert.notEqual(resumed.connectionId, 'runtime-connection');
  assert.equal(resumed.connections.length, 2);
  assert.equal(resumed.connections[1].model, 'new-model');
  assert.equal(log().turns[0], first);
  log().appendTranscription('agent', 'Welcome back', false);
  assert.equal(log().turns[1].connectionId, resumed.connectionId);
});

test('recordConnection can initialize explicitly from config and clearTurns resets the session', () => {
  log().recordConnection(config);
  const first = log().sessionMetadata!;
  log().appendTranscription('agent', 'Hello', false);
  log().setIsAwaitingFunctionResponse(true, 'map');
  log().clearTurns();
  assert.deepEqual(log().turns, []);
  assert.equal(log().sessionMetadata, null);
  assert.equal(log().activeAgentTurnId, null);
  assert.equal(log().activeUserTurnId, null);
  assert.equal(log().isAwaitingFunctionResponse, false);
  assert.equal(log().awaitingToolType, null);
  log().recordConnection(config);
  assert.notEqual(log().sessionMetadata!.sessionId, first.sessionId);
  assert.notEqual(log().sessionMetadata!.connectionId, first.connectionId);
});

test('controls and resume turns do not replace active conversation IDs', () => {
  log().appendTranscription('user', 'Input', false);
  const userId = log().activeUserTurnId;
  log().addTurn({ role: 'user', text: 'Resume instruction', isFinal: true, source: 'resume' });
  assert.equal(log().activeUserTurnId, userId);
  log().appendTranscription('agent', 'Answer', false);
  const agentId = log().activeAgentTurnId;
  log().addTurn({ role: 'agent', text: 'Control', isFinal: true, source: 'control' });
  assert.equal(log().activeAgentTurnId, agentId);
});

test('resume history admits conversation sources and rejects system, controls, resume, and tool-only', () => {
  const sources: ConversationTurnSource[] = ['composer', 'suggestion', 'map', 'text', 'transcription', 'control', 'resume', 'tool', 'system'];
  for (const source of sources) log().addTurn({ role: 'user', text: source, source, isFinal: true });
  log().addTurn({ role: 'system', source: 'composer', text: 'System text', isFinal: true });
  log().mergeIntoLastAgentTurn({ actualToolCalls: [{ name: 'tool', args: {} }] });
  log().addTurn({ role: 'agent', text: '  A real answer  ', isFinal: true });
  log().addTurn({ role: 'user', text: ' \n\t ', isFinal: true });
  assert.deepEqual(buildResumeHistory(log().turns), [
    ...sources.slice(0, 5).map(text => ({ role: 'user', parts: [{ text }] })),
    { role: 'model', parts: [{ text: 'A real answer' }] },
  ]);
});

function historyTurn(text: string, role: 'user' | 'agent' = 'user'): ConversationTurn {
  return { id: text, role, text, source: 'transcription', timestamp: new Date(0), isFinal: true };
}

test('resume history keeps the latest 12 eligible turns in chronological order without mutation', () => {
  const turns = Object.freeze(Array.from({ length: 20 }, (_, index) => Object.freeze(historyTurn(`Turn ${index}`, index % 2 ? 'agent' : 'user'))));
  const snapshot = JSON.stringify(turns);
  const history = buildResumeHistory(turns);
  assert.equal(history.length, 12);
  assert.equal(history[0].parts![0].text, 'Turn 8');
  assert.equal(history[11].parts![0].text, 'Turn 19');
  assert.equal(history[11].role, 'model');
  history[0].parts![0].text = 'Changed result';
  assert.equal(JSON.stringify(turns), snapshot);
});

test('resume history limits the total JS characters to 12000 by taking the newest suffix', () => {
  const history = buildResumeHistory([
    historyTurn('discarded'),
    historyTurn('prefix' + 'a'.repeat(8_000)),
    historyTurn('b'.repeat(5_000), 'agent'),
  ]);
  assert.deepEqual(history.map(content => content.parts![0].text), ['a'.repeat(7_000), 'b'.repeat(5_000)]);
  assert.equal(history.reduce((length, content) => length + content.parts![0].text!.length, 0), 12_000);
});

test('resume suffix never splits a surrogate pair at the global budget boundary', () => {
  const history = buildResumeHistory([
    historyTurn('older'),
    historyTurn('👋' + 'a'.repeat(6_999)),
    historyTurn('b'.repeat(5_000), 'agent'),
  ]);
  assert.equal(history.length, 2);
  assert.equal(history[0].parts![0].text, 'a'.repeat(6_999));
  const astral = buildResumeHistory([historyTurn('👋'.repeat(6_001))]);
  assert.equal(astral[0].parts![0].text, '👋'.repeat(6_000));
  const noRoom = buildResumeHistory([historyTurn('👋'), historyTurn('b'.repeat(11_999))]);
  assert.equal(noRoom.length, 1);
  assert.equal(noRoom[0].parts![0].text!.length, 11_999);
});
