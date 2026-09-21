import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  ArrowRight,
  Layers,
  CheckCircle,
  Flame,
  MapPin,
  Navigation,
  Globe,
  FileText
} from 'lucide-react';
import bannerVideo from '../assets/banner.webm';
import picHue from '../assets/pictures/1789477888834_3466390194730922005_g2285579428170464438_97fb29714b65f3e4f91196487a1510be.jpg';
import picDongHo from '../assets/pictures/1789477897671_3466390194730922005_g2285579428170464438_208c3b16036482dde07954a98eba6f37.jpg';
import picAoDai from '../assets/pictures/1789477908863_3466390194730922005_g2285579428170464438_43e95faf8835448ecde377e2b7447d69.jpg';
import VietnamMapCarousel from '../components/VietnamMapCarousel';

interface LandingPage3Props {
  onNavigate: (view: string) => void;
  onOpenDocs: () => void;
}

interface LandmarkArticle {
  id: string;
  name: string;
  region: string;
  locationNameVi: string;
  pinCoordinates: { x: number; y: number };
  title: string;
  titleVi: string;
  subtitle: string;
  excerptEn: string;
  excerptVi: string;
  category: string;
  level: string;
  image: string;
  readTime: string;
  vocabHighlights: string[];
}

const VIETNAM_LANDMARKS: LandmarkArticle[] = [
  {
    id: 'mu-cang-chai',
    name: 'Mù Cang Chải',
    region: 'Tây Bắc',
    locationNameVi: 'Mù Cang Chải • Yên Bái (Tây Bắc)',
    pinCoordinates: { x: 26, y: 13 },
    title: 'Mu Cang Chai Terraces & Highland Agricultural Wisdom',
    titleVi: 'Ruộng Bậc Thang Mù Cang Chải & Tri Thức Nông Nghiệp',
    subtitle: 'Highland harvest season and traditional agricultural wisdom of Hmong villagers.',
    excerptEn: 'Carved directly into steep mountain slopes by Hmong farmers, these golden terraces harvest mountain stream water creating a breathtaking staircase to the sky during autumn harvest season.',
    excerptVi: 'Được bàn tay người H’Mông khắc chạm trực tiếp vào vách núi dốc đứng, những dải ruộng bậc thang vàng óng dẫn nước suối ngàn tạo nên chiếc cầu thang lên mây tuyệt đẹp mùa lúa chín.',
    category: 'Nature',
    level: 'B1',
    image: picDongHo,
    readTime: '4 mins',
    vocabHighlights: ['terraces', 'breathtaking', 'agricultural']
  },
  {
    id: 'hanoi-bat-trang',
    name: 'Hà Nội & Bát Tràng',
    region: 'Đồng Bằng Sông Hồng',
    locationNameVi: 'Hà Nội • Thủ Đô Nghìn Năm Văn Hiến',
    pinCoordinates: { x: 31, y: 16 },
    title: 'Bat Trang Ceramic Heritage: 700 Years of Kiln Arts',
    titleVi: 'Gốm Bát Tràng: 700 Năm Hồn Đất & Lửa Thủ Đô',
    subtitle: '700 years of traditional pottery craftsmanship in Hanoi.',
    excerptEn: 'Nestled along the Red River, Bat Trang artisans transform raw white clay into porcelain masterpieces using ancient crackle glaze technique and hand-painted blue dragon motifs passed through generations.',
    excerptVi: 'Nằm ven dòng sông Hồng, các nghệ nhân Bát Tràng biến đất sét trắng thô thành kiệt tác gốm sứ với kỹ thuật men rạn cổ truyền và họa tiết rồng xanh vẽ tay qua nhiều thế hệ.',
    category: 'Crafts',
    level: 'B2',
    image: picHue,
    readTime: '5 mins',
    vocabHighlights: ['masterpieces', 'crackle glaze', 'motifs']
  },
  {
    id: 'hue-citadel',
    name: 'Cố Đô Huế',
    region: 'Bắc Trung Bộ',
    locationNameVi: 'Cố Đô Huế • Di Sản Triều Nguyễn',
    pinCoordinates: { x: 44, y: 48 },
    title: 'Imperial Hue Citadel Gates & Court Architecture',
    titleVi: 'Cổng Thành & Kiến Trúc Hoàng Cung Cố Đô Huế',
    subtitle: 'Explore 19th-century court architecture and geomancy design along the Perfume River.',
    excerptEn: 'Built under the Nguyen Dynasty in 1804, the Imperial Citadel features ten majestic gates harmoniously aligned with geomancy principles along the Perfume River. Each wooden pavilion reflects royal craftsmanship and court ceremonies.',
    excerptVi: 'Xây dựng dưới thời nhà Nguyễn năm 1804, Hoàng thành Huế sở hữu 10 cổng thành uy nghiêm nằm hài hòa theo triết lý phong thủy sông Hương. Mỗi lầu vọng cảnh phản ánh tinh hoa chạm khắc hoàng gia.',
    category: 'Heritage',
    level: 'B1',
    image: picHue,
    readTime: '5 mins',
    vocabHighlights: ['geomancy', 'pavilion', 'craftsmanship']
  },
  {
    id: 'hoi-an-lanterns',
    name: 'Phố Cổ Hội An',
    region: 'Duyên Hải Nam Trung Bộ',
    locationNameVi: 'Phố Cổ Hội An • Quảng Nam',
    pinCoordinates: { x: 50, y: 54 },
    title: 'Hoi An Lantern Festival & Ancient Silk Craftsmanship',
    titleVi: 'Đêm Hội Hoa Đăng Hội An & Nghề Lụa Cổ Truyền',
    subtitle: 'Full moon rituals and ancient silk craftsmanship along the Thu Bon river.',
    excerptEn: 'On the 14th night of every lunar month, the ancient town of Hoi An switches off electric lights, illuminating streets with thousands of colorful hand-woven silk lanterns floating gracefully on the river.',
    excerptVi: 'Vào đêm 14 âm lịch hàng tháng, phố cổ Hội An tắt toàn bộ ánh đèn điện, thắp sáng các con phố bằng hàng ngàn chiếc đèn lồng lụa thủ công rực rỡ trôi bồng bềnh trên dòng sông Hoài.',
    category: 'Heritage',
    level: 'B1',
    image: picAoDai,
    readTime: '6 mins',
    vocabHighlights: ['illuminating', 'hand-woven', 'folklore']
  },
  {
    id: 'saigon-banh-mi',
    name: 'Thành Phố Hồ Chí Minh',
    region: 'Nam Bộ',
    locationNameVi: 'Sài Gòn - TP. Hồ Chí Minh • Hòn Ngọc Viễn Đông',
    pinCoordinates: { x: 34, y: 79 },
    title: 'The Story of Saigon Banh Mi: A Culinary Evolution',
    titleVi: 'Hành Trình Bánh Mì Sài Gòn: Từ Ngõ Hẻm Ra Thế Giới',
    subtitle: 'From French baguette origins to global street food culinary icon.',
    excerptEn: 'Saigon Banh Mi reinvented the classic French baguette by adding rice flour for extra crispness, stuffed with savory pate, pork cold cuts, pickled daikon, and fresh cilantro. It stands as a symbol of Vietnamese culinary creativity.',
    excerptVi: 'Bánh mì Sài Gòn đã sáng tạo lại chiếc bánh baguette kiểu Pháp bằng cách phối trộn bột gạo cho vỏ giòn rụm, kẹp pate đậm đà, chả lụa, đồ chua và ngò rí. Đây là biểu tượng của sự sáng tạo ẩm thực Việt.',
    category: 'Cuisine',
    level: 'B1',
    image: picDongHo,
    readTime: '4 mins',
    vocabHighlights: ['culinary', 'crispness', 'reinvented']
  }
];

