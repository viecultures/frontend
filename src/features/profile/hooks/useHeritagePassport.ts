import { useState, useEffect, useCallback, useRef } from 'react';
import { getStoredToken, isTokenExpired } from '@/utils/auth-storage';
import { rewardApiService, RewardApiError } from '@/features/reader/services/rewardApiService';
import type {
  StoryStampDto,
  FoodJourneyProgressDto,
  FoodStickerAwardDto,
} from '@/features/reader/types/rewardTypes';

export interface UseHeritagePassportReturn {
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  stamps: StoryStampDto[];
  foodProgress: FoodJourneyProgressDto[];
  reconcilingFoodId: string | null;
  reconcileError: string | null;
  reconcileSuccessSticker: FoodStickerAwardDto | null;
  refetch: () => Promise<void>;
  reconcileFood: (foodId: string) => Promise<FoodStickerAwardDto | null>;
  clearReconcileFeedback: () => void;
}

export function useHeritagePassport(): UseHeritagePassportReturn {
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    const token = getStoredToken();
    return !token || isTokenExpired(token);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stamps, setStamps] = useState<StoryStampDto[]>([]);
  const [foodProgress, setFoodProgress] = useState<FoodJourneyProgressDto[]>([]);
  const [reconcilingFoodId, setReconcilingFoodId] = useState<string | null>(null);
  const [reconcileError, setReconcileError] = useState<string | null>(null);
  const [reconcileSuccessSticker, setReconcileSuccessSticker] = useState<FoodStickerAwardDto | null>(null);

  const isMountedRef = useRef<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPassportData = useCallback(async () => {
    const token = getStoredToken();
    if (!token || isTokenExpired(token)) {
      if (isMountedRef.current) {
        setIsGuest(true);
        setStamps([]);
        setFoodProgress([]);
        setIsLoading(false);
        setError(null);
      }
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);
    setIsGuest(false);

    try {
      const [fetchedStamps, fetchedProgress] = await Promise.all([
        rewardApiService.getUserStamps(signal),
        rewardApiService.getUserFoodProgress(signal),
      ]);

      if (isMountedRef.current) {
        setStamps(Array.isArray(fetchedStamps) ? fetchedStamps : []);
        setFoodProgress(Array.isArray(fetchedProgress) ? fetchedProgress : []);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if (signal.aborted) return;
      if (isMountedRef.current) {
        if (err instanceof RewardApiError) {
          if (err.statusCode === 401 || err.statusCode === 403) {
            setIsGuest(true);
            setStamps([]);
            setFoodProgress([]);
            setError(null);
          } else {
            setError(err.message || 'Không thể tải bộ sưu tập phần thưởng.');
          }
        } else {
          setError('Không thể kết nối đến máy chủ phần thưởng. Vui lòng kiểm tra lại mạng.');
        }
        setIsLoading(false);
      }
    }
  }, []);

  const reconcileFood = useCallback(
    async (foodId: string): Promise<FoodStickerAwardDto | null> => {
      const token = getStoredToken();
      if (!token || isTokenExpired(token)) {
        setReconcileError('Vui lòng đăng nhập để thực hiện đối soát phần thưởng.');
        return null;
      }

      setReconcilingFoodId(foodId);
      setReconcileError(null);
      setReconcileSuccessSticker(null);

      try {
        const awardedSticker = await rewardApiService.reconcileFoodSticker(foodId);
        if (isMountedRef.current) {
          setReconcileSuccessSticker(awardedSticker);
          setReconcilingFoodId(null);
          // Refetch to synchronize full progress across UI
          void fetchPassportData();
        }
        return awardedSticker;
      } catch (err: unknown) {
        if (isMountedRef.current) {
          if (err instanceof RewardApiError) {
            setReconcileError(err.message);
          } else {
            setReconcileError('Không thể hoàn tất đối soát tem món ăn. Vui lòng thử lại sau.');
          }
          setReconcilingFoodId(null);
        }
        return null;
      }
    },
    [fetchPassportData]
  );

  const clearReconcileFeedback = useCallback(() => {
    setReconcileError(null);
    setReconcileSuccessSticker(null);
  }, []);

  // ── Initial Fetch & Event Listeners ─────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    void fetchPassportData();

    const handleAuthChange = () => {
      const token = getStoredToken();
      if (!token || isTokenExpired(token)) {
        setIsGuest(true);
        setStamps([]);
        setFoodProgress([]);
        setError(null);
      } else {
        void fetchPassportData();
      }
    };

    const handleRewardClaimed = () => {
      // Auto refresh passport data when any stamp is claimed
      void fetchPassportData();
    };

    window.addEventListener('auth:change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('reward:stamp:claimed', handleRewardClaimed);

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      window.removeEventListener('auth:change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('reward:stamp:claimed', handleRewardClaimed);
    };
  }, [fetchPassportData]);

  return {
    isGuest,
    isLoading,
    error,
    stamps,
    foodProgress,
    reconcilingFoodId,
    reconcileError,
    reconcileSuccessSticker,
    refetch: fetchPassportData,
    reconcileFood,
    clearReconcileFeedback,
  };
}
