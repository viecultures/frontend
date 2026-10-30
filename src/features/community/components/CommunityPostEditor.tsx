import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Send,
  PenLine,
  BookOpen,
  Tag,
  ImageIcon,
  Eye,
  Edit3,
  Check,
  Plus,
  HelpCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import type { HighlightVocabItem } from "../types";

interface CommunityPostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLesson: string;
  onChangeLesson: (lesson: string) => void;
  postTitle?: string;
  onChangePostTitle?: (title: string) => void;
  reflectionText: string;
  onChangeReflectionText: (text: string) => void;
  onPublish: (postData: {
    title: string;
    content: string;
    lesson: string;
    imageUrl?: string;
    imageCaption?: string;
    vocabList: HighlightVocabItem[];
  }) => void;
}

const TOPIC_OPTIONS = [
  { value: "Imperial Hue", label: "Imperial Hue Architecture & Citadel" },
  { value: "Saigon Bánh Mì", label: "Saigon Food & Street Culture" },
  { value: "Hội An Lanterns", label: "Hoi An Lanterns & Heritage Port" },
  { value: "Vietnamese Traditions", label: "Vietnamese Traditions & Festivals" },
  { value: "Bát Tràng Pottery", label: "Bát Tràng Pottery & Craftsmanship" },
  { value: "Egg Coffee", label: "Hanoi Egg Coffee & Cafe History" },
];

const PRESET_PHOTOS = [
  {
    url: "/images/landing/hue-citadel.jpg",
    label: "Imperial Hue Citadel",
    topic: "Imperial Hue",
  },
  {
    url: "/images/landing/banh-mi.jpg",
    label: "Saigon Bánh Mì",
    topic: "Saigon Bánh Mì",
  },
  {
    url: "/images/landing/hoi-an-lanterns.jpg",
    label: "Hội An Silk Lanterns",
    topic: "Hội An Lanterns",
  },
  {
    url: "/images/landing/bat-trang.jpg",
    label: "Bát Tràng Ceramics",
    topic: "Bát Tràng Pottery",
  },
  {
    url: "/images/landing/dong-ho.jpg",
    label: "Đông Hồ Folk Art",
    topic: "Vietnamese Traditions",
  },
  {
    url: "/images/landing/pho-hanoi.jpg",
    label: "Traditional Hanoi Phở",
    topic: "Saigon Bánh Mì",
  },
];

