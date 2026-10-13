import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type MouseEvent } from 'react';
import type { ConversationTurn } from '../../lib/state';
import { extractSentenceContext, type VocabItem } from '@/data/readerData';
import { lookupWordInstant, sanitizeChatWord } from '../../lib/dictionary-service';
import { debugLog } from '../../lib/debug-logger';

/** Keeps dictionary selection anchored to the text the learner actually selected. */
export function useTimelineSelection(turns: ConversationTurn[], active: boolean, sessionId?: string) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedWord, setSelectedWord] = useState<VocabItem | null>(null);
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number } | null>(null);
  const [frozen, setFrozen] = useState<Map<string, ConversationTurn>>(new Map());
  const frozenRef = useRef(frozen);
  const renderedTurns = useRef(turns);
  const gestureTurns = useRef(turns);
  const dragging = useRef(false);
  const popupOpen = useRef(false);
  const requestId = useRef(0);
  const atBottom = useRef(true);
  const lastLookup = useRef({ text: '', time: 0 });
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const freeze = useCallback((next: Map<string, ConversationTurn>) => {
    frozenRef.current = next;
    setFrozen(next);
  }, []);

  const selectionRange = useCallback(() => {
    const selection = window.getSelection();
    const root = scrollRef.current;
    if (!root || !selection || selection.isCollapsed || !selection.rangeCount) return null;
    const range = selection.getRangeAt(0);
    return root.contains(range.startContainer) && root.contains(range.endContainer) ? range : null;
  }, []);

  const closeSelection = useCallback(() => {
    requestId.current += 1;
    popupOpen.current = false;
    dragging.current = false;
    lastLookup.current = { text: '', time: 0 };
    setSelectedWord(null);
    setWordPosition(null);
    freeze(new Map());
    if (selectionRange()) window.getSelection()?.removeAllRanges();
  }, [freeze, selectionRange]);

  const captureSelection = useCallback(() => {
    const range = selectionRange();
    if (!range) {
      if (!dragging.current && !popupOpen.current) freeze(new Map());
      return;
    }
    const next = new Map<string, ConversationTurn>();
    scrollRef.current?.querySelectorAll<HTMLElement>('[data-turn-id]').forEach(element => {
      if (!range.intersectsNode(element)) return;
      const id = element.dataset.turnId!;
      const turn = frozenRef.current.get(id) ?? (dragging.current ? gestureTurns.current.find(item => item.id === id) : undefined)
        ?? renderedTurns.current.find(item => item.id === id);
      if (turn) next.set(id, turn);
    });
    freeze(next);
  }, [freeze, selectionRange]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!active || event.button !== 0) return;
    const element = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-turn-id]') : null;
    if (!element) return;
    gestureTurns.current = renderedTurns.current;
    dragging.current = true;
    const turn = renderedTurns.current.find(item => item.id === element.dataset.turnId);
    // Freeze on pointer-down, before the first streaming delta can disturb the drag.
    if (turn) freeze(new Map([[turn.id, turn]]));
  }, [active, freeze]);

  const handleTextSelection = useCallback(async (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('.in-place-dictionary-popup')) return;
    dragging.current = false;
    if (!active) return;
    const range = selectionRange();
    captureSelection();
    if (!range) return;
    const cleanText = sanitizeChatWord(range.toString());
    if (!cleanText || cleanText.length < 2 || cleanText.split(/\s+/).length > 8) return;
    const now = Date.now();
    if (lastLookup.current.text === cleanText.toLowerCase() && now - lastLookup.current.time < 350) return;
    lastLookup.current = { text: cleanText.toLowerCase(), time: now };
    const id = ++requestId.current;
    const rect = range.getBoundingClientRect();
    const element = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
    const paragraph = element?.closest('p, [data-turn-id]')?.textContent ?? range.toString();
    const contextSentence = extractSentenceContext(paragraph, cleanText);
    popupOpen.current = true;
    setWordPosition(rect.width || rect.height
      ? { x: rect.left + rect.width / 2, y: rect.bottom }
      : { x: event.clientX, y: event.clientY + 12 });
    setSelectedWord({
      id: cleanText.toLowerCase(), word: cleanText,
      pos: cleanText.includes(' ') ? 'Cụm từ / Phrase' : 'Đang tra cứu...',
      ipa: '/.../', viMeaning: 'Đang tải nghĩa & phiên âm IPA...',
      enDefinition: 'Fetching dictionary definition...',
      contextSentence: contextSentence || `Context: "${cleanText}" in English conversation.`,
    });
    try {
      const resolved = await lookupWordInstant(cleanText, contextSentence);
      if (id === requestId.current && popupOpen.current) setSelectedWord(resolved);
    } catch (error) {
      debugLog.error('DictionarySelectionLookup', error);
    }
  }, [active, captureSelection, selectionRange]);

  useEffect(() => {
    closeSelection();
    atBottom.current = true;
    setHasNewMessages(false);
    return () => { requestId.current += 1; popupOpen.current = false; };
  }, [active, sessionId, turns[0]?.id, closeSelection]);

  useEffect(() => {
    if (!active) return;
    const finishDrag = () => { dragging.current = false; captureSelection(); };
    const onScroll = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.in-place-dictionary-popup')) return;
      if (popupOpen.current || frozenRef.current.size) closeSelection();
      else requestId.current += 1;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSelection();
    };
    document.addEventListener('selectionchange', captureSelection);
    document.addEventListener('pointerup', finishDrag);
    document.addEventListener('pointercancel', finishDrag);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', closeSelection);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('selectionchange', captureSelection);
      document.removeEventListener('pointerup', finishDrag);
      document.removeEventListener('pointercancel', finishDrag);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', closeSelection);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active, captureSelection, closeSelection]);

  useLayoutEffect(() => {
    const changed = renderedTurns.current !== turns;
    renderedTurns.current = turns;
    const root = scrollRef.current;
    if (!active || !root || !changed) return;
    if (!atBottom.current || dragging.current || frozenRef.current.size || popupOpen.current || selectionRange()) {
      setHasNewMessages(true);
      return;
    }
    root.scrollTop = root.scrollHeight;
    setHasNewMessages(false);
  }, [turns, active, selectionRange]);

  const handleScroll = () => {
    const root = scrollRef.current;
    if (!root) return;
    atBottom.current = root.scrollHeight - root.scrollTop - root.clientHeight < 48;
    if (atBottom.current && !frozenRef.current.size && !popupOpen.current) setHasNewMessages(false);
  };
  const scrollToLatest = () => {
    closeSelection();
    atBottom.current = true;
    setHasNewMessages(false);
    requestAnimationFrame(() => {
      const root = scrollRef.current;
      if (root) root.scrollTop = root.scrollHeight;
    });
  };

  return {
    scrollRef, selectedWord, wordPosition, closeSelection, handlePointerDown,
    handleTextSelection, handleScroll, hasNewMessages, scrollToLatest,
    renderedTurn: (turn: ConversationTurn) => frozen.get(turn.id) ?? turn,
  };
}
