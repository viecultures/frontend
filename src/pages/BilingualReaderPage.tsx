import { useState } from "react";
import Link from "@/components/Link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Moon,
  Sun,
  Type,
  X,
  Headphones,
  PenTool,
  ArrowRight,
  Layers,
  ChevronRight,
} from "lucide-react";

// Vocabulary Item Schema
interface VocabItem {
  id: string;
  word: string;
  pos: string;
  ipa: string;
  viMeaning: string;
  contextSentence: string;
}

const VOCAB_DATABASE: Record<string, VocabItem> = {
  "well-read": {
    id: "well-read",
    word: "well-read",
    pos: "adj",
    ipa: "/ˌwel ˈred/",
    viMeaning: "Đọc nhiều, am hiểu sâu rộng qua sách báo và tri thức.",
    contextSentence: "There’s a kind of person who’s so well-read...",
  },
  "frighteningly-articulate": {
    id: "frighteningly-articulate",
    word: "frighteningly articulate",
    pos: "phrase",
    ipa: "/ˈfraɪ.tən.ɪŋ.li ɑːrˈtɪk.jə.lət/",
    viMeaning: "Ăn nói sắc sảo, diễn đạt ý tưởng vô cùng lưu loát và thuyết phục.",
    contextSentence: "...so frighteningly articulate, so mentally juicy...",
  },
  "annotating-a-book": {
    id: "annotating-a-book",
    word: "annotating a book",
    pos: "v. phrase",
    ipa: "/ˈæn.ə.teɪt.ɪŋ/",
    viMeaning: "Ghi chú, đúc kết suy nghĩ trực tiếp vào lề trang sách khi đang đọc.",
    contextSentence: "They listen to podcasts at 1.5x speed while annotating a book.",
  },
  "epistemic-frameworks": {
    id: "epistemic-frameworks",
    word: "epistemic frameworks",
    pos: "noun phrase",
    ipa: "/ˌep.əˈstee.mɪk ˈfreɪm.wɜːrk/",
    viMeaning: "Khung nhận thức luận / Hệ thống cấu trúc lý thuyết tri thức.",
    contextSentence: "They drop phrases like 'epistemic frameworks'...",
  },
  "indecent-pleasure": {
    id: "indecent-pleasure",
    word: "indecent pleasure",
    pos: "noun phrase",
    ipa: "/ɪnˈdiː.sənt ˈpleʒ.ər/",
    viMeaning: "Niềm vui mãnh liệt, trần trụi và thuần túy khi dung nạp kiến thức.",
    contextSentence: "...for the sheer, indecent pleasure of being disgustingly educated.",
  },
};

