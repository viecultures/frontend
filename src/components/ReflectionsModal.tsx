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
  const selectedLessonTitle = lesson ? lesson.titleEn : 'Dong Ho Folk Woodcut Paintings';
  const [usedVocabList, setUsedVocabList] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const availableVocabs = lesson ? lesson.vocabularies : [
    { word: 'quintessence' },
    { word: 'aesthetics' },
    { word: 'pigments' },
    { word: 'auspicious' },
    { word: 'monumental' },
    { word: 'geomancy' },
    { word: 'enduring' },
    { word: 'juxtaposition' },
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

    const detectedVocabs = availableVocabs
      .map(v => v.word.toLowerCase())
      .filter(w => newContent.toLowerCase().includes(w));

    const newReflection: UserReflection = {
      id: `ref-${Date.now()}`,
      lessonId: lesson ? lesson.id : 'custom',
      lessonTitle: selectedLessonTitle,
      authorName: 'Bạn (Người học)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      authorLevel: lesson?.level || 'B2',
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0D1C18]/95 border border-white/20 rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-white/10 text-[#F5D280] flex items-center justify-center border border-white/15">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-semibold border border-teal-500/30">
                  Cộng Đồng Cảm Nghĩ • No-Judgment Zone
                </span>
              </div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-white">
                {lesson ? lesson.titleEn : 'Chia sẻ góc nhìn văn hóa của bạn'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safe Environment Banner */}
        <div className="px-6 py-3 bg-emerald-950/40 border-b border-white/10 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-200/90 leading-tight font-normal">
            <strong>Môi trường an toàn:</strong> Không áp dụng chấm điểm hay soi lỗi ngữ pháp. Hãy tự tin dùng các từ vựng học thuật vừa học để diễn đạt suy nghĩ của bạn!
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Editor Form Card */}
          <form onSubmit={handleSubmit} className="bg-black/40 p-5 rounded-[20px] border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-[#F5D280]" />
                Viết cảm nghĩ về bài đọc:
              </span>
              <span className="text-xs text-white/60 font-normal">
                Gợi ý: Click từ bên dưới để chèn nhanh
              </span>
            </div>

            {/* Quick Vocab Insertion Toolbar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-white/60 shrink-0 font-medium">Chèn từ:</span>
              {availableVocabs.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleInsertVocab(v.word)}
                  className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-[#FCE5B5] border border-white/15 hover:bg-[#FCE5B5] hover:text-[#18221E] transition-all flex items-center gap-1"
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
                placeholder="Chia sẻ cảm xúc của bạn (ví dụ: Learning about the quintessence of Vietnamese art makes me feel so proud...)"
                rows={3}
                className="w-full p-4 rounded-[16px] bg-black/50 border border-white/15 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#FCE5B5] transition-all resize-none"
              />
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-xs text-white/60">
                {usedVocabList.length > 0 ? (
                  <span className="text-[#FCE5B5] font-medium">
                    ✓ Đã dùng: {usedVocabList.join(', ')}
                  </span>
                ) : (
                  <span>Tự do chia sẻ cảm xúc không áp lực</span>
                )}
              </div>

              <button
                type="submit"
                disabled={!newContent.trim()}
                className="btn-pill-primary px-5 py-2.5 text-xs font-semibold"
              >
                <Send className="w-3.5 h-3.5 text-[#18221E]" />
                <span>Đăng cảm nghĩ</span>
              </button>
            </div>

            {isSubmitted && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cảm nghĩ của bạn đã được đăng thành công lên bảng tin cộng đồng!</span>
              </div>
            )}
          </form>

          {/* Community Feed */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-white mb-4 flex items-center gap-2">
              <span>Bảng Tin Cảm Nghĩ Cộng Đồng</span>
              <span className="text-xs font-sans font-medium text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                {reflections.length} bài chia sẻ
              </span>
            </h3>

            <div className="space-y-4">
              {reflections.map((item) => (
                <div 
                  key={item.id}
                  className="bg-black/30 p-5 rounded-[20px] border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.authorAvatar}
                        alt={item.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{item.authorName}</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 text-[10px] font-semibold border border-purple-500/30">
                            Band {item.authorLevel}
                          </span>
                        </div>
                        <span className="text-xs text-white/50">{item.createdAt} • Về "{item.lessonTitle}"</span>
                      </div>
                    </div>

                    <button className="text-white/40 hover:text-white/80 p-1" title="Báo cáo vi phạm">
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm text-white/85 leading-relaxed mb-3 font-normal">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.usedVocab.map((w, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#FCE5B5]/15 text-[#FCE5B5] border border-[#FCE5B5]/30"
                        >
                          ✨ {w}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleToggleLike(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                        item.userLiked
                          ? 'text-[#E58396] bg-[#E58396]/15 border-[#E58396]/30'
                          : 'text-white/60 bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.userLiked ? 'fill-[#E58396]' : ''}`} />
                      <span className="font-semibold">{item.likes}</span>
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
