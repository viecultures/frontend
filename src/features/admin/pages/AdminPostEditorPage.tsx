import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Lightbulb,
  BookOpen,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Compass,
  MapPin,
  HelpCircle,
  Wand2,
  Radio,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import type {
  ReadingPostPayload,
  LearningJourneyItem,
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
import { journeyAdminService } from '../services/journeyAdminService';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import { adminTopicLabel, adminRegionLabel } from '../admin-presentation';
import { PostPreviewCanvas } from '../components/PostPreviewCanvas';
import { HeritageImageUploader } from '../components/HeritageImageUploader';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';

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

export const AdminPostEditorPage: React.FC = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { lang, id } = useParams<{ lang?: string; id?: string }>();
  const currentLang = resolveLanguage(lang);
  const isEdit = Boolean(id);

  // Loading & Initial post fetch
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(isEdit);

  // Accordion active group: only 1 section open at a time ("Mở rộng 1 mục sẽ thu gọn các mục khác")
  const [openSection, setOpenSection] = useState<string>('info');

  // Split-pane Resizer state
  const [editorWidth, setEditorWidth] = useState<number>(560);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastExpandedWidthRef = useRef<number>(560);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Form states
  const [journeyId, setJourneyId] = useState<string>('');
  const [chapterOrder, setChapterOrder] = useState<number>(1);
  const [provinceId, setProvinceId] = useState<string>('');
  const [journeysList, setJourneysList] = useState<LearningJourneyItem[]>([]);
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

  // Toggle accordion section: opening one collapses others
  const toggleSection = (sectionId: string) => {
    setOpenSection((prev) => (prev === sectionId ? '' : sectionId));
  };

  // Load models and journeys
  useEffect(() => {
    setIsLoadingModels(true);
    postAdminService
      .getVoiceModels()
      .then((models) => setVoiceModels(models))
      .catch((err) => console.error('Error fetching voice models:', err))
      .finally(() => setIsLoadingModels(false));

    journeyAdminService
      .getJourneys()
      .then((data) => setJourneysList(data))
      .catch((err) => console.error('Error loading journeys:', err));
  }, []);

  // Fetch existing post if editing
  useEffect(() => {
    if (!id) return;

    setIsLoadingPost(true);
    postAdminService
      .getPostById(id)
      .then((data) => {
        if (!data) return;
        setJourneyId(data.journeyId || '');
        setChapterOrder(data.chapterOrder || 1);
        setProvinceId(data.provinceId || '');
        setTopicGroup(data.topicGroup || '');
        setTitleEn(data.titleEn || '');
        setTitleVi(data.titleVi || '');
        setTopic(data.topic || 'Văn hóa & Phong tục');
        setRegion(data.region || 'Lào Cai');
        setLevel(data.level || 'B1');
        setWordCount(data.wordCount || 0);
        setReadTime(data.readTime || '3 phút');
        setImageUrl(data.imageUrl || '');
        setShadowingAudioUrl(data.shadowingAudioUrl || '');
        setSummary(data.summary || '');
        setFeatured(Boolean(data.featured));
        setContentEn(data.contentEn || '');
        setContentVi(data.contentVi || '');
        setParagraphs(data.paragraphs || []);
        setVocabularies(data.vocabularies || []);

        if (data.questions) {
          try {
            const rawQ = data.questions;
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
            }
          } catch {
            setQuestions([]);
          }
        }

        if (data.audioTracks) {
          try {
            const parsed =
              typeof data.audioTracks === 'string'
                ? JSON.parse(data.audioTracks)
                : data.audioTracks;
            if (Array.isArray(parsed)) {
              setVoiceTracks(parsed);
            }
          } catch {
            setVoiceTracks([]);
          }
        }
      })
      .catch((err) => {
        setErrorMsg((err instanceof Error ? err.message : '') || 'Không thể tải thông tin bài viết.');
      })
      .finally(() => {
        setIsLoadingPost(false);
      });
  }, [id]);

  // Resizer toggle collapse
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      if (prev) {
        setEditorWidth(lastExpandedWidthRef.current || 560);
        return false;
      } else {
        lastExpandedWidthRef.current = editorWidth;
        return true;
      }
    });
  }, [editorWidth]);

  // Pointer drag handler for resizer handle
  const handleResizerPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const startX = e.clientX;
      const startWidth = isCollapsed ? 56 : editorWidth;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = startWidth + deltaX;

        if (newWidth < 200) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
          const maxAllowed = (containerRef.current?.clientWidth || 1400) - 380;
          const clamped = Math.max(340, Math.min(newWidth, maxAllowed));
          setEditorWidth(clamped);
          lastExpandedWidthRef.current = clamped;
        }
      };

      const onPointerUp = () => {
        setIsDragging(false);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [editorWidth, isCollapsed]
  );

  // Return to posts list
  const handleBackToList = () => {
    navigate(getLocalizedPath('/admin/content?tab=posts', currentLang));
  };

  // Auto split bilingual paragraphs
  const handleAutoSplit = () => {
    if (!contentEn.trim() && !contentVi.trim()) {
      setErrorMsg('Nhập nội dung bài đọc trước khi tách thành các cặp đoạn.');
      return;
    }
    const pairs = postAdminService.autoSplitBilingual(contentEn, contentVi);
    setParagraphs(pairs);
    const words = contentEn.trim().split(/\s+/).filter(Boolean).length;
    if (words > 0) {
      setWordCount(words);
      setReadTime(`${Math.max(1, Math.ceil(words / 100))} phút`);
    }
    setSuccessToast(`Đã tạo ${pairs.length} cặp đoạn văn song ngữ.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Parse quick vocab input
  const handleFastVocabImport = () => {
    if (!fastVocabInput.trim()) return;
    const parsed = postAdminService.parseKeyVocabularyText(fastVocabInput, level);
    if (parsed.length === 0) {
      setErrorMsg('Không tìm thấy từ vựng hợp lệ.');
      return;
    }
    setVocabularies((prev) => [...prev, ...parsed]);
    setFastVocabInput('');
    setSuccessToast(`Đã thêm ${parsed.length} mục từ vựng.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Parse TSV Raw Row
  const handleTsvImport = () => {
    if (!tsvRawRow.trim()) {
      setErrorMsg('Vui lòng dán dòng dữ liệu TSV.');
      return;
    }
    const result = postAdminService.parseTsvRow(tsvRawRow, tsvLevelChoice);
    if (!result) {
      setErrorMsg('Không thể đọc dữ liệu TSV. Vui lòng kiểm tra lại thứ tự cột.');
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

    setSuccessToast(`Đã nạp bài viết, ${result.paragraphs?.length || 0} đoạn văn và ${result.vocabularies?.length || 0} từ vựng.`);
    setOpenSection('info');
    setTimeout(() => setSuccessToast(null), 4000);
  };

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

  const handleRemoveParagraph = (idx: number) => {
    setParagraphs((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((p, i) => ({ ...p, orderIndex: i }))
    );
  };

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

  const handleRemoveVocab = (idx: number) => {
    setVocabularies((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGenerateVoice = async (model: VoiceModelItem) => {
    const readingText =
      contentEn.trim() ||
      paragraphs
        .map((p) => p.enText.trim())
        .filter(Boolean)
        .join('\n\n');

    if (!readingText) {
      setErrorMsg('Vui lòng nhập nội dung tiếng Anh trước khi tạo giọng đọc AI.');
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

      const defaultAudioUrl = newTrack.normalUrl || newTrack.slowUrl;
      if (!shadowingAudioUrl && defaultAudioUrl) {
        setShadowingAudioUrl(defaultAudioUrl);
      }

      setSuccessToast(`Đã tạo audio cho giọng đọc ${model.name}.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : '') || `Không thể tạo audio cho giọng đọc ${model.name}.`);
    } finally {
      setGeneratingVoiceId(null);
    }
  };

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

  // Submit Handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!titleEn.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề tiếng Anh.');
      setOpenSection('info');
      if (isCollapsed) setIsCollapsed(false);
      return;
    }
    if (!titleVi.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề tiếng Việt.');
      setOpenSection('info');
      if (isCollapsed) setIsCollapsed(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ReadingPostPayload = {
        journeyId: journeyId.trim() || undefined,
        chapterOrder: journeyId.trim() ? Number(chapterOrder) || 1 : undefined,
        provinceId: provinceId.trim() || undefined,
        topicGroup: topicGroup.trim() || undefined,
        titleEn: titleEn.trim(),
        titleVi: titleVi.trim(),
        topic: topic.trim(),
        region: region.trim() || undefined,
        level,
        wordCount: wordCount > 0 ? wordCount : undefined,
        readTime: readTime.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        shadowingAudioUrl:
          shadowingAudioUrl.trim() ||
          (voiceTracks.length > 0 ? voiceTracks[0].normalUrl || voiceTracks[0].slowUrl : undefined),
        audioTracks: voiceTracks.length > 0 ? JSON.stringify(voiceTracks) : undefined,
        summary: summary.trim() || undefined,
        featured,
        contentEn: contentEn.trim() || undefined,
        contentVi: contentVi.trim() || undefined,
        paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
        vocabularies: vocabularies.length > 0 ? vocabularies : undefined,
        questions:
          questions.length > 0
            ? questions.map((q, idx) => ({
                ...q,
                orderIndex: idx,
                options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
              }))
            : undefined,
      };

      if (id) {
        await postAdminService.updatePost(id, payload);
      } else {
        await postAdminService.createPost(payload);
      }

      setSuccessToast(isEdit ? 'Đã lưu thay đổi bài đọc thành công.' : 'Đã xuất bản bài đọc mới thành công.');
      setTimeout(() => {
        navigate(getLocalizedPath('/admin/content?tab=posts', currentLang));
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : '') || 'Không thể lưu bài viết.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center space-y-3 bg-warm-ivory dark:bg-heritage-forest">
        <div className="inline-block animate-spin w-8 h-8 border-3 border-antique-gold border-t-transparent rounded-full" />
        <p className="text-xs text-text-muted font-medium">Đang tải dữ liệu bài đọc...</p>
      </div>
    );
  }

  // Accordion Sections configuration
  const sections = [
    {
      id: 'info',
      icon: Layers,
      title: '1. Thông tin chung & Bài thô',
      subtitle: 'Tiêu đề, chủ đề, vùng miền, CEFR, ảnh bìa, tóm tắt...',
      badge: `${level} · ${adminTopicLabel(topic)}`,
    },
    {
      id: 'bilingual',
      icon: BookOpen,
      title: '2. Cặp đoạn văn song ngữ',
      subtitle: 'Nội dung bài học đối chiếu câu/đoạn',
      badge: `${paragraphs.length} cặp đoạn`,
    },
    {
      id: 'vocab',
      icon: Lightbulb,
      title: '3. Từ vựng trọng tâm',
      subtitle: 'Danh sách từ vựng highlight và tra cứu nhanh',
      badge: `${vocabularies.length} từ`,
    },
    {
      id: 'voices',
      icon: Radio,
      title: '4. Audio & Giọng đọc AI',
      subtitle: 'Shadowing audio & đa tốc độ đọc',
      badge: `${voiceTracks.length} giọng`,
    },
    {
      id: 'quiz',
      icon: HelpCircle,
      title: '5. Câu hỏi đọc hiểu ôn tập',
      subtitle: 'Bộ trắc nghiệm 4 lựa chọn (A, B, C, D)',
      badge: `${questions.length} câu`,
    },
    {
      id: 'tsv',
      icon: FileSpreadsheet,
      title: '6. Nạp nhanh dữ liệu TSV',
      subtitle: 'Import 1 dòng từ Google Sheets / Excel',
      badge: 'Fast Loader',
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`h-screen w-screen flex flex-col min-w-0 bg-warm-ivory dark:bg-heritage-forest overflow-hidden ${
        isDragging ? 'select-none cursor-col-resize' : ''
      }`}
    >
      {/* ── Studio Topbar (Full width, no AdminTopbar/Sidebar) ──────────────── */}
      <header className="h-14 px-4 sm:px-6 bg-heritage-green text-warm-ivory border-b border-antique-gold/30 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleBackToList}
            className="p-1.5 rounded-xl hover:bg-white/10 text-warm-ivory transition-colors cursor-pointer flex items-center gap-1.5"
            title="Quay lại danh sách bài đọc"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span className="text-xs font-bold hidden sm:inline">Quản lý bài đọc</span>
          </button>

          <span className="h-4 w-px bg-white/20 hidden sm:inline" />

          <div className="min-w-0">
            <h1 className="font-heading text-xs sm:text-sm font-bold tracking-wide truncate">
              {isEdit ? `Chỉnh sửa: ${titleEn || 'Bài đọc'}` : 'Tạo bài đọc mới (Studio)'}
            </h1>
            <p className="text-[10px] text-warm-ivory/80 truncate hidden md:block">
              {paragraphs.length} cặp đoạn · {vocabularies.length} từ vựng · {questions.length} câu hỏi
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleCollapse}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isCollapsed
                ? 'bg-antique-gold text-heritage-dark border-antique-gold'
                : 'bg-white/10 hover:bg-white/20 border-antique-gold/30 text-warm-ivory'
            }`}
            title={isCollapsed ? 'Mở rộng form nhập liệu' : 'Kéo qua trái hoặc bấm để thu gọn form'}
          >
            {isCollapsed ? (
              <>
                <PanelLeftOpen aria-hidden="true" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mở Form</span>
              </>
            ) : (
              <>
                <PanelLeftClose aria-hidden="true" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Thu gọn Form</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitting || paragraphs.length === 0}
            title={paragraphs.length === 0 ? 'Thêm ít nhất một đoạn văn song ngữ trước khi xuất bản' : undefined}
            className="px-4 sm:px-5 py-1.5 rounded-xl bg-antique-gold text-heritage-dark hover:bg-antique-bright text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin w-3.5 h-3.5 border-2 border-heritage-dark border-t-transparent rounded-full" />
            ) : (
              <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-heritage-green" />
            )}
            <span>{isEdit ? 'Lưu thay đổi' : 'Xuất bản bài đọc'}</span>
          </button>
        </div>
      </header>

      {/* ── Studio Split-View Workspace ────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* ════ CỘT TRÁI: FORM NHẬP LIỆU (ACCORDION GROUPS) ════ */}
        {isCollapsed ? (
          /* Slim Vertical Tab Strip when Collapsed */
          <aside className="w-14 shrink-0 bg-rice-paper dark:bg-heritage-forest border-r border-antique-gold/30 flex flex-col items-center py-3 gap-2 z-10">
            <button
              type="button"
              onClick={toggleCollapse}
              className="p-2 rounded-xl bg-antique-gold/20 hover:bg-antique-gold/40 text-heritage-green dark:text-antique-gold transition-colors cursor-pointer"
              title="Mở rộng cột soạn thảo"
            >
              <ChevronRight aria-hidden="true" className="w-4 h-4" />
            </button>
            <div className="w-8 h-px bg-antique-gold/20 my-1" />
            {sections.map((item) => {
              const TabIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setOpenSection(item.id);
                    setIsCollapsed(false);
                  }}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    openSection === item.id
                      ? 'bg-heritage-green text-warm-ivory shadow-xs'
                      : 'text-text-muted hover:bg-antique-gold/20'
                  }`}
                  title={`${item.title} (Click để mở)`}
                >
                  <TabIcon aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                </button>
              );
            })}
          </aside>
        ) : (
          /* Full Expanded Left Form Panel with Accordion Groups */
          <section
            style={{ width: `${editorWidth}px` }}
            className="shrink-0 flex flex-col min-h-0 bg-rice-paper dark:bg-heritage-forest border-r border-antique-gold/30 overflow-hidden"
          >
            {/* Header info bar of form */}
            <div className="px-4 py-2 bg-warm-ivory/70 dark:bg-heritage-dark/50 border-b border-antique-gold/20 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-bold text-heritage-green dark:text-antique-gold uppercase tracking-wider">
                Nội dung bài viết (Gom nhóm)
              </span>
              <span className="text-[10px] text-text-muted italic">
                Mở 1 mục sẽ tự thu gọn các mục khác
              </span>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div role="alert" className="mx-4 mt-3 p-3 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2 shrink-0">
                <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successToast && (
              <div role="status" className="mx-4 mt-3 p-3 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200 text-xs flex items-center gap-2 shrink-0">
                <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Accordion List Container */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* ════ GROUP 1: THÔNG TIN CHUNG & BÀI THÔ ════ */}
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openSection === 'info'
                  ? 'border-antique-gold bg-warm-ivory dark:bg-stone-800/80 shadow-sm'
                  : 'border-antique-gold/25 bg-warm-ivory/50 dark:bg-stone-800/30 hover:border-antique-gold/50'
              }`}>
                <button
                  type="button"
                  onClick={() => toggleSection('info')}
                  className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      openSection === 'info'
                        ? 'bg-heritage-green text-warm-ivory'
                        : 'bg-antique-gold/20 text-heritage-green dark:text-antique-bright'
                    }`}>
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-heritage-green dark:text-warm-ivory truncate">
                        1. Thông tin chung & Bài thô
                      </div>
                      <div className="text-[10px] text-text-muted truncate">
                        Tiêu đề, chủ đề, vùng miền, CEFR, ảnh bìa, tóm tắt...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright border border-antique-gold/30">
                      {level} · {adminTopicLabel(topic)}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${openSection === 'info' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {openSection === 'info' && (
                  <div className="p-4 pt-2 border-t border-antique-gold/15 space-y-4">
                    <div className="p-3.5 rounded-2xl bg-antique-gold/15 border border-antique-gold/30 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory flex items-center gap-1.5">
                          <Compass aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                          <span>Hành trình học (Journey)</span>
                        </label>
                        <select
                          value={journeyId}
                          onChange={(e) => setJourneyId(e.target.value)}
                          className="w-full p-2 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                        >
                          <option value="">Không thuộc hành trình (Bài độc lập)</option>
                          {journeysList.map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.titleEn} ({j.region || 'Toàn quốc'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                          Thứ tự chặng (Chapter Order)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={chapterOrder}
                          onChange={(e) => setChapterOrder(parseInt(e.target.value, 10) || 1)}
                          disabled={!journeyId}
                          className="w-full p-2 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                          Tiêu đề tiếng Anh (EN) *
                        </label>
                        <input
                          type="text"
                          value={titleEn}
                          onChange={(e) => setTitleEn(e.target.value)}
                          placeholder="e.g. The Ancient Colors of Bat Trang Pottery"
                          className="w-full p-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                          Tiêu đề tiếng Việt (VI) *
                        </label>
                        <input
                          type="text"
                          value={titleVi}
                          onChange={(e) => setTitleVi(e.target.value)}
                          placeholder="e.g. Sắc màu cổ kính của gốm Bát Tràng"
                          className="w-full p-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                          Chủ đề (Topic)
                        </label>
                        <select
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="w-full p-2 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory"
                        >
                          {TOPIC_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                          Vùng miền / Tỉnh thành
                        </label>
                        <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className="w-full p-2 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory"
                        >
                          {REGION_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                          Cấp độ (CEFR Level)
                        </label>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value as CefrLevel)}
                          className="w-full p-2 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory font-bold"
                        >
                          {CEFR_LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <HeritageImageUploader
                        label="URL Ảnh bìa (Cover Image)"
                        value={imageUrl}
                        onChange={setImageUrl}
                        folder="posts"
                        helperText="Hỗ trợ JPG, PNG, WebP, AVIF, GIF dưới 5MB. Kéo thả hoặc dán ảnh (Ctrl+V)."
                        aspectRatio="video"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                        Thời gian đọc dự kiến
                      </label>
                      <input
                        type="text"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        placeholder="e.g. 3 phút"
                        className="w-full p-2 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                        Tóm tắt bài đọc (Summary)
                      </label>
                      <textarea
                        rows={2}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Mô tả ngắn gọn về bài đọc..."
                        className="w-full p-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                      />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-antique-gold/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-heritage-green dark:text-warm-ivory">
                          Soạn thô bài viết song ngữ (Nguyên bài)
                        </span>
                        <button
                          type="button"
                          onClick={handleAutoSplit}
                          className="px-3 py-1 rounded-xl bg-antique-gold text-heritage-dark text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-antique-bright transition-colors shadow-xs"
                        >
                          <Wand2 aria-hidden="true" className="w-3 h-3" />
                          <span>Tách thành cặp đoạn</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-text-muted">
                            Toàn bộ văn bản Tiếng Anh (EN)
                          </label>
                          <textarea
                            rows={5}
                            value={contentEn}
                            onChange={(e) => setContentEn(e.target.value)}
                            placeholder="Paste or write the entire English reading text here..."
                            className="w-full p-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-text-muted">
                            Toàn bộ văn bản Tiếng Việt (VI)
                          </label>
                          <textarea
                            rows={5}
                            value={contentVi}
                            onChange={(e) => setContentVi(e.target.value)}
                            placeholder="Dán hoặc soạn bản dịch tiếng Việt tương ứng ở đây..."
                            className="w-full p-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ════ GROUP 2: CẶP ĐOẠN SONG NGỮ ════ */}
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openSection === 'bilingual'
                  ? 'border-antique-gold bg-warm-ivory dark:bg-stone-800/80 shadow-sm'
                  : 'border-antique-gold/25 bg-warm-ivory/50 dark:bg-stone-800/30 hover:border-antique-gold/50'
              }`}>
                <button
                  type="button"
                  onClick={() => toggleSection('bilingual')}
                  className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      openSection === 'bilingual'
                        ? 'bg-heritage-green text-warm-ivory'
                        : 'bg-antique-gold/20 text-heritage-green dark:text-antique-bright'
                    }`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-heritage-green dark:text-warm-ivory truncate">
                        2. Cặp đoạn văn song ngữ
                      </div>
                      <div className="text-[10px] text-text-muted truncate">
                        Nội dung bài học đối chiếu câu/đoạn
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright border border-antique-gold/30">
                      {paragraphs.length} cặp đoạn
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${openSection === 'bilingual' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {openSection === 'bilingual' && (
                  <div className="p-4 pt-2 border-t border-antique-gold/15 space-y-4">
                    <div className="flex items-center justify-between bg-warm-ivory/80 dark:bg-heritage-dark/60 p-3 rounded-2xl border border-antique-gold/30">
                      <div className="text-xs font-bold text-heritage-green dark:text-antique-bright">
                        {paragraphs.length} cặp đoạn văn
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleAutoSplit}
                          className="px-2.5 py-1 rounded-xl bg-antique-gold/20 hover:bg-antique-gold/30 text-heritage-dark dark:text-antique-bright text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Wand2 aria-hidden="true" className="w-3.5 h-3.5" />
                          <span>Tách lại</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleAddParagraph}
                          className="px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-heritage-dark transition-colors"
                        >
                          <Plus aria-hidden="true" className="w-3.5 h-3.5" />
                          <span>Thêm đoạn</span>
                        </button>
                      </div>
                    </div>

                    {paragraphs.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-antique-gold/30 rounded-2xl">
                        <BookOpen aria-hidden="true" className="w-8 h-8 text-antique-gold/50 mx-auto mb-2" />
                        <p className="text-xs text-text-muted">Chưa có cặp đoạn văn nào.</p>
                        <button
                          type="button"
                          onClick={handleAddParagraph}
                          className="mt-2 px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold cursor-pointer"
                        >
                          Thêm đoạn văn đầu tiên
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {paragraphs.map((p, idx) => (
                          <div
                            key={idx}
                            id={`paragraph-pair-${idx}`}
                            className="p-3.5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-full bg-heritage-green text-warm-ivory text-[11px] font-bold">
                                Đoạn {idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveParagraph(idx)}
                                className="p-1 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                                title="Xóa đoạn này"
                              >
                                <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-text-muted uppercase">
                                Tiếng Anh (EN)
                              </label>
                              <textarea
                                rows={2}
                                value={p.enText}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setParagraphs((prev) =>
                                    prev.map((item, i) => (i === idx ? { ...item, enText: val } : item))
                                  );
                                }}
                                className="w-full p-2 rounded-xl border border-antique-gold/30 bg-white dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-text-muted uppercase">
                                Tiếng Việt (VI)
                              </label>
                              <textarea
                                rows={2}
                                value={p.viText}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setParagraphs((prev) =>
                                    prev.map((item, i) => (i === idx ? { ...item, viText: val } : item))
                                  );
                                }}
                                className="w-full p-2 rounded-xl border border-antique-gold/30 bg-white dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ════ GROUP 3: TỪ VỰNG TRỌNG TÂM ════ */}
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openSection === 'vocab'
                  ? 'border-antique-gold bg-warm-ivory dark:bg-stone-800/80 shadow-sm'
                  : 'border-antique-gold/25 bg-warm-ivory/50 dark:bg-stone-800/30 hover:border-antique-gold/50'
              }`}>
                <button
                  type="button"
                  onClick={() => toggleSection('vocab')}
                  className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      openSection === 'vocab'
                        ? 'bg-heritage-green text-warm-ivory'
                        : 'bg-antique-gold/20 text-heritage-green dark:text-antique-bright'
                    }`}>
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-heritage-green dark:text-warm-ivory truncate">
                        3. Từ vựng trọng tâm
                      </div>
                      <div className="text-[10px] text-text-muted truncate">
                        Danh sách từ vựng highlight và tra cứu nhanh
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright border border-antique-gold/30">
                      {vocabularies.length} từ
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${openSection === 'vocab' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {openSection === 'vocab' && (
                  <div className="p-4 pt-2 border-t border-antique-gold/15 space-y-4">
                    <div className="p-3.5 rounded-2xl bg-antique-gold/15 border border-antique-gold/30 space-y-2">
                      <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                        Nhập nhanh từ vựng (Fast Paste)
                      </label>
                      <textarea
                        rows={2}
                        value={fastVocabInput}
                        onChange={(e) => setFastVocabInput(e.target.value)}
                        placeholder="pottery - đồ gốm&#10;glaze - lớp men tráng"
                        className="w-full p-2 rounded-xl border border-antique-gold/30 bg-white dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory"
                      />
                      <button
                        type="button"
                        onClick={handleFastVocabImport}
                        className="px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold cursor-pointer hover:bg-heritage-dark transition-colors"
                      >
                        Nạp danh sách từ vựng
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-heritage-green dark:text-antique-bright">
                        Danh sách từ vựng ({vocabularies.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddVocab}
                        className="px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus aria-hidden="true" className="w-3.5 h-3.5" />
                        <span>Thêm từ mới</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {vocabularies.map((v, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Từ vựng (EN)"
                              value={v.word}
                              onChange={(e) => {
                                const val = e.target.value;
                                setVocabularies((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, word: val } : item))
                                );
                              }}
                              className="flex-1 p-2 rounded-xl border border-antique-gold/30 bg-white dark:bg-stone-800 text-xs font-bold"
                            />
                            <input
                              type="text"
                              placeholder="Nghĩa (VI)"
                              value={v.vietnameseMeaning}
                              onChange={(e) => {
                                const val = e.target.value;
                                setVocabularies((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, vietnameseMeaning: val } : item
                                  )
                                );
                              }}
                              className="flex-1 p-2 rounded-xl border border-antique-gold/30 bg-white dark:bg-stone-800 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveVocab(idx)}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg cursor-pointer"
                            >
                              <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ════ GROUP 4: AUDIO & GIỌNG ĐỌC AI ════ */}
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openSection === 'voices'
                  ? 'border-antique-gold bg-warm-ivory dark:bg-stone-800/80 shadow-sm'
                  : 'border-antique-gold/25 bg-warm-ivory/50 dark:bg-stone-800/30 hover:border-antique-gold/50'
              }`}>
                <button
                  type="button"
                  onClick={() => toggleSection('voices')}
                  className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      openSection === 'voices'
                        ? 'bg-heritage-green text-warm-ivory'
                        : 'bg-antique-gold/20 text-heritage-green dark:text-antique-bright'
                    }`}>
                      <Radio className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-heritage-green dark:text-warm-ivory truncate">
                        4. Audio & Giọng đọc AI
                      </div>
                      <div className="text-[10px] text-text-muted truncate">
                        Shadowing audio & đa tốc độ đọc
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright border border-antique-gold/30">
                      {voiceTracks.length} giọng
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${openSection === 'voices' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {openSection === 'voices' && (
                  <div className="p-4 pt-2 border-t border-antique-gold/15 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                        Audio Shadowing chuẩn (URL trực tiếp)
                      </label>
                      <input
                        type="url"
                        value={shadowingAudioUrl}
                        onChange={(e) => setShadowingAudioUrl(e.target.value)}
                        placeholder="https://.../shadowing.mp3"
                        className="w-full p-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                      />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-antique-gold/20">
                      <span className="text-xs font-bold text-heritage-green dark:text-antique-bright">
                        Bộ giọng đọc AI VieCultures ({voiceModels.length} mẫu)
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {voiceModels.map((model) => (
                          <div
                            key={model.id}
                            className="p-3 rounded-2xl bg-warm-ivory dark:bg-white/5 border border-antique-gold/20 flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-bold text-heritage-green dark:text-antique-gold">
                                {model.name}
                              </div>
                              <div className="text-[10px] text-text-muted">{model.gender} · {model.accent}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleGenerateVoice(model)}
                              disabled={generatingVoiceId === model.id}
                              className="px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {generatingVoiceId === model.id ? (
                                <Loader2 aria-hidden="true" className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Radio aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                              )}
                              <span>Tạo Audio</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ════ GROUP 5: BỘ CÂU HỎI TRẮC NGHIỆM ════ */}
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openSection === 'quiz'
                  ? 'border-antique-gold bg-warm-ivory dark:bg-stone-800/80 shadow-sm'
                  : 'border-antique-gold/25 bg-warm-ivory/50 dark:bg-stone-800/30 hover:border-antique-gold/50'
              }`}>
                <button
                  type="button"
                  onClick={() => toggleSection('quiz')}
                  className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      openSection === 'quiz'
                        ? 'bg-heritage-green text-warm-ivory'
                        : 'bg-antique-gold/20 text-heritage-green dark:text-antique-bright'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-heritage-green dark:text-warm-ivory truncate">
                        5. Câu hỏi đọc hiểu ôn tập
                      </div>
                      <div className="text-[10px] text-text-muted truncate">
                        Bộ trắc nghiệm 4 lựa chọn (A, B, C, D)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright border border-antique-gold/30">
                      {questions.length} câu
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${openSection === 'quiz' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {openSection === 'quiz' && (
                  <div className="p-4 pt-2 border-t border-antique-gold/15 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-heritage-green dark:text-antique-bright">
                        Bộ câu hỏi ôn tập ({questions.length} câu)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus aria-hidden="true" className="w-3.5 h-3.5" />
                        <span>Thêm câu hỏi</span>
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {questions.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-3.5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-heritage-green text-warm-ivory text-[11px] font-bold">
                              Câu {qIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(qIdx)}
                              className="p-1 text-red-500 hover:bg-red-100 rounded-lg cursor-pointer"
                            >
                              <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Nội dung câu hỏi..."
                            value={q.questionText}
                            onChange={(e) => handleUpdateQuestionText(qIdx, e.target.value)}
                            className="w-full p-2 rounded-xl border border-antique-gold/30 bg-white dark:bg-stone-800 text-xs font-bold"
                          />

                          <div className="space-y-1.5">
                            {q.options?.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <span className="text-xs font-bold w-4">{String.fromCharCode(65 + oIdx)}.</span>
                                <input
                                  type="text"
                                  placeholder={`Đáp án ${String.fromCharCode(65 + oIdx)}...`}
                                  value={opt.optionText}
                                  onChange={(e) => handleUpdateOptionText(qIdx, String.fromCharCode(65 + oIdx), e.target.value)}
                                  className="flex-1 p-2 rounded-xl border border-antique-gold/30 bg-white dark:bg-stone-800 text-xs"
                                />
                                <label className="flex items-center gap-1 text-[11px] font-bold cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`correct-${qIdx}`}
                                    checked={opt.isCorrect}
                                    onChange={() => handleUpdateCorrectKey(qIdx, String.fromCharCode(65 + oIdx))}
                                  />
                                  <span>Đúng</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ════ GROUP 6: IMPORT TSV ════ */}
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openSection === 'tsv'
                  ? 'border-antique-gold bg-warm-ivory dark:bg-stone-800/80 shadow-sm'
                  : 'border-antique-gold/25 bg-warm-ivory/50 dark:bg-stone-800/30 hover:border-antique-gold/50'
              }`}>
                <button
                  type="button"
                  onClick={() => toggleSection('tsv')}
                  className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      openSection === 'tsv'
                        ? 'bg-heritage-green text-warm-ivory'
                        : 'bg-antique-gold/20 text-heritage-green dark:text-antique-bright'
                    }`}>
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-heritage-green dark:text-warm-ivory truncate">
                        6. Nạp nhanh dữ liệu TSV
                      </div>
                      <div className="text-[10px] text-text-muted truncate">
                        Import 1 dòng từ Google Sheets / Excel
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright border border-antique-gold/30">
                      Fast Loader
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${openSection === 'tsv' ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {openSection === 'tsv' && (
                  <div className="p-4 pt-2 border-t border-antique-gold/15 space-y-3">
                    <label className="block text-xs font-bold text-heritage-green dark:text-warm-ivory">
                      Dán dòng TSV từ Google Sheets hoặc Excel
                    </label>
                    <textarea
                      rows={4}
                      value={tsvRawRow}
                      onChange={(e) => setTsvRawRow(e.target.value)}
                      placeholder="Dán hàng TSV tại đây..."
                      className="w-full p-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-stone-800 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleTsvImport}
                      className="px-4 py-2 rounded-xl bg-antique-gold text-heritage-dark font-extrabold text-xs cursor-pointer shadow-sm hover:bg-antique-bright transition-colors"
                    >
                      Nạp dữ liệu vào bài viết
                    </button>
                  </div>
                )}
              </div>
            </form>
          </section>
        )}

        {/* ════ RESIZER SPLITTER HANDLE ════ */}
        <div
          onPointerDown={handleResizerPointerDown}
          className="w-2 hover:w-3 active:w-3 bg-antique-gold/25 hover:bg-antique-gold/70 active:bg-antique-gold cursor-col-resize flex items-center justify-center shrink-0 select-none z-10 transition-all group relative"
          title="Kéo sang trái để thu gọn, kéo sang phải để mở rộng"
        >
          <div className="w-1 h-8 rounded-full bg-antique-gold/60 group-hover:bg-heritage-green transition-colors" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse();
            }}
            className="absolute -top-3 w-6 h-6 rounded-full bg-antique-gold text-heritage-dark shadow-md flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title={isCollapsed ? 'Mở rộng cột trái' : 'Thu gọn cột trái'}
          >
            {isCollapsed ? (
              <ChevronRight aria-hidden="true" className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft aria-hidden="true" className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* ════ CỘT PHẢI: LIVE PREVIEW CANVAS ════ */}
        <main className="flex-1 min-w-0 h-full overflow-hidden flex flex-col bg-warm-ivory/60 dark:bg-stone-900">
          <PostPreviewCanvas
            titleEn={titleEn}
            titleVi={titleVi}
            topic={topic}
            region={region}
            level={level}
            readTime={readTime}
            imageUrl={imageUrl}
            shadowingAudioUrl={shadowingAudioUrl}
            summary={summary}
            journeyTitleEn={journeysList.find((j) => j.id === journeyId)?.titleEn}
            chapterOrder={chapterOrder}
            paragraphs={paragraphs}
            vocabularies={vocabularies}
            questions={questions}
            voiceTracks={voiceTracks}
            onFocusParagraphInForm={(idx) => {
              if (isCollapsed) setIsCollapsed(false);
              setOpenSection('bilingual');
              setTimeout(() => {
                const el = document.getElementById(`paragraph-pair-${idx}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
            onUpdateParagraph={(idx, enText, viText) => {
              setParagraphs((prev) => {
                const next = [...prev];
                if (next[idx]) {
                  next[idx] = { ...next[idx], enText, viText };
                }
                return next;
              });
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminPostEditorPage;
