/**
 * Single source of truth for frontend URLs.
 * See document/frontend-routes.md and document/frontend-routes-proposal.md.
 * Do NOT hard-code URL strings in components — use PATHS / builders below.
 */

export const PATHS = {
  landing: '/',
  login: '/login',
  home: '/home',
  discovery: '/discovery',
  reader: '/reader',
  dictionary: '/dictionary',
  flashcardStudy: '/flashcard-study',
  community: '/community',
  communityContest: '/community-contest',
  playground: '/playground',
  aiWorkspace: '/ai-workspace',
  admin: '/admin',
  pricing: '/pricing',
  checkout: '/pricing/checkout',
  profile: '/profile',
} as const;

export type AppPath = (typeof PATHS)[keyof typeof PATHS];

type QueryValue = string | number | boolean | null | undefined;

/** Build `path?query`, skipping empty values. */
export const withQuery = (path: string, query: Record<string, QueryValue> = {}): string => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== false) {
      params.set(key, value === true ? '1' : String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

export const paths = {
  login: (opts: { redirect?: string } = {}) => withQuery(PATHS.login, opts),

  profile: (opts: { tab?: 'passport' | 'badges' | 'vocab' | 'subscription' } = {}) =>
    withQuery(PATHS.profile, opts),

  reader: (opts: {
    postId?: string;
    story?: string;
    article?: string;
    level?: string;
    mode?: 'bilingual' | 'extensive';
  } = {}) => withQuery(PATHS.reader, opts),

  flashcardStudy: (opts: { deck?: string; level?: string; saved?: boolean } = {}) =>
    withQuery(PATHS.flashcardStudy, opts),

  playground: (opts: { view?: 'chat'; story?: string; topic?: string; level?: string } = {}) =>
    withQuery(PATHS.playground, opts),
  aiWorkspace: (opts: { story?: string; topic?: string; level?: string } = {}) =>
    withQuery(PATHS.aiWorkspace, opts),
};

