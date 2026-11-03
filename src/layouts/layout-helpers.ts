/**
 * Helper to compute active view name for navigation highlighting based on pathname.
 * Automatically normalizes localized route prefixes (e.g. /vi/... or /en/...).
 */
export const getActiveView = (pathname: string): string => {
  const clean = pathname.replace(/^\/(vi|en)(\/|$)/, '/');
  if (clean === '/' || clean === '/landing') return 'landing';
  if (clean.startsWith('/login')) return 'login';
  if (clean.startsWith('/home')) return 'home';
  if (clean.startsWith('/discovery')) return 'discovery';
  if (clean.startsWith('/reader') || clean.startsWith('/bilingual-reader')) return 'reader';
  if (clean.startsWith('/dictionary') || clean.startsWith('/flashcard-library')) return 'dictionary';
  if (clean.startsWith('/flashcard-study') || clean.startsWith('/flashcards')) return 'flashcard-study';
  if (clean.startsWith('/community-2') || clean.startsWith('/community-contest')) return 'community-contest';
  if (clean.startsWith('/community')) return 'community';
  if (clean.startsWith('/playground')) return 'playground';
  if (clean.startsWith('/ai-workspace')) return 'ai-workspace';
  if (clean.startsWith('/admin')) return 'admin';
  if (clean.startsWith('/pricing') || clean.startsWith('/checkout') || clean.startsWith('/subscription')) {
    return 'pricing';
  }
  if (
    clean.startsWith('/profile') ||
    clean.startsWith('/account') ||
    clean.startsWith('/passport') ||
    clean.startsWith('/achievements')
  ) {
    return 'profile';
  }
  return 'landing';
};
