export interface CommunityComment {
  id: string;
  authorName: string;
  avatarText: string;
  timeAgo: string;
  text: string;
}

export interface HighlightVocabItem {
  word: string;
  ipa: string;
  meaning: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  avatarText: string;
  timeAgo: string;
  lessonTag: string;
  topicCategory: 'architecture' | 'cuisine' | 'festivals' | 'crafts' | 'general';
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
