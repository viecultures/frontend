import { useState, useEffect, useCallback, useRef } from 'react';
import { rewardApiService, RewardApiError } from '../services/rewardApiService';
import type {
  StoryRewardStatusResponse,
  StampClaimResponse,
  ReadConfirmationResponse,
} from '../types/rewardTypes';
import { getStoredToken } from '@/utils/auth-storage';

/**
 * Advisory helper for canonical story ID pattern.
 * Strictly secondary to server-provided storyId from articleData or confirm-read response.
 * Never used to fabricate authoritative reward eligibility.
 */
export function deriveAdvisoryStoryId(articleId: string | undefined): string | null {
  if (!articleId) return null;
  const match = articleId.match(/^([a-z-]+?)-(\d+)-([a-z0-9]+)$/i);
  if (match) {
    const foodSlug = match[1];
    const chapter = match[2];
    return `${foodSlug}-chapter-${chapter}`;
  }
  return null;
}

export interface UseStoryRewardReturn {
  storyId: string | null;
  foodId: string | null;
  status: StoryRewardStatusResponse | null;
  hasStamp: boolean;
  hasReadConfirmed: boolean;
  eligibleToClaim: boolean;
  lastClaim: StampClaimResponse | null;
  isLoading: boolean;
  isConfirming: boolean;
  isClaiming: boolean;
  error: string | null;
  confirmReading: () => Promise<ReadConfirmationResponse | null>;
  claimStamp: () => Promise<StampClaimResponse | null>;
  refetchStatus: () => Promise<void>;
  clearError: () => void;
}

