/**
 * Reward System v1.0 Types for VieCultures Frontend
 * Strictly aligned with Backend DTO contracts on branch feat/reward-system-p5b.
 */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
}

export interface ReadConfirmationRequest {
  articleId: string;
}

export interface ReadConfirmationResponse {
  articleId: string;
  storyId: string;
  foodId: string;
  confirmedAt: string;
  firstConfirmation: boolean;
  eligibleToClaimStamp: boolean;
  alreadyClaimedStamp: boolean;
  message: string;
}

export interface StoryRewardStatusResponse {
  storyId: string;
  foodId: string;
  readConfirmed: boolean;
  readConfirmedAt?: string | null;
  hasStamp: boolean;
  stampAwardedAt?: string | null;
  eligibleToClaim: boolean;
}

export interface StoryStampDto {
  stampId: string;
  storyId: string;
  foodId: string;
  storyTitleEn: string;
  awardedAt: string;
  awardSource: string;
}

export interface FoodStickerAwardDto {
  stickerId: string;
  foodId: string;
  displayName: string;
  ruleVersion: number;
  unlockedAt: string;
  newUnlock: boolean;
  requiredStoriesSnapshot: string[];
  awardSource: string;
}

export interface StampClaimResponse {
  stampId: string;
  storyId: string;
  foodId: string;
  newStamp: boolean;
  awardedAt: string;
  awardSource: string;
  foodRuleVersion: number;
  completedStoriesCount: number;
  totalRequiredStoriesCount: number;
  unlockedSticker?: FoodStickerAwardDto | null;
  message: string;
}

export interface FoodJourneyProgressDto {
  foodId: string;
  displayName: string;
  ruleVersion: number;
  assignedRule: boolean;
  ruleAssignedAt?: string | null;
  totalRequiredStories: number;
  completedStoriesCount: number;
  requiredStoryIds: string[];
  completedStoryIds: string[];
  stickerUnlocked: boolean;
  stickerAward?: FoodStickerAwardDto | null;
}
