import { useCallback } from 'react';
import { useNavigate, type NavigateOptions } from 'react-router-dom';

/**
 * Standard in-app navigation: scroll to top, then navigate to a path.
 * Always pass a value from PATHS / paths.* (see ./paths.ts) — never a "view name".
 */
export const useAppNavigate = () => {
  const navigate = useNavigate();
  return useCallback(
    (to: string, options?: NavigateOptions) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(to, options);
    },
    [navigate],
  );
};