export function useStoryReward(
  articleId: string | undefined,
  serverStoryId?: string
): UseStoryRewardReturn {
  // Authoritative story identity: strictly initialized with serverStoryId.
  // Never fabricates reward eligibility for unmapped articles.
  const [resolvedStoryId, setResolvedStoryId] = useState<string | null>(
    () => serverStoryId || null
  );
  const [foodId, setFoodId] = useState<string | null>(null);
  const [status, setStatus] = useState<StoryRewardStatusResponse | null>(null);
  const [lastClaim, setLastClaim] = useState<StampClaimResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ── Synchronize story identity when articleId or serverStoryId changes ─────
  useEffect(() => {
    isMountedRef.current = true;
    // Invalidate stale state when switching articles
    setResolvedStoryId(serverStoryId || null);
    setStatus(null);
    setLastClaim(null);
    setError(null);
    setFoodId(null);

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [articleId, serverStoryId]);

  // ── Fetch story reward status from backend (Server Truth) ───────────────────
  const fetchStatus = useCallback(async () => {
    const activeStoryId = resolvedStoryId;
    if (!activeStoryId) {
      // Unmapped article or identity not yet resolved by server: do not fabricate eligibility
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
      const serverStatus = await rewardApiService.getStoryRewardStatus(
        activeStoryId,
        controller.signal
      );
      if (isMountedRef.current) {
        setStatus(serverStatus);
        setFoodId(serverStatus.foodId || null);
        setError(null);
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return;
      if (isMountedRef.current) {
        console.warn(`[useStoryReward] Could not load reward status for story ${activeStoryId}:`, err);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [resolvedStoryId]);

  // ── Fetch on mount and strictly isolate auth changes (Login / Logout) ──────
  useEffect(() => {
    if (resolvedStoryId) {
      void fetchStatus();
    }

    const handleAuthChange = () => {
      const token = getStoredToken();
      if (!token) {
        // Guest logout: immediately wipe previous user's reward state
        setStatus(null);
        setLastClaim(null);
        setError(null);
      } else if (resolvedStoryId) {
        // Authenticated login / switch: refetch reward status for new user
        void fetchStatus();
      }
    };

    window.addEventListener('auth:change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth:change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [fetchStatus, resolvedStoryId]);

  // ── Listen to cross-component reward events without redundant event loops ──
  useEffect(() => {
    const handleExternalStampClaimed = (event: Event) => {
      const customEvent = event as CustomEvent<{
        stampId: string;
        storyId: string;
        foodId: string;
        newStamp: boolean;
      }>;
      const detail = customEvent.detail;
      if (detail && detail.storyId === resolvedStoryId) {
        // Update local state without re-dispatching to avoid recursive loops
        setStatus((prev) => ({
          storyId: detail.storyId,
          foodId: detail.foodId,
          readConfirmed: true,
          readConfirmedAt: prev?.readConfirmedAt || new Date().toISOString(),
          hasStamp: true,
          stampAwardedAt: prev?.stampAwardedAt || new Date().toISOString(),
          eligibleToClaim: false,
        }));
      }
    };

    window.addEventListener('reward:stamp:claimed', handleExternalStampClaimed);
    return () => {
      window.removeEventListener('reward:stamp:claimed', handleExternalStampClaimed);
    };
  }, [resolvedStoryId]);

  // ── 1. Confirm Reading API (Authoritative Server Handshake) ──────────────────
  const confirmReading = useCallback(async (): Promise<ReadConfirmationResponse | null> => {
    if (!articleId) return null;
    const token = getStoredToken();
    if (!token) {
      // Guest: learning session is recorded locally, but reward server is not invoked
      return null;
    }

    // Synchronous guard against double-clicks
    if (isConfirming) return null;
    setIsConfirming(true);
    setError(null);

    try {
      const response = await rewardApiService.confirmRead(articleId);
      if (isMountedRef.current) {
        // Server confirms mapping and returns canonical storyId + foodId
        setResolvedStoryId(response.storyId);
        setFoodId(response.foodId);
        setStatus((prev) => ({
          storyId: response.storyId,
          foodId: response.foodId,
          readConfirmed: true,
          readConfirmedAt: response.confirmedAt,
          hasStamp: prev?.hasStamp || response.alreadyClaimedStamp,
          stampAwardedAt: prev?.stampAwardedAt || null,
          eligibleToClaim: response.eligibleToClaimStamp,
        }));
      }
      return response;
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const msg = err instanceof RewardApiError ? err.message : 'Không thể ghi nhận đọc bài viết. Vui lòng thử lại.';
        setError(msg);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setIsConfirming(false);
      }
    }
  }, [articleId, isConfirming]);

  // ── 2. Claim Story Stamp API (Ceremonial Mộc Son v2) ─────────────────────────
  const claimStamp = useCallback(async (): Promise<StampClaimResponse | null> => {
    const activeStoryId = resolvedStoryId;
    if (!activeStoryId) {
      setError('Bài viết này chưa được liên kết với câu chuyện di sản có Mộc Son.');
      return null;
    }

    const token = getStoredToken();
    if (!token) {
      setError('Vui lòng đăng nhập để lưu trữ Mộc Son vào Hộ chiếu Văn hóa.');
      return null;
    }

    // Synchronous guard against double clicks
    if (isClaiming) return null;
    setIsClaiming(true);
    setError(null);

    try {
      const claimResp = await rewardApiService.claimStoryStamp(activeStoryId);
      if (isMountedRef.current) {
        setLastClaim(claimResp);
        setFoodId(claimResp.foodId);
        setStatus((prev) => ({
          storyId: activeStoryId,
          foodId: claimResp.foodId,
          readConfirmed: true,
          readConfirmedAt: prev?.readConfirmedAt || claimResp.awardedAt,
          hasStamp: true,
          stampAwardedAt: claimResp.awardedAt,
          eligibleToClaim: false,
        }));

        // Notify other listeners (e.g. JourneyPanel or CulturalPassport)
        window.dispatchEvent(
          new CustomEvent('reward:stamp:claimed', {
            detail: {
              stampId: claimResp.stampId,
              storyId: activeStoryId,
              foodId: claimResp.foodId,
              newStamp: claimResp.newStamp,
              unlockedSticker: claimResp.unlockedSticker,
            },
          })
        );
      }
      return claimResp;
    } catch (err: unknown) {
      // Ambiguous failure (network drop, 409 conflict, or gateway timeout):
      // Refetch actual server truth before reporting state
      try {
        const latestStatus = await rewardApiService.getStoryRewardStatus(activeStoryId);
        if (isMountedRef.current && latestStatus.hasStamp) {
          // Server already persisted the stamp: safely transition to owned state
          setStatus(latestStatus);
          setLastClaim({
            stampId: latestStatus.storyId,
            storyId: latestStatus.storyId,
            foodId: latestStatus.foodId,
            newStamp: false,
            awardedAt: latestStatus.stampAwardedAt || new Date().toISOString(),
            awardSource: 'READER_CONFIRM',
            foodRuleVersion: 1,
            completedStoriesCount: 1,
            totalRequiredStoriesCount: 1,
            message: 'Mộc Son đã được xác nhận sở hữu trên hệ thống.',
          });
          return null;
        }
      } catch {
        // Ignore secondary status fetch failure; report primary error
      }

      if (isMountedRef.current) {
        const msg = err instanceof RewardApiError ? err.message : 'Không thể nhận Mộc Son. Vui lòng kiểm tra kết nối và thử lại.';
        setError(msg);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setIsClaiming(false);
      }
    }
  }, [resolvedStoryId, isClaiming]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    storyId: resolvedStoryId,
    foodId,
    status,
    hasStamp: !!status?.hasStamp,
    hasReadConfirmed: !!status?.readConfirmed,
    eligibleToClaim: !!status?.eligibleToClaim,
    lastClaim,
    isLoading,
    isConfirming,
    isClaiming,
    error,
    confirmReading,
    claimStamp,
    refetchStatus: fetchStatus,
    clearError,
  };
}