export function CommunityPostEditor({
  isOpen,
  onClose,
  selectedLesson,
  onChangeLesson,
  postTitle = "",
  onChangePostTitle,
  reflectionText,
  onChangeReflectionText,
  onPublish,
}: CommunityPostEditorProps) {
  const { t } = useTranslation("community");
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    PRESET_PHOTOS[0].url
  );
  const [photoCaption, setPhotoCaption] = useState<string>(
    PRESET_PHOTOS[0].label
  );
  const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [showWritingAssistance, setShowWritingAssistance] = useState<boolean>(false);

  // Custom Vocab items to attach
  const [vocabList, setVocabList] = useState<HighlightVocabItem[]>([
    {
      word: "architectural",
      meaning: "thuộc kiến trúc",
      partOfSpeech: "Adjective",
      synonyms: ["structural", "design-related"],
      exampleSentence: "Appreciating the architectural harmony of ancient temples.",
    },
  ]);
  const [newVocabWord, setNewVocabWord] = useState<string>("");
  const [newVocabMeaning, setNewVocabMeaning] = useState<string>("");
  const [showVocabInput, setShowVocabInput] = useState<boolean>(false);

  if (!isOpen) return null;

  const wordCount = reflectionText.trim()
    ? reflectionText.trim().split(/\s+/).length
    : 0;

  const handleAddVocab = () => {
    if (!newVocabWord.trim() || !newVocabMeaning.trim()) return;
    setVocabList([
      ...vocabList,
      {
        word: newVocabWord.trim().toLowerCase(),
        meaning: newVocabMeaning.trim(),
        partOfSpeech: "Term",
      },
    ]);
    setNewVocabWord("");
    setNewVocabMeaning("");
    setShowVocabInput(false);
  };

  const handleRemoveVocab = (idx: number) => {
    setVocabList(vocabList.filter((_, i) => i !== idx));
  };

  const handleSelectPresetPhoto = (photo: typeof PRESET_PHOTOS[0]) => {
    setSelectedPhoto(photo.url);
    setPhotoCaption(photo.label);
    setShowPhotoPicker(false);
  };

  const handleSubmit = () => {
    if (!reflectionText.trim()) {
      alert(t("community.editor.alert_empty_content"));
      return;
    }
    onPublish({
      title: postTitle.trim(),
      content: reflectionText.trim(),
      lesson: selectedLesson,
      imageUrl: selectedPhoto,
      imageCaption: photoCaption,
      vocabList,
    });
  };

  // Heuristic Writing Advice (Non-intrusive, educational)
  const writingTips: string[] = [];
  if (wordCount < 20) {
    writingTips.push(t("community.editor.tip_min_words"));
  }
  if (!reflectionText.includes("because") && !reflectionText.includes("which") && !reflectionText.includes("when")) {
    writingTips.push(t("community.editor.tip_linking_words"));
  }
  if (vocabList.length === 0) {
    writingTips.push(t("community.editor.tip_vocab"));
  }

  return (
    <div
      id="reflection-editor"
      className="community-editor mb-6 p-5 sm:p-7 rounded-2xl bg-white border border-line shadow-lg space-y-5 animate-in fade-in slide-in-from-top-3 duration-250 relative"
    >
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-heritage-green/10 text-heritage-green font-bold text-xs flex items-center justify-center border border-heritage-green/20">
            HV
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-heritage-green">
              {t("community.editor.header_title")}
            </h2>
            <p className="text-xs text-text-muted">
              {t("community.editor.header_desc")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview / Edit Toggle */}
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-1.5 rounded-xl bg-surface-muted border border-line text-xs font-semibold text-heritage-green hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isPreview ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t("community.editor.edit")}</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>{t("community.editor.preview")}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-muted text-text-muted hover:text-heritage-green transition-colors cursor-pointer focus-ring"
            aria-label={t("community.editor.close_aria")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isPreview ? (
        <>
          {/* 2. Topic & Title Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Category Selector */}
            <div>
              <label
                htmlFor="lesson-select"
                className="block text-xs font-semibold text-text-body mb-1.5 flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-heritage-green" />
                <span>{t("community.editor.topic_label")}</span>
              </label>
              <select
                id="lesson-select"
                value={selectedLesson}
                onChange={(e) => onChangeLesson(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-line text-xs font-medium text-heritage-green focus:outline-none focus:ring-1 focus:ring-heritage-green focus:bg-white"
              >
                {TOPIC_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Post Title */}
            <div>
              <label
                htmlFor="title-input"
                className="block text-xs font-semibold text-text-body mb-1.5 flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-heritage-green" />
                <span>{t("community.editor.title_label")}</span>
              </label>
              <input
                id="title-input"
                type="text"
                value={postTitle}
                onChange={(e) => onChangePostTitle?.(e.target.value)}
                placeholder={t("community.editor.title_placeholder")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-line text-xs text-text-body placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-heritage-green focus:bg-white"
              />
            </div>
          </div>

          {/* 3. Main Textarea */}
          <div className="space-y-1.5">
            <textarea
              value={reflectionText}
              onChange={(e) => onChangeReflectionText(e.target.value)}
              placeholder={t("community.editor.content_placeholder")}
              className="w-full h-36 sm:h-40 p-4 rounded-xl bg-surface-muted border border-line text-xs sm:text-sm text-text-body placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-heritage-green focus:bg-white leading-relaxed resize-y"
              aria-label={t("community.editor.content_aria")}
            />
            <div className="flex items-center justify-between text-xs text-text-muted px-1">
              <button
                type="button"
                onClick={() => setShowWritingAssistance(!showWritingAssistance)}
                className="inline-flex items-center gap-1 text-heritage-green font-semibold hover:underline cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-antique-gold" />
                <span>{showWritingAssistance ? t("community.editor.hide_tips_btn") : t("community.editor.writing_assist_btn")}</span>
              </button>
              <span className="font-medium">{t("community.editor.words_count", { count: wordCount })}</span>
            </div>
          </div>

          {/* 4. Optional English Writing Assistant Box */}
          {showWritingAssistance && (
            <div className="p-3.5 rounded-xl bg-surface-muted border border-line space-y-2 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-heritage-green flex items-center gap-1.5">
                  <PenLine className="w-3.5 h-3.5 text-heritage-green" />
                  <span>{t("community.editor.tips_title")}</span>
                </span>
                <span className="text-[11px] text-text-muted">
                  {t("community.editor.tips_subtitle")}
                </span>
              </div>
              <ul className="space-y-1 text-text-body pl-4 list-disc text-xs leading-relaxed">
                {writingTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
                <li>
                  {t("community.editor.sentence_starters_label")} <em>&ldquo;{t("community.editor.starter_1")}&rdquo;</em>, <em>&ldquo;{t("community.editor.starter_2")}&rdquo;</em>
                </li>
              </ul>
            </div>
          )}

          {/* 5. Vocabulary Tags Attachment */}
          <div className="space-y-2 pt-1 border-t border-line/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-body flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-heritage-green" />
                <span>{t("community.editor.vocab_tags_title")}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowVocabInput(!showVocabInput)}
                className="text-xs font-semibold text-heritage-green hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("community.editor.add_word_btn")}</span>
              </button>
            </div>

            {/* Attached Vocab Chips */}
            <div className="flex flex-wrap gap-1.5">
              {vocabList.map((v, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-muted border border-line text-xs font-medium text-heritage-green"
                >
                  <span className="font-bold">{v.word}</span>
                  <span className="text-[11px] text-text-muted">({v.meaning})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVocab(idx)}
                    className="hover:text-red-600 ml-0.5 cursor-pointer"
                    aria-label={t("community.editor.remove_word_aria", { word: v.word })}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Inline Add Word Form */}
            {showVocabInput && (
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  placeholder={t("community.editor.word_placeholder")}
                  value={newVocabWord}
                  onChange={(e) => setNewVocabWord(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-surface-muted border border-line text-xs text-text-body focus:outline-none focus:ring-1 focus:ring-heritage-green"
                />
                <input
                  type="text"
                  placeholder={t("community.editor.meaning_placeholder")}
                  value={newVocabMeaning}
                  onChange={(e) => setNewVocabMeaning(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-surface-muted border border-line text-xs text-text-body focus:outline-none focus:ring-1 focus:ring-heritage-green"
                />
                <button
                  type="button"
                  onClick={handleAddVocab}
                  className="px-3 py-1.5 rounded-lg bg-heritage-green text-white text-xs font-semibold hover:bg-heritage-dark cursor-pointer"
                >
                  {t("community.editor.save_tag_btn")}
                </button>
              </div>
            )}
          </div>

          {/* 6. Photo Attachment Selection */}
          <div className="space-y-2 pt-1 border-t border-line/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-body flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-heritage-green" />
                <span>{t("community.editor.photo_attach_title")}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                className="text-xs font-semibold text-heritage-green hover:underline cursor-pointer"
              >
                {showPhotoPicker ? t("community.editor.close_photo_btn") : t("community.editor.choose_photo_btn")}
              </button>
            </div>

            {/* Currently Selected Photo Preview */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-muted border border-line">
              <img
                src={selectedPhoto}
                alt={photoCaption}
                className="w-16 h-12 object-cover rounded-lg border border-line"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-heritage-green block truncate">
                  {photoCaption}
                </span>
                <span className="text-[11px] text-text-muted">
                  {t("community.editor.photo_badge")}
                </span>
              </div>
            </div>

            {/* Photo Picker Gallery */}
            {showPhotoPicker && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-white border border-line">
                {PRESET_PHOTOS.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetPhoto(photo)}
                    className={`relative rounded-lg overflow-hidden border aspect-video text-left cursor-pointer group transition-all ${
                      selectedPhoto === photo.url
                        ? "border-heritage-green ring-2 ring-heritage-green/30"
                        : "border-line hover:border-heritage-green/40"
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-black/60 text-white text-[10px] truncate">
                      {photo.label}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Preview Card */
        <div className="p-4 rounded-xl bg-surface-muted border border-line space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-heritage-green">
              {t("community.editor.preview_mode")}
            </span>
            <span className="text-xs text-text-muted">
              · {selectedLesson}
            </span>
          </div>
          {postTitle && (
            <h3 className="font-serif text-lg font-bold text-heritage-green">
              {postTitle}
            </h3>
          )}
          <p className="text-sm text-text-body leading-relaxed whitespace-pre-line">
            {reflectionText || t("community.editor.no_content_placeholder")}
          </p>
          {selectedPhoto && (
            <div className="w-full rounded-xl overflow-hidden border border-line h-52 sm:h-60">
              <img
                src={selectedPhoto}
                alt={photoCaption}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* 7. Footer Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-line">
        <span className="text-xs text-text-muted hidden sm:inline">
          {t("community.editor.footer_hint")}
        </span>

        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-heritage-green hover:bg-surface-muted transition-colors cursor-pointer"
          >
            {t("community.editor.cancel_btn")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-heritage-green hover:bg-heritage-dark shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer focus-ring"
          >
            <Send className="w-3.5 h-3.5 text-antique-gold" />
            <span>{t("community.editor.publish_btn")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityPostEditor;
