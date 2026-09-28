import React from "react";
import Link from "@/components/Link";
import { CheckCircle2, ArrowRight, Layers, Headphones, PenTool, ChevronRight } from "lucide-react";
import { READER_QUIZ_QUESTIONS } from "@/data/readerData";

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
              Tết: Renewal, Remembrance and Regional Flavours
            </h1>
            <p className={`font-serif italic text-sm sm:text-base ${paperSubtitleColor} mb-6`}>
              A cultural exploration of renewal, ancestral gratitude, and rich regional culinary traditions
            </p>

            {/* Artwork Banner Canvas */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-br from-[#1E4B43] via-[#2A665B] to-[#D9B76A] p-6 text-white flex flex-col justify-between overflow-hidden mb-8 shadow-inner border border-[#D9B76A]/40">
              <div className="absolute inset-2 border border-[#D9B76A]/40 rounded-xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs font-semibold text-[#D9B76A] uppercase tracking-wider">
                <span>Cultural Essay</span>
                <span>Level B2–C1 (~370 words)</span>
              </div>
              <div className="text-center my-auto">
                <span className="text-5xl block mb-2">🌸🧧✨</span>
                <span className="font-serif text-lg font-bold text-[#FBF7EE]">
                  Tết Nguyên Đán Heritage
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
                Tết Nguyên Đán, often called simply Tết, is described as the most important and{" "}
                <button
                  onClick={() => openVocab("sacred")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  sacred
                </button>{" "}
                holiday in Vietnamese culture. It marks the{" "}
                <button
                  onClick={() => openVocab("passage")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  passage from the old year to the new one
                </button>
                , but its meaning goes further. According to the article, Tết stands for{" "}
                <button
                  onClick={() => openVocab("family-reunion")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  family reunion
                </button>
                , respect for ancestors, and hope for a better future.
              </p>

              <p>
                The article traces Tết back to the ancient{" "}
                <button
                  onClick={() => openVocab("agricultural-civilization")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  agricultural civilization
                </button>{" "}
                of East Asia, where the cycle of the seasons played a central role in daily life. Tết takes place when winter{" "}
                <button
                  onClick={() => openVocab("give-way-to")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  gives way to
                </button>{" "}
                spring and plants begin to grow again, which{" "}
                <button
                  onClick={() => openVocab("symbolize")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  symbolizes
                </button>{" "}
                a new beginning. A{" "}
                <button
                  onClick={() => openVocab("folk-legend")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  folk legend
                </button>{" "}
                also says that the festival is a time for descendants to remember their ancestors and pray for a good harvest. Over time, Tết{" "}
                <button
                  onClick={() => openVocab("absorb-influences")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  absorbed influences
                </button>{" "}
                from Chinese culture during the period of Chinese rule, yet it kept its own identity.
              </p>

              <p>
                Traditional customs follow three stages. Before Tết, people clean their houses, prepare a{" "}
                <button
                  onClick={() => openVocab("five-fruit-tray")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  five-fruit tray
                </button>
                , and wrap bánh chưng or bánh tét together. During the holiday, families hold{" "}
                <button
                  onClick={() => openVocab("ancestor-worship")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  ancestor worship
                </button>{" "}
                ceremonies, exchange New Year wishes, give{" "}
                <button
                  onClick={() => openVocab("li-xi")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  lì xì
                </button>{" "}
                to children, and visit pagodas. Afterwards, people take part in spring festivals to wish for good luck. Although the way Vietnamese people celebrate has changed, the article argues that the{" "}
                <button
                  onClick={() => openVocab("core-values")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  core values
                </button>{" "}
                of togetherness, gratitude, and hope remain the soul of the holiday.
              </p>

              <p>
                Food carries cultural and spiritual meaning as well. Bánh chưng and bánh tét, which the article calls symbols of earth and sky, express gratitude to ancestors. Bánh chưng is usually made in the North, whereas bánh tét is more common in the Centre and the South.{" "}
                <button
                  onClick={() => openVocab("dua-hanh")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  Dưa hành
                </button>{" "}
                balances rich, protein-heavy dishes, and thịt kho tàu with duck eggs represents fullness and{" "}
                <button
                  onClick={() => openVocab("prosperity")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  prosperity
                </button>
                . Mứt Tết, made from coconut, ginger, or kumquat, stands for sweetness and a good start.
              </p>

              <p>
                Finally, the{" "}
                <button
                  onClick={() => openVocab("atmosphere")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  atmosphere
                </button>{" "}
                of Tết{" "}
                <button
                  onClick={() => openVocab("differ-from-region-to-region")}
                  className={vocabBtnClass}
                  title="Nhấp để xem từ vựng"
                >
                  differs from region to region
                </button>
                . In the North, it is linked to peach blossoms, bánh chưng, and solemn customs, with a busy Tết market and a nostalgic mood. The Central region celebrates in a simpler but equally warm way, with yellow mai flowers, red couplets, and dishes such as nem chua and tré. In the South, Tết feels lively and open, with mai flowers, red watermelons, flower markets, and folk games.
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
              Tết: Sự đổi mới, lòng tưởng nhớ và hương vị các vùng miền
            </h1>
            <p className={`font-serif italic text-sm sm:text-base ${paperSubtitleColor} mb-6`}>
              Khám phá văn hóa về sự đổi mới, lòng tri ân tổ tiên và phong vị ẩm thực ba miền
            </p>

            {/* Artwork Banner Canvas (Vietnamese Side) */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-br from-[#059669] via-[#047857] to-[#D9B76A] p-6 text-white flex flex-col justify-between overflow-hidden mb-8 shadow-inner border border-[#D9B76A]/40">
              <div className="absolute inset-2 border border-[#D9B76A]/40 rounded-xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs font-semibold text-[#D9B76A] uppercase tracking-wider">
                <span>Tản Văn Văn Hóa</span>
                <span>Trình Độ B2–C1</span>
              </div>
              <div className="text-center my-auto">
                <span className="text-5xl block mb-2">🌿🎍🎋</span>
                <span className="font-serif text-lg font-bold text-[#FBF7EE]">
                  Phong Vị Tết Cổ Truyền
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
                Tết Nguyên Đán, thường được gọi đơn giản là Tết, được mô tả là ngày lễ quan trọng và thiêng liêng nhất trong văn hóa Việt Nam. Tết đánh dấu sự chuyển giao từ năm cũ sang năm mới, nhưng ý nghĩa của nó còn sâu xa hơn thế. Theo bài viết, Tết tượng trưng cho sự đoàn viên gia đình, lòng kính trọng tổ tiên và hy vọng về một tương lai tốt đẹp hơn.
              </p>

              <p>
                Bài viết truy nguồn gốc của Tết về nền văn minh nông nghiệp lâu đời của người Á Đông, nơi vòng quay của các mùa đóng vai trò trung tâm trong đời sống hằng ngày. Tết diễn ra khi mùa đông nhường chỗ cho mùa xuân và cây cối bắt đầu sinh trưởng trở lại, điều này tượng trưng cho một khởi đầu mới. Một truyền thuyết dân gian cũng kể rằng Tết là dịp để con cháu tưởng nhớ tổ tiên và cầu mong mùa màng bội thu. Theo thời gian, Tết tiếp nhận những ảnh hưởng từ văn hóa Trung Hoa trong thời kỳ Bắc thuộc, nhưng vẫn giữ được bản sắc riêng.
              </p>

              <p>
                Các phong tục truyền thống diễn ra theo ba giai đoạn. Trước Tết, mọi người dọn dẹp nhà cửa, bày mâm ngũ quả và cùng nhau gói bánh chưng hoặc bánh tét. Trong Tết, các gia đình cúng gia tiên, chúc Tết, lì xì cho trẻ em và đi chùa. Sau Tết, mọi người tham gia các lễ hội xuân để cầu may mắn. Dù cách người Việt đón Tết đã thay đổi, bài viết cho rằng những giá trị cốt lõi như sự sum họp, lòng biết ơn và hy vọng vẫn là linh hồn của ngày lễ.
              </p>

              <p>
                Ẩm thực cũng mang ý nghĩa văn hóa và tâm linh. Bánh chưng và bánh tét, mà bài viết gọi là biểu tượng của đất và trời, thể hiện lòng biết ơn tổ tiên. Bánh chưng thường được làm ở miền Bắc, trong khi bánh tét phổ biến hơn ở miền Trung và miền Nam. Dưa hành giúp cân bằng các món nhiều đạm, còn thịt kho tàu với trứng vịt thể hiện sự tròn đầy và sung túc. Mứt Tết, làm từ dừa, gừng hoặc quất, biểu trưng cho sự ngọt ngào và một khởi đầu tốt đẹp.
              </p>

              <p>
                Cuối cùng, không khí Tết khác nhau giữa các vùng miền. Ở miền Bắc, Tết gắn với hoa đào, bánh chưng và những phong tục trang trọng, với phiên chợ Tết nhộn nhịp và không khí hoài niệm. Miền Trung đón Tết giản dị hơn nhưng không kém phần ấm cúng, với hoa mai vàng, câu đối đỏ và các món như nem chua, tré. Ở miền Nam, Tết sôi động và phóng khoáng, với hoa mai, dưa hấu đỏ, chợ hoa và các trò chơi dân gian.
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
              {READER_QUIZ_QUESTIONS[0]?.question}
            </h3>

            <div className="space-y-2.5">
              {READER_QUIZ_QUESTIONS[0]?.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${q1Answer === opt.value
                      ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                      : themeMode === "dark"
                        ? "bg-[#18211E] border-[#D9B76A]/20 text-[#E8DFCB] hover:bg-[#1E2925]"
                        : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.12)] hover:bg-[#F6EEDC]"
                    }`}
                >
                  <input
                    type="radio"
                    name="q1"
                    value={opt.value}
                    checked={q1Answer === opt.value}
                    onChange={() => setQ1Answer(opt.value)}
                    className="mt-1 accent-[#D9B76A]"
                  />
                  <span className="text-xs sm:text-sm">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Quiz Q2 */}
          <div className="mb-8">
            <h3 className={`text-sm sm:text-base font-bold mb-3 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
              {READER_QUIZ_QUESTIONS[1]?.question}
            </h3>

            <div className="space-y-2.5">
              {READER_QUIZ_QUESTIONS[1]?.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${q2Answer === opt.value
                      ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                      : themeMode === "dark"
                        ? "bg-[#18211E] border-[#D9B76A]/20 text-[#E8DFCB] hover:bg-[#1E2925]"
                        : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.12)] hover:bg-[#F6EEDC]"
                    }`}
                >
                  <input
                    type="radio"
                    name="q2"
                    value={opt.value}
                    checked={q2Answer === opt.value}
                    onChange={() => setQ2Answer(opt.value)}
                    className="mt-1 accent-[#D9B76A]"
                  />
                  <span className="text-xs sm:text-sm">
                    {opt.label}
                  </span>
                </label>
              ))}
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
                <span>
                  {q1Answer === READER_QUIZ_QUESTIONS[0]?.correctValue && q2Answer === READER_QUIZ_QUESTIONS[1]?.correctValue
                    ? "Chính xác! Bạn đạt 2/2 câu hỏi thấu hiểu."
                    : "Bạn đã hoàn thành bài kiểm tra thấu hiểu."}
                </span>
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
                  Ôn Tập Flashcards (16 từ bài đọc)
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
