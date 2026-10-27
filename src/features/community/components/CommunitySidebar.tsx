import React, { useState } from "react";
import { Trophy, TrendingUp, Award, ArrowRight, Clock, Users, Check } from "lucide-react";
import Link from "@/components/Link";
import { PATHS } from "@/routes/paths";
import type { TopAmbassadorItem } from "../types";

interface CommunitySidebarProps {
  onSelectTopicTag?: (tag: string) => void;
  selectedTag?: string;
}

const TRENDING_TOPICS = [
  { tag: "Imperial Hue", count: 42, label: "#ImperialHue" },
  { tag: "Saigon Bánh Mì", count: 35, label: "#SaigonBanhMi" },
  { tag: "Hội An Lanterns", count: 29, label: "#HoiAnLanterns" },
  { tag: "Bát Tràng Pottery", count: 18, label: "#BatTrang" },
  { tag: "Egg Coffee", count: 24, label: "#EggCoffee" },
];

const TOP_AMBASSADORS: TopAmbassadorItem[] = [
  {
    name: "Trần Thanh Thảo",
    role: "Sứ Giả Cố Đô • Top 1 Essay",
    points: "1,450 XP",
    initials: "TT",
    rank: 1,
  },
  {
    name: "Daniel Krauss",
    role: "Global Learner • 12 Reflections",
    points: "1,120 XP",
    initials: "DK",
    rank: 2,
  },
  {
    name: "Lê Thu Hà",
    role: "Sứ Giả Hội An • Vocab Champion",
    points: "980 XP",
    initials: "TH",
    rank: 3,
  },
];

export function CommunitySidebar({
  onSelectTopicTag,
  selectedTag,
}: CommunitySidebarProps) {
  const [hasJoinedChallenge, setHasJoinedChallenge] = useState<boolean>(false);

  return (
    <aside className="community-sidebar space-y-4">
      {/* 1. Main Weekly Challenge Card */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E2D5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3.5">
        {/* Challenge Header Tag */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#1D5046] uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-antique-gold" />
            <span>Weekly Challenge</span>
          </span>
          <span className="text-xs font-bold text-[#1D5046] bg-[#E8D7AE]/30 px-2 py-0.5 rounded-full border border-[#E8D7AE]/50">
            +100 coins
          </span>
        </div>

        {/* Thumbnail & Title */}
        <div className="space-y-2">
          <div className="w-full rounded-xl overflow-hidden aspect-[16/9] border border-[#E8E2D5] relative group">
            <img
              src="/images/landing/hue-citadel.jpg"
              alt="Imperial Hue Architecture & Heritage"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-white text-xs font-semibold drop-shadow-xs">
                Imperial Hue Architecture
              </span>
            </div>
          </div>

          <h3 className="font-serif text-base font-bold text-[#1D5046] leading-snug">
            Imperial Hue Architecture &amp; Heritage
          </h3>

          <p className="text-xs text-[#6E7B75] leading-relaxed">
            Write a 100–300 word reflection in English exploring royal gate symmetry, courtyards, or Perfume River mausoleums.
          </p>
        </div>

        {/* Challenge Metadata Metrics */}
        <div className="flex items-center justify-between text-[11px] text-[#6E7B75] pt-1 border-t border-[#E8E2D5]/70">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#1D5046]" />
            <span>128 learners joined</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-antique-gold" />
            <span>3 days left</span>
          </span>
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-0.5">
          {hasJoinedChallenge ? (
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#1D5046]/20 flex items-center justify-between text-xs">
                <span className="text-[#1D5046] font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#1D5046]" />
                  <span>Enrolled in Challenge</span>
                </span>
                <span className="text-[11px] text-[#6E7B75]">1/1 submitted</span>
              </div>
              <Link
                to={PATHS.communityContest}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#1D5046] bg-[#FAF7F0] hover:bg-white border border-[#E8E2D5] transition-colors w-full focus-ring cursor-pointer"
              >
                <span>View submissions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHasJoinedChallenge(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1D5046] hover:bg-[#153D35] transition-colors shadow-xs focus-ring cursor-pointer"
              >
                <span>Join Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                to={PATHS.communityContest}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D5046] bg-[#FAF7F0] hover:bg-white border border-[#E8E2D5] transition-colors focus-ring"
                title="View challenge details"
              >
                Rules
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 2. Trending Topics (Compact, Clean Links) */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E2D5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E2D5]/70">
          <h3 className="text-xs font-bold text-[#1D5046] uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-antique-gold" />
            <span>Trending Topics</span>
          </h3>
          <span className="text-[11px] text-[#6E7B75]">This week</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.tag}
              type="button"
              onClick={() => onSelectTopicTag?.(topic.tag)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus-ring flex items-center gap-1.5 ${
                selectedTag === topic.tag
                  ? "bg-[#1D5046] text-white font-semibold shadow-2xs"
                  : "bg-[#FAF7F0] text-[#314F49] hover:bg-white hover:text-[#1D5046] border border-[#E8E2D5]"
              }`}
            >
              <span>{topic.label}</span>
              <span
                className={`text-[10px] ${
                  selectedTag === topic.tag ? "opacity-90" : "text-[#6E7B75]"
                }`}
              >
                · {topic.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Top Cultural Ambassadors (Restrained Gold/Silver/Bronze) */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E2D5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E2D5]/70">
          <h3 className="text-xs font-bold text-[#1D5046] uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-antique-gold" />
            <span>Top Ambassadors</span>
          </h3>
          <span className="text-[11px] text-[#6E7B75]">Weekly XP</span>
        </div>

        <div className="space-y-2.5 pt-0.5">
          {TOP_AMBASSADORS.map((amb) => (
            <div
              key={amb.name}
              className="flex items-center justify-between text-xs p-1.5 rounded-xl hover:bg-[#FAF7F0] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Metallic ranking badge */}
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    amb.rank === 1
                      ? "bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/40"
                      : amb.rank === 2
                      ? "bg-[#F1F5F9] text-[#334155] border border-[#94A3B8]/40"
                      : "bg-[#FFEDD5] text-[#9A3412] border border-[#FB923C]/40"
                  }`}
                >
                  {amb.rank}
                </span>

                <div className="min-w-0">
                  <h4 className="font-semibold text-[#1D5046] truncate">
                    {amb.name}
                  </h4>
                  <span className="text-[10px] text-[#6E7B75] block truncate">
                    {amb.role}
                  </span>
                </div>
              </div>

              <span className="font-bold text-[#1D5046] text-xs shrink-0 ml-2">
                {amb.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default CommunitySidebar;
