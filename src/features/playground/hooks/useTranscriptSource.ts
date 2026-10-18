import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { dictationApiService } from '../services/dictationService';
import type { YtbTranscriptData } from '../services/dictationService';
import { extractYouTubeId } from '../lib/shadowing-lesson';

const transcriptSchema = z.object({
  videoId: z.string().regex(/^[\w-]{11}$/), title: z.string(),
  snippets: z.array(z.object({ text: z.string(), start: z.number().finite().nonnegative(), duration: z.number().finite().positive() })).min(1).max(300),
});
export type TranscriptMode = 'SHADOWING' | 'SENTENCE' | 'COMMA' | 'RAW';

export function useTranscriptSource() {
  const [loading, setLoading] = useState(false), [error, setError] = useState<string | null>(null);
  const generation = useRef(0), mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; ++generation.current; }; }, []);
  const load = useCallback(async (url: string, language: string, mode: TranscriptMode, clean: boolean): Promise<YtbTranscriptData | null> => {
    const videoId = extractYouTubeId(url);
    if (!videoId) { setError('Enter a valid YouTube URL or video ID.'); return null; }
    const request = ++generation.current; setLoading(true); setError(null);
    const result = await dictationApiService.fetchYtbTranscript(url, language, mode, clean);
    if (!mounted.current || request !== generation.current) return null;
    setLoading(false);
    const data = result.data?.success ? result.data.data : null;
    if (!data || !transcriptSchema.safeParse(data).success || data.videoId !== videoId) {
      setError(result.error || 'The transcript is invalid or does not match this video. Check its sentences and timing, then try again.'); return null;
    }
    return data;
  }, []);
  return { load, loading, error };
}
