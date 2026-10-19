import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  MapPin,
  HelpCircle,
  Wand2,
  ListPlus,
  Volume2,
  Headphones,
  Radio,
  Star,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import type {
  ReadingPostPayload,
  ReadingPostItem,
  ParagraphPairDto,
  VocabItemDto,
  CefrLevel,
  AudioTrackDto,
  VoiceModelItem,
  QuizQuestionDto,
  QuizOptionDto,
} from '../types/adminTypes';
import { postAdminService } from '../services/postAdminService';
import { AdminDialog } from './AdminDialog';
import { adminTopicLabel } from '../admin-presentation';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedPost: ReadingPostItem) => void;
  initialData?: ReadingPostPayload | null;
}

const REGION_OPTIONS = [
  'Lào Cai',
  'Tây Bắc',
  'Hà Giang',
  'Tuyên Quang',
  'Phú Thọ',
  'Hà Nội',
  'Ninh Bình',
  'Huế',
  'Quảng Nam',
  'Đà Nẵng',
  'Đắk Lắk',
  'Tây Nguyên',
  'Lâm Đồng',
  'TP. Hồ Chí Minh',
  'Cần Thơ',
  'An Giang',
  'Cà Mau',
  'Toàn quốc',
];

const TOPIC_OPTIONS = [
  'Văn hóa & Phong tục',
  'Lễ hội & Nghệ thuật',
  'Ẩm thực truyền thống',
  'Di sản & Lịch sử',
  'Danh lam thắng cảnh',
  'Đời sống cộng đồng',
];

