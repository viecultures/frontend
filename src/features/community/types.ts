export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  avatarText: string;
  timeAgo: string;
  lessonTag: string;
  contentEn: string;
  highlightWords: string[];
  heartsCount: number;
  userLiked?: boolean;
  imageCaption?: string;
  imageBgGradient?: string;
}

export interface ContestEntry {
  id: string;
  rankTag?: string;
  rankClass?: string;
  authorName: string;
  authorBadge?: string;
  authorSub: string;
  title: string;
  excerpt: string;
  votesCount: number;
  commentsCount: number;
  rewardCoins: number;
  userVoted?: boolean;
  imageCaption?: string;
}
