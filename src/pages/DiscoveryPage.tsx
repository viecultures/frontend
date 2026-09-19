import { useState, useMemo } from "react";
import Link from "@/components/Link";
import {
  Search,
  BookOpen,
  Clock,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Filter,
  ArrowRight,
  Compass,
  Award,
  Layers,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

// Catalog Lesson Interface
interface Lesson {
  id: string;
  title: string;
  vietnameseTitle: string;
  category: "Heritage" | "Cuisine" | "Crafts" | "Nature" | "Folklore";
  categoryVi: string;
  cefrLevel: "A2" | "B1" | "B2" | "C1";
  readTime: string;
  vocabCount: number;
  summary: string;
  gradient: string;
  iconSymbol: string;
  featured?: boolean;
  dateAdded: string;
}

// Mock Dataset of Vietnamese Cultural Stories
const LESSONS_DATA: Lesson[] = [
  {
    id: "imperial-hue",
    title: "Exploring Imperial Hue Architecture Through B1 English",
    vietnameseTitle: "Khám Phá Kiến Trúc Cung Đình Huế Qua Tiếng Anh B1",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "B1",
    readTime: "8 phút đọc",
    vocabCount: 12,
    summary:
      "Discover the citadel gates, royal tombs, and court cuisine of the Nguyen Dynasty while building academic vocabulary in historical architecture and conservation.",
    gradient: "from-[#1E4B43] via-[#2A665B] to-[#163D37]",
    iconSymbol: "🏛️",
    featured: true,
    dateAdded: "2026-03-15",
  },
  {
    id: "saigon-banh-mi",
    title: "The Story of Saigon Bánh Mì",
    vietnameseTitle: "Hành Trình Bánh Mì Sài Gòn Ra Thế Giới",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "B1",
    readTime: "5 phút đọc",
    vocabCount: 8,
    summary:
      "From French baguette to global culinary icon: trace the history behind Vietnam's favorite street food and learn key culinary descriptive adjectives.",
    gradient: "from-[#D9B76A]/90 via-[#C59B48] to-[#9E7728]",
    iconSymbol: "🥖",
    dateAdded: "2026-03-10",
  },
  {
    id: "hoi-an-lanterns",
    title: "Hội An Lantern Festival Traditions",
    vietnameseTitle: "Truyền Thống Đèn Lồng Phố Cổ Hội An",
    category: "Heritage",
    categoryVi: "Lịch Sử & Di Sản",
    cefrLevel: "B1",
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Understand full moon rituals, silk craftsmanship, and ancient wooden architecture along the Thu Bồn River using rich descriptive storytelling.",
    gradient: "from-[#E8B7B2]/90 via-[#D69690] to-[#B86E67]",
    iconSymbol: "🏮",
    dateAdded: "2026-03-12",
  },
  {
    id: "bat-trang-pottery",
    title: "Bát Tràng Pottery & Ceramic Arts",
    vietnameseTitle: "Nghệ Thuật Gốm Sứ Làng Cổ Bát Tràng",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "B2",
    readTime: "6 phút đọc",
    vocabCount: 9,
    summary:
      "Explore 700 years of ceramic craftsmanship in a traditional village on the Red River delta while learning terminology for artisan techniques.",
    gradient: "from-[#6E9FA1] via-[#528385] to-[#3B6668]",
    iconSymbol: "🏺",
    dateAdded: "2026-03-08",
  },
  {
    id: "mu-cang-chai",
    title: "Terraced Fields of Mù Cang Chải",
    vietnameseTitle: "Ruộng Bậc Thang Mù Cang Chải Mùa Lúa Chín",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "B1",
    readTime: "5 phút đọc",
    vocabCount: 7,
    summary:
      "Journey through the golden harvest season in northern highlands and discover the ecological wisdom of ethnic minority communities.",
    gradient: "from-[#2A665B] via-[#4A887C] to-[#1E4B43]",
    iconSymbol: "🌾",
    dateAdded: "2026-03-05",
  },
  {
    id: "egg-coffee",
    title: "Vietnamese Egg Coffee Legacy",
    vietnameseTitle: "Huyền Thoại Cà Phê Trứng Hà Nội",
    category: "Cuisine",
    categoryVi: "Ẩm Thực & Cà Phê",
    cefrLevel: "B2",
    readTime: "4 phút đọc",
    vocabCount: 6,
    summary:
      "How wartime necessity birthed a world-renowned coffee innovation in 1946 Old Quarter Hanoi. Practice narrative tenses and passive voice.",
    gradient: "from-[#C59B48] via-[#A87E2D] to-[#78571B]",
    iconSymbol: "☕",
    dateAdded: "2026-03-14",
  },
  {
    id: "water-puppetry",
    title: "Water Puppetry & Village Legends",
    vietnameseTitle: "Múa Rối Nước & Truyền Thuyết Làng Quê",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "B1",
    readTime: "8 phút đọc",
    vocabCount: 11,
    summary:
      "Step into the flooded rice paddies of Northern Vietnam to discover a unique thousand-year-old performing art and folk mythology.",
    gradient: "from-[#9FCED8] via-[#75B2C0] to-[#488E9E]",
    iconSymbol: "🎭",
    dateAdded: "2026-03-01",
  },
  {
    id: "sword-lake-legend",
    title: "The Legend of Sword Lake & Golden Turtle",
    vietnameseTitle: "Sự Tích Hoàn Kiếm & Rùa Vàng",
    category: "Folklore",
    categoryVi: "Lễ Hội & Tín Ngưỡng",
    cefrLevel: "A2",
    readTime: "4 phút đọc",
    vocabCount: 5,
    summary:
      "Revisit King Le Loi's mythical sword and the sacred turtle of Hanoi in accessible A2 English tailored for foundational learners.",
    gradient: "from-[#E8B7B2] via-[#C88A84] to-[#995852]",
    iconSymbol: "🐢",
    dateAdded: "2026-02-28",
  },
  {
    id: "ao-dai-weaving",
    title: "The Art of Vietnamese Áo Dài Silk Weaving",
    vietnameseTitle: "Nghệ Thuật Dệt Lụa & Áo Dài Truyền Thống",
    category: "Crafts",
    categoryVi: "Nghệ Thuật & Làng Nghề",
    cefrLevel: "B2",
    readTime: "7 phút đọc",
    vocabCount: 10,
    summary:
      "Trace the evolution of the national garment from Royal court attire to modern high fashion, exploring textile and design terminology.",
    gradient: "from-[#D9B76A] via-[#B89240] to-[#806120]",
    iconSymbol: "👘",
    dateAdded: "2026-03-03",
  },
  {
    id: "trang-an-caves",
    title: "Tràng An Landscape Complex & Cave Secrets",
    vietnameseTitle: "Quần Thể Danh Thắng Tràng An & Bí Ẩn Hang Động",
    category: "Nature",
    categoryVi: "Danh Thắng Thiên Nhiên",
    cefrLevel: "C1",
    readTime: "9 phút đọc",
    vocabCount: 14,
    summary:
      "Explore UNESCO dual heritage karst mountains, ancient temples, and subterranean rivers using advanced C1 academic vocabulary.",
    gradient: "from-[#1E4B43] via-[#336F64] to-[#143630]",
    iconSymbol: "⛰️",
    dateAdded: "2026-03-16",
  },
];

export default function DiscoveryPage() {
  // State for filtering & searching
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedCefr, setSelectedCefr] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"recent" | "vocab" | "time">("recent");
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  // Toggle Favorite Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Get Featured Story
  const featuredStory = useMemo(
    () => LESSONS_DATA.find((item) => item.featured) || LESSONS_DATA[0],
    []
  );

  // Filter & Sort Logic
  const filteredLessons = useMemo(() => {
    return LESSONS_DATA.filter((lesson) => {
      // Exclude featured story from main grid list to avoid duplication
      if (lesson.id === featuredStory.id) return false;

      // Filter by Topic
      const matchTopic =
        selectedTopic === "All" || lesson.category === selectedTopic;

      // Filter by CEFR Level
      const matchCefr =
        selectedCefr === "All" || lesson.cefrLevel === selectedCefr;

      // Filter by Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.vietnameseTitle.toLowerCase().includes(q) ||
        lesson.summary.toLowerCase().includes(q) ||
        lesson.categoryVi.toLowerCase().includes(q);

      return matchTopic && matchCefr && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      if (sortBy === "vocab") {
        return b.vocabCount - a.vocabCount;
      }
      if (sortBy === "time") {
        return parseInt(a.readTime) - parseInt(b.readTime);
      }
      return 0;
    });
  }, [selectedTopic, selectedCefr, searchQuery, sortBy, featuredStory]);

  // Topic Options
  const topicOptions = [
    { label: "Tất cả chủ đề", value: "All" },
    { label: "Lịch sử & Di sản", value: "Heritage" },
    { label: "Ẩm thực & Cà phê", value: "Cuisine" },
    { label: "Nghệ thuật & Làng nghề", value: "Crafts" },
    { label: "Danh thắng Thiên nhiên", value: "Nature" },
    { label: "Lễ hội & Tín ngưỡng", value: "Folklore" },
  ];

  // CEFR Levels
  const cefrLevels = ["All", "A2", "B1", "B2", "C1"];

  return (
    <main className="min-h-screen bg-[#FBF7EE] text-[#3F5550] relative selection:bg-[#BFE3EA] selection:text-[#1E4B43]">

      {/* Hero Header Section */}
      <section className="relative pt-12 pb-10 bg-gradient-to-b from-[#F6EEDC]/60 via-[#FBF7EE] to-[#FBF7EE] border-b border-[rgba(30,75,67,0.08)] overflow-hidden">
        {/* Subtle Background Pattern Decorative Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFE3EA]/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8B7B2]/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6EEDC] border border-[#D9B76A]/60 shadow-sm text-xs font-semibold text-[#1E4B43] mb-4">
            <Compass className="w-3.5 h-3.5 text-[#D9B76A]" />
            <span>Thư Viện Bài Học Song Ngữ Văn Hóa Việt</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E4B43] tracking-tight leading-tight">
                Discovery Catalog
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[#3F5550] max-w-2xl leading-relaxed">
                Khám phá kho tàng truyện kể song ngữ Anh - Việt qua di sản văn hóa, phong tục, ẩm thực và cảnh sắc Việt Nam. Trau dồi từ vựng IELTS & Academic theo trình độ CEFR.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 bg-[#FBF7EE] p-3 rounded-2xl border border-[rgba(30,75,67,0.12)] shadow-sm">
              <div className="px-3 py-1.5 rounded-xl bg-[#1E4B43]/10 text-center">
                <span className="block text-lg font-bold text-[#1E4B43]">
                  {LESSONS_DATA.length}
                </span>
                <span className="text-[11px] font-semibold text-[#6E7E79] uppercase tracking-wider">
                  Bài học
                </span>
              </div>
              <div className="w-[1px] h-8 bg-[rgba(30,75,67,0.12)]" />
              <div className="px-3 py-1.5 rounded-xl bg-[#D9B76A]/15 text-center">
                <span className="block text-lg font-bold text-[#1E4B43]">4</span>
                <span className="text-[11px] font-semibold text-[#6E7E79] uppercase tracking-wider">
                  Cấp độ CEFR
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Featured Story Spotlight Banner */}
        <section className="mb-14">
          <div className="relative rounded-3xl overflow-hidden bg-[#1E4B43] text-[#FBF7EE] shadow-[0_10px_35px_-5px_rgba(30,75,67,0.25)] border border-[#D9B76A]/40 grid grid-cols-1 lg:grid-cols-12 group">
            {/* Left Graphic Banner / Cover */}
            <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[340px] lg:min-h-full bg-gradient-to-br from-[#2A665B] via-[#1E4B43] to-[#163D37] p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
              {/* Decorative Traditional Border Grid Overlay */}
              <div className="absolute inset-3 border border-[#D9B76A]/30 rounded-2xl pointer-events-none" />
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D9B76A]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D9B76A] text-[#1E4B43]">
                  <Sparkles className="w-3 h-3 fill-current" />
                  Featured Story of the Week
                </span>
                <span className="text-3xl">{featuredStory.iconSymbol}</span>
              </div>

              <div className="relative z-10 my-auto py-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#BFE3EA]">
                  {featuredStory.categoryVi} • Level {featuredStory.cefrLevel}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FBF7EE] mt-2 leading-snug group-hover:text-[#D9B76A] transition-colors">
                  {featuredStory.title}
                </h2>
                <p className="text-sm text-[#F6EEDC]/80 mt-1 italic font-light">
                  {featuredStory.vietnameseTitle}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-4 text-xs font-medium text-[#BFE3EA]">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredStory.readTime}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {featuredStory.vocabCount} Từ vựng IELTS
                </span>
              </div>
            </div>

            {/* Right Story Description & Action Body */}
            <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 bg-[#F6EEDC] text-[#3F5550] flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#D9B76A]/20">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B43] bg-[#1E4B43]/10 px-3 py-1 rounded-md">
                    Chủ đề nổi bật
                  </span>
                  <button
                    onClick={() => toggleBookmark(featuredStory.id)}
                    className="p-2 rounded-full hover:bg-[#E8DFCB] transition-colors text-[#1E4B43]"
                    title="Lưu bài học"
                  >
                    {bookmarks[featuredStory.id] ? (
                      <BookmarkCheck className="w-5 h-5 text-[#1E4B43] fill-[#1E4B43]" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-[#1E4B43]" />
                    )}
                  </button>
                </div>

                <p className="text-base text-[#3F5550] leading-relaxed mb-6">
                  {featuredStory.summary}
                </p>

                <div className="p-4 rounded-xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.10)] mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E4B43] mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#D9B76A]" />
                    Mục tiêu đạt được sau bài học:
                  </h4>
                  <ul className="text-xs text-[#3F5550] space-y-1.5 list-disc list-inside">
                    <li>Nắm vững từ vựng miêu tả kiến trúc di sản & quy hoạch hoàng gia.</li>
                    <li>Luyện cấu trúc câu ghép miêu tả dòng lịch sử (Historical Timeline).</li>
                    <li>Thực hành trả lời IELTS Speaking Part 2 chủ đề "A historic building".</li>
                  </ul>
                </div>
              </div>

              <div>
                <Link
                  href="/#courses"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] shadow-[0_4px_16px_rgba(30,75,67,0.25)] hover:shadow-[0_6px_22px_rgba(30,75,67,0.35)] transition-all duration-300 hover:-translate-y-0.5 border border-[#D9B76A]/60 w-full sm:w-auto"
                >
                  <span>Đọc bài học ngay / Read Story Now</span>
                  <ArrowRight className="w-4 h-4 text-[#D9B76A]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Filter & Search Bar Toolbar */}
        <section className="mb-10">
          <div className="p-6 rounded-3xl bg-[#F6EEDC]/90 border border-[rgba(30,75,67,0.12)] shadow-[0_4px_20px_-4px_rgba(30,75,67,0.06)] backdrop-blur-sm space-y-5">
            {/* Top Row: Search Input & Sort Selector */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7E79]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm bài học (ví dụ: Bánh Mì, Huế, Cà Phê, Silk)..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.15)] text-sm text-[#1E4B43] placeholder-[#8C9692] focus:outline-none focus:ring-2 focus:ring-[#1E4B43]/20 focus:border-[#1E4B43] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8C9692] hover:text-[#1E4B43] px-2 py-1"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Topic Select Dropdown & Sort */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Topic Dropdown */}
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 rounded-2xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.15)] text-xs font-bold text-[#1E4B43] focus:outline-none focus:ring-2 focus:ring-[#1E4B43]/20 cursor-pointer shadow-sm"
                  >
                    {topicOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E4B43] pointer-events-none" />
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-1.5 bg-[#FBF7EE] p-1 rounded-2xl border border-[rgba(30,75,67,0.12)] text-xs font-semibold text-[#3F5550]">
                  <span className="px-2 text-[#8C9692] hidden sm:inline">Xếp theo:</span>
                  <button
                    onClick={() => setSortBy("recent")}
                    className={`px-3 py-1.5 rounded-xl transition-colors ${
                      sortBy === "recent"
                        ? "bg-[#1E4B43] text-[#FBF7EE]"
                        : "hover:bg-[#F6EEDC] text-[#3F5550]"
                    }`}
                  >
                    Mới nhất
                  </button>
                  <button
                    onClick={() => setSortBy("vocab")}
                    className={`px-3 py-1.5 rounded-xl transition-colors ${
                      sortBy === "vocab"
                        ? "bg-[#1E4B43] text-[#FBF7EE]"
                        : "hover:bg-[#F6EEDC] text-[#3F5550]"
                    }`}
                  >
                    Nhiều từ vựng
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: CEFR Level Pills & Active Filters summary */}
            <div className="pt-3 border-t border-[rgba(30,75,67,0.10)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B43] flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  Trình độ CEFR:
                </span>
                {cefrLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedCefr(lvl)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      selectedCefr === lvl
                        ? "bg-[#1E4B43] text-[#FBF7EE] shadow-sm border border-[#D9B76A]/50"
                        : "bg-[#FBF7EE] text-[#1E4B43] hover:bg-[#E8DFCB] border border-[rgba(30,75,67,0.12)]"
                    }`}
                  >
                    {lvl === "All" ? "Tất cả" : lvl}
                  </button>
                ))}
              </div>

              {/* Counter & Reset */}
              <div className="flex items-center gap-3 text-xs font-semibold text-[#6E7E79]">
                <span>
                  Hiển thị <strong className="text-[#1E4B43]">{filteredLessons.length}</strong> bài học
                </span>
                {(selectedTopic !== "All" || selectedCefr !== "All" || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedTopic("All");
                      setSelectedCefr("All");
                      setSearchQuery("");
                    }}
                    className="inline-flex items-center gap-1 text-[#1E4B43] hover:underline underline-offset-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Lesson Catalog Cards Grid */}
        <section className="mb-16">
          {filteredLessons.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center rounded-3xl bg-[#F6EEDC]/50 border border-dashed border-[rgba(30,75,67,0.2)] p-8">
              <div className="w-16 h-16 rounded-full bg-[#E8DFCB] flex items-center justify-center mx-auto mb-4 text-[#1E4B43]">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1E4B43]">
                Không tìm thấy bài học phù hợp
              </h3>
              <p className="text-sm text-[#3F5550] mt-2 max-w-md mx-auto">
                Không tìm thấy câu chuyện văn hóa nào khớp với từ khóa "{searchQuery}". Hãy thử tìm lại với từ khóa khác hoặc đặt lại bộ lọc.
              </p>
              <button
                onClick={() => {
                  setSelectedTopic("All");
                  setSelectedCefr("All");
                  setSearchQuery("");
                }}
                className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] shadow-sm transition-all"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredLessons.map((lesson) => (
                <article
                  key={lesson.id}
                  className="group relative rounded-3xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] shadow-[0_4px_20px_-4px_rgba(30,75,67,0.06)] hover:shadow-[0_12px_30px_-6px_rgba(30,75,67,0.14)] transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                >
                  {/* Card Header Illustration Thumbnail */}
                  <div
                    className={`relative h-48 w-full bg-gradient-to-br ${lesson.gradient} p-6 flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Pattern Overlay */}
                    <div className="absolute inset-2 border border-[#D9B76A]/20 rounded-2xl pointer-events-none" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FBF7EE]/90 backdrop-blur-sm text-[#1E4B43] border border-[rgba(30,75,67,0.15)]">
                        {lesson.categoryVi}
                      </span>
                      <button
                        onClick={() => toggleBookmark(lesson.id)}
                        className="p-2 rounded-full bg-[#FBF7EE]/80 hover:bg-[#FBF7EE] text-[#1E4B43] transition-colors shadow-sm"
                        aria-label="Bookmark lesson"
                      >
                        {bookmarks[lesson.id] ? (
                          <BookmarkCheck className="w-4 h-4 text-[#1E4B43] fill-[#1E4B43]" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-[#1E4B43]" />
                        )}
                      </button>
                    </div>

                    {/* Center Icon Emblem */}
                    <div className="relative z-10 my-auto text-center">
                      <span className="text-4xl filter drop-shadow-md transition-transform duration-300 group-hover:scale-110 inline-block">
                        {lesson.iconSymbol}
                      </span>
                    </div>

                    {/* Bottom CEFR & Duration Bar */}
                    <div className="relative z-10 flex items-center justify-between text-[11px] font-bold text-[#FBF7EE] tracking-wider uppercase">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#D9B76A] text-[#1E4B43]">
                        CEFR {lesson.cefrLevel}
                      </span>
                      <span className="flex items-center gap-1 text-[#F6EEDC]">
                        <Clock className="w-3 h-3" />
                        {lesson.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-[#FBF7EE]">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#1E4B43] leading-snug group-hover:text-[#D9B76A] transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-[#6E7E79] mt-1 font-medium italic">
                        {lesson.vietnameseTitle}
                      </p>
                      <p className="text-xs text-[#3F5550] mt-3 line-clamp-3 leading-relaxed">
                        {lesson.summary}
                      </p>
                    </div>

                    {/* Card Footer Details */}
                    <div className="mt-6 pt-4 border-t border-[rgba(30,75,67,0.10)] flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#6E7E79] flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#1E4B43]" />
                        {lesson.vocabCount} Từ vựng
                      </span>
                      <Link
                        href="/#courses"
                        className="font-bold text-[#1E4B43] group-hover:text-[#D9B76A] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Poetic Heritage Banner CTA */}
        <section className="rounded-3xl bg-gradient-to-r from-[#F6EEDC] via-[#FBF7EE] to-[#F6EEDC] border border-[#D9B76A]/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-2xl mb-2 block">🪷</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E4B43]">
              "Mỗi bài học là một chuyến du hành văn hóa"
            </h2>
            <p className="text-sm text-[#3F5550] mt-3 leading-relaxed">
              Hãy duy trì thói quen đọc 10 phút mỗi ngày để vừa am hiểu sâu sắc văn hóa dân tộc, vừa nâng tầm tiếng Anh chuẩn academic & IELTS.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-[#1E4B43] bg-[#FBF7EE] hover:bg-[#F6EEDC] border border-[#D9B76A] shadow-sm transition-all"
              >
                <span>Quay về Trang Chủ VieCultures</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
