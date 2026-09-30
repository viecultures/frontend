import React from 'react';
import { Quote, Sparkles, Award, ShieldCheck, CheckCircle2, Users } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  avatarInitials: string;
  avatarBg: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Lê Thu Trang',
    role: 'English Teacher & Tour Guide',
    location: 'Hà Nội',
    quote:
      'Reading about Saigon\'s coffee history in academic B2 English gave me the exact vocabulary I needed to explain Vietnamese culture to my international colleagues with utmost confidence!',
    avatarInitials: 'TT',
    avatarBg: 'bg-emerald-700 text-warm-ivory',
  },
  {
    name: 'Nguyễn Quốc Bảo',
    role: 'University Student & Cultural Enthusiast',
    location: 'TP. Hồ Chí Minh',
    quote:
      'The Safe Reflections section is brilliant. Writing without fear of grammar correction or red pen grading helped me build real confidence expressing deep cultural feelings in English.',
    avatarInitials: 'QB',
    avatarBg: 'bg-amber-700 text-warm-ivory',
  },
  {
    name: 'Mark Henderson',
    role: 'Expat & Language Enthusiast',
    location: 'Đà Nẵng',
    quote:
      'As an expat living in Vietnam, this app helps me understand the rich symbolism of Vietnamese heritage while helping my local friends practice natural English pronunciation!',
    avatarInitials: 'MH',
    avatarBg: 'bg-sky-800 text-warm-ivory',
  },
];

export const AmbassadorCommunitySection: React.FC = () => {
  return (
    <section
      id="trusted-community"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line vn-pattern-bg"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <Users className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-widest text-[11px] font-extrabold">
              Social Proof &amp; Community
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
            Trusted By <span className="italic text-antique-gold font-serif">Cultural Ambassadors</span>
          </h2>

          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Join thousands of learners sharing Vietnamese culture in English globally.
          </p>
        </div>

        {/* Stats Bar Container */}
        <div className="rounded-3xl border-2 border-border-dark p-8 sm:p-10 bg-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1.5">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-heritage-green tabular-nums">
              <AnimatedNumber value={500} />
              <span className="text-antique-gold font-light">+</span>
            </div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">
              Bilingual Cultural Articles
            </p>
            <p className="text-[11px] text-mountain-teal font-medium">Chuẩn học thuật CEFR A2 - C1</p>
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 md:border-l md:border-r border-line pt-6 md:pt-0">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-heritage-green tabular-nums">
              <AnimatedNumber value={12500} />
              <span className="text-antique-gold font-light">+</span>
            </div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">
              Active Ambassadors
            </p>
            <p className="text-[11px] text-mountain-teal font-medium">Từ 32+ quốc gia trên thế giới</p>
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 border-line pt-6 md:pt-0">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-heritage-green tabular-nums">
              <AnimatedNumber value={150000} />
              <span className="text-antique-gold font-light">+</span>
            </div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">
              Flashcard Repetitions
            </p>
            <p className="text-[11px] text-mountain-teal font-medium">Tỷ lệ nhớ từ vựng đạt 94.8%</p>
          </div>
        </div>

        {/* 3 Testimonials Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white border border-line shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              {/* Quote Body */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <Quote className="w-7 h-7 text-antique-gold/60" />
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Learner</span>
                  </span>
                </div>

                <p className="font-serif text-sm sm:text-base text-text-main italic leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Author Row */}
              <div className="pt-4 border-t border-line flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-serif font-bold text-sm shadow-xs shrink-0 ${testimonial.avatarBg}`}
                >
                  {testimonial.avatarInitials}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-text-main truncate">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-text-muted font-normal truncate">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmbassadorCommunitySection;
