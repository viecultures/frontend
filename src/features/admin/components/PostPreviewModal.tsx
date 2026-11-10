import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  BookOpen,
  Layers,
  MapPin,
  Clock,
  Bookmark,
  Compass,
  Volume2,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import type { ReadingPostItem } from '../types/adminTypes';
import { AdminDialog } from './AdminDialog';
import { adminRegionLabel, adminTopicLabel } from '../admin-presentation';
import { HeritageImage } from '@/components/common/HeritageImage';

interface PostPreviewModalProps {
  post: ReadingPostItem | null;
  onClose: () => void;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({ post, onClose }) => {
  const [previewMode, setPreviewMode] = useState<'reader' | 'card'>('reader');
  const [bilingualMode, setBilingualMode] = useState<'both' | 'en' | 'vi'>('both');

  if (!post) return null;

  return (
    <AdminDialog title="Xem trước bài đọc" onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 bg-heritage-green text-warm-ivory flex items-center justify-between border-b border-antique-gold/30 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-antique-gold uppercase tracking-wider">
                {adminRegionLabel(post.region)} · CEFR {post.level}
              </span>
              {post.journeyTitleEn && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-antique-gold/20 text-warm-ivory border border-antique-gold/40 flex items-center gap-1">
                  <Compass aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                  <span>Chặng {post.chapterOrder || 1}: {post.journeyTitleEn}</span>
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg">
              {post.titleEn}
            </h3>
            <p className="text-xs text-warm-ivory/80 italic">{post.titleVi}</p>
          </div>

          <button
            aria-label="Đóng xem trước"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-warm-ivory cursor-pointer"
          >
            <X aria-hidden="true" className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Bar */}
        <div className="px-6 py-2.5 bg-warm-ivory/80 dark:bg-white/5 border-b border-antique-gold/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode('reader')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                previewMode === 'reader'
                  ? 'bg-heritage-green text-warm-ivory shadow-xs'
                  : 'text-text-muted hover:text-heritage-green'
              }`}
            >
              <BookOpen aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
              <span>Giao diện đọc (Reader View)</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('card')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                previewMode === 'card'
                  ? 'bg-heritage-green text-warm-ivory shadow-xs'
                  : 'text-text-muted hover:text-heritage-green'
              }`}
            >
              <Layers aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
              <span>Thẻ khám phá (Discovery Card)</span>
            </button>
          </div>