export default function ReaderPage() {
  // Reader Control States
  const [fontSize, setFontSize] = useState<number>(17);
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [themeMode, setThemeMode] = useState<"olive" | "paper" | "dark">("dark");
  const [isVocabDrawerOpen, setIsVocabDrawerOpen] = useState<boolean>(false);
  const [selectedVocab, setSelectedVocab] = useState<VocabItem | null>(null);
  const [bookmarkedWords, setBookmarkedWords] = useState<Record<string, boolean>>({});

  // Quiz States
  const [q1Answer, setQ1Answer] = useState<string>("");
  const [q2Answer, setQ2Answer] = useState<string>("");
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Toggle Vocabulary Drawer
  const openVocab = (key: string) => {
    if (VOCAB_DATABASE[key]) {
      setSelectedVocab(VOCAB_DATABASE[key]);
      setIsVocabDrawerOpen(true);
    }
  };

  const toggleBookmarkWord = (wordId: string) => {
    setBookmarkedWords((prev) => ({ ...prev, [wordId]: !prev[wordId] }));
  };

  // Dynamic style helpers based on themeMode
  const canvasBgClass =
    themeMode === "olive"
      ? "bg-[#545C2D] text-[#FBF7EE]"
      : themeMode === "dark"
      ? "bg-[#141C1A] text-[#E8DFCB]"
      : "bg-[#F6EEDC] text-[#3F5550]";

  const paperSheetBgClass =
    themeMode === "dark"
      ? "bg-[#1E2925] text-[#FBF7EE] border-[#D9B76A]/35 shadow-[0_12px_45px_rgba(0,0,0,0.6)]"
      : themeMode === "olive"
      ? "bg-[#FBF7EE] text-[#2C3B37] border-[rgba(30,75,67,0.12)] shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
      : "bg-[#FBF7EE] text-[#2C3B37] border-[rgba(30,75,67,0.12)] shadow-md";

  const paperTitleColor =
    themeMode === "dark"
      ? "text-[#FBF7EE] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
      : "text-[#1E4B43]";

  const paperSubtitleColor =
    themeMode === "dark"
      ? "text-[#BFE3EA]"
      : "text-[#4B5563]";

  const paperBodyTextColor =
    themeMode === "dark"
      ? "text-[#F6EEDC]/95"
      : "text-[#2C3B37]";

  const vocabBtnClass =
    themeMode === "dark"
      ? "border-b-2 border-dashed border-[#D9B76A] bg-[#D9B76A]/30 font-semibold text-[#D9B76A] hover:bg-[#D9B76A]/45 px-1 rounded transition-colors cursor-pointer shadow-xs"
      : "border-b-2 border-dashed border-[#D9B76A] bg-[#D9B76A]/15 font-semibold text-[#1E4B43] px-1 rounded hover:bg-[#D9B76A]/30 transition-colors cursor-pointer";

  const bottomCardBgClass =
    themeMode === "dark"
      ? "bg-[#1E2925] text-[#FBF7EE] border-[#D9B76A]/30 shadow-xl"
      : "bg-[#FBF7EE] text-[#3F5550] border-[rgba(30,75,67,0.12)] shadow-xl";

  return (
    <main className="min-h-screen bg-[#FBF7EE] text-[#3F5550] relative selection:bg-[#BFE3EA] selection:text-[#1E4B43]">

      {/* Top Reader Toolbar Control Bar */}
      <section className="bg-[#1E4B43] text-[#FBF7EE] border-b border-[#D9B76A]/30 py-3 px-6 sm:px-8 sticky top-[65px] z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Side: Back Link & Breadcrumbs */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <Link
              href="/discovery"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FBF7EE] hover:text-[#D9B76A] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 text-[#D9B76A] group-hover:-translate-x-1 transition-transform" />
              <span className="font-serif italic text-sm">Reading</span>
            </Link>
            <span className="text-[11px] font-semibold text-[#BFE3EA] tracking-wider uppercase">
              • THE VN CULTURE DICTIONARY & READER
            </span>
          </div>

          {/* Right Controls: Font, Size, Vocab Drawer, Theme Toggle */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            {/* Font Selector */}
            <div className="flex items-center gap-1.5 bg-[#163D37] px-3 py-1.5 rounded-xl border border-[#D9B76A]/40">
              <Type className="w-3.5 h-3.5 text-[#D9B76A]" />
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as "serif" | "sans")}
                className="bg-transparent text-xs font-semibold text-[#FBF7EE] focus:outline-none cursor-pointer"
              >
                <option value="serif" className="bg-[#163D37]">
                  Playfair (Serif)
                </option>
                <option value="sans" className="bg-[#163D37]">
                  Plus Jakarta (Sans)
                </option>
              </select>
            </div>

            {/* Font Size +/- Controls */}
            <div className="flex items-center gap-2 bg-[#163D37] px-3 py-1.5 rounded-xl border border-[#D9B76A]/40">
              <span className="text-[11px] text-[#BFE3EA] uppercase font-bold">Cỡ chữ:</span>
              <button
                onClick={() => setFontSize((prev) => Math.max(14, prev - 1))}
                className="w-5 h-5 rounded hover:bg-[#1E4B43] flex items-center justify-center font-bold text-sm"
              >
                -
              </button>
              <span className="font-mono text-xs font-bold text-[#D9B76A]">{fontSize}px</span>
              <button
                onClick={() => setFontSize((prev) => Math.min(24, prev + 1))}
                className="w-5 h-5 rounded hover:bg-[#1E4B43] flex items-center justify-center font-bold text-sm"
              >
                +
              </button>
            </div>

            {/* Vocab Drawer Button */}
            <button
              onClick={() => {
                setSelectedVocab(VOCAB_DATABASE["well-read"]);
                setIsVocabDrawerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D9B76A] text-[#1E4B43] font-bold shadow-sm hover:bg-[#c9a657] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>5 từ vựng</span>
            </button>

            {/* Theme Toggle */}
            <div className="flex items-center bg-[#163D37] p-1 rounded-xl border border-[#D9B76A]/40">
              <button
                onClick={() => setThemeMode("dark")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  themeMode === "dark" ? "bg-[#18211E] text-[#D9B76A]" : "text-[#BFE3EA]"
                }`}
                title="Tối"
              >
                <Moon className="w-3 h-3 inline mr-1" />
                Tối
              </button>
              <button
                onClick={() => setThemeMode("olive")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  themeMode === "olive" ? "bg-[#545C2D] text-[#FBF7EE]" : "text-[#BFE3EA]"
                }`}
                title="Khung Olive"
              >
                Olive
              </button>
              <button
                onClick={() => setThemeMode("paper")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  themeMode === "paper" ? "bg-[#FBF7EE] text-[#1E4B43]" : "text-[#BFE3EA]"
                }`}
                title="Sáng"
              >
                <Sun className="w-3 h-3 inline mr-1" />
                Sáng
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Olive Canvas Container */}
      <section className={`py-10 px-4 sm:px-8 transition-colors duration-300 ${canvasBgClass}`}>
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Dual Floating Paper Sheets View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT PAPER SHEET (ENGLISH) */}
            <div
              className={`p-8 sm:p-10 rounded-3xl flex flex-col justify-between transition-colors duration-300 ${paperSheetBgClass}`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-md">
                    ENGLISH ORIGINAL
                  </span>
                  <span className="text-xs font-bold bg-[#2563EB] text-white px-2.5 py-0.5 rounded">
                    EN
                  </span>
                </div>

                {/* English Title & Subtitle */}
                <h1
                  className={`${
                    fontFamily === "serif" ? "font-serif" : "font-sans"
                  } text-2xl sm:text-3xl font-bold ${paperTitleColor} leading-snug mb-3`}
                >
                  How to be disgustingly educated
                </h1>
                <p className={`font-serif italic text-sm sm:text-base ${paperSubtitleColor} mb-6`}>
                  A chaotic guide to becoming the most interesting person in the room
                </p>

                {/* Artwork Banner Canvas */}
                <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-br from-[#1E4B43] via-[#2A665B] to-[#D9B76A] p-6 text-white flex flex-col justify-between overflow-hidden mb-8 shadow-inner border border-[#D9B76A]/40">
                  <div className="absolute inset-2 border border-[#D9B76A]/40 rounded-xl pointer-events-none" />
                  <div className="flex items-center justify-between text-xs font-semibold text-[#D9B76A] uppercase tracking-wider">
                    <span>Cultural Essay</span>
                    <span>Level B1-B2</span>
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-5xl block mb-2">📚✨</span>
                    <span className="font-serif text-lg font-bold text-[#FBF7EE]">
                      The Intellectual Journey
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-[#BFE3EA]">
                    Artwork Illustration • VieCultures Edition
                  </div>
                </div>

                {/* Paragraphs with Dotted Vocab Highlights */}
                <div
                  className={`space-y-4 leading-relaxed ${paperBodyTextColor} ${
                    fontFamily === "serif" ? "font-serif" : "font-sans"
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <p>
                    Hello my <em>love</em>,
                  </p>

                  <p>
                    There’s a kind of person who’s so{" "}
                    <button
                      onClick={() => openVocab("well-read")}
                      className={vocabBtnClass}
                      title="Nhấp để xem từ vựng"
                    >
                      well-read
                    </button>
                    , so{" "}
                    <button
                      onClick={() => openVocab("frighteningly-articulate")}
                      className={vocabBtnClass}
                      title="Nhấp để xem từ vựng"
                    >
                      frighteningly articulate
                    </button>
                    , so mentally juicy that you want to both date them and punch them in the throat.
                  </p>

                  <p>You know the type.</p>

                  <p>They quote Baldwin mid-conversation.</p>

                  <p>
                    They listen to podcasts at 1.5x speed while{" "}
                    <button
                      onClick={() => openVocab("annotating-a-book")}
                      className={vocabBtnClass}
                      title="Nhấp để xem từ vựng"
                    >
                      annotating a book
                    </button>
                    .
                  </p>

                  <p>
                    They drop phrases like{" "}
                    <button
                      onClick={() => openVocab("epistemic-frameworks")}
                      className={vocabBtnClass}
                      title="Nhấp để xem từ vựng"
                    >
                      “epistemic frameworks”
                    </button>{" "}
                    and somehow make it work.
                  </p>

                  <p>
                    This is your guide to becoming that person. Not for clout. Not for Instagram aesthetics. But for the{" "}
                    <button
                      onClick={() => openVocab("indecent-pleasure")}
                      className={vocabBtnClass}
                      title="Nhấp để xem từ vựng"
                    >
                      sheer, indecent pleasure
                    </button>{" "}
                    of being disgustingly educated.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT PAPER SHEET (TIẾNG VIỆT TRANSLATION) */}
            <div
              className={`p-8 sm:p-10 rounded-3xl flex flex-col justify-between transition-colors duration-300 ${paperSheetBgClass}`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-md">
                    BẢN DỊCH TIẾNG VIỆT
                  </span>
                  <span className="text-xs font-bold bg-[#059669] text-white px-2.5 py-0.5 rounded">
                    VI
                  </span>
                </div>

                {/* Vietnamese Title & Subtitle */}
                <h1
                  className={`${
                    fontFamily === "serif" ? "font-serif" : "font-sans"
                  } text-2xl sm:text-3xl font-bold ${paperTitleColor} italic leading-snug mb-3`}
                >
                  Làm thế nào để trở nên cực kỳ uyên bác
                </h1>
                <p className={`font-serif italic text-sm sm:text-base ${paperSubtitleColor} mb-6`}>
                  Hướng dẫn đầy ngẫu hứng để trở thành người thú vị nhất trong phòng
                </p>

                {/* Artwork Banner Canvas (Vietnamese Side) */}
                <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-br from-[#059669] via-[#047857] to-[#D9B76A] p-6 text-white flex flex-col justify-between overflow-hidden mb-8 shadow-inner border border-[#D9B76A]/40">
                  <div className="absolute inset-2 border border-[#D9B76A]/40 rounded-xl pointer-events-none" />
                  <div className="flex items-center justify-between text-xs font-semibold text-[#D9B76A] uppercase tracking-wider">
                    <span>Tản Văn Văn Hóa</span>
                    <span>Trình Độ B1-B2</span>
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-5xl block mb-2">🌿📖</span>
                    <span className="font-serif text-lg font-bold text-[#FBF7EE]">
                      Hành Trình Uyên Bác
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-[#BFE3EA]">
                    Bản Dịch Tiếng Việt Chuẩn Ngữ Cảnh
                  </div>
                </div>

                {/* Vietnamese Translated Paragraphs */}
                <div
                  className={`space-y-4 leading-relaxed ${paperBodyTextColor} ${
                    fontFamily === "serif" ? "font-serif" : "font-sans"
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <p>
                    Chào <em>tình yêu</em> của em,
                  </p>

                  <p>
                    Có một kiểu người đọc nhiều đến thế, ăn nói sắc sảo đến đáng sợ, và có một bộ óc đầy chất xám đến vậy, khiến anh vừa muốn hẹn hò lại vừa muốn đấm vào họng họ.
                  </p>

                  <p>Anh biết kiểu người đó mà.</p>

                  <p>Họ trích dẫn Baldwin giữa cuộc trò chuyện.</p>

                  <p>
                    Họ nghe podcast ở tốc độ 1.5x trong khi đang ghi chú một cuốn sách.
                  </p>

                  <p>
                    Họ buông những cụm từ như <em>“khung nhận thức luận”</em> và bằng cách nào đó vẫn khiến nó nghe thật hợp lý.
                  </p>

                  <p>
                    Đây là hướng dẫn để anh trở thành người đó. Không phải để gây chú ý. Không phải để sống ảo trên Instagram. Mà vì niềm vui thuần túy, trần trụi khi được <em>uyên bác đến đáng ghét</em>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Single Unified Card Container: Quiz & Next Steps */}
          <div className={`rounded-3xl p-8 sm:p-12 transition-colors duration-300 grid grid-cols-1 lg:grid-cols-12 gap-10 ${bottomCardBgClass}`}>
            {/* Left 8 Cols: Quiz Section */}
            <div className="lg:col-span-7 pr-0 lg:pr-8 lg:border-r border-[rgba(217,183,106,0.2)]">
              <div className="mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                  Reading Check & Comprehension
                </span>
                <h2 className={`font-serif text-2xl font-bold mt-1 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                  Câu Hỏi Kiểm Tra Thấu Hiểu Bài Đọc
                </h2>
              </div>

              {/* Quiz Q1 */}
              <div className="mb-8">
                <h3 className={`text-sm sm:text-base font-bold mb-3 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                  1. According to the article, what is the core secret to becoming "disgustingly educated"?
                </h3>

                <div className="space-y-2.5">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      q1Answer === "A"
                        ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                        : themeMode === "dark"
                        ? "bg-[#18211E] border-[#D9B76A]/20 text-[#E8DFCB] hover:bg-[#1E2925]"
                        : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.12)] hover:bg-[#F6EEDC]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q1"
                      value="A"
                      checked={q1Answer === "A"}
                      onChange={() => setQ1Answer("A")}
                      className="mt-1 accent-[#D9B76A]"
                    />
                    <span className="text-xs sm:text-sm">
                      A. Memorizing 50 new vocabulary words every single morning for social media clout.
                    </span>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      q1Answer === "B"
                        ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                        : themeMode === "dark"
                        ? "bg-[#18211E] border-[#D9B76A]/20 text-[#E8DFCB] hover:bg-[#1E2925]"
                        : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.12)] hover:bg-[#F6EEDC]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q1"
                      value="B"
                      checked={q1Answer === "B"}
                      onChange={() => setQ1Answer("B")}
                      className="mt-1 accent-[#D9B76A]"
                    />
                    <span className="text-xs sm:text-sm">
                      B. Cultivating a deep, genuine curiosity and annotations for the sheer pleasure of learning.
                    </span>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      q1Answer === "C"
                        ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                        : themeMode === "dark"
                        ? "bg-[#18211E] border-[#D9B76A]/20 text-[#E8DFCB] hover:bg-[#1E2925]"
                        : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.12)] hover:bg-[#F6EEDC]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q1"
                      value="C"
                      checked={q1Answer === "C"}
                      onChange={() => setQ1Answer("C")}
                      className="mt-1 accent-[#D9B76A]"
                    />
                    <span className="text-xs sm:text-sm">
                      C. Listening to podcasts at 3.0x speed without taking any notes or reflection.
                    </span>
                  </label>
                </div>
              </div>

              {/* Quiz Q2 */}
              <div className="mb-8">
                <h3 className={`text-sm sm:text-base font-bold mb-3 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                  2. What does the highlighted term <span className="underline decoration-[#D9B76A] font-serif font-semibold">"frighteningly articulate"</span> mean in context?
                </h3>

                <div className="space-y-2.5">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      q2Answer === "A"
                        ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                        : themeMode === "dark"
                        ? "bg-[#18211E] border-[#D9B76A]/20 text-[#E8DFCB] hover:bg-[#1E2925]"
                        : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.12)] hover:bg-[#F6EEDC]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q2"
                      value="A"
                      checked={q2Answer === "A"}
                      onChange={() => setQ2Answer("A")}
                      className="mt-1 accent-[#D9B76A]"
                    />
                    <span className="text-xs sm:text-sm">
                      A. Có khả năng diễn đạt ý tưởng vô cùng sắc sảo, lưu loát và thuyết phục.
                    </span>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      q2Answer === "B"
                        ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                        : themeMode === "dark"
                        ? "bg-[#18211E] border-[#D9B76A]/20 text-[#E8DFCB] hover:bg-[#1E2925]"
                        : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.12)] hover:bg-[#F6EEDC]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q2"
                      value="B"
                      checked={q2Answer === "B"}
                      onChange={() => setQ2Answer("B")}
                      className="mt-1 accent-[#D9B76A]"
                    />
                    <span className="text-xs sm:text-sm">
                      B. Nói chuyện quá nhanh khiến người nghe bị sợ hãi và ngợp.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Quiz Action */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="px-6 py-3 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] shadow-sm transition-all border border-[#D9B76A]"
                >
                  Kiểm Tra Đáp Án
                </button>
                {quizSubmitted && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-bold border border-[#059669]/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Chính xác! Bạn đạt 2/2 câu hỏi thấu hiểu.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Cols: Practice Next Steps */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                    Next Learning Steps
                  </span>
                  <h3 className={`font-serif text-xl font-bold mt-1 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                    Chế Độ Ôn Luyện
                  </h3>
                  <p className="text-xs opacity-80 mt-1 leading-relaxed">
                    Lựa chọn phương thức thực hành tiếp theo để ghi nhớ từ vựng và cấu trúc ngữ pháp vừa học.
                  </p>
                </div>

                <div className="space-y-3 mt-6">
                  <Link
                    href="/discovery#flashcards"
                    className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#1E4B43] text-[#FBF7EE] text-xs font-bold shadow-sm hover:bg-[#163D37] border border-[#D9B76A]/50 transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#D9B76A]" />
                      Ôn Tập Flashcards (5 từ bài đọc)
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#D9B76A] group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    onClick={() => alert("Đã khởi động chế độ Dictation (Luyện chép chính tả)!")}
                    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all ${
                      themeMode === "dark"
                        ? "bg-[#18211E] text-[#FBF7EE] border-[#D9B76A]/20 hover:bg-[#232F2B]"
                        : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-[#D9B76A]" />
                      Luyện Chép Chính Tả (Dictation)
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </button>

                  <button
                    onClick={() => alert("Đã chuyển sang giao diện Viết bài cảm nghĩ (Reflection)!")}
                    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all ${
                      themeMode === "dark"
                        ? "bg-[#18211E] text-[#FBF7EE] border-[#D9B76A]/20 hover:bg-[#232F2B]"
                        : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-[#D9B76A]" />
                      Viết Bài Cảm Nghĩ (Reflection)
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Articles Section */}
          <div className="pt-8 border-t border-[rgba(217,183,106,0.2)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                  Continue Reading
                </span>
                <h3 className={`font-serif text-xl font-bold mt-0.5 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                  Bài Đọc Đề Xuất Tiếp Theo
                </h3>
              </div>
              <Link
                href="/discovery"
                className={`text-xs font-bold inline-flex items-center gap-1 transition-colors ${
                  themeMode === "dark" ? "text-[#D9B76A] hover:text-white" : "text-[#1E4B43] hover:text-[#D9B76A]"
                }`}
              >
                <span>Xem tất cả bài đọc</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <Link
                href="/reader"
                className={`group p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  themeMode === "dark"
                    ? "bg-[#1E2925] border-[#D9B76A]/30 text-[#FBF7EE] shadow-md hover:border-[#D9B76A]"
                    : "bg-[#FBF7EE] border-[rgba(30,75,67,0.12)] text-[#3F5550] shadow-sm hover:shadow-md"
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4B43] bg-[#F6EEDC] px-2.5 py-1 rounded">
                    Cuisine • B1
                  </span>
                  <h4 className={`font-serif text-base font-bold mt-3 group-hover:text-[#D9B76A] transition-colors ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                    The Story of Saigon Bánh Mì
                  </h4>
                  <p className="text-xs opacity-80 mt-1.5 line-clamp-2 leading-relaxed">
                    From French baguette to global culinary icon: the history behind Vietnam's favorite street food.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(217,183,106,0.2)] flex items-center justify-between text-xs font-semibold opacity-80">
                  <span>5 min read • 8 Vocab</span>
                  <span className="text-[#D9B76A] group-hover:translate-x-1 transition-transform inline-block font-bold">
                    Đọc ngay →
                  </span>
                </div>
              </Link>

              {/* Card 2 */}
              <Link
                href="/reader"
                className={`group p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  themeMode === "dark"
                    ? "bg-[#1E2925] border-[#D9B76A]/30 text-[#FBF7EE] shadow-md hover:border-[#D9B76A]"
                    : "bg-[#FBF7EE] border-[rgba(30,75,67,0.12)] text-[#3F5550] shadow-sm hover:shadow-md"
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4B43] bg-[#F6EEDC] px-2.5 py-1 rounded">
                    Heritage • B1
                  </span>
                  <h4 className={`font-serif text-base font-bold mt-3 group-hover:text-[#D9B76A] transition-colors ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                    Hội An Lantern Festival Traditions
                  </h4>
                  <p className="text-xs opacity-80 mt-1.5 line-clamp-2 leading-relaxed">
                    Understanding full moon rituals, silk craftsmanship, and ancient wooden architecture along the Thu Bồn river.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(217,183,106,0.2)] flex items-center justify-between text-xs font-semibold opacity-80">
                  <span>7 min read • 10 Vocab</span>
                  <span className="text-[#D9B76A] group-hover:translate-x-1 transition-transform inline-block font-bold">
                    Đọc ngay →
                  </span>
                </div>
              </Link>

              {/* Card 3 */}
              <Link
                href="/reader"
                className={`group p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  themeMode === "dark"
                    ? "bg-[#1E2925] border-[#D9B76A]/30 text-[#FBF7EE] shadow-md hover:border-[#D9B76A]"
                    : "bg-[#FBF7EE] border-[rgba(30,75,67,0.12)] text-[#3F5550] shadow-sm hover:shadow-md"
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4B43] bg-[#F6EEDC] px-2.5 py-1 rounded">
                    Crafts • B2
                  </span>
                  <h4 className={`font-serif text-base font-bold mt-3 group-hover:text-[#D9B76A] transition-colors ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
                    Bát Tràng Pottery & Ceramic Arts
                  </h4>
                  <p className="text-xs opacity-80 mt-1.5 line-clamp-2 leading-relaxed">
                    700 years of ceramic heritage in a traditional craft village on the Red River delta.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(217,183,106,0.2)] flex items-center justify-between text-xs font-semibold opacity-80">
                  <span>6 min read • 9 Vocab</span>
                  <span className="text-[#D9B76A] group-hover:translate-x-1 transition-transform inline-block font-bold">
                    Đọc ngay →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vocabulary Slide-Over Drawer Modal */}
      {isVocabDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsVocabDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body Panel */}
          <div className="relative w-full max-w-md bg-[#FBF7EE] h-full shadow-2xl border-l border-[#D9B76A]/40 p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(30,75,67,0.12)] mb-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1E4B43]">
                    Từ Vựng Bài Đọc
                  </h3>
                  <span className="text-xs text-[#6E7E79]">
                    "How to be disgustingly educated"
                  </span>
                </div>
                <button
                  onClick={() => setIsVocabDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F6EEDC] text-[#1E4B43] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Inspected Vocab Card */}
              {selectedVocab && (
                <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#D9B76A]/40 mb-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-serif text-xl font-bold text-[#1E4B43]">
                      {selectedVocab.word}
                    </h4>
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-[#1E4B43]/10 text-[#1E4B43]">
                      {selectedVocab.pos}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#6E7E79] italic mb-3">
                    {selectedVocab.ipa}
                  </p>
                  <p className="text-sm font-bold text-[#1E4B43] mb-3 leading-snug">
                    {selectedVocab.viMeaning}
                  </p>
                  <div className="p-3 rounded-xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.08)] text-xs text-[#3F5550] italic">
                    "{selectedVocab.contextSentence}"
                  </div>

                  <div className="mt-4 pt-3 border-t border-[rgba(30,75,67,0.10)] flex items-center justify-between">
                    <button
                      onClick={() => toggleBookmarkWord(selectedVocab.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4B43] hover:text-[#D9B76A]"
                    >
                      {bookmarkedWords[selectedVocab.id] ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 fill-[#1E4B43]" />
                          <span>Đã lưu vào bộ sưu tập</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>Lưu từ vựng này</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* List of All Vocabulary in Article */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E7E79] mb-2">
                  Tất cả từ vựng trong bài ({Object.keys(VOCAB_DATABASE).length})
                </h4>
                {Object.values(VOCAB_DATABASE).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedVocab(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedVocab?.id === item.id
                        ? "bg-[#1E4B43] text-[#FBF7EE] border-[#D9B76A]"
                        : "bg-[#FBF7EE] text-[#3F5550] border-[rgba(30,75,67,0.10)] hover:bg-[#F6EEDC]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm">{item.word}</span>
                      <span className="text-[10px] opacity-80 uppercase font-mono">
                        {item.pos}
                      </span>
                    </div>
                    <p className="text-xs mt-1 line-clamp-1 opacity-90">{item.viMeaning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-[rgba(30,75,67,0.12)] space-y-2 mt-6">
              <Link
                href="/discovery#flashcards"
                className="w-full py-3 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] flex items-center justify-center gap-2 shadow-sm border border-[#D9B76A]/50 transition-all"
              >
                <span>Ôn Tập Flashcards từ vựng</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D9B76A]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
