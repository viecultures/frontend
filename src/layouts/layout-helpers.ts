/**
 * Helper to compute active view name for navigation highlighting based on pathname.
 */
export const getActiveView = (pathname: string): string => {
  if (pathname === '/' || pathname === '/landing') return 'landing';
  if (pathname.startsWith('/login')) return 'login';
  if (pathname.startsWith('/home')) return 'home';
  if (pathname.startsWith('/discovery')) return 'discovery';
  if (pathname.startsWith('/reader') || pathname.startsWith('/bilingual-reader')) return 'reader';
  if (pathname.startsWith('/dictionary') || pathname.startsWith('/flashcard-library')) return 'dictionary';
  if (pathname.startsWith('/flashcard-study')) return 'flashcard-study';
  if (pathname.startsWith('/community-2') || pathname.startsWith('/community-contest')) return 'community-contest';
  if (pathname.startsWith('/community')) return 'community';
  if (pathname.startsWith('/playground')) return 'playground';
  if (pathname.startsWith('/ai-workspace')) return 'ai-workspace';
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/pricing') || pathname.startsWith('/checkout') || pathname.startsWith('/subscription')) {
    return 'pricing';
  }
  if (
    pathname.startsWith('/profile') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/passport') ||
    pathname.startsWith('/achievements')
  ) {
    return 'profile';
  }
  return 'landing';
};