export const LandingPage3: React.FC<LandingPage3Props> = ({ onNavigate, onOpenDocs }) => {
  const [activePinIndex, setActivePinIndex] = useState(2);
  const [isAutoTour, setIsAutoTour] = useState(true);
  const [activeTooltipWord, setActiveTooltipWord] = useState<string | null>('architectural');

  useEffect(() => {
    if (!isAutoTour) return;
    const interval = setInterval(() => {
      setActivePinIndex((prev) => (prev + 1) % VIETNAM_LANDMARKS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoTour]);

  const activeLandmark = VIETNAM_LANDMARKS[activePinIndex];

  return (
    <div className="min-h-screen bg-[#0D1C18] text-[#FFFDF8] font-sans selection:bg-[#FCE5B5] selection:text-[#122A22]">

      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-[0.65] contrast-[1.1] scale-105"
          >
            <source src={bannerVideo} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C18] via-[#0D1C18]/50 to-[#0D1C18]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D1C18]/40 to-[#0D1C18]/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#F5D280]/40 text-[#FCE5B5] text-xs font-semibold tracking-wider uppercase mb-6 shadow-xl">
            <Globe className="w-3.5 h-3.5 text-[#F5D280]" />
            <span>VIETNAM OFFICIAL MAP TOUR • LANDING PAGE 03</span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight mb-6 drop-shadow-2xl">
            Khám Phá Di Sản Việt Nam — <br className="hidden sm:inline" />
            <span className="text-[#FCE5B5] italic font-normal">Trên Bản Đồ Tương Tác</span>
          </h1>

          <p className="max-w-3xl text-base sm:text-lg text-white/90 leading-relaxed font-normal mb-10 drop-shadow-md">
            Trải nghiệm hành trình du ngoạn 5 địa danh di sản lừng lẫy nhất Việt Nam từ Hà Nội, Mù Cang Chải, Huế, Hội An đến Sài Gòn qua bản đồ chi tiết SVG &amp; các bài đọc song ngữ độc quyền.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#vietnam-map"
              className="btn-pill-primary px-8 py-4 text-base font-bold flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform"
            >
              <Navigation className="w-5 h-5" />
              <span>Khám Phá Bản Đồ Di Sản ↓</span>
            </a>

            <button
              onClick={() => onNavigate('discovery')}
              className="btn-pill-glass px-8 py-4 text-base font-semibold flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-[#F5D280]" />
              <span>Kho Bài Đọc Miễn Phí</span>
            </button>

            <button
              onClick={onOpenDocs}
              className="btn-pill-glass px-6 py-4 text-sm font-semibold flex items-center gap-2 text-white/80 hover:text-white"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Đặc Tả Design.md</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. VIETNAM INTERACTIVE MAP SPOTLIGHT SECTION */}
      <section id="vietnam-map" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0A1613]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-[#F5D280] uppercase flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#F5D280]" />
              OFFICIAL VIETNAM SVG MAP SPOTLIGHT
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
              Bản Đồ Di Sản Việt Nam Chi Tiết
            </h2>
            <p className="text-sm text-white/70">
              Nhấp vào 5 điểm mốc di sản trên bản đồ để khám phá câu chuyện văn hóa và bài đọc song ngữ độc quyền.
            </p>
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            onMouseEnter={() => setIsAutoTour(false)}
            onMouseLeave={() => setIsAutoTour(true)}
          >
            {/* LEFT COLUMN: Official Vietnam Vector SVG Map Container */}
            <div className="lg:col-span-5 relative bg-[#122A22] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between items-center h-full overflow-hidden">
              <VietnamMapCarousel
                activeIndex={activePinIndex}
                onSelectLandmark={setActivePinIndex}
              />

              {/* Landmark Pin Selection Pills Bar */}
              <div className="w-full pt-4 mt-2 border-t border-white/10 flex flex-wrap items-center justify-center gap-1.5">
                {VIETNAM_LANDMARKS.map((landmark, idx) => (
                  <button
                    key={landmark.id}
                    onClick={() => setActivePinIndex(idx)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                      idx === activePinIndex
                        ? 'bg-[#F5D280] text-[#122A22] shadow-md'
                        : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    📍 {landmark.name}
                  </button>
                ))}
              </div>

            </div>

            {/* RIGHT COLUMN: Active Landmark Spotlight Card */}
            <div className="lg:col-span-7 h-full">
              <div className="bg-[#122A22] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col justify-between">
                
                {/* Location Header Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D1C18] border border-[#F5D280]/40 text-[#FCE5B5] text-xs font-bold mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#F5D280]" />
                  <span>{activeLandmark.locationNameVi}</span>
                </div>

                {/* Main Feature Image Banner */}
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-6 border border-white/15 group">
                  <img
                    src={activeLandmark.image}
                    alt={activeLandmark.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#122A22] via-black/20 to-black/40" />

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0D1C18]/90 text-[#FCE5B5] border border-white/20 backdrop-blur-md">
                      {activeLandmark.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                      Band {activeLandmark.level}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-medium text-white/90">
                    <span className="bg-black/60 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                      ⏱️ {activeLandmark.readTime} đọc song ngữ
                    </span>
                    <span className="bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full border border-amber-500/40 backdrop-blur-md font-semibold">
                      🌟 Di Sản Tiêu Điểm
                    </span>
                  </div>
                </div>

                {/* Article Titles */}
                <div className="space-y-1.5 mb-4">
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                    {activeLandmark.title}
                  </h3>
                  <p className="text-sm font-medium text-[#FCE5B5]">
                    {activeLandmark.titleVi}
                  </p>
                </div>

                {/* Bilingual Excerpt Box */}
                <div className="space-y-3 mb-6 bg-[#0D1C18]/80 p-4 rounded-2xl border border-white/10">
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-serif">
                    "{activeLandmark.excerptEn}"
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed italic border-t border-white/10 pt-2 font-sans">
                    "{activeLandmark.excerptVi}"
                  </p>
                </div>

                {/* Vocabulary Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-xs font-bold text-white/60">Từ vựng di sản:</span>
                  {activeLandmark.vocabHighlights.map((vocab, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    >
                      ✨ {vocab}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10">
                  <button
                    onClick={() => onNavigate('bilingual-reader')}
                    className="btn-pill-primary px-6 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Đọc Song Ngữ &amp; AI Shadowing</span>
                  </button>

                  <button
                    onClick={() => onNavigate('flashcard-study')}
                    className="btn-pill-glass px-5 py-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#F5D280]" />
                    <span>Ôn Flashcard Địa Danh</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. THE 4 CORE PILLARS SECTION */}
      <section id="topics" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-[#F5D280] uppercase">Content Curriculum</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
              The 4 Core Topics (Pillars)
            </h2>
            <p className="text-sm text-white/70">
              Lộ trình bài đọc được thiết kế khoa học nhằm mở rộng vốn từ vựng thuộc các miền di sản văn hóa trọng điểm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#122A22] border border-white/15 rounded-2xl p-6 hover:border-[#F5D280]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#F5D280] mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white/50 tracking-wider uppercase">Pillar 01</span>
                <h3 className="font-heading font-bold text-xl text-white mt-1 mb-2 group-hover:text-[#FCE5B5]">
                  History &amp; Heritage
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Lịch sử triều đại, các di sản thế giới UNESCO, thành quách cổ kính và những cột mốc độc lập dân tộc.
                </p>
              </div>
              <button
                onClick={() => onNavigate('discovery')}
                className="mt-6 text-xs font-bold text-[#F5D280] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Khám phá 120+ bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#122A22] border border-white/15 rounded-2xl p-6 hover:border-[#F5D280]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white/50 tracking-wider uppercase">Pillar 02</span>
                <h3 className="font-heading font-bold text-xl text-white mt-1 mb-2 group-hover:text-[#FCE5B5]">
                  Cuisine &amp; Coffee
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Ẩm thực 3 miền, câu chuyện Bánh mì Sài Gòn, Cà phê trứng Hà Nội và từ vựng ẩm thực chuẩn quốc tế.
                </p>
              </div>
              <button
                onClick={() => onNavigate('discovery')}
                className="mt-6 text-xs font-bold text-[#F5D280] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Khám phá 95+ bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#122A22] border border-white/15 rounded-2xl p-6 hover:border-[#F5D280]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white/50 tracking-wider uppercase">Pillar 03</span>
                <h3 className="font-heading font-bold text-xl text-white mt-1 mb-2 group-hover:text-[#FCE5B5]">
                  Arts &amp; Craft Villages
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Làng dệt lụa Vạn Phúc, gốm Bát Tràng, tranh Đông Hồ, múa rối nước và âm nhạc dân gian truyền thống.
                </p>
              </div>
              <button
                onClick={() => onNavigate('discovery')}
                className="mt-6 text-xs font-bold text-[#F5D280] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Khám phá 140+ bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#122A22] border border-white/15 rounded-2xl p-6 hover:border-[#F5D280]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white/50 tracking-wider uppercase">Pillar 04</span>
                <h3 className="font-heading font-bold text-xl text-white mt-1 mb-2 group-hover:text-[#FCE5B5]">
                  Festivals &amp; Beliefs
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Phong tục Tết Nguyên Đán, Đêm hội Trung Thu, tín ngưỡng thờ Mẫu và các lễ hội đình làng đặc sắc.
                </p>
              </div>
              <button
                onClick={() => onNavigate('discovery')}
                className="mt-6 text-xs font-bold text-[#F5D280] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Khám phá 110+ bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE READER DEMO SECTION */}
      <section id="interactive-demo" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0A1613]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#F5D280] uppercase">Interactive Demo 01</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                Trải Nghiệm Reader Overlay Trực Tiếp
              </h2>
              <p className="text-sm text-white/80 leading-relaxed font-normal">
                Nhấp vào bất kỳ từ vựng gạch chân nào trong đoạn văn mẫu để xem phiên âm IPA chuẩn, nghĩa Tiếng Việt, nghe phát âm AI và xem câu ví dụ thực tế.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-white/90">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Tra từ tức thì không ngắt quãng trải nghiệm đọc song ngữ</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-white/90">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Lưu từ vựng trực tiếp vào bộ Flashcard Spaced Repetition</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('bilingual-reader')}
                  className="btn-pill-primary px-6 py-3.5 text-sm font-bold flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Mở Trình Đọc Song Ngữ Đầy Đủ</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-[#122A22] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-white/60 ml-2">ReaderPreview.tsx</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FCE5B5] text-[#122A22]">
                    BILINGUAL MODE
                  </span>
                </div>

                <div className="space-y-6 text-left">
                  <h3 className="font-heading font-bold text-2xl text-[#FCE5B5]">
                    Imperial Hue Citadel Architecture
                  </h3>

                  <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/10 space-y-3">
                    <p className="text-sm leading-relaxed text-white/90 font-serif">
                      "The Imperial Citadel represents an extraordinary{' '}
                      <span
                        onClick={() => setActiveTooltipWord('architectural')}
                        className={`cursor-pointer px-1.5 py-0.5 rounded font-bold underline decoration-amber-400 decoration-2 transition-colors ${activeTooltipWord === 'architectural' ? 'bg-amber-400/30 text-[#FCE5B5]' : 'hover:bg-white/10 text-amber-300'}`}
                      >
                        architectural
                      </span>{' '}
                      accomplishment. Originating from Bac Ninh, traditional craftsmen embodied the{' '}
                      <span
                        onClick={() => setActiveTooltipWord('quintessence')}
                        className={`cursor-pointer px-1.5 py-0.5 rounded font-bold underline decoration-emerald-400 decoration-2 transition-colors ${activeTooltipWord === 'quintessence' ? 'bg-emerald-400/30 text-emerald-200' : 'hover:bg-white/10 text-emerald-300'}`}
                      >
                        quintessence
                      </span>{' '}
                      of Vietnamese aesthetics with natural pigments."
                    </p>
                  </div>

                  {activeTooltipWord && (
                    <div className="p-4 rounded-xl bg-[#18362C] border border-[#F5D280]/50 shadow-2xl animate-in fade-in duration-300">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-bold text-xl text-[#FCE5B5]">
                              {activeTooltipWord === 'architectural' && 'architectural'}
                              {activeTooltipWord === 'quintessence' && 'quintessence'}
                            </h4>
                            <span className="text-xs text-white/60 italic">
                              {activeTooltipWord === 'architectural' && '/ˌɑːrkɪˈtektʃərəl/ • adj'}
                              {activeTooltipWord === 'quintessence' && '/kwɪnˈtesns/ • noun'}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-emerald-400 mt-1">
                            {activeTooltipWord === 'architectural' && 'Thuộc về kiến trúc, liên quan đến thiết kế công trình'}
                            {activeTooltipWord === 'quintessence' && 'Tinh hoa, phần tinh túy nhất của văn hóa / nghệ thuật'}
                          </p>
                        </div>
                        <button
                          onClick={() => alert(`🔊 Đang phát âm từ vựng: ${activeTooltipWord}`)}
                          className="p-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage3;
