import { useState, useRef, useCallback } from 'react';
import type { VocabItem } from '@/data/readerData';
import { VOCAB_DATABASE, extractSentenceContext } from '@/data/readerData';
import { lookupWordInstant, sanitizeChatWord } from '@/utils/dictionary-service';

export function useReaderDictionary() {
  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    vocab: VocabItem | null;
    position: { x: number; y: number } | null;
  }>({
    isOpen: false,
    vocab: null,
    position: null,
  });

  const requestIdRef = useRef<number>(0);
  const lastLookupRef = useRef<{ text: string; time: number }>({ text: '', time: 0 });

  const closeDictionary = useCallback(() => {
    setPopupState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleTextSelection = useCallback(async (e: React.MouseEvent) => {
    if (e.target instanceof Element && e.target.closest('.in-place-dictionary-popup')) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const rawText = selection.toString();
    const cleanText = sanitizeChatWord(rawText);
    if (!cleanText || cleanText.length < 2 || cleanText.split(/\s+/).length > 8) return;

    const now = Date.now();
    if (lastLookupRef.current.text === cleanText.toLowerCase() && now - lastLookupRef.current.time < 350) return;
    lastLookupRef.current = { text: cleanText.toLowerCase(), time: now };

    const currentReqId = ++requestIdRef.current;

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      let blockEl: HTMLElement | null = null;
      let node: Node | null = range.startContainer;
      while (node && node !== document.body) {
        if (node instanceof HTMLElement && (node.tagName === 'P' || node.tagName === 'DIV' || node.tagName === 'SECTION')) {
          blockEl = node;
          break;
        }
        node = node.parentNode;
      }

      const fullParagraph = blockEl ? (blockEl.innerText || blockEl.textContent || '') : (range.commonAncestorContainer.textContent || '');
      const fullSentence = extractSentenceContext(fullParagraph, cleanText);

      setPopupState({
        isOpen: true,
        vocab: {
          id: cleanText.toLowerCase(),
          word: cleanText,
          pos: cleanText.includes(' ') ? 'Cụm từ / Phrase' : 'Đang tra cứu...',
          ipa: '/.../',
          viMeaning: 'Đang tải nghĩa & phiên âm IPA...',
          enDefinition: 'Fetching dictionary definition...',
          contextSentence: fullSentence,
        },
        position: {
          x: rect.left + rect.width / 2,
          y: rect.bottom,
        },
      });

      const resolved = await lookupWordInstant(cleanText, fullSentence);
      if (requestIdRef.current === currentReqId) {
        setPopupState({
          isOpen: true,
          vocab: resolved,
          position: {
            x: rect.left + rect.width / 2,
            y: rect.bottom,
          },
        });
      }
    } catch {
      const resolved = await lookupWordInstant(cleanText);
      if (requestIdRef.current === currentReqId) {
        setPopupState({
          isOpen: true,
          vocab: resolved,
          position: {
            x: e.clientX,
            y: e.clientY + 10,
          },
        });
      }
    }
  }, []);

  const handleVocabClick = useCallback(async (key: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const el = e?.currentTarget as HTMLElement | undefined;
    const rect = el ? el.getBoundingClientRect() : null;

    const blockEl = el?.closest('p');
    const fullParagraph = blockEl ? (blockEl.innerText || blockEl.textContent || '') : '';
    const vocabData = VOCAB_DATABASE[key];
    const targetWord = vocabData?.word || key;
    const fullSentence = fullParagraph ? extractSentenceContext(fullParagraph, targetWord) : (vocabData?.contextSentence || '');

    const position = rect
      ? { x: rect.left + rect.width / 2, y: rect.bottom }
      : { x: window.innerWidth / 2, y: window.innerHeight / 3 };

    if (vocabData) {
      setPopupState({
        isOpen: true,
        vocab: {
          ...vocabData,
          contextSentence: fullSentence || vocabData.contextSentence,
        },
        position,
      });
      return;
    }

    const currentReqId = ++requestIdRef.current;
    setPopupState({
      isOpen: true,
      vocab: {
        id: key,
        word: targetWord,
        pos: 'Đang tra cứu...',
        ipa: '/.../',
        viMeaning: 'Đang tải nghĩa & phiên âm IPA...',
        contextSentence: fullSentence,
      },
      position,
    });

    const resolved = await lookupWordInstant(targetWord, fullSentence);
    if (requestIdRef.current === currentReqId) {
      setPopupState({
        isOpen: true,
        vocab: resolved,
        position,
      });
    }
  }, []);

  return {
    popupState,
    closeDictionary,
    handleTextSelection,
    handleVocabClick,
  };
}
