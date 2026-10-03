import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "@/components/Link";
import { CheckCircle2, ArrowRight, Layers, Headphones, PenTool, ChevronRight, RefreshCw, Sparkles } from "lucide-react";
import { READER_QUIZ_QUESTIONS, VOCAB_DATABASE, lookupWord, extractSentenceContext, type VocabItem } from "@/data/readerData";
import { InPlaceDictionaryPopup } from "./InPlaceDictionaryPopup";

interface BilingualReaderViewProps {
  themeMode: "paper" | "dark";
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
  fontSize,
  paperSheetBgClass,
  paperTitleColor,
  paperSubtitleColor,
  paperBodyTextColor,
  vocabBtnClass,
  bottomCardBgClass,
  q1Answer,
  setQ1Answer,
  q2Answer,
  setQ2Answer,
  quizSubmitted,
  setQuizSubmitted,
}) => {
  // ── Proportional Scroll Sync Refs & State ─────────────────────────────────
  const leftSheetRef = useRef<HTMLDivElement>(null);
  const rightSheetRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef<boolean>(false);
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState<boolean>(true);

  // ── In-Place Dictionary Popup State ───────────────────────────────────────
  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    vocab: VocabItem | null;
    position: { x: number; y: number } | null;
  }>({
    isOpen: false,
    vocab: null,
    position: null,
  });

  // Handle Proportional Scroll Sync
  const handleScroll = useCallback((source: "left" | "right") => {
    if (!isScrollSyncEnabled || isSyncingRef.current) return;

    const sourceEl = source === "left" ? leftSheetRef.current : rightSheetRef.current;
    const targetEl = source === "left" ? rightSheetRef.current : leftSheetRef.current;

    if (!sourceEl || !targetEl) return;

    const sourceMaxScroll = sourceEl.scrollHeight - sourceEl.clientHeight;
    const targetMaxScroll = targetEl.scrollHeight - targetEl.clientHeight;

    if (sourceMaxScroll <= 0 || targetMaxScroll <= 0) return;

    const scrollRatio = sourceEl.scrollTop / sourceMaxScroll;

    isSyncingRef.current = true;
    targetEl.scrollTop = scrollRatio * targetMaxScroll;

    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  }, [isScrollSyncEnabled]);

  // Handle click on predetermined vocab word
  const handleVocabClick = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    
    // Find enclosing paragraph text to get the full accurate sentence
    const blockEl = el.closest('p');
    const fullParagraph = blockEl ? (blockEl.innerText || blockEl.textContent || "") : "";
    const vocabData = VOCAB_DATABASE[key] || lookupWord(key);
    const fullSentence = fullParagraph ? extractSentenceContext(fullParagraph, vocabData.word) : vocabData.contextSentence;

    setPopupState({
      isOpen: true,
      vocab: {
        ...vocabData,
        contextSentence: fullSentence || vocabData.contextSentence,
      },
      position: {
        x: rect.left + rect.width / 2,
        y: rect.bottom,
      },
    });
  };

  // Handle selection / highlighting of any word or phrase (Tra từ tại chỗ)
  const handleTextSelection = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (!selectedText || selectedText.length < 2) return;

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Find enclosing paragraph (<p>) element to extract full paragraph text
      let blockEl: HTMLElement | null = null;
      let node: Node | null = range.startContainer;
      while (node && node !== document.body) {
        if (node instanceof HTMLElement && (node.tagName === 'P' || node.tagName === 'DIV')) {
          blockEl = node;
          break;
        }
        node = node.parentNode;
      }

      const fullParagraph = blockEl ? (blockEl.innerText || blockEl.textContent || "") : (range.commonAncestorContainer.textContent || "");
      const fullSentence = extractSentenceContext(fullParagraph, selectedText);
      const vocab = lookupWord(selectedText, fullSentence);

      setPopupState({
        isOpen: true,
        vocab: {
          ...vocab,
          contextSentence: fullSentence,
        },
        position: {
          x: rect.left + rect.width / 2,
          y: rect.bottom,
        },
      });
    } catch (err) {
      // Fallback positioning with mouse coordinates
      const vocab = lookupWord(selectedText);
      setPopupState({
        isOpen: true,
        vocab,
        position: {
          x: e.clientX,
          y: e.clientY + 10,
        },
      });
    }
  };

  // Recalculate sync when font size reflows
  useEffect(() => {
    if (leftSheetRef.current && rightSheetRef.current && isScrollSyncEnabled) {
      handleScroll("left");
    }
  }, [fontSize, isScrollSyncEnabled, handleScroll]);

  const isDark = themeMode === "dark";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ── Scroll Sync Toolbar Indicator ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-2 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScrollSyncEnabled(!isScrollSyncEnabled)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isScrollSyncEnabled
                ? isDark
                  ? "bg-[#D9B76A]/20 border-[#D9B76A] text-[#D9B76A] font-bold shadow-xs"
                  : "bg-[#1E4B43]/10 border-[#1E4B43]/30 text-[#1E4B43] font-bold shadow-xs"
                : isDark
                ? "bg-white/5 border-transparent text-[#BFE3EA]/60 hover:text-[#FBF7EE]"
                : "bg-black/5 border-transparent text-[#1E4B43]/60 hover:text-[#1E4B43]"
            }`}
            title="Bật/Tắt tính năng đồng bộ cuộn theo tỉ lệ giữa văn bản gốc và bản dịch"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScrollSyncEnabled ? "text-[#D9B76A]" : ""}`} />
            <span>Đồng bộ cuộn theo tỉ lệ: {isScrollSyncEnabled ? "Đang bật" : "Tắt"}</span>
          </button>
        </div>

        <span className={`text-[11px] font-medium hidden sm:flex items-center gap-1.5 ${
          isDark ? "text-[#BFE3EA]" : "text-[#1E4B43]/80"
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
          <span>Click hoặc bôi đen cụm từ bất kỳ để tra từ & lưu ngữ cảnh tại chỗ</span>
        </span>
      </div>

      {/* ── BILINGUAL MODE: Dual Paper Sheets (Side-by-Side Instant Comparison) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ── LEFT PAPER SHEET (ENGLISH ORIGINAL) ─────────────────────────── */}
        <div
          ref={leftSheetRef}
          onScroll={() => handleScroll("left")}
          onMouseUp={handleTextSelection}
          className={`p-6 sm:p-10 rounded-3xl flex flex-col justify-between transition-colors duration-300 overflow-y-auto max-h-[750px] scroll-smooth ${paperSheetBgClass}`}
        >
          <div>
            {/* Header Tag */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] dark:bg-[#2563EB]/20 dark:text-[#93C5FD] px-3 py-1 rounded-md">
                ENGLISH ORIGINAL
              </span>
              <span className="text-xs font-bold bg-[#2563EB] text-white px-2.5 py-0.5 rounded">
                EN
              </span>
            </div>

            {/* English Title & Subtitle */}
            <h1
              className={`font-sans text-2xl sm:text-3xl font-bold ${paperTitleColor} leading-snug mb-3`}
            >
              Tết: Renewal, Remembrance and Regional Flavours
            </h1>
            <p className={`font-sans italic text-sm sm:text-base ${paperSubtitleColor} mb-6`}>
              A cultural exploration of renewal, ancestral gratitude, and rich regional culinary traditions
            </p>

            {/* Traditional Vietnamese Tết Artwork Banner */}
            <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden mb-8 shadow-md border border-[#D9B76A]/40 group">
              <img
                src="https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80"
                alt="Tết Nguyên Đán Traditional Holiday"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
              <div className="absolute inset-2 border border-[#D9B76A]/30 rounded-xl pointer-events-none" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-[#D9B76A] uppercase tracking-wider">
                <span className="bg-[#1E4B43]/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#D9B76A]/40 text-[#FBF7EE]">
                  Cultural Essay
                </span>
                <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[#D9B76A]">
                  Level 2–3 (~370 words)
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <span className="text-xs text-[#D9B76A] font-semibold uppercase tracking-wider block mb-0.5">
                    Vietnamese Lunar New Year
                  </span>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-[#FBF7EE] drop-shadow-md">
                    Tết Nguyên Đán Heritage
                  </h3>
                </div>
                <div className="text-[11px] text-[#BFE3EA] font-sans opacity-90 text-left sm:text-right">
                  Truyền Thống & Phong Vị Ba Miền
                </div>
              </div>
            </div>

            {/* Paragraphs with Dotted Vocab Highlights */}
            <div
              className={`space-y-5 leading-relaxed ${paperBodyTextColor} font-sans`}
              style={{ fontSize: `${fontSize}px` }}
            >
              <p>
                Tết Nguyên Đán, often called simply Tết, is described as the most important and{" "}
                <button
                  onClick={(e) => handleVocabClick("sacred", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'sacred' tại chỗ"
                >
                  sacred
                </button>{" "}
                holiday in Vietnamese culture. It marks the{" "}
                <button
                  onClick={(e) => handleVocabClick("passage", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'passage from one year to the next' tại chỗ"
                >
                  passage from the old year to the new one
                </button>
                , but its meaning goes further. According to the article, Tết stands for{" "}
                <button
                  onClick={(e) => handleVocabClick("family-reunion", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'family reunion' tại chỗ"
                >
                  family reunion
                </button>
                , respect for ancestors, and hope for a better future.
              </p>

              <p>
                The article traces Tết back to the ancient{" "}
                <button
                  onClick={(e) => handleVocabClick("agricultural-civilization", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'agricultural civilization' tại chỗ"
                >
                  agricultural civilization
                </button>{" "}
                of East Asia, where the cycle of the seasons played a central role in daily life. Tết takes place when winter{" "}
                <button
                  onClick={(e) => handleVocabClick("give-way-to", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'give way to' tại chỗ"
                >
                  gives way to
                </button>{" "}
                spring and plants begin to grow again, which{" "}
                <button
                  onClick={(e) => handleVocabClick("symbolize", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'symbolize' tại chỗ"
                >
                  symbolizes
                </button>{" "}
                a new beginning. A{" "}
                <button
                  onClick={(e) => handleVocabClick("folk-legend", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'folk legend' tại chỗ"
                >
                  folk legend
                </button>{" "}
                also says that the festival is a time for descendants to remember their ancestors and pray for a good harvest. Over time, Tết{" "}
                <button
                  onClick={(e) => handleVocabClick("absorb-influences", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'absorb influences' tại chỗ"
                >
                  absorbed influences
                </button>{" "}
                from Chinese culture during the period of Chinese rule, yet it kept its own identity.
              </p>

              <p>
                Traditional customs follow three stages. Before Tết, people clean their houses, prepare a{" "}
                <button
                  onClick={(e) => handleVocabClick("five-fruit-tray", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'five-fruit tray' tại chỗ"
                >
                  five-fruit tray
                </button>
                , and wrap bánh chưng or bánh tét together. During the holiday, families hold{" "}
                <button
                  onClick={(e) => handleVocabClick("ancestor-worship", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'ancestor worship' tại chỗ"
                >
                  ancestor worship
                </button>{" "}
                ceremonies, exchange New Year wishes, give{" "}
                <button
                  onClick={(e) => handleVocabClick("li-xi", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'lì xì' tại chỗ"
                >
                  lì xì
                </button>{" "}
                to children, and visit pagodas. Afterwards, people take part in spring festivals to wish for good luck. Although the way Vietnamese people celebrate has changed, the article argues that the{" "}
                <button
                  onClick={(e) => handleVocabClick("core-values", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'core values' tại chỗ"
                >
                  core values
                </button>{" "}
                of togetherness, gratitude, and hope remain the soul of the holiday.
              </p>

              <p>
                Food carries cultural and spiritual meaning as well. Bánh chưng and bánh tét, which the article calls symbols of earth and sky, express gratitude to ancestors. Bánh chưng is usually made in the North, whereas bánh tét is more common in the Centre and the South.{" "}
                <button
                  onClick={(e) => handleVocabClick("dua-hanh", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'dưa hành' tại chỗ"
                >
                  Dưa hành
                </button>{" "}
                balances rich, protein-heavy dishes, and thịt kho tàu with duck eggs represents fullness and{" "}
                <button
                  onClick={(e) => handleVocabClick("prosperity", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'prosperity' tại chỗ"
                >
                  prosperity
                </button>
                . Mứt Tết, made from coconut, ginger, or kumquat, stands for sweetness and a good start.
              </p>

              <p>
                Finally, the{" "}
                <button
                  onClick={(e) => handleVocabClick("atmosphere", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'atmosphere' tại chỗ"
                >
                  atmosphere
                </button>{" "}
                of Tết{" "}
                <button
                  onClick={(e) => handleVocabClick("differ-from-region-to-region", e)}
                  className={vocabBtnClass}
                  title="Nhấp để tra từ 'differ from region to region' tại chỗ"
                >
                  differs from region to region
                </button>
                . In the North, it is linked to peach blossoms, bánh chưng, and solemn customs, with a busy Tết market and a nostalgic mood. The Central region celebrates in a simpler but equally warm way, with yellow mai flowers, red couplets, and dishes such as nem chua and tré. In the South, Tết feels lively and open, with mai flowers, red watermelons, flower markets, and folk games.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT PAPER SHEET (TIẾNG VIỆT TRANSLATION) ────────────────────── */}
        <div
          ref={rightSheetRef}
          onScroll={() => handleScroll("right")}
          className={`p-6 sm:p-10 rounded-3xl flex flex-col justify-between transition-colors duration-300 overflow-y-auto max-h-[750px] scroll-smooth ${paperSheetBgClass}`}
        >
          <div>
            {/* Header Tag */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] dark:bg-[#059669]/20 dark:text-[#6EE7B7] px-3 py-1 rounded-md">
                BẢN DỊCH TIẾNG VIỆT
              </span>
              <span className="text-xs font-bold bg-[#059669] text-white px-2.5 py-0.5 rounded">
                VI
              </span>
            </div>

            {/* Vietnamese Title & Subtitle */}
            <h1
              className={`font-sans text-2xl sm:text-3xl font-bold ${paperTitleColor} italic leading-snug mb-3`}
            >
              Tết: Sự đổi mới, lòng tưởng nhớ và hương vị các vùng miền
            </h1>
            <p className={`font-sans italic text-sm sm:text-base ${paperSubtitleColor} mb-6`}>
              Khám phá văn hóa về sự đổi mới, lòng tri ân tổ tiên và phong vị ẩm thực ba miền
            </p>

            {/* Vietnamese Side Banner */}
            <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden mb-8 shadow-md border border-[#D9B76A]/40 group">
              <img
                src="https://images.unsplash.com/photo-1582233479366-6d38bc390a08?auto=format&fit=crop&w=1200&q=80"
                alt="Phong Vị Tết Cổ Truyền Việt Nam"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
              <div className="absolute inset-2 border border-[#D9B76A]/30 rounded-xl pointer-events-none" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-[#D9B76A] uppercase tracking-wider">
                <span className="bg-[#059669]/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#D9B76A]/40 text-[#FBF7EE]">
                  Tản Văn Văn Hóa
                </span>
                <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[#D9B76A]">
                  Trình Độ: Level 2–3
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <span className="text-xs text-[#D9B76A] font-semibold uppercase tracking-wider block mb-0.5">
                    Phong Tục & Ẩm Thực
                  </span>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-[#FBF7EE] drop-shadow-md">
                    Phong Vị Tết Cổ Truyền
                  </h3>
                </div>
                <div className="text-[11px] text-[#BFE3EA] font-sans opacity-90 text-left sm:text-right">
                  Bản Dịch Tiếng Việt Chuẩn Ngữ Cảnh
                </div>
              </div>
            </div>

            {/* Vietnamese Translated Paragraphs */}
            <div
              className={`space-y-5 leading-relaxed ${paperBodyTextColor} font-sans`}
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

      {/* ── Unified Bottom Card: Reading Check Quiz + Practice Next Steps ───── */}
      <div
        className={`rounded-3xl p-8 sm:p-12 transition-colors duration-300 grid grid-cols-1 lg:grid-cols-12 gap-10 ${bottomCardBgClass}`}
      >
        {/* Left 7 Cols: Quiz Section */}
        <div className="lg:col-span-7 pr-0 lg:pr-8 lg:border-r border-[rgba(217,183,106,0.2)]">
          <div className="mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
              Reading Check & Comprehension
            </span>
            <h2
              className={`font-serif text-2xl font-bold mt-1 ${
                themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
              }`}
            >
              Câu Hỏi Kiểm Tra Thấu Hiểu Bài Đọc
            </h2>
          </div>

          {/* Quiz Q1 */}
          <div className="mb-8">
            <h3
              className={`text-sm sm:text-base font-bold mb-3 ${
                themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
              }`}
            >
              {READER_QUIZ_QUESTIONS[0]?.question}
            </h3>

            <div className="space-y-2.5">
              {READER_QUIZ_QUESTIONS[0]?.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    q1Answer === opt.value
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
                  <span className="text-xs sm:text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quiz Q2 */}
          <div className="mb-8">
            <h3
              className={`text-sm sm:text-base font-bold mb-3 ${
                themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
              }`}
            >
              {READER_QUIZ_QUESTIONS[1]?.question}
            </h3>

            <div className="space-y-2.5">
              {READER_QUIZ_QUESTIONS[1]?.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    q2Answer === opt.value
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
                  <span className="text-xs sm:text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Quiz Action */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuizSubmitted(true)}
              className="px-6 py-3 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] shadow-sm transition-all border border-[#D9B76A] cursor-pointer"
            >
              Kiểm Tra Đáp Án
            </button>
            {quizSubmitted && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-bold border border-[#059669]/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {q1Answer === READER_QUIZ_QUESTIONS[0]?.correctValue &&
                  q2Answer === READER_QUIZ_QUESTIONS[1]?.correctValue
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
              <h3
                className={`font-serif text-xl font-bold mt-1 ${
                  themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
                }`}
              >
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
                onClick={() =>
                  alert(
                    "Tính năng Dictation (Luyện chép chính tả) đang được phát triển, sẽ sớm ra mắt!"
                  )
                }
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
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

              <Link
                href="/community"
                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all group ${
                  themeMode === "dark"
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

      {/* ── In-Place Dictionary Popup ──────────────────────────────────────── */}
      <InPlaceDictionaryPopup
        isOpen={popupState.isOpen}
        vocab={popupState.vocab}
        position={popupState.position}
        onClose={() => setPopupState((prev) => ({ ...prev, isOpen: false }))}
        themeMode={themeMode}
      />

    </div>
  );
};

export default BilingualReaderView;