          {previewMode === 'reader' && (
            <div className="flex items-center gap-1 bg-white/60 dark:bg-heritage-dark/80 p-1 rounded-xl border border-antique-gold/20 text-[11px]">
              <button
                type="button"
                onClick={() => setBilingualMode('both')}
                className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                  bilingualMode === 'both' ? 'bg-antique-gold text-rice-paper font-bold' : 'text-text-muted'
                }`}
              >
                Song ngữ
              </button>
              <button
                type="button"
                onClick={() => setBilingualMode('en')}
                className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                  bilingualMode === 'en' ? 'bg-antique-gold text-rice-paper font-bold' : 'text-text-muted'
                }`}
              >
                Chỉ EN
              </button>
              <button
                type="button"
                onClick={() => setBilingualMode('vi')}
                className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                  bilingualMode === 'vi' ? 'bg-antique-gold text-rice-paper font-bold' : 'text-text-muted'
                }`}
              >
                Chỉ VI
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* ════ CHẾ ĐỘ 1: DISCOVERY CARD VIEW ════ */}
          {previewMode === 'card' && (
            <div className="max-w-md mx-auto p-4 bg-warm-ivory dark:bg-white/5 rounded-3xl border border-antique-gold/30 shadow-md space-y-4">
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider text-center border-b border-antique-gold/20 pb-2">
                Minh họa hiển thị thẻ trên /discovery?view=stories
              </div>

              <article className="rounded-2xl overflow-hidden bg-rice-paper dark:bg-heritage-dark border border-antique-gold/30 shadow-sm flex flex-col">
                <div className="aspect-video w-full relative bg-stone-200 overflow-hidden">
                  {post.imageUrl ? (
                    <HeritageImage
                      src={post.imageUrl}
                      alt={post.titleEn}
                      category={post.topic}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-2">
                      <BookOpen aria-hidden="true" className="w-8 h-8 text-antique-gold" />
                      <span className="text-xs">{adminTopicLabel(post.topic)}</span>
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-warm-ivory backdrop-blur-xs">
                    {post.level}
                  </span>
                  {post.journeyTitleEn && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold text-rice-paper shadow-sm">
                      Chặng {post.chapterOrder || 1}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2 flex-1">
                  <div className="flex items-center justify-between text-[11px] text-antique-gold font-bold">
                    <span>{adminTopicLabel(post.topic)}</span>
                    <span className="text-text-muted">{adminRegionLabel(post.region)}</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-heritage-green dark:text-warm-ivory line-clamp-2">
                    {post.titleEn}
                  </h4>
                  <p className="text-xs text-text-muted italic line-clamp-1">{post.titleVi}</p>
                  <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                    {post.summary || post.contentEn?.slice(0, 150) || 'Chưa có mô tả tóm tắt.'}
                  </p>
                </div>

                <div className="px-4 py-3 border-t border-antique-gold/20 flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                    <span>{post.readTime || '3 phút đọc'}</span>
                  </span>
                  <button
                    type="button"
                    className="p-1 rounded-lg text-text-muted hover:text-heritage-green transition-colors"
                  >
                    <Bookmark aria-hidden="true" className="w-4 h-4" />
                  </button>
                </div>
              </article>
            </div>
          )}

          {/* ════ CHẾ ĐỘ 2: READER VIEW ════ */}
          {previewMode === 'reader' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Cover Banner */}
              {post.imageUrl && (
                <div className="aspect-21/9 w-full rounded-2xl overflow-hidden border border-antique-gold/30 relative">
                  <HeritageImage
                    src={post.imageUrl}
                    alt={post.titleEn}
                    category={post.topic}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <div className="text-warm-ivory space-y-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-antique-gold text-rice-paper">
                        {adminTopicLabel(post.topic)} · {adminRegionLabel(post.region)}
                      </span>
                      <h2 className="text-lg font-heading font-bold">{post.titleEn}</h2>
                    </div>
                  </div>
                </div>
              )}

              {/* Audio Track Bar */}
              {post.shadowingAudioUrl && (
                <div className="p-3.5 rounded-2xl bg-antique-gold/15 border border-antique-gold/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-heritage-green text-warm-ivory flex items-center justify-center shrink-0">
                      <Volume2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-heritage-green dark:text-antique-bright">
                        Audio Shadowing bản chuẩn
                      </div>
                      <div className="text-[10px] text-text-muted font-mono truncate max-w-xs sm:max-w-md">
                        {post.shadowingAudioUrl}
                      </div>
                    </div>
                  </div>
                  <audio controls src={post.shadowingAudioUrl} className="h-8 max-w-[200px]" />
                </div>
              )}

              {/* Paragraphs Bilingual Content */}
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright border-b border-antique-gold/20 pb-2 flex items-center gap-2">
                  <BookOpen aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>
                    Nội dung bài đọc song ngữ ({post.paragraphs?.length || 0} đoạn)
                  </span>
                </h4>

                {post.paragraphs && post.paragraphs.length > 0 ? (
                  <div className="space-y-3">
                    {post.paragraphs.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-warm-ivory dark:bg-white/5 border border-antique-gold/20 space-y-2 hover:border-antique-gold/40 transition-colors"
                      >
                        {(bilingualMode === 'both' || bilingualMode === 'en') && (
                          <div className="text-sm font-serif leading-relaxed text-text-body dark:text-warm-ivory">
                            {p.enText}
                          </div>
                        )}
                        {(bilingualMode === 'both' || bilingualMode === 'vi') && (
                          <div className={`text-xs italic text-text-secondary leading-relaxed ${bilingualMode === 'both' ? 'border-t border-antique-gold/15 pt-2' : ''}`}>
                            {p.viText}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-warm-ivory/50 text-xs text-text-muted italic">
                    {post.contentEn || 'Chưa có dữ liệu đoạn văn.'}
                  </div>
                )}
              </div>

              {/* Vocabulary Section */}
              {post.vocabularies && post.vocabularies.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright border-b border-antique-gold/20 pb-2 flex items-center gap-2">
                    <BookOpen aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Từ vựng học thuật ({post.vocabularies.length} từ)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {post.vocabularies.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-warm-ivory dark:bg-white/5 border border-antique-gold/20 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-heritage-green dark:text-antique-bright text-sm">
                            {v.word}
                          </span>
                          {v.pos && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-antique-gold/15 text-antique-gold font-bold">
                              {v.pos}
                            </span>
                          )}
                        </div>
                        <p className="text-text-secondary font-medium">{v.viMeaning}</p>
                        {v.contextSentence && (
                          <p className="text-[11px] text-text-muted italic border-t border-antique-gold/10 pt-1.5 mt-1">
                            "{v.contextSentence}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz Questions Section */}
              {post.questions && post.questions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright border-b border-antique-gold/20 pb-2 flex items-center gap-2">
                    <HelpCircle aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Câu hỏi ôn tập ({post.questions.length} câu)</span>
                  </h4>
                  <div className="space-y-3">
                    {post.questions.map((q, idx) => {
                      let opts: { key: string; text: string }[] = [];
                      if (typeof q.options === 'string') {
                        try {
                          opts = JSON.parse(q.options);
                        } catch {
                          opts = [];
                        }
                      } else if (Array.isArray(q.options)) {
                        opts = q.options as { key: string; text: string }[];
                      }

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-warm-ivory dark:bg-white/5 border border-antique-gold/20 space-y-2.5 text-xs"
                        >
                          <div className="font-bold text-heritage-green dark:text-warm-ivory">
                            Câu {idx + 1}: {q.question}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {opts.map((opt) => (
                              <div
                                key={opt.key}
                                className={`p-2 rounded-xl border flex items-center gap-2 ${
                                  opt.key === q.correctKey
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold'
                                    : 'border-antique-gold/20 text-text-body dark:text-warm-ivory'
                                }`}
                              >
                                <span className="w-5 h-5 rounded-full bg-antique-gold/20 flex items-center justify-center font-bold text-[10px]">
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <div className="text-[11px] text-text-muted italic border-t border-antique-gold/15 pt-1.5 flex items-center gap-1.5">
                              <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Giải thích: {q.explanation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AdminDialog>
  );
};
