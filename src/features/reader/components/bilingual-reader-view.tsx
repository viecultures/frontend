import React from "react";
import Link from "@/components/Link";
import { CheckCircle2, ArrowRight, Layers, Headphones, PenTool, ChevronRight } from "lucide-react";

interface BilingualReaderViewProps {
  themeMode: "olive" | "paper" | "dark";
  fontFamily: "serif" | "sans";
  fontSize: number;
  paperSheetBgClass: string;
  paperTitleColor: string;
  paperSubtitleColor: string;
  paperBodyTextColor: string;
  vocabBtnClass: string;
  bottomCardBgClass: string;
  openVocab: (key: string) => void;
  q1Answer: string;
  setQ1Answer: (val: string) => void;
  q2Answer: string;
  setQ2Answer: (val: string) => void;
  quizSubmitted: boolean;
  setQuizSubmitted: (val: boolean) => void;
}

export const BilingualReaderView: React.FC<BilingualReaderViewProps> = ({
  themeMode,
  fontFamily,
  fontSize,
  paperSheetBgClass,
  paperTitleColor,
  paperSubtitleColor,
  paperBodyTextColor,
  vocabBtnClass,
  bottomCardBgClass,
  openVocab,
  q1Answer,
  setQ1Answer,
  q2Answer,
  setQ2Answer,
  quizSubmitted,
  setQuizSubmitted,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* BILINGUAL MODE: Dual Paper Sheets (English Original + Vietnamese Translation) */}
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
              className={`${fontFamily === "serif" ? "font-serif" : "font-sans"
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
              className={`space-y-4 leading-relaxed ${paperBodyTextColor} ${fontFamily === "serif" ? "font-serif" : "font-sans"
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
              className={`${fontFamily === "serif" ? "font-serif" : "font-sans"
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
              className={`space-y-4 leading-relaxed ${paperBodyTextColor} ${fontFamily === "serif" ? "font-serif" : "font-sans"
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

      {/* Unified Bottom Card: Reading Check Quiz + Vertical Next Learning Steps */}
      <div className={`rounded-3xl p-8 sm:p-12 transition-colors duration-300 grid grid-cols-1 lg:grid-cols-12 gap-10 ${bottomCardBgClass}`}>
        {/* Left 7 Cols: Quiz Section */}
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
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${q1Answer === "A"
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
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${q1Answer === "B"
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
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${q1Answer === "C"
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
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${q2Answer === "A"
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
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${q2Answer === "B"
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
                href="/flashcard-study"
                className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#1E4B43] text-[#FBF7EE] text-xs font-bold shadow-sm hover:bg-[#163D37] border border-[#D9B76A]/50 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D9B76A]" />
                  Ôn Tập Flashcards (5 từ bài đọc)
                </span>
                <ArrowRight className="w-4 h-4 text-[#D9B76A] group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => alert("Tính năng Dictation (Luyện chép chính tả) đang được phát triển, sẽ sớm ra mắt!")}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all ${themeMode === "dark"
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

              <Link
                href="/community"
                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all group ${themeMode === "dark"
                    ? "bg-[#18211E] text-[#FBF7EE] border-[#D9B76A]/20 hover:bg-[#232F2B]"
                    : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#D9B76A]" />
                  Viết Bài Cảm Nghĩ (Reflection)
                </span>
                <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
