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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#12332B]/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF6EE] border-2 border-[#12332B] rounded-[4px] shadow-[10px_10px_0px_#12332B] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#12332B] bg-[#F8E9CF]">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-[3px] bg-[#1A7368] text-white flex items-center justify-center border-2 border-[#12332B] shadow-[2px_2px_0px_#12332B]">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="dongho-tag bg-[#E58396] text-[#12332B] text-[10px]">
                  Cảm Nghĩ Cộng Đồng • No-Judgment Zone
                </span>
              </div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#12332B]">
                {lesson ? lesson.titleEn : 'Chia sẻ góc nhìn văn hóa của bạn'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-[3px] border border-[#12332B] bg-[#FAF6EE] text-[#12332B] hover:bg-[#E58396] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* No-Judgment Safe Environment Banner */}
        <div className="px-6 py-3 bg-[#E58396]/25 border-b-2 border-[#12332B] flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#1A7368] shrink-0" />
          <p className="text-xs text-[#12332B] font-medium leading-tight">
            <strong>Môi trường an toàn:</strong> Không chấm điểm hay soi lỗi ngữ pháp. Hãy tự tin dùng các từ vựng học thuật vừa học để diễn đạt góc nhìn văn hóa của bạn!
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#FAF6EE]">
          
          {/* Editor Form Card */}
          <form onSubmit={handleSubmit} className="bg-[#FFFDF9] p-5 rounded-[4px] border-2 border-[#12332B] shadow-[4px_4px_0px_#12332B] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#12332B] flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-[#EAA22E]" />
                Viết cảm nghĩ về bài đọc:
              </span>
              <span className="text-xs text-[#4A635D] font-medium">
                Gợi ý: Click từ bên dưới để chèn nhanh
              </span>
            </div>

            {/* Quick Vocab Insertion Toolbar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-[#12332B] shrink-0">Chèn từ:</span>
              {availableVocabs.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleInsertVocab(v.word)}
                  className="shrink-0 px-2.5 py-1 rounded-[2px] text-xs font-bold bg-[#FAF6EE] text-[#12332B] border-2 border-[#12332B] shadow-[1.5px_1.5px_0px_#12332B] hover:bg-[#EAA22E] transition-all flex items-center gap-1"
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
                placeholder="Chia sẻ cảm xúc của bạn (ví dụ: Learning about the quintessence of Dong Ho woodcut aesthetics makes me so proud...)"
                rows={3}
                className="w-full p-4 rounded-[3px] bg-[#FAF6EE] border-2 border-[#12332B] text-[#12332B] text-sm placeholder-[#4A635D] focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#12332B] transition-all resize-none font-medium"
              />
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-xs text-[#4A635D]">
                {usedVocabList.length > 0 ? (
                  <span className="text-[#1A7368] font-bold">
                    ✓ Đã dùng: {usedVocabList.join(', ')}
                  </span>
                ) : (
                  <span>Tự do chia sẻ cảm xúc không áp lực</span>
                )}
              </div>

              <button
                type="submit"
                disabled={!newContent.trim()}
                className="dongho-btn dongho-btn-primary px-5 py-2.5 text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Đăng cảm nghĩ</span>
              </button>
            </div>

            {isSubmitted && (
              <div className="p-3 bg-[#1A7368]/15 border-2 border-[#1A7368] rounded-[3px] text-[#1A7368] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cảm nghĩ của bạn đã được đăng thành công lên bảng tin cộng đồng!</span>
              </div>
            )}
          </form>

          {/* Community Feed */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-[#12332B] mb-4 flex items-center gap-2">
              <span>Bảng Tin Cảm Nghĩ Cộng Đồng</span>
              <span className="text-xs font-sans font-bold text-[#12332B] bg-[#F8E9CF] px-2.5 py-0.5 rounded-[2px] border border-[#12332B]">
                {reflections.length} bài chia sẻ
              </span>
            </h3>

            <div className="space-y-4">
              {reflections.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#FFFDF9] p-5 rounded-[4px] border-2 border-[#12332B] shadow-[3px_3px_0px_#12332B]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.authorAvatar}
                        alt={item.authorName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#12332B]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#12332B]">{item.authorName}</span>
                          <span className="dongho-tag bg-[#F8E9CF] text-[#12332B] text-[10px]">
                            Band {item.authorLevel}
                          </span>
                        </div>
                        <span className="text-xs text-[#4A635D]">{item.createdAt} • Về "{item.lessonTitle}"</span>
                      </div>
                    </div>

                    <button className="text-[#4A635D] hover:text-[#E58396] p-1" title="Báo cáo vi phạm">
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm text-[#12332B] leading-relaxed mb-3">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#12332B]/10 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.usedVocab.map((w, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-[2px] text-[10px] font-bold bg-[#EAA22E] text-[#12332B] border border-[#12332B]"
                        >
                          ❖ {w}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleToggleLike(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border border-[#12332B] transition-all ${
                        item.userLiked
                          ? 'text-[#12332B] bg-[#E58396] shadow-[1px_1px_0px_#12332B]'
                          : 'text-[#12332B] bg-[#FAF6EE] hover:bg-[#F8E9CF]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.userLiked ? 'fill-[#12332B]' : ''}`} />
                      <span className="font-bold">{item.likes}</span>
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
