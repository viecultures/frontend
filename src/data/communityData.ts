export interface AmbassadorEssay {
  id: string;
  title: string;
  author: string;
  role: string;
  avatar: string;
  excerpt: string;
  publishedDate: string;
  likes: number;
}

export interface ContestEntry {
  id: string;
  title: string;
  author: string;
  avatar: string;
  votes: number;
  rank: number;
  snippet: string;
}

export const AMBASSADOR_ESSAYS: AmbassadorEssay[] = [
  {
    id: 'essay-1',
    title: 'The Resonance of Imperial Court Music in Modern Vietnam',
    author: 'TS. Nguyễn Văn Hùng',
    role: 'Nhà nghiên cứu Âm nhạc Dân tộc',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    excerpt: 'Exploring how Nhã Nhạc Hue Court Music balances ancient royal scale harmonies with contemporary acoustic arrangements...',
    publishedDate: '24/09/2026',
    likes: 342,
  },
  {
    id: 'essay-2',
    title: 'Silk Weaving Along the Red River: A Living Tapestry',
    author: 'Lê Minh Trang',
    role: 'Nghệ nhân Áo Dài Di Sản',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    excerpt: 'How Van Phuc silk artisans preserve natural mulberry dye techniques while introducing contemporary fashion cuts...',
    publishedDate: '22/09/2026',
    likes: 289,
  }
];

export const CONTEST_ENTRIES: ContestEntry[] = [
  {
    id: 'contest-1',
    title: 'Preserving Dong Ho Pigments in the 21st Century',
    author: 'Trần Đức Anh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    votes: 412,
    rank: 1,
    snippet: 'An essay on the natural indigo and scallopshell powder extraction techniques of Bac Ninh craftsmen...',
  },
  {
    id: 'contest-2',
    title: 'Banh Mi: The Geometry of Taste',
    author: 'Phạm Phương Thảo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    votes: 388,
    rank: 2,
    snippet: 'Reflections on the crisp baguette crust and herbs as a bridge between Saigon history and global street food...',
  }
];
