import { useEffect, type RefObject } from 'react';
import { getStoredUser } from '@/utils/auth-storage';
import { readReadingHistory, saveReadingBookmark } from '@/features/home/lib/studyRoomStorage';
import type { ReaderArticleData } from '../services/readerApiService';

/** Remember the actual pane position; scrolling is not treated as lesson completion. */
export function useReadingBookmark(
  article: ReaderArticleData | null | undefined,
  level: string,
  leftRef: RefObject<HTMLDivElement | null>,
  rightRef: RefObject<HTMLDivElement | null>,
) {
  const account = getStoredUser()?.email || 'guest';
  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!article || !left) return;
    const saved = readReadingHistory(account).find(item => item.id === article.id && item.level === level);
    let position = saved?.position || 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let interacted = false;
    const persist = () => saveReadingBookmark(account, {
      id: article.id, level, title: article.titleEn,
      image: article.imageUrl || '/images/landing/hoi-an-lanterns.webp',
      topic: article.topic, position, updatedAt: Date.now(),
    });
    const restore = () => {
      if (interacted) return;
      left.scrollTop = position * Math.max(0, left.scrollHeight - left.clientHeight);
      if (right) right.scrollTop = position * Math.max(0, right.scrollHeight - right.clientHeight);
    };
    const onInteraction = () => { interacted = true; };
    const onScroll = (event: Event) => {
      if (!interacted) return;
      const pane = event.currentTarget as HTMLDivElement;
      const maximum = pane.scrollHeight - pane.clientHeight;
      if (maximum <= 0) return;
      position = Math.min(1, Math.max(0, pane.scrollTop / maximum));
      clearTimeout(timer);
      timer = setTimeout(persist, 300);
    };
    const panes = [left, right].filter((pane): pane is HTMLDivElement => Boolean(pane));
    const observer = new ResizeObserver(restore);
    panes.forEach(pane => {
      observer.observe(pane);
      if (pane.firstElementChild) observer.observe(pane.firstElementChild);
      pane.addEventListener('scroll', onScroll, { passive: true });
      pane.addEventListener('wheel', onInteraction, { passive: true });
      pane.addEventListener('touchstart', onInteraction, { passive: true });
      pane.addEventListener('pointerdown', onInteraction);
      pane.addEventListener('keydown', onInteraction);
      pane.addEventListener('load', restore, true);
    });
    const frame = requestAnimationFrame(restore);
    persist();
    window.addEventListener('pagehide', persist);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pagehide', persist);
      panes.forEach(pane => {
        pane.removeEventListener('scroll', onScroll);
        pane.removeEventListener('wheel', onInteraction);
        pane.removeEventListener('touchstart', onInteraction);
        pane.removeEventListener('pointerdown', onInteraction);
        pane.removeEventListener('keydown', onInteraction);
        pane.removeEventListener('load', restore, true);
      });
      persist();
    };
  }, [article, level, account, leftRef, rightRef]);
}
