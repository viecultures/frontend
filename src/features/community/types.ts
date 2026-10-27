export interface CommunityComment {
  id: string;
  authorName: string;
  avatarText: string;
  timeAgo: string;
  text: string;
  likesCount?: number;
  userLiked?: boolean;
  replies?: CommunityComment[];
}

export interface HighlightVocabItem {
  word: string;
  ipa?: string;
  meaning: string;
  partOfSpeech?: string;
  synonyms?: string[];
  exampleSentence?: string;
  isSaved?: boolean;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  avatarText: string;
  avatarUrl?: string;
  isAmbassador?: boolean;
  authorBio?: string;
  authorFollowing?: boolean;
  timeAgo: string;
  lessonTag: string;
  topicCategory: 'architecture' | 'cuisine' | 'festivals' | 'crafts' | 'general';
  topicSlug?: 'imperial-hue' | 'saigon-food' | 'hoi-an' | 'vietnamese-traditions';
  title?: string;
  contentEn: string;
  highlightWords: HighlightVocabItem[] | string[];
  heartsCount: number;
  commentsCount: number;
  bookmarksCount?: number;
  userLiked?: boolean;
  userBookmarked?: boolean;
  imageCaption?: string;
  imageUrl?: string;
  imageBgGradient?: string;
  comments?: CommunityComment[];
  feedType?: 'for-you' | 'following' | 'latest' | 'trending';
}

export interface TopAmbassadorItem {
  name: string;
  role: string;
  points: string;
  initials: string;
  rank: number;
  avatarUrl?: string;
}

export interface ContestEntry {
  id: string;
  rankTag?: string;
  rankClass?: string;
  authorName: string;
  authorBadge?: string;
  authorSub: string;
  avatarText: string;
  title: string;
  excerpt: string;
  fullStory?: string;
  usedVocab: string[];
  votesCount: number;
  commentsCount: number;
  rewardCoins: number;
  userVoted?: boolean;
  imageCaption?: string;
  imageUrl?: string;
  imageBgGradient?: string;
  comments?: CommunityComment[];
}

export interface GamificationShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  iconType: 'audio' | 'theme' | 'badge' | 'mentor';
  unlocked: boolean;
  category: string;
}

export interface UserReflectionItem {
  id: string;
  postId: string;
  userId?: string;
  authorName: string;
  authorRole?: string;
  avatarText: string;
  content: string;
  usedVocabIds?: string[];
  usedWords?: string[];
  reactionsCount: number;
  userLiked?: boolean;
  status: 'published' | 'pending_review';
  createdAt: string;
  timeAgo?: string;
  isReported?: boolean;
}
