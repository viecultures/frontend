import React, { useState } from "react";
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
      alert("Please write your reflection content before publishing.");
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
  const writingTips = [];
  if (wordCount < 20) {
    writingTips.push("Aim for at least 30–50 words to express a rich reflection.");
  }
  if (!reflectionText.includes("because") && !reflectionText.includes("which") && !reflectionText.includes("when")) {
    writingTips.push("Tip: Use linking words like 'when', 'because', or 'which' to create complex sentences.");
  }
  if (vocabList.length === 0) {
    writingTips.push("Tip: Attach 1–2 target English words to help peers learn vocabulary from your post.");
  }

  return (
    <div
      id="reflection-editor"
      className="community-editor mb-6 p-5 sm:p-7 rounded-2xl bg-white border border-[#E8E2D5] shadow-lg space-y-5 animate-in fade-in slide-in-from-top-3 duration-250 relative"
    >
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E2D5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1D5046]/10 text-[#1D5046] font-bold text-xs flex items-center justify-center border border-[#1D5046]/20">
            HV
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1D5046]">
              Share your Cultural Reflection
            </h2>
            <p className="text-xs text-[#6E7B75]">
              Write in English, explore heritage, and help peers discover vocabulary.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview / Edit Toggle */}
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs font-semibold text-[#1D5046] hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isPreview ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FAF7F0] text-[#6E7B75] hover:text-[#1D5046] transition-colors cursor-pointer focus-ring"
            aria-label="Close reflection editor"
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
                className="block text-xs font-semibold text-[#314F49] mb-1.5 flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#1D5046]" />
                <span>Cultural Topic</span>
              </label>
              <select
                id="lesson-select"
                value={selectedLesson}
                onChange={(e) => onChangeLesson(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs font-medium text-[#1D5046] focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white"
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
                className="block text-xs font-semibold text-[#314F49] mb-1.5 flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-[#1D5046]" />
                <span>Reflection Title (Optional)</span>
              </label>
              <input
                id="title-input"
                type="text"
                value={postTitle}
                onChange={(e) => onChangePostTitle?.(e.target.value)}
                placeholder="e.g. Architectural symmetry of Ngọ Môn Gate..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs text-[#314F49] placeholder:text-[#6E7B75]/60 focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white"
              />
            </div>
          </div>

          {/* 3. Main Textarea */}
          <div className="space-y-1.5">
            <textarea
              value={reflectionText}
              onChange={(e) => onChangeReflectionText(e.target.value)}
              placeholder="Share a cultural story or something you learned today in English... Express your feelings, vocabulary or memories."
              className="w-full h-36 sm:h-40 p-4 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs sm:text-sm text-[#314F49] placeholder:text-[#6E7B75]/60 focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white leading-relaxed resize-y"
              aria-label="Reflection text in English"
            />
            <div className="flex items-center justify-between text-xs text-[#6E7B75] px-1">
              <button
                type="button"
                onClick={() => setShowWritingAssistance(!showWritingAssistance)}
                className="inline-flex items-center gap-1 text-[#1D5046] font-semibold hover:underline cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#E8D7AE]" />
                <span>{showWritingAssistance ? "Hide writing tips" : "English Writing Assistance"}</span>
              </button>
              <span className="font-medium">{wordCount} words</span>
            </div>
          </div>

          {/* 4. Optional English Writing Assistant Box */}
          {showWritingAssistance && (
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-2 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1D5046] flex items-center gap-1.5">
                  <PenLine className="w-3.5 h-3.5 text-[#1D5046]" />
                  <span>Writing Suggestions (Non-intrusive)</span>
                </span>
                <span className="text-[11px] text-[#6E7B75]">
                  Vocabulary &amp; Sentence Flow
                </span>
              </div>
              <ul className="space-y-1 text-[#314F49] pl-4 list-disc text-xs leading-relaxed">
                {writingTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
                <li>
                  Sentence starter ideas: <em>&ldquo;What struck me most about...&rdquo;</em>, <em>&ldquo;Exploring the history of... gave me a fresh perspective on...&rdquo;</em>
                </li>
              </ul>
            </div>
          )}

          {/* 5. Vocabulary Tags Attachment */}
          <div className="space-y-2 pt-1 border-t border-[#E8E2D5]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#314F49] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#1D5046]" />
                <span>Practiced Vocabulary Tags</span>
              </span>
              <button
                type="button"
                onClick={() => setShowVocabInput(!showVocabInput)}
                className="text-xs font-semibold text-[#1D5046] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add word</span>
              </button>
            </div>

            {/* Attached Vocab Chips */}
            <div className="flex flex-wrap gap-1.5">
              {vocabList.map((v, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-[#E8E2D5] text-xs font-medium text-[#1D5046]"
                >
                  <span className="font-bold">{v.word}</span>
                  <span className="text-[11px] text-[#6E7B75]">({v.meaning})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVocab(idx)}
                    className="hover:text-red-600 ml-0.5 cursor-pointer"
                    aria-label={`Remove ${v.word}`}
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
                  placeholder="English word (e.g. craftsmanship)"
                  value={newVocabWord}
                  onChange={(e) => setNewVocabWord(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#E8E2D5] text-xs text-[#314F49] focus:outline-none focus:ring-1 focus:ring-[#1D5046]"
                />
                <input
                  type="text"
                  placeholder="Vietnamese meaning (e.g. tay nghề thủ công)"
                  value={newVocabMeaning}
                  onChange={(e) => setNewVocabMeaning(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#E8E2D5] text-xs text-[#314F49] focus:outline-none focus:ring-1 focus:ring-[#1D5046]"
                />
                <button
                  type="button"
                  onClick={handleAddVocab}
                  className="px-3 py-1.5 rounded-lg bg-[#1D5046] text-white text-xs font-semibold hover:bg-[#153D35] cursor-pointer"
                >
                  Save tag
                </button>
              </div>
            )}
          </div>

          {/* 6. Photo Attachment Selection */}
          <div className="space-y-2 pt-1 border-t border-[#E8E2D5]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#314F49] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#1D5046]" />
                <span>Cultural Photo Attachment</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                className="text-xs font-semibold text-[#1D5046] hover:underline cursor-pointer"
              >
                {showPhotoPicker ? "Close gallery" : "Choose from library"}
              </button>
            </div>

            {/* Currently Selected Photo Preview */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5]">
              <img
                src={selectedPhoto}
                alt={photoCaption}
                className="w-16 h-12 object-cover rounded-lg border border-[#E8E2D5]"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-[#1D5046] block truncate">
                  {photoCaption}
                </span>
                <span className="text-[11px] text-[#6E7B75]">
                  Authentic heritage photograph
                </span>
              </div>
            </div>

            {/* Photo Picker Gallery */}
            {showPhotoPicker && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-white border border-[#E8E2D5]">
                {PRESET_PHOTOS.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetPhoto(photo)}
                    className={`relative rounded-lg overflow-hidden border aspect-video text-left cursor-pointer group transition-all ${
                      selectedPhoto === photo.url
                        ? "border-[#1D5046] ring-2 ring-[#1D5046]/30"
                        : "border-[#E8E2D5] hover:border-[#1D5046]/40"
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
        <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1D5046]">
              Preview Mode
            </span>
            <span className="text-xs text-[#6E7B75]">
              · {selectedLesson}
            </span>
          </div>
          {postTitle && (
            <h3 className="font-serif text-lg font-bold text-[#1D5046]">
              {postTitle}
            </h3>
          )}
          <p className="text-sm text-[#314F49] leading-relaxed whitespace-pre-line">
            {reflectionText || "(No reflection content written yet...)"}
          </p>
          {selectedPhoto && (
            <div className="w-full rounded-xl overflow-hidden border border-[#E8E2D5] h-52 sm:h-60">
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
      <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D5]">
        <span className="text-xs text-[#6E7B75] hidden sm:inline">
          Express yourself freely · Build cultural confidence
        </span>

        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1D5046] hover:bg-[#153D35] shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer focus-ring"
          >
            <Send className="w-3.5 h-3.5 text-[#E8D7AE]" />
            <span>Publish Reflection</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityPostEditor;
