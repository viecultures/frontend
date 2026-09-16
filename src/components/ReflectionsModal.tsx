import React, { useState } from 'react';
import { 
  X, MessageSquare, Heart, ShieldCheck, Send, 
  Sparkles, Flag, Plus, CheckCircle2 
} from 'lucide-react';
import type { Lesson, UserReflection } from '../types';
import { MOCK_REFLECTIONS } from '../data/mockData';

interface ReflectionsModalProps {
  lesson?: Lesson;
  onClose: () => void;
}

export const ReflectionsModal: React.FC<ReflectionsModalProps> = ({
  lesson,
  onClose,
}) => {
  const [reflections, setReflections] = useState<UserReflection[]>(MOCK_REFLECTIONS);
  const [newContent, setNewContent] = useState<string>('');
  const selectedLessonTitle = lesson ? lesson.titleEn : 'The Imperial City of Hue';
  const [usedVocabList, setUsedVocabList] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Available vocabularies for insertion
  const availableVocabs = lesson ? lesson.vocabularies : [
    { word: 'monumental' },
    { word: 'epitome' },
    { word: 'geomancy' },
    { word: 'intricate' },
    { word: 'evocative' },
    { word: 'transformation' },
    { word: 'juxtaposition' },
    { word: 'succulent' },
  ];

  const handleInsertVocab = (word: string) => {
    setNewContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + `"${word}" `);
    if (!usedVocabList.includes(word)) {
      setUsedVocabList(prev => [...prev, word]);
    }
  };

  const handleToggleLike = (refId: string) => {
    setReflections(prev => prev.map(r => {
      if (r.id === refId) {
        const isLiked = r.userLiked;
        return {
          ...r,
          likes: isLiked ? r.likes - 1 : r.likes + 1,
          userLiked: !isLiked
        };
      }
      return r;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    // Detect used vocabs automatically from text
    const detectedVocabs = availableVocabs
      .map(v => v.word.toLowerCase())
      .filter(w => newContent.toLowerCase().includes(w));

    const newReflection: UserReflection = {
      id: `ref-${Date.now()}`,
      lessonId: lesson ? lesson.id : 'custom',
      lessonTitle: selectedLessonTitle,
      authorName: 'Bạn (Người học)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      authorLevel: lesson?.level || 'B1',
      content: newContent,
      usedVocab: Array.from(new Set([...usedVocabList, ...detectedVocabs])),
      createdAt: 'Vừa xong',
      likes: 1,
      userLiked: true
    };

    setReflections([newReflection, ...reflections]);
    setNewContent('');
    setUsedVocabList([]);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                  Cộng Đồng Cảm Nghĩ • No-Judgment Zone
                </span>
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-slate-100">
                {lesson ? lesson.titleEn : 'Chia sẻ góc nhìn văn hóa của bạn'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* No-Judgment Safe Environment Banner */}
        <div className="px-6 py-3 bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border-b border-teal-500/30 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-300/90 leading-tight">
            <strong>Môi trường an toàn:</strong> Không áp dụng chấm điểm hay sửa lỗi ngữ pháp. Hãy tự tin dùng các từ vựng học thuật vừa học để diễn đạt suy nghĩ của bạn!
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Editor Form Card */}
          <form onSubmit={handleSubmit} className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Viết cảm nghĩ về bài đọc:
              </span>
              <span className="text-[11px] text-slate-400">
                Gợi ý: Click từ bên dưới để chèn nhanh
              </span>
            </div>

            {/* Quick Vocab Insertion Toolbar (Specified in Screen Specs) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">Chèn từ:</span>
              {availableVocabs.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleInsertVocab(v.word)}
                  className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{v.word}</span>
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Chia sẻ cảm xúc của bạn bằng tiếng Anh hoặc suy nghĩ về bài đọc (ví dụ: I feel so proud learning about the monumental architecture of Hue Citadel...)"
                rows={3}
                className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 transition-all resize-none"
              />
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-400">
                {usedVocabList.length > 0 ? (
                  <span className="text-emerald-400 font-medium">
                    ✓ Đã dùng: {usedVocabList.join(', ')}
                  </span>
                ) : (
                  <span>Tự do chia sẻ cảm xúc không áp lực</span>
                )}
              </div>

              <button
                type="submit"
                disabled={!newContent.trim()}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Đăng cảm nghĩ</span>
              </button>
            </div>

            {isSubmitted && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cảm nghĩ của bạn đã được đăng thành công lên bảng tin cộng đồng!</span>
              </div>
            )}
          </form>

          {/* Community Reflections Feed */}
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-200 mb-4 flex items-center gap-2">
              <span>Bảng Tin Cảm Nghĩ Cộng Đồng</span>
              <span className="text-xs font-sans font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {reflections.length} bài chia sẻ
              </span>
            </h3>

            <div className="space-y-4">
              {reflections.map((item) => (
                <div 
                  key={item.id}
                  className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.authorAvatar}
                        alt={item.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-200">{item.authorName}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {item.authorLevel}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{item.createdAt} • Về "{item.lessonTitle}"</span>
                      </div>
                    </div>

                    <button className="text-slate-600 hover:text-slate-400 p-1" title="Báo cáo vi phạm">
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Content with highlighted academic vocabs */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                    {item.content}
                  </p>

                  {/* Badges of used vocabs & likes */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.usedVocab.map((w, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20"
                        >
                          ✨ {w}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleToggleLike(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                        item.userLiked
                          ? 'text-pink-400 bg-pink-500/15'
                          : 'text-slate-400 hover:text-pink-400 hover:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.userLiked ? 'fill-pink-400' : ''}`} />
                      <span>{item.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
