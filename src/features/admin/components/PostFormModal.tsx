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
  ParagraphPairDto,
  VocabItemDto,
  CefrLevel,
  AudioTrackDto,
  VoiceModelItem,
} from '../types/adminTypes';
import { postAdminService } from '../services/postAdminService';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedPost: any) => void;
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
  const [activeTab, setActiveTab] = useState<'info' | 'bilingual' | 'vocab' | 'voices' | 'tsv'>('info');

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
    setVoiceTracks([]);
    setFastVocabInput('');
    setTsvRawRow('');
    setActiveTab('info');
  };

  // Auto split bilingual paragraphs
  const handleAutoSplit = () => {
    if (!contentEn.trim() && !contentVi.trim()) {
      setErrorMsg('Vui lòng nhập nội dung toàn văn tiếng Anh hoặc tiếng Việt trước khi tách đoạn.');
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
    setSuccessToast(`Đã tự động tách thành ${pairs.length} cặp đoạn song ngữ.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Parse quick vocab input
  const handleFastVocabImport = () => {
    if (!fastVocabInput.trim()) return;
    const parsed = postAdminService.parseKeyVocabularyText(fastVocabInput, level);
    if (parsed.length === 0) {
      setErrorMsg('Không tìm thấy từ vựng hợp lệ. Hãy kiểm tra định dạng (ví dụ: word — nghĩa).');
      return;
    }
    setVocabularies((prev) => [...prev, ...parsed]);
    setFastVocabInput('');
    setSuccessToast(`Đã thêm thành công ${parsed.length} từ vựng vào danh sách.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Parse TSV Raw Row
  const handleTsvImport = () => {
    if (!tsvRawRow.trim()) {
      setErrorMsg('Vui lòng dán 1 dòng từ file TSV vào ô bên dưới.');
      return;
    }
    const result = postAdminService.parseTsvRow(tsvRawRow, tsvLevelChoice);
    if (!result) {
      setErrorMsg('Không thể nhận diện dữ liệu dòng TSV. Vui lòng đảm bảo dán đúng định dạng các cột.');
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

    setSuccessToast(`Nhập TSV thành công! Đã tự động điền nội dung, ${result.paragraphs?.length || 0} đoạn và ${result.vocabularies?.length || 0} từ vựng.`);
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
      setErrorMsg('Vui lòng nhập nội dung bài đọc tiếng Anh (Toàn văn ở Tab 1 hoặc Cặp đoạn ở Tab 2) trước khi tạo giọng đọc.');
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

      setSuccessToast(`Đã tạo thành công giọng đọc AI "${model.name}" với 2 phiên bản (Nguyên bản mặc định & Chậm)!`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || `Lỗi khi tạo giọng đọc với ${model.name}`);
    } finally {
      setGeneratingVoiceId(null);
    }
  };

  // Remove voice track
  const handleRemoveVoiceTrack = (voiceId: string) => {
    setVoiceTracks((prev) => prev.filter((t) => t.voiceId !== voiceId));
    setSuccessToast('Đã xóa bản ghi âm khỏi bài đọc.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Set as primary shadowing audio
  const handleSetPrimaryAudio = (url: string, name: string, speedLabel: string) => {
    setShadowingAudioUrl(url);
    setSuccessToast(`Đã chọn bản "${name} (${speedLabel})" làm Audio Shadowing mặc định!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!titleEn.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề tiếng Anh.');
      setActiveTab('info');
      return;
    }
    if (!titleVi.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề tiếng Việt.');
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
      };

      let result;
      if (initialData?.id) {
        result = await postAdminService.updatePost(initialData.id, payload);
      } else {
        result = await postAdminService.createPost(payload);
      }

      onSuccess(result);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi lưu bài viết.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-heritage-dark/80 backdrop-blur-md overflow-y-auto">
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
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide">
                {initialData?.id ? 'Chỉnh Sửa Bài Đọc' : 'Đăng Bài Đọc Mới'}
              </h2>
              <p className="text-xs text-warm-ivory/80">
                Nhập liệu bài học song ngữ, cặp đoạn đối xứng và từ vựng học thuật
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-warm-ivory/70 hover:text-warm-ivory hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-warm-ivory/70 dark:bg-heritage-dark/50 border-b border-antique-gold/20 flex gap-2 overflow-x-auto shrink-0 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'info'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-body dark:text-warm-ivory/70 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-antique-gold" />
            <span>1. Thông tin văn hóa</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bilingual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bilingual'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-body dark:text-warm-ivory/70 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span>2. Cặp đoạn song ngữ ({paragraphs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vocab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-body dark:text-warm-ivory/70 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
            <span>3. Từ vựng trọng tâm ({vocabularies.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('voices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'voices'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-body dark:text-warm-ivory/70 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-antique-gold" />
            <span>4. Giọng đọc AI ({voiceTracks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tsv')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tsv'
                ? 'bg-antique-gold text-heritage-dark font-extrabold shadow-xs'
                : 'text-antique-gold hover:bg-antique-gold/10'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>⚡ Nhập từ File TSV</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successToast && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
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
                    Cụm Chủ Đề / Nhóm Câu Chuyện (Story Group)
                  </label>
                  <input
                    type="text"
                    value={topicGroup}
                    onChange={(e) => setTopicGroup(e.target.value)}
                    placeholder="VD: Tục kéo vợ người Mông, Chợ tình Khâu Vai..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                  <p className="text-[10px] text-text-muted mt-1">
                    Dùng để nhóm các bài học cùng câu chuyện ở các cấp độ (Level 1, Level 2, Level 3).
                  </p>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Vùng Miền / Tỉnh Thành (Region)
                  </label>
                  <div className="flex gap-2">
                    <select
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
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="Hoặc gõ địa danh tự do"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>
                </div>

                {/* Title EN */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Tiêu Đề Tiếng Anh (English Title) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="VD: Kéo Vợ – A Mông Wedding Tradition"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                </div>

                {/* Title VI */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Tiêu Đề Tiếng Việt (Vietnamese Title) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={titleVi}
                    onChange={(e) => setTitleVi(e.target.value)}
                    placeholder="VD: Kéo Vợ – Một phong tục cưới hỏi của người Mông"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                </div>

                {/* Topic / Category */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Chuyên Mục Văn Hóa
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  >
                    {TOPIC_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level & Word Count */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                      Cấp Độ CEFR
                    </label>
                    <select
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
                      Số Lượng Từ
                    </label>
                    <input
                      type="number"
                      value={wordCount || ''}
                      onChange={(e) => {
                        const count = parseInt(e.target.value, 10) || 0;
                        setWordCount(count);
                        if (count > 0) {
                          setReadTime(`${Math.max(1, Math.ceil(count / 100))} phút`);
                        }
                      }}
                      placeholder="VD: 89"
                      className="w-full px-3 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                      Thời Lượng Đọc
                    </label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="VD: 3 phút"
                      className="w-full px-3 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                    Link Ảnh Bìa (Cover Image URL)
                  </label>
                  <input
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
                      Link Audio Shadowing (.mp3)
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('voices')}
                      className="text-[11px] text-antique-gold hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Radio className="w-3 h-3" />
                      <span>Tạo Voice AI ({voiceTracks.length}) ➔</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={shadowingAudioUrl}
                    onChange={(e) => setShadowingAudioUrl(e.target.value)}
                    placeholder="https://example.com/audio.mp3 hoặc tạo từ Tab Giọng đọc AI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                  <p className="text-[10px] text-text-muted mt-1">
                    Audio chính cho học viên luyện nói Shadowing. Bạn có thể tự động tạo âm thanh ở tab 4 "Giọng đọc AI".
                  </p>
                </div>
              </div>

              {/* Featured Checkbox Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-warm-ivory/80 dark:bg-heritage-dark/50 border border-antique-gold/30">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-heritage-green accent-heritage-green cursor-pointer"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-bold text-text-body dark:text-warm-ivory cursor-pointer select-none">
                  ⭐ Đánh dấu bài viết nổi bật (Featured) – Hiển thị huy hiệu Tiêu Điểm trên trang Khám phá
                </label>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-text-body dark:text-warm-ivory mb-1">
                  Tóm Tắt Bài Đọc (Summary)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Mô tả vắn tắt 1-2 câu về nét đẹp văn hóa của bài viết..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold resize-none"
                />
              </div>

              {/* Full Text English & Vietnamese */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-antique-gold/20">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
                      Toàn Văn Bài Đọc (English Reading)
                    </label>
                    <span className="text-[10px] text-text-muted">
                      {contentEn.split(/\s+/).filter(Boolean).length} từ
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={contentEn}
                    onChange={(e) => {
                      setContentEn(e.target.value);
                      const w = e.target.value.trim().split(/\s+/).filter(Boolean).length;
                      setWordCount(w);
                      setReadTime(`${Math.max(1, Math.ceil(w / 100))} phút`);
                    }}
                    placeholder="Dán toàn văn bài đọc tiếng Anh tại đây..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-dark/70 border border-antique-gold/40 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
                      Toàn Văn Bản Dịch (Vietnamese Translation)
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSplit}
                      className="px-2.5 py-1 rounded-lg bg-antique-gold/20 text-heritage-dark dark:text-antique-bright hover:bg-antique-gold/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>⚡ Tự động tách cặp đoạn</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={contentVi}
                    onChange={(e) => setContentVi(e.target.value)}
                    placeholder="Dán toàn văn bản dịch tiếng Việt tại đây..."
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
                    Tổng số: {paragraphs.length} cặp đoạn song ngữ
                  </span>
                  <span className="text-[11px] text-text-muted">
                    (Mỗi đoạn tiếng Anh tương ứng 1 đoạn dịch tiếng Việt để luyện Shadowing/Dictation)
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAutoSplit}
                    className="px-3 py-1.5 rounded-xl bg-antique-gold/20 hover:bg-antique-gold/30 text-heritage-dark dark:text-antique-bright text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Tách lại từ Toàn văn</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddParagraph}
                    className="px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-heritage-dark transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm cặp đoạn</span>
                  </button>
                </div>
              </div>

              {paragraphs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-antique-gold/30 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-antique-gold/50 mx-auto mb-2" />
                  <p className="text-xs text-text-muted">Chưa có đoạn văn nào.</p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Bạn có thể bấm "⚡ Tự động tách cặp đoạn" ở Tab 1 hoặc bấm "Thêm cặp đoạn" ở trên.
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
                          Đoạn #{idx + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                            <Clock className="w-3 h-3 text-antique-gold" />
                            <span>Audio mốc:</span>
                            <input
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
                            <span>s ➔</span>
                            <input
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
                            title="Xóa cặp đoạn"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-text-body dark:text-warm-ivory mb-1">
                            Tiếng Anh (English)
                          </label>
                          <textarea
                            rows={3}
                            value={p.enText}
                            onChange={(e) => {
                              const val = e.target.value;
                              setParagraphs((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, enText: val } : item))
                              );
                            }}
                            placeholder="Nhập đoạn tiếng Anh..."
                            className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-text-body dark:text-warm-ivory mb-1">
                            Tiếng Việt (Vietnamese Translation)
                          </label>
                          <textarea
                            rows={3}
                            value={p.viText}
                            onChange={(e) => {
                              const val = e.target.value;
                              setParagraphs((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, viText: val } : item))
                              );
                            }}
                            placeholder="Nhập đoạn tiếng Việt tương ứng..."
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
                    <ListPlus className="w-4 h-4 text-antique-gold" />
                    <span>⚡ Nhập nhanh danh sách từ vựng (Fast Paste)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFastVocabImport}
                    className="px-3 py-1 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer"
                  >
                    Nạp vào danh sách
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={fastVocabInput}
                  onChange={(e) => setFastVocabInput(e.target.value)}
                  placeholder={`Dán danh sách từ theo dạng:\n- tradition — phong tục, truyền thống\n- marriage custom \t phong tục cưới hỏi\n- spring festival — lễ hội mùa xuân`}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-mono text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold resize-none"
                />
              </div>

              {/* Vocab Items List */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-heritage-green dark:text-antique-bright">
                  Danh sách từ vựng ({vocabularies.length} từ/cụm từ)
                </span>
                <button
                  type="button"
                  onClick={handleAddVocab}
                  className="px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-heritage-dark transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm 1 từ mới</span>
                </button>
              </div>

              {vocabularies.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-antique-gold/30 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-antique-gold/50 mx-auto mb-2" />
                  <p className="text-xs text-text-muted">Chưa có từ vựng nào.</p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Hãy dùng ô Nhập nhanh bên trên hoặc bấm Thêm 1 từ mới.
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
                          Từ / Cụm từ (Word/Phrase)
                        </label>
                        <input
                          type="text"
                          value={v.word}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVocabularies((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, word: val } : item))
                            );
                          }}
                          placeholder="VD: tradition"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-bold text-text-body dark:text-warm-ivory focus:outline-none"
                        />
                      </div>

                      {/* Meaning */}
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-text-muted mb-0.5">
                          Nghĩa tiếng Việt
                        </label>
                        <input
                          type="text"
                          value={v.viMeaning}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVocabularies((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, viMeaning: val } : item))
                            );
                          }}
                          placeholder="VD: truyền thống, phong tục"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none"
                        />
                      </div>

                      {/* POS */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-text-muted mb-0.5">
                          Loại từ (POS)
                        </label>
                        <input
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
                          Phiên âm IPA
                        </label>
                        <input
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
                        <select
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
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Context Sentence */}
                      <div className="md:col-span-12">
                        <input
                          type="text"
                          value={v.contextSentence || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVocabularies((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, contextSentence: val } : item))
                            );
                          }}
                          placeholder="Câu ngữ cảnh trong bài đọc (Context sentence)..."
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
                    <Radio className="w-5 h-5 text-antique-gold" />
                    <h3 className="text-sm font-bold text-heritage-green dark:text-antique-bright">
                      Bộ Sinh Giọng Đọc AI Đa Tốc Độ (Azure Speech Neural)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-antique-gold/20 text-heritage-dark dark:text-antique-bright text-[11px] font-bold">
                    {voiceTracks.length} giọng đã tạo
                  </span>
                </div>
                <p className="text-xs text-text-body dark:text-warm-ivory/80 leading-relaxed">
                  Khi bạn chọn 1 model giọng đọc và nhấn <strong>Tạo Giọng Đọc</strong>, hệ thống sẽ tự động tổng hợp toàn bộ bài đọc tiếng Anh thành <strong>2 phiên bản tốc độ</strong>:
                  <span className="inline-block mx-1 font-semibold text-emerald-700 dark:text-emerald-300">⭐ Nguyên bản (Chuẩn 100% - Mặc định bài học)</span> và
                  <span className="inline-block mx-1 font-semibold text-blue-700 dark:text-blue-300">🐢 Chậm (-15% cho người mới học / Shadowing)</span>.
                </p>

                {/* Context Status */}
                {!contentEn.trim() && paragraphs.length === 0 ? (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>
                      Chưa có nội dung tiếng Anh. Vui lòng nhập ở <strong>Tab 1 (Toàn văn)</strong> hoặc <strong>Tab 2 (Cặp đoạn)</strong> trước khi tạo giọng đọc.
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Đã sẵn sàng tạo âm thanh cho nội dung ({contentEn.trim() ? `${contentEn.trim().split(/\s+/).filter(Boolean).length} từ toàn văn` : `${paragraphs.length} đoạn văn`}).
                    </span>
                  </div>
                )}
              </div>

              {/* Section 1: Tracks already generated for this post */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-body dark:text-warm-ivory uppercase tracking-wider flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-antique-gold" />
                    <span>Giọng Đọc Đã Tạo Cho Bài Viết ({voiceTracks.length})</span>
                  </h4>
                  {voiceTracks.length > 0 && (
                    <span className="text-[11px] text-text-muted">
                      Bản Nguyên bản được ưu tiên làm audio mặc định cho bài đọc
                    </span>
                  )}
                </div>

                {voiceTracks.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-antique-gold/30 rounded-2xl p-4">
                    <Headphones className="w-8 h-8 text-antique-gold/40 mx-auto mb-2" />
                    <p className="text-xs font-medium text-text-body dark:text-warm-ivory">
                      Chưa có giọng đọc AI nào được tạo cho bài viết này.
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">
                      Hãy chọn một model bên dưới (khuyên dùng <strong>Amanda</strong> hoặc <strong>Dustin</strong>) rồi bấm "Tạo Giọng Đọc".
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
                                <Volume2 className="w-4 h-4" />
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
                                  Đã tạo lúc {track.createdAt ? new Date(track.createdAt).toLocaleTimeString('vi-VN') : 'vừa xong'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveVoiceTrack(track.voiceId)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer text-xs flex items-center gap-1"
                                title="Xóa giọng này khỏi bài viết"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xóa</span>
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
                                  ⭐ Tốc độ Nguyên bản (Chuẩn 100% - Mặc định)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryAudio(normalAudioUrl, track.voiceName, 'Nguyên bản')}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                                    isNormalPrimary
                                      ? 'bg-antique-gold text-heritage-dark font-extrabold'
                                      : 'text-text-muted hover:text-antique-gold hover:bg-antique-gold/10'
                                  }`}
                                >
                                  {isNormalPrimary ? '★ Audio mặc định chính' : 'Đặt làm Audio chính'}
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
                                  🐢 Tốc độ Chậm (-15%)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryAudio(track.slowUrl, track.voiceName, 'Chậm')}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                                    isSlowPrimary
                                      ? 'bg-antique-gold text-heritage-dark font-extrabold'
                                      : 'text-text-muted hover:text-antique-gold hover:bg-antique-gold/10'
                                  }`}
                                >
                                  {isSlowPrimary ? '★ Audio mặc định chính' : 'Đặt làm Audio chính'}
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
                    <Sparkles className="w-4 h-4 text-antique-gold" />
                    <span>Chọn Model Để Tạo Voice (Dev Predefined)</span>
                  </h4>
                  {isLoadingModels && (
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-antique-gold" />
                      Đang tải danh sách model...
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
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>Khuyên dùng</span>
                                </span>
                              )}
                              {model.isMultilingual && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-medium">
                                  Đa ngôn ngữ
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] text-text-muted font-mono">
                              {model.gender === 'Female' ? 'Nữ' : 'Nam'}
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
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Đang tổng hợp...</span>
                              </>
                            ) : isExisting ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Tạo lại giọng này</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-3.5 h-3.5 text-antique-gold" />
                                <span>Tạo Giọng Đọc</span>
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

          {/* ════ TAB 5: TRÌNH NHẬP NHANH TSV (FAST LOADER) ════ */}
          {activeTab === 'tsv' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-antique-gold/15 border border-antique-gold/40 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-heritage-dark dark:text-antique-bright">
                  <FileSpreadsheet className="w-5 h-5 text-antique-gold" />
                  <span>Trình Nhập Dữ Liệu TSV Siêu Tốc (Auto TSV Row Parser)</span>
                </div>
                <p className="text-xs text-text-body dark:text-warm-ivory/90 leading-relaxed">
                  Công cụ hỗ trợ copy <strong>1 dòng hoàn chỉnh</strong> từ file TSV của bạn (chẳng hạn dòng{' '}
                  <em>"Tục kéo vợ người Mông"</em> trong file <code className="bg-black/10 px-1 py-0.5 rounded">10_10 EXE101 - Minh Bảo.tsv</code>).
                  Hệ thống sẽ tự động bóc tách: Tiêu đề, Vùng miền, Toàn văn bài đọc, Số lượng từ, Bản dịch tiếng Việt, và Bảng từ vựng tương ứng!
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold text-text-body dark:text-warm-ivory">
                    Chọn Cấp độ cần nhập từ dòng TSV:
                  </span>
                  <div className="flex gap-2">
                    {[
                      { idx: 1, label: 'Level 1 (A1 - Cột 3)' },
                      { idx: 2, label: 'Level 2 (B1 - Cột 4)' },
                      { idx: 3, label: 'Level 3 (B2/C1 - Cột 5)' },
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

                <textarea
                  rows={8}
                  value={tsvRawRow}
                  onChange={(e) => setTsvRawRow(e.target.value)}
                  placeholder="Dán 1 dòng TSV tại đây (chứa các cột Topic, Vùng miền, Level 1, Level 2, Level 3 ngăn cách bởi dấu tab)..."
                  className="w-full px-3.5 py-3 rounded-xl bg-white/90 dark:bg-heritage-dark/90 border border-antique-gold/40 text-xs font-mono text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleTsvImport}
                    className="px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs flex items-center gap-2 hover:bg-heritage-dark transition-all cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-antique-gold" />
                    <span>⚡ Bóc Tách & Nạp Dữ Liệu Vào Form Ngay</span>
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
              Hủy bỏ
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted">
                {paragraphs.length} đoạn • {vocabularies.length} từ vựng
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-antique-gold" />
                )}
                <span>{initialData?.id ? 'Lưu Thay Đổi' : 'Đăng Bài Viết (Publish)'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