const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const PostFormModal: React.FC<PostFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'bilingual' | 'vocab' | 'voices' | 'quiz' | 'tsv'>('info');

  // Form states
  const [topicGroup, setTopicGroup] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleVi, setTitleVi] = useState('');
  const [topic, setTopic] = useState('Văn hóa & Phong tục');
  const [region, setRegion] = useState('Lào Cai');
  const [level, setLevel] = useState<CefrLevel>('B1');
  const [wordCount, setWordCount] = useState<number>(0);
  const [readTime, setReadTime] = useState('3 phút');
  const [imageUrl, setImageUrl] = useState('');
  const [shadowingAudioUrl, setShadowingAudioUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [contentEn, setContentEn] = useState('');
  const [contentVi, setContentVi] = useState('');

  // Paragraphs
  const [paragraphs, setParagraphs] = useState<ParagraphPairDto[]>([]);

  // Vocabularies
  const [vocabularies, setVocabularies] = useState<VocabItemDto[]>([]);

  // Quiz Questions
  const [questions, setQuestions] = useState<QuizQuestionDto[]>([]);

  // Voice Tracks & Models
  const [voiceTracks, setVoiceTracks] = useState<AudioTrackDto[]>([]);
  const [voiceModels, setVoiceModels] = useState<VoiceModelItem[]>([]);
  const [generatingVoiceId, setGeneratingVoiceId] = useState<string | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);

  // Fast tool helpers
  const [fastVocabInput, setFastVocabInput] = useState('');
  const [tsvRawRow, setTsvRawRow] = useState('');
  const [tsvLevelChoice, setTsvLevelChoice] = useState<1 | 2 | 3>(1);

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Initialize or reset form data
  useEffect(() => {
    if (isOpen) {
      setIsLoadingModels(true);
      postAdminService
        .getVoiceModels()
        .then((models) => setVoiceModels(models))
        .catch((err) => console.error('Error fetching voice models:', err))
        .finally(() => setIsLoadingModels(false));
    }

    if (initialData) {
      setTopicGroup(initialData.topicGroup || '');
      setTitleEn(initialData.titleEn || '');
      setTitleVi(initialData.titleVi || '');
      setTopic(initialData.topic || 'Văn hóa & Phong tục');
      setRegion(initialData.region || 'Lào Cai');
      setLevel(initialData.level || 'B1');
      setWordCount(initialData.wordCount || 0);
      setReadTime(initialData.readTime || '3 phút');
      setImageUrl(initialData.imageUrl || '');
      setShadowingAudioUrl(initialData.shadowingAudioUrl || '');
      setSummary(initialData.summary || '');
      setFeatured(Boolean(initialData.featured));
      setContentEn(initialData.contentEn || '');
      setContentVi(initialData.contentVi || '');
      setParagraphs(initialData.paragraphs || []);
      setVocabularies(initialData.vocabularies || []);

      if (initialData.questions) {
        try {
          const rawQ = initialData.questions;
          const parsed = typeof rawQ === 'string' ? JSON.parse(rawQ) : rawQ;
          if (Array.isArray(parsed)) {
            setQuestions(
              parsed.map((q: any, idx: number) => {
                let opts = q.options;
                if (typeof opts === 'string') {
                  try {
                    opts = JSON.parse(opts);
                  } catch {
                    opts = [];
                  }
                }
                return {
                  id: q.id,
                  orderIndex: q.orderIndex ?? idx,
                  question: q.question || '',
                  options: Array.isArray(opts) ? opts : [],
                  correctKey: q.correctKey || 'A',
                  explanation: q.explanation || '',
                };
              })
            );
          } else {
            setQuestions([]);
          }
        } catch {
          setQuestions([]);
        }
      } else {
        setQuestions([]);
      }

      if (initialData.audioTracks) {
        try {
          const parsed =
            typeof initialData.audioTracks === 'string'
              ? JSON.parse(initialData.audioTracks)
              : initialData.audioTracks;
          if (Array.isArray(parsed)) {
            setVoiceTracks(parsed);
          } else {
            setVoiceTracks([]);
          }
        } catch {
          setVoiceTracks([]);
        }
      } else {
        setVoiceTracks([]);
      }
    } else {
      resetForm();
    }
    setErrorMsg(null);
    setSuccessToast(null);
  }, [initialData, isOpen]);

  const resetForm = () => {
    setTopicGroup('');
    setTitleEn('');
    setTitleVi('');
    setTopic('Văn hóa & Phong tục');
    setRegion('Lào Cai');
    setLevel('B1');
    setWordCount(0);
    setReadTime('3 phút');
    setImageUrl('');
    setShadowingAudioUrl('');
    setSummary('');
    setFeatured(false);
    setContentEn('');
    setContentVi('');
    setParagraphs([]);
    setVocabularies([]);
    setQuestions([]);
    setVoiceTracks([]);
    setFastVocabInput('');
    setTsvRawRow('');
    setActiveTab('info');
  };

  // Auto split bilingual paragraphs
  const handleAutoSplit = () => {
    if (!contentEn.trim() && !contentVi.trim()) {
      setErrorMsg('Add English or Vietnamese article content before creating paragraph pairs.');
      return;
    }
    const pairs = postAdminService.autoSplitBilingual(contentEn, contentVi);
    setParagraphs(pairs);
    // Tính lại word count nếu chưa có
    const words = contentEn.trim().split(/\s+/).filter(Boolean).length;
    if (words > 0) {
      setWordCount(words);
      setReadTime(`${Math.max(1, Math.ceil(words / 100))} phút`);
    }
    setSuccessToast(`Created ${pairs.length} bilingual paragraph pairs.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Parse quick vocab input
  const handleFastVocabImport = () => {
    if (!fastVocabInput.trim()) return;
    const parsed = postAdminService.parseKeyVocabularyText(fastVocabInput, level);
    if (parsed.length === 0) {
      setErrorMsg('No vocabulary found. Use one word and Vietnamese meaning per line, separated by a tab or dash.');
      return;
    }
    setVocabularies((prev) => [...prev, ...parsed]);
    setFastVocabInput('');
    setSuccessToast(`Added ${parsed.length} vocabulary items.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Parse TSV Raw Row
  const handleTsvImport = () => {
    if (!tsvRawRow.trim()) {
      setErrorMsg('Paste a TSV row below.');
      return;
    }
    const result = postAdminService.parseTsvRow(tsvRawRow, tsvLevelChoice);
    if (!result) {
      setErrorMsg('Unable to read the TSV row. Check the column order.');
      return;
    }

    if (result.topicGroup) setTopicGroup(result.topicGroup);
    if (result.titleEn) setTitleEn(result.titleEn);
    if (result.titleVi) setTitleVi(result.titleVi);
    if (result.region) setRegion(result.region);
    if (result.level) setLevel(result.level);
    if (result.wordCount) setWordCount(result.wordCount);
    if (result.readTime) setReadTime(result.readTime);
    if (result.summary) setSummary(result.summary);
    if (result.contentEn) setContentEn(result.contentEn);
    if (result.contentVi) setContentVi(result.contentVi);
    if (result.paragraphs) setParagraphs(result.paragraphs);
    if (result.vocabularies) setVocabularies(result.vocabularies);

    setSuccessToast(`Imported article content, ${result.paragraphs?.length || 0} paragraph pairs and ${result.vocabularies?.length || 0} vocabulary items.`);
    setActiveTab('info');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Add empty paragraph
  const handleAddParagraph = () => {
    setParagraphs((prev) => [
      ...prev,
      {
        orderIndex: prev.length,
        enText: '',
        viText: '',
        audioTimestampStart: 0,
        audioTimestampEnd: 0,
      },
    ]);
  };

  // Remove paragraph
  const handleRemoveParagraph = (idx: number) => {
    setParagraphs((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((p, i) => ({ ...p, orderIndex: i }))
    );
  };

  // Add empty vocab
  const handleAddVocab = () => {
    setVocabularies((prev) => [
      ...prev,
      {
        word: '',
        viMeaning: '',
        pos: 'noun',
        level: level,
        contextSentence: '',
      },
    ]);
  };

  // Remove vocab
  const handleRemoveVocab = (idx: number) => {
    setVocabularies((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handle Voice generation
  const handleGenerateVoice = async (model: VoiceModelItem) => {
    const readingText =
      contentEn.trim() ||
      paragraphs
        .map((p) => p.enText.trim())
        .filter(Boolean)
        .join('\n\n');

    if (!readingText) {
      setErrorMsg('Add English content in Article details or Paragraph pairs before generating audio.');
      return;
    }

    setGeneratingVoiceId(model.id);
    setErrorMsg(null);

    try {
      const res = await postAdminService.generateVoiceTrack({
        text: readingText,
        voiceId: model.id,
        voiceName: model.name,
        titleSlug: topicGroup || titleEn || 'reading-post',
      });

      const newTrack: AudioTrackDto = {
        voiceId: res.voiceId,
        voiceName: res.voiceName,
        normalUrl: res.normalUrl || res.fastUrl,
        slowUrl: res.slowUrl,
        fastUrl: res.normalUrl || res.fastUrl,
        createdAt: new Date().toISOString(),
      };

      setVoiceTracks((prev) => {
        const existingIdx = prev.findIndex((t) => t.voiceId === model.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newTrack;
          return updated;
        }
        return [...prev, newTrack];
      });

      // Gán audio shadowing mặc định là bản NGUYÊN BẢN (Normal/Original)
      const defaultAudioUrl = newTrack.normalUrl || newTrack.slowUrl;
      if (!shadowingAudioUrl && defaultAudioUrl) {
        setShadowingAudioUrl(defaultAudioUrl);
      }

      setSuccessToast(`Created normal and slow audio for ${model.name}.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : '') || `Unable to generate audio for ${model.name}.`);
    } finally {
      setGeneratingVoiceId(null);
    }
  };

  // Remove voice track
  const handleRemoveVoiceTrack = (voiceId: string) => {
    setVoiceTracks((prev) => prev.filter((t) => t.voiceId !== voiceId));
    setSuccessToast('Audio track removed.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Quiz helper functions
  const handleAddQuestion = () => {
    const newQ: QuizQuestionDto = {
      orderIndex: questions.length,
      question: '',
      options: [
        { key: 'A', text: '' },
        { key: 'B', text: '' },
        { key: 'C', text: '' },
        { key: 'D', text: '' },
      ],
      correctKey: 'A',
      explanation: '',
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuestionText = (index: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], question: text };
      return updated;
    });
  };

  const handleUpdateOptionText = (qIndex: number, optKey: string, optText: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const currentOpts: QuizOptionDto[] = Array.isArray(updated[qIndex].options)
        ? [...(updated[qIndex].options as QuizOptionDto[])]
        : [];
      const targetIdx = currentOpts.findIndex((o) => o.key === optKey);
      if (targetIdx >= 0) {
        currentOpts[targetIdx] = { ...currentOpts[targetIdx], text: optText };
      } else {
        currentOpts.push({ key: optKey, text: optText });
      }
      updated[qIndex] = { ...updated[qIndex], options: currentOpts };
      return updated;
    });
  };

  const handleUpdateCorrectKey = (qIndex: number, key: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], correctKey: key };
      return updated;
    });
  };

  const handleUpdateExplanation = (qIndex: number, exp: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], explanation: exp };
      return updated;
    });
  };

  // Set as primary shadowing audio
  const handleSetPrimaryAudio = (url: string, name: string, speedLabel: string) => {
    setShadowingAudioUrl(url);
    setSuccessToast(`${name} (${speedLabel}) is now the default shadowing audio.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!titleEn.trim()) {
      setErrorMsg('Enter an English title.');
      setActiveTab('info');
      return;
    }
    if (!titleVi.trim()) {
      setErrorMsg('Enter a Vietnamese title.');
      setActiveTab('info');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ReadingPostPayload = {
        topicGroup: topicGroup.trim() || undefined,
        titleEn: titleEn.trim(),
        titleVi: titleVi.trim(),
        topic: topic.trim(),
        region: region.trim() || undefined,
        level,
        wordCount: wordCount > 0 ? wordCount : undefined,
        readTime: readTime.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        shadowingAudioUrl: shadowingAudioUrl.trim() || (voiceTracks.length > 0 ? (voiceTracks[0].normalUrl || voiceTracks[0].slowUrl) : undefined),
        audioTracks: voiceTracks.length > 0 ? JSON.stringify(voiceTracks) : undefined,
        summary: summary.trim() || undefined,
        featured,
        contentEn: contentEn.trim() || undefined,
        contentVi: contentVi.trim() || undefined,
        paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
        vocabularies: vocabularies.length > 0 ? vocabularies : undefined,
        questions: questions.length > 0 ? questions.map((q, idx) => ({
          ...q,
          orderIndex: idx,
          options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
        })) : undefined,
      };

      let result;
      if (initialData?.id) {
        result = await postAdminService.updatePost(initialData.id, payload);
      } else {
        result = await postAdminService.createPost(payload);
      }

      onSuccess(result);
      onClose();
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : '') || 'Unable to save the article.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AdminDialog title={initialData?.id ? 'Edit article' : 'New article'} onClose={() => { if (!isSubmitting) onClose(); }} wide>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-heritage-green text-warm-ivory border-b border-antique-gold/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-antique-gold/20 border border-antique-gold/40 flex items-center justify-center text-antique-gold">
              <BookOpen aria-hidden="true" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide">
                {initialData?.id ? 'Edit article' : 'New article'}
              </h2>
              <p className="text-xs text-warm-ivory/80">
                Create bilingual lessons, paragraph pairs and vocabulary.
              </p>
            </div>
          </div>
          <button aria-label="Close editor"
            onClick={onClose}
            className="p-2 rounded-xl text-warm-ivory/70 hover:text-warm-ivory hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X aria-hidden="true" className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-warm-ivory/70 dark:bg-heritage-dark/50 border-b border-antique-gold/20 flex gap-2 overflow-x-auto shrink-0 py-2">
          <button
            type="button"
            aria-pressed={activeTab === 'info'}
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'info'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-body dark:text-warm-ivory/70 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <Layers aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
            <span>Article details</span>
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'bilingual'}
            onClick={() => setActiveTab('bilingual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bilingual'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-body dark:text-warm-ivory/70 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
            <span>Paragraph pairs ({paragraphs.length})</span>
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'vocab'}
            onClick={() => setActiveTab('vocab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-body dark:text-warm-ivory/70 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
            <span>Vocabulary ({vocabularies.length})</span>
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'voices'}
            onClick={() => setActiveTab('voices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'voices'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-body dark:text-warm-ivory/70 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <Radio aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
            <span>Audio ({voiceTracks.length})</span>
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'quiz'}
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-body dark:text-warm-ivory/70 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <HelpCircle aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
            <span>Reading quiz ({questions.length})</span>
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'tsv'}
            onClick={() => setActiveTab('tsv')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tsv'
                ? 'bg-antique-gold text-heritage-dark font-extrabold shadow-xs'
                : 'text-antique-gold hover:bg-antique-gold/10'
            }`}
          >
            <FileSpreadsheet aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Import TSV</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div role="alert" className="mx-6 mt-4 p-3.5 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
            <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successToast && (
          <div role="status" className="mx-6 mt-4 p-3.5 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200 text-xs flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ════ TAB 1: THÔNG TIN BÀI VIẾT ════ */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Topic Group */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Story group
                  </label>
                  <input aria-label="Story group"
                    type="text"
                    value={topicGroup}
                    onChange={(e) => setTopicGroup(e.target.value)}
                    placeholder="e.g. Mong wedding traditions, Khau Vai love market"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                  <p className="text-[10px] text-text-muted mt-1">
                    Group different reading levels of the same story.
                  </p>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Region / province
                  </label>
                  <div className="flex gap-2">
                    <select aria-label="Region / province"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                    >
                      {REGION_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <input aria-label="Region / province"
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="Or enter a location"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>
                </div>

                {/* Title EN */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    English title <span className="text-red-500">*</span>
                  </label>
                  <input aria-label="English title"
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. A Mong wedding tradition"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                </div>

                {/* Title VI */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Vietnamese title <span className="text-red-500">*</span>
                  </label>
                  <input aria-label="Vietnamese title"
                    type="text"
                    required
                    value={titleVi}
                    onChange={(e) => setTitleVi(e.target.value)}
                    placeholder="e.g. Một phong tục cưới hỏi của người Mông"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                </div>

                {/* Topic / Category */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Cultural category
                  </label>
                  <select aria-label="Cultural category"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  >
                    {TOPIC_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {adminTopicLabel(t)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level & Word Count */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                      CEFR level
                    </label>
                    <select aria-label="CEFR level"
                      value={level}
                      onChange={(e) => setLevel(e.target.value as CefrLevel)}
                      className="w-full px-3 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                      Word count
                    </label>
                    <input aria-label="Word count"
                      type="number"
                      value={wordCount || ''}
                      onChange={(e) => {
                        const count = parseInt(e.target.value, 10) || 0;
                        setWordCount(count);
                        if (count > 0) {
                          setReadTime(`${Math.max(1, Math.ceil(count / 100))} phút`);
                        }
                      }}
                      placeholder="e.g. 89"
                      className="w-full px-3 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                      Reading time
                    </label>
                    <input aria-label="Reading time"
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="e.g. 3 min"
                      className="w-full px-3 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Cover image URL
                  </label>
                  <input aria-label="Cover image URL"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                </div>

                {/* Audio URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
                      Shadowing audio URL (.mp3)
                    </label>
                    <button
                      type="button"
                      aria-label="Open audio tab"
            onClick={() => setActiveTab('voices')}
                      className="text-[11px] text-antique-gold hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Radio aria-hidden="true" className="w-3 h-3" />
                      <span>Generate audio ({voiceTracks.length}) →</span>
                    </button>
                  </div>
                  <input aria-label="Shadowing audio URL"
                    type="url"
                    value={shadowingAudioUrl}
                    onChange={(e) => setShadowingAudioUrl(e.target.value)}
                    placeholder="https://example.com/audio.mp3 or generate audio in the Audio tab"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                  <p className="text-[10px] text-text-muted mt-1">
                    Default audio for shadowing practice. Generate tracks in the Audio tab.
                  </p>
                </div>
              </div>

              {/* Featured Checkbox Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-warm-ivory/80 dark:bg-heritage-dark/50 border border-antique-gold/30">
                <input aria-label="Feature this article"
                  type="checkbox"
                  id="featured-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-heritage-green accent-heritage-green cursor-pointer"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-bold text-text-body dark:text-warm-ivory cursor-pointer select-none">
                  Feature this article in Discover
                </label>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                  Summary
                </label>
                <textarea aria-label="Summary"
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe the story in one or two sentences…"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold resize-none"
                />
              </div>

              {/* Full Text English & Vietnamese */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-antique-gold/20">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
                      English article
                    </label>
                    <span className="text-[10px] text-text-muted">
                      {contentEn.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea aria-label="English article"
                    rows={6}
                    value={contentEn}
                    onChange={(e) => {
                      setContentEn(e.target.value);
                      const w = e.target.value.trim().split(/\s+/).filter(Boolean).length;
                      setWordCount(w);
                      setReadTime(`${Math.max(1, Math.ceil(w / 100))} phút`);
                    }}
                    placeholder="Paste the full English article…"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
                      Vietnamese translation
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSplit}
                      className="px-2.5 py-1 rounded-lg bg-antique-gold/20 text-heritage-dark dark:text-antique-bright hover:bg-antique-gold/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Wand2 aria-hidden="true" className="w-3 h-3" />
                      <span>Create paragraph pairs</span>
                    </button>
                  </div>
                  <textarea aria-label="Vietnamese translation"
                    rows={6}
                    value={contentVi}
                    onChange={(e) => setContentVi(e.target.value)}
                    placeholder="Paste the Vietnamese translation…"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold font-sans leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 2: CẶP ĐOẠN SONG NGỮ (PARAGRAPH PAIRS) ════ */}
          {activeTab === 'bilingual' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-warm-ivory/80 dark:bg-heritage-dark/60 p-3 rounded-2xl border border-antique-gold/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-heritage-green dark:text-antique-bright">
                    {paragraphs.length} bilingual paragraph pairs
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Each English paragraph is paired with its Vietnamese translation.
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAutoSplit}
                    className="px-3 py-1.5 rounded-xl bg-antique-gold/20 hover:bg-antique-gold/30 text-heritage-dark dark:text-antique-bright text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Wand2 aria-hidden="true" className="w-3.5 h-3.5" />
                    <span>Rebuild from article</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddParagraph}
                    className="px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-heritage-dark transition-colors"
                  >
                    <Plus aria-hidden="true" className="w-3.5 h-3.5" />
                    <span>Add paragraph pair</span>
                  </button>
                </div>
              </div>

              {paragraphs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-antique-gold/30 rounded-2xl">
                  <BookOpen aria-hidden="true" className="w-8 h-8 text-antique-gold/50 mx-auto mb-2" />
                  <p className="text-xs text-text-muted">No paragraph pairs yet.</p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Create pairs from Article details or add a pair manually.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paragraphs.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-heritage-green text-warm-ivory text-[11px] font-bold">
                          Paragraph {idx + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                            <Clock aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                            <span>Audio timing:</span>
                            <input aria-label="Paragraph audio start in seconds"
                              type="number"
                              step="0.1"
                              value={p.audioTimestampStart ?? 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setParagraphs((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, audioTimestampStart: val } : item
                                  )
                                );
                              }}
                              placeholder="Start(s)"
                              className="w-14 px-1.5 py-0.5 rounded border border-antique-gold/30 text-center text-xs"
                            />
                            <span>s →</span>
                            <input aria-label="Paragraph audio end in seconds"
                              type="number"
                              step="0.1"
                              value={p.audioTimestampEnd ?? 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setParagraphs((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, audioTimestampEnd: val } : item
                                  )
                                );
                              }}
                              placeholder="End(s)"
                              className="w-14 px-1.5 py-0.5 rounded border border-antique-gold/30 text-center text-xs"
                            />
                            <span>s</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveParagraph(idx)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                            title="Delete paragraph pair" aria-label="Delete paragraph pair"
                          >
                            <Trash2 aria-hidden="true" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-text-body dark:text-warm-ivory mb-1">
                            English
                          </label>
                          <textarea aria-label="English paragraph"
                            rows={3}
                            value={p.enText}
                            onChange={(e) => {
                              const val = e.target.value;
                              setParagraphs((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, enText: val } : item))
                              );
                            }}
                            placeholder="Enter the English paragraph…"
                            className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-text-body dark:text-warm-ivory mb-1">
                            Vietnamese
                          </label>
                          <textarea aria-label="Vietnamese paragraph"
                            rows={3}
                            value={p.viText}
                            onChange={(e) => {
                              const val = e.target.value;
                              setParagraphs((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, viText: val } : item))
                              );
                            }}
                            placeholder="Enter the Vietnamese translation…"
                            className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════ TAB 3: TỪ VỰNG TRỌNG TÂM (KEY VOCABULARY) ════ */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              {/* Fast Paste Tool */}
              <div className="p-4 rounded-2xl bg-antique-gold/10 border border-antique-gold/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-heritage-dark dark:text-antique-bright">
                    <ListPlus aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Paste vocabulary</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFastVocabImport}
                    className="px-3 py-1 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer"
                  >
                    Add to vocabulary
                  </button>
                </div>
                <textarea aria-label="Paste vocabulary"
                  rows={3}
                  value={fastVocabInput}
                  onChange={(e) => setFastVocabInput(e.target.value)}
                  placeholder={`Paste words and Vietnamese meanings:\n- tradition — phong tục, truyền thống\n- marriage custom \t phong tục cưới hỏi\n- spring festival — lễ hội mùa xuân`}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-mono text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold resize-none"
                />
              </div>

              {/* Vocab Items List */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-heritage-green dark:text-antique-bright">
                  Vocabulary ({vocabularies.length} items)
                </span>
                <button
                  type="button"
                  onClick={handleAddVocab}
                  className="px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-heritage-dark transition-colors"
                >
                  <Plus aria-hidden="true" className="w-3.5 h-3.5" />
                  <span>Add word</span>
                </button>
              </div>

              {vocabularies.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-antique-gold/30 rounded-2xl">
                  <Sparkles aria-hidden="true" className="w-8 h-8 text-antique-gold/50 mx-auto mb-2" />
                  <p className="text-xs text-text-muted">No vocabulary yet.</p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Paste a vocabulary list or add a word manually.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vocabularies.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-start"
                    >
                      {/* Word / Phrase */}
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-text-muted mb-0.5">
                          Word / phrase
                        </label>
                        <input aria-label="Word / phrase"
                          type="text"
                          value={v.word}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVocabularies((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, word: val } : item))
                            );
                          }}
                          placeholder="e.g. tradition"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-bold text-text-body dark:text-warm-ivory focus:outline-none"
                        />
                      </div>

                      {/* Meaning */}
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-text-muted mb-0.5">
                          Vietnamese meaning
                        </label>
                        <input aria-label="Vietnamese meaning"
                          type="text"
                          value={v.viMeaning}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVocabularies((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, viMeaning: val } : item))
                            );
                          }}
                          placeholder="e.g. truyền thống, phong tục"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none"
                        />
                      </div>

                      {/* POS */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-text-muted mb-0.5">
                          Part of speech
                        </label>
                        <input aria-label="Part of speech"
                          type="text"
                          value={v.pos || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVocabularies((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, pos: val } : item))
                            );
                          }}
                          placeholder="noun / phrase"
                          className="w-full px-2 py-1.5 rounded-lg bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none"
                        />
                      </div>

                      {/* IPA */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-text-muted mb-0.5">
                          IPA pronunciation
                        </label>
                        <input aria-label="IPA pronunciation"
                          type="text"
                          value={v.ipa || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVocabularies((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, ipa: val } : item))
                            );
                          }}
                          placeholder="/trəˈdɪʃn/"
                          className="w-full px-2 py-1.5 rounded-lg bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none"
                        />
                      </div>

                      {/* Level & Delete */}
                      <div className="md:col-span-2 flex items-center justify-between pt-4">
                        <select aria-label="Vocabulary CEFR level"
                          value={v.level || level}
                          onChange={(e) => {
                            const val = e.target.value as CefrLevel;
                            setVocabularies((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, level: val } : item))
                            );
                          }}
                          className="px-2 py-1 rounded bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-bold"
                        >
                          {CEFR_LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveVocab(idx)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                        >
                          <Trash2 aria-hidden="true" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Context Sentence */}
                      <div className="md:col-span-12">
                        <input aria-label="Context sentence"
                          type="text"
                          value={v.contextSentence || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVocabularies((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, contextSentence: val } : item))
                            );
                          }}
                          placeholder="Example sentence from the article…"
                          className="w-full px-2.5 py-1 rounded-lg bg-white/40 dark:bg-heritage-dark/50 border border-antique-gold/20 text-[11px] text-text-body dark:text-warm-ivory italic focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════ TAB 4: GIỌNG ĐỌC AI & ĐA TỐC ĐỘ ════ */}
          {activeTab === 'voices' && (
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="p-4 rounded-2xl bg-warm-ivory/80 dark:bg-heritage-dark/60 border border-antique-gold/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio aria-hidden="true" className="w-5 h-5 text-antique-gold" />
                    <h3 className="text-sm font-bold text-heritage-green dark:text-antique-bright">
                      Generate article audio
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-antique-gold/20 text-heritage-dark dark:text-antique-bright text-[11px] font-bold">
                    {voiceTracks.length} voices generated
                  </span>
                </div>
                <p className="text-xs text-text-body dark:text-warm-ivory/80 leading-relaxed">
                  Choose a voice and select <strong>Generate audio</strong> to create the English article in <strong>two playback speeds</strong>:
                  <span className="inline-block mx-1 font-semibold text-emerald-700 dark:text-emerald-300">Normal speed (default)</span> and
                  <span className="inline-block mx-1 font-semibold text-blue-700 dark:text-blue-300">Slow speed (15% slower)</span>.
                </p>

                {/* Context Status */}
                {!contentEn.trim() && paragraphs.length === 0 ? (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                    <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>
                      Add English content in <strong>Article details</strong> or <strong>Paragraph pairs</strong> before generating audio.
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
                    <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Ready to generate audio ({contentEn.trim() ? `${contentEn.trim().split(/\s+/).filter(Boolean).length} words` : `${paragraphs.length} paragraphs`}).
                    </span>
                  </div>
                )}
              </div>

              {/* Section 1: Tracks already generated for this post */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-body dark:text-warm-ivory uppercase tracking-wider flex items-center gap-2">
                    <Headphones aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Article audio tracks ({voiceTracks.length})</span>
                  </h4>
                  {voiceTracks.length > 0 && (
                    <span className="text-[11px] text-text-muted">
                      Normal-speed audio is used as the default.
                    </span>
                  )}
                </div>

                {voiceTracks.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-antique-gold/30 rounded-2xl p-4">
                    <Headphones aria-hidden="true" className="w-8 h-8 text-antique-gold/40 mx-auto mb-2" />
                    <p className="text-xs font-medium text-text-body dark:text-warm-ivory">
                      No audio tracks yet.
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">
                      Choose a voice below (recommended: <strong>Amanda</strong> or <strong>Dustin</strong>) and select Generate audio.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {voiceTracks.map((track) => {
                      const normalAudioUrl = track.normalUrl || track.fastUrl || '';
                      const isNormalPrimary = shadowingAudioUrl === normalAudioUrl;
                      const isSlowPrimary = shadowingAudioUrl === track.slowUrl;

                      return (
                        <div
                          key={track.voiceId}
                          className="p-4 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/40 shadow-xs space-y-3 transition-all hover:border-antique-gold"
                        >
                          {/* Track Header */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-heritage-green/10 dark:bg-antique-gold/10 flex items-center justify-center text-heritage-green dark:text-antique-bright font-bold">
                                <Volume2 aria-hidden="true" className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-heritage-dark dark:text-warm-ivory">
                                    {track.voiceName || track.voiceId}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/10 text-text-muted">
                                    {track.voiceId}
                                  </span>
                                </div>
                                <span className="text-[10px] text-text-muted">
                                  Created {track.createdAt ? new Date(track.createdAt).toLocaleTimeString('en-GB') : 'just now'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveVoiceTrack(track.voiceId)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer text-xs flex items-center gap-1"
                                title="Remove audio track" aria-label="Remove audio track"
                              >
                                <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>

                          {/* 2 Speed Players: Normal (Default) and Slow */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {/* Normal Track (Default) */}
                            <div
                              className={`p-3 rounded-xl border transition-all ${
                                isNormalPrimary
                                  ? 'bg-antique-gold/15 border-antique-gold dark:bg-antique-gold/10'
                                  : 'bg-white/60 dark:bg-heritage-dark/80 border-antique-gold/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                                  Normal speed (default)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryAudio(normalAudioUrl, track.voiceName, 'Normal')}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                                    isNormalPrimary
                                      ? 'bg-antique-gold text-heritage-dark font-extrabold'
                                      : 'text-text-muted hover:text-antique-gold hover:bg-antique-gold/10'
                                  }`}
                                >
                                  {isNormalPrimary ? 'Default audio' : 'Use as default'}
                                </button>
                              </div>
                              <audio
                                src={normalAudioUrl}
                                controls
                                preload="none"
                                className="w-full h-8 rounded"
                              />
                            </div>

                            {/* Slow Track */}
                            <div
                              className={`p-3 rounded-xl border transition-all ${
                                isSlowPrimary
                                  ? 'bg-antique-gold/15 border-antique-gold dark:bg-antique-gold/10'
                                  : 'bg-white/60 dark:bg-heritage-dark/80 border-antique-gold/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                                  Slow speed (15% slower)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryAudio(track.slowUrl, track.voiceName, 'Slow')}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                                    isSlowPrimary
                                      ? 'bg-antique-gold text-heritage-dark font-extrabold'
                                      : 'text-text-muted hover:text-antique-gold hover:bg-antique-gold/10'
                                  }`}
                                >
                                  {isSlowPrimary ? 'Default audio' : 'Use as default'}
                                </button>
                              </div>
                              <audio
                                src={track.slowUrl}
                                controls
                                preload="none"
                                className="w-full h-8 rounded"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 2: Model Pickers */}
              <div className="space-y-3 pt-2 border-t border-antique-gold/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-body dark:text-warm-ivory uppercase tracking-wider flex items-center gap-2">
                    <Sparkles aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Available voices</span>
                  </h4>
                  {isLoadingModels && (
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <Loader2 aria-hidden="true" className="w-3 h-3 animate-spin text-antique-gold" />
                      Loading voices…
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {voiceModels.map((model) => {
                    const isExisting = voiceTracks.some((t) => t.voiceId === model.id);
                    const isGenerating = generatingVoiceId === model.id;
                    const canGenerate = (contentEn.trim().length > 0 || paragraphs.length > 0) && !generatingVoiceId;

                    return (
                      <div
                        key={model.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isExisting
                            ? 'bg-warm-ivory dark:bg-heritage-dark/70 border-emerald-500/50 shadow-xs'
                            : 'bg-warm-ivory/60 dark:bg-heritage-dark/50 border-antique-gold/30 hover:border-antique-gold/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-heritage-dark dark:text-warm-ivory">
                                {model.name}
                              </span>
                              {model.isPrimary && (
                                <span className="px-2 py-0.5 rounded-full bg-antique-gold/20 text-heritage-dark dark:text-antique-bright text-[10px] font-extrabold flex items-center gap-0.5">
                                  <Star aria-hidden="true" className="w-2.5 h-2.5 fill-current" />
                                  <span>Recommended</span>
                                </span>
                              )}
                              {model.isMultilingual && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-medium">
                                  Multilingual
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] text-text-muted font-mono">
                              {model.gender === 'Female' ? 'Female' : 'Male'}
                            </span>
                          </div>

                          <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                            {model.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-antique-gold/15">
                          <span className="text-[10px] text-text-muted font-mono">
                            {model.id}
                          </span>

                          <button
                            type="button"
                            disabled={!canGenerate && !isGenerating}
                            onClick={() => handleGenerateVoice(model)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              isGenerating
                                ? 'bg-antique-gold text-heritage-dark animate-pulse'
                                : isExisting
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                                : 'bg-heritage-green text-warm-ivory hover:bg-heritage-dark'
                            }`}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 aria-hidden="true" className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating…</span>
                              </>
                            ) : isExisting ? (
                              <>
                                <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Regenerate audio</span>
                              </>
                            ) : (
                              <>
                                <Wand2 aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                                <span>Generate audio</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 5: BỘ CÂU HỎI ĐỌC HIỂU (READING COMPREHENSION QUIZ) ════ */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-antique-gold/15 border border-antique-gold/30">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-heritage-dark dark:text-antique-bright">
                    <HelpCircle aria-hidden="true" className="w-5 h-5 text-antique-gold" />
                    <span>Reading comprehension quiz</span>
                  </div>
                  <p className="text-xs text-text-body dark:text-warm-ivory/80 mt-1">
                    Create two to four multiple-choice questions about the story and its cultural context.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs flex items-center gap-2 hover:bg-heritage-dark transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <Plus aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Add question</span>
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-antique-gold/30 bg-warm-ivory/40 dark:bg-heritage-dark/30">
                  <HelpCircle aria-hidden="true" className="w-10 h-10 mx-auto text-antique-gold/60 mb-3" />
                  <h4 className="text-sm font-bold text-text-body dark:text-warm-ivory mb-1">
                    No questions yet
                  </h4>
                  <p className="text-xs text-text-muted max-w-md mx-auto mb-4">
                    Add questions to help learners check their understanding.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs inline-flex items-center gap-2 hover:bg-heritage-dark transition-all cursor-pointer shadow-sm"
                  >
                    <Plus aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Add the first question</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {questions.map((q, qIdx) => {
                    const opts: QuizOptionDto[] = Array.isArray(q.options)
                      ? (q.options as QuizOptionDto[])
                      : [
                          { key: 'A', text: '' },
                          { key: 'B', text: '' },
                          { key: 'C', text: '' },
                          { key: 'D', text: '' },
                        ];
                    const defaultKeys = ['A', 'B', 'C', 'D'];
                    const fullOpts = defaultKeys.map(
                      (k) => opts.find((o) => o.key === k) || { key: k, text: '' }
                    );

                    return (
                      <div
                        key={q.id || qIdx}
                        className="p-5 rounded-2xl bg-white/70 dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-antique-gold/20">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-heritage-green text-warm-ivory text-xs font-bold flex items-center justify-center">
                              {qIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-heritage-dark dark:text-warm-ivory">
                              Question {qIdx + 1}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete question" aria-label="Delete question"
                          >
                            <Trash2 aria-hidden="true" className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Question Text */}
                        <div>
                          <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                            Question (English or bilingual) <span className="text-red-500">*</span>
                          </label>
                          <textarea aria-label="Question"
                            rows={2}
                            value={q.question}
                            onChange={(e) => handleUpdateQuestionText(qIdx, e.target.value)}
                            placeholder="e.g. According to the article, where did Tet originate?"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory/80 dark:bg-heritage-forest border border-antique-gold/40 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                          />
                        </div>

                        {/* Options A, B, C, D */}
                        <div className="space-y-2.5 pt-1">
                          <label className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                            Answer options (select the correct answer):
                          </label>
                          <div className="grid grid-cols-1 gap-2.5">
                            {fullOpts.map((opt) => {
                              const isCorrect = q.correctKey === opt.key;
                              return (
                                <div
                                  key={opt.key}
                                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                                    isCorrect
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/60 shadow-xs'
                                      : 'bg-warm-ivory/40 dark:bg-heritage-forest/60 border-antique-gold/25'
                                  }`}
                                >
                                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                        <input aria-label={`Mark answer ${opt.key} as correct`}
                                      type="radio"
                                      name={`correct-${qIdx}`}
                                      checked={isCorrect}
                                      onChange={() => handleUpdateCorrectKey(qIdx, opt.key)}
                                      className="accent-heritage-green w-4 h-4 cursor-pointer"
                                    />
                                    <span
                                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-extrabold ${
                                        isCorrect
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-antique-gold/20 text-heritage-dark dark:text-warm-ivory'
                                      }`}
                                    >
                                      {opt.key}
                                    </span>
                                  </label>

                                  <input aria-label="Answer option"
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) =>
                                      handleUpdateOptionText(qIdx, opt.key, e.target.value)
                                    }
                                    placeholder={`Answer ${opt.key}…`}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-heritage-dark/90 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                                  />

                                  {isCorrect && (
                                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded shrink-0">
                                      Correct answer
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Cultural Explanation */}
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">
                            Explanation (shown after submission):
                          </label>
                          <input aria-label="Answer explanation"
                            type="text"
                            value={q.explanation || ''}
                            onChange={(e) => handleUpdateExplanation(qIdx, e.target.value)}
                            placeholder="Explain the answer using the story and its cultural context…"
                            className="w-full px-3 py-2 rounded-xl bg-warm-ivory/60 dark:bg-heritage-forest/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════ TAB 6: TRÌNH NHẬP NHANH TSV (FAST LOADER) ════ */}
          {activeTab === 'tsv' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-antique-gold/15 border border-antique-gold/40 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-heritage-dark dark:text-antique-bright">
                  <FileSpreadsheet aria-hidden="true" className="w-5 h-5 text-antique-gold" />
                  <span>Import from TSV</span>
                </div>
                <p className="text-xs text-text-body dark:text-warm-ivory/90 leading-relaxed">
                  Paste <strong>one complete row</strong> from your TSV file (for example,{' '}
                  <em>"Tục kéo vợ người Mông"</em> in <code className="bg-black/10 px-1 py-0.5 rounded">10_10 EXE101 - Minh Bảo.tsv</code>).
                  The importer fills the title, region, article, word count, Vietnamese translation and vocabulary.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold text-text-body dark:text-warm-ivory">
                    Choose a reading level to import:
                  </span>
                  <div className="flex gap-2">
                    {[
                      { idx: 1, label: 'Level 1 (A1 - column 3)' },
                      { idx: 2, label: 'Level 2 (B1 - column 4)' },
                      { idx: 3, label: 'Level 3 (B2/C1 - column 5)' },
                    ].map((opt) => (
                      <button
                        key={opt.idx}
                        type="button"
                        onClick={() => setTsvLevelChoice(opt.idx as 1 | 2 | 3)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          tsvLevelChoice === opt.idx
                            ? 'bg-heritage-green text-warm-ivory shadow-xs'
                            : 'bg-white/60 dark:bg-white/10 text-text-body dark:text-warm-ivory/70 hover:bg-white/80'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea aria-label="TSV row"
                  rows={8}
                  value={tsvRawRow}
                  onChange={(e) => setTsvRawRow(e.target.value)}
                  placeholder="Paste one TSV row with Topic, Region, Level 1, Level 2 and Level 3 columns…"
                  className="w-full px-3.5 py-3 rounded-xl bg-white/90 dark:bg-heritage-dark/90 border border-antique-gold/40 text-xs font-mono text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleTsvImport}
                    className="px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs flex items-center gap-2 hover:bg-heritage-dark transition-all cursor-pointer shadow-md"
                  >
                    <Sparkles aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Import into editor</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-antique-gold/30 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-antique-gold/40 text-xs font-bold text-text-body dark:text-warm-ivory hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted">
                {paragraphs.length} pairs · {vocabularies.length} words · {questions.length} questions
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                )}
                <span>{initialData?.id ? 'Save changes' : 'Publish article'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </AdminDialog>
  );
};
