import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Award,
  Flame,
  Coins,
  Crown,
  ShoppingBag,
  CheckCircle2,
  CircleDashed,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Headphones,
  Palette,
  Medal,
  Landmark,
  Layers,
  BookOpen,
  PenTool,
  Heart,
  Clock,
  Zap,
} from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';

type TabType = 'quests' | 'streak' | 'badges' | 'shop';

export const MissionsModal: React.FC = () => {
  const {
    isMissionsOpen,
    closeMissions,
    stats,
    currentLevelInfo,
    streakMultiplier,
    dailyMissions,
    weeklyMissions,
    allBadges,
    shopItems,
    claimMissionReward,
    spendCoins,
    equipItem,
  } = useGamification();

  const [activeTab, setActiveTab] = useState<TabType>('quests');
  const [shopFeedback, setShopFeedback] = useState<string | null>(null);

  if (!isMissionsOpen) return null;

  const handleClaim = (missionId: string) => {
    claimMissionReward(missionId);
  };

  const handleBuy = (item: { id: string; cost: number; name: string }) => {
    const success = spendCoins(item.cost, item.id, item.name);
    if (success) {
      setShopFeedback(`Chúc mừng bạn đã mở khóa thành công "${item.name}"!`);
      setTimeout(() => setShopFeedback(null), 3500);
    } else {
      setShopFeedback(`Bạn cần thêm ${item.cost - stats.coins} Xu để đổi vật phẩm này.`);
      setTimeout(() => setShopFeedback(null), 3500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMissions}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-surface dark:bg-heritage-dark border-2 border-antique-gold/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.6)] text-text-body dark:text-warm-ivory z-10 flex flex-col overflow-hidden"
        >
          {/* ── HEADER ──────────────────────────────────────────────────────── */}
          <div className="p-5 sm:p-6 pb-4 border-b border-line dark:border-white/10 flex items-center justify-between bg-rice-paper/50 dark:bg-black/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-heritage-green text-antique-gold border border-antique-gold/40 flex items-center justify-center shadow-md shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-heritage-green dark:text-warm-ivory leading-tight">
                  Trung Tâm Nhiệm Vụ & Danh Hiệu
                </h2>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-text-secondary dark:text-white/70">
                  <span className="font-semibold">{currentLevelInfo.level} ({currentLevelInfo.title})</span>
                  <span>•</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {stats.xp} XP
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={closeMissions}
              className="p-2 rounded-full hover:bg-mist-cloud dark:hover:bg-white/10 text-text-secondary dark:text-white/60 hover:text-heritage-green dark:hover:text-warm-ivory transition-colors cursor-pointer focus-ring"
              aria-label="Đóng bảng nhiệm vụ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── USER STATS QUICK SUMMARY BAR ─────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-2 px-5 py-3 bg-mist-cloud/40 dark:bg-black/20 border-b border-line dark:border-white/10 text-xs">
            {/* Coins */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-surface dark:bg-heritage-forest/50 border border-line dark:border-white/10">
              <div className="p-1 rounded-lg bg-antique-gold/20 text-antique-gold">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-text-secondary dark:text-white/60 font-semibold block uppercase">
                  Ví Xu
                </span>
                <span className="font-mono font-bold text-antique-gold text-sm">
                  {stats.coins} Xu
                </span>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-surface dark:bg-heritage-forest/50 border border-line dark:border-white/10">
              <div className="p-1 rounded-lg bg-amber-500/20 text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
              <div>
                <span className="text-[10px] text-text-secondary dark:text-white/60 font-semibold block uppercase">
                  Chuỗi Streak
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1">
                  {stats.streakDays} Ngày
                  {streakMultiplier > 1 && (
                    <span className="text-[9px] px-1 bg-amber-500/20 rounded">
                      x{streakMultiplier}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Level Progress */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-surface dark:bg-heritage-forest/50 border border-line dark:border-white/10">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[10px] text-text-secondary dark:text-white/60 font-semibold uppercase">
                  <span>Tiến Độ</span>
                  <span>{currentLevelInfo.progressPercent}%</span>
                </div>
                <div className="w-full bg-line dark:bg-white/20 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-gradient-to-r from-antique-gold to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentLevelInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── TABS NAVIGATION ──────────────────────────────────────────────── */}
          <div className="flex items-center px-5 pt-3 border-b border-line dark:border-white/10 gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('quests')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'quests'
                  ? 'border-antique-gold text-heritage-green dark:text-antique-gold font-extrabold'
                  : 'border-transparent text-text-secondary dark:text-white/60 hover:text-heritage-green dark:hover:text-warm-ivory'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Nhiệm Vụ ({dailyMissions.length + weeklyMissions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('streak')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'streak'
                  ? 'border-antique-gold text-heritage-green dark:text-antique-gold font-extrabold'
                  : 'border-transparent text-text-secondary dark:text-white/60 hover:text-heritage-green dark:hover:text-warm-ivory'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Chuỗi & Nhân Điểm</span>
            </button>

            <button
              onClick={() => setActiveTab('badges')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'badges'
                  ? 'border-antique-gold text-heritage-green dark:text-antique-gold font-extrabold'
                  : 'border-transparent text-text-secondary dark:text-white/60 hover:text-heritage-green dark:hover:text-warm-ivory'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Huy Hiệu Di Sản ({stats.unlockedBadges.length}/{allBadges.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'shop'
                  ? 'border-antique-gold text-heritage-green dark:text-antique-gold font-extrabold'
                  : 'border-transparent text-text-secondary dark:text-white/60 hover:text-heritage-green dark:hover:text-warm-ivory'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Đổi Quà & Shop</span>
            </button>
          </div>

          {/* ── TAB CONTENT BODY ─────────────────────────────────────────────── */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 max-h-[58vh]">
            {/* 1. TAB: QUESTS / MISSIONS */}
            {activeTab === 'quests' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Daily Quests Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-heritage-green dark:text-antique-gold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Nhiệm Vụ Hằng Ngày (Làm mới mỗi ngày)</span>
                    </h3>
                    <span className="text-[11px] text-text-secondary dark:text-white/60 font-mono">
                      Tiến độ: {dailyMissions.filter((m) => m.completed).length}/{dailyMissions.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {dailyMissions.map((mission) => {
                      const canClaim = mission.completed && !mission.claimed;
                      return (
                        <div
                          key={mission.id}
                          className="p-3.5 rounded-2xl bg-rice-paper/60 dark:bg-white/5 border border-line dark:border-white/10 flex items-center justify-between gap-3 hover:bg-rice-paper dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-heritage-green/10 dark:bg-antique-gold/20 text-heritage-green dark:text-antique-gold flex items-center justify-center shrink-0 mt-0.5">
                              {mission.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <CircleDashed className="w-4 h-4 text-antique-gold" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-heritage-green dark:text-warm-ivory flex items-center gap-2">
                                <span>{mission.title}</span>
                                {mission.claimed && (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                                    Đã nhận
                                  </span>
                                )}
                              </h4>
                              <p className="text-[11px] text-text-secondary dark:text-white/70 leading-relaxed truncate">
                                {mission.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <div className="text-right">
                              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 justify-end">
                                <Coins className="w-3 h-3 text-antique-gold" />
                                <span>+{mission.rewardCoins} Xu</span>
                              </span>
                              <span className="text-[10px] font-bold text-antique-rich dark:text-antique-gold block">
                                +{mission.rewardXP} XP
                              </span>
                            </div>

                            {canClaim ? (
                              <button
                                onClick={() => handleClaim(mission.id)}
                                className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-antique-gold text-heritage-dark shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer focus-ring"
                              >
                                Nhận Thưởng
                              </button>
                            ) : mission.claimed ? (
                              <span className="text-xs font-bold text-text-secondary dark:text-white/40 px-2">
                                Hoàn tất
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-text-secondary dark:text-white/50 px-2 font-mono">
                                {mission.current}/{mission.target}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Weekly Quests Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-heritage-green dark:text-antique-gold flex items-center gap-1.5">
                      <Medal className="w-3.5 h-3.5" />
                      <span>Thử Thách Tuần (Phần thưởng lớn)</span>
                    </h3>
                    <span className="text-[11px] text-text-secondary dark:text-white/60 font-mono">
                      Tiến độ: {weeklyMissions.filter((m) => m.completed).length}/{weeklyMissions.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {weeklyMissions.map((mission) => {
                      const canClaim = mission.completed && !mission.claimed;
                      return (
                        <div
                          key={mission.id}
                          className="p-3.5 rounded-2xl bg-rice-paper/60 dark:bg-white/5 border border-line dark:border-white/10 flex items-center justify-between gap-3 hover:bg-rice-paper dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                              {mission.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <CircleDashed className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-heritage-green dark:text-warm-ivory flex items-center gap-2">
                                <span>{mission.title}</span>
                                {mission.claimed && (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                                    Đã nhận
                                  </span>
                                )}
                              </h4>
                              <p className="text-[11px] text-text-secondary dark:text-white/70 leading-relaxed truncate">
                                {mission.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <div className="text-right">
                              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 justify-end">
                                <Coins className="w-3 h-3 text-antique-gold" />
                                <span>+{mission.rewardCoins} Xu</span>
                              </span>
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">
                                +{mission.rewardXP} XP
                              </span>
                            </div>

                            {canClaim ? (
                              <button
                                onClick={() => handleClaim(mission.id)}
                                className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-antique-gold text-heritage-dark shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer focus-ring"
                              >
                                Nhận Thưởng
                              </button>
                            ) : mission.claimed ? (
                              <span className="text-xs font-bold text-text-secondary dark:text-white/40 px-2">
                                Hoàn tất
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-text-secondary dark:text-white/50 px-2 font-mono">
                                {mission.current}/{mission.target}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. TAB: STREAK & MULTIPLIER */}
            {activeTab === 'streak' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Streak Highlight Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-antique-gold/20 to-amber-500/10 border border-antique-gold/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-heritage-dark flex items-center justify-center shadow-lg">
                        <Flame className="w-7 h-7 fill-heritage-dark" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
                          CHUỖI HỌC TẬP HIỆN TẠI
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-heritage-green dark:text-warm-ivory">
                          {stats.streakDays} Ngày Liên Tiếp
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700">
                        Bonus {streakMultiplier}x XP
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary dark:text-white/80 leading-relaxed">
                    Học tập mỗi ngày giúp nhân đôi tốc độ thăng cấp! Duy trì streak từ 3 ngày trở lên sẽ kích hoạt hệ số nhân điểm kinh nghiệm.
                  </p>

                  {/* 7-Day Visual Row */}
                  <div className="grid grid-cols-7 gap-2 pt-2">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => {
                      const isCompleted = idx < stats.streakDays;
                      const isToday = idx === stats.streakDays - 1;
                      return (
                        <div
                          key={day}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                            isCompleted
                              ? 'bg-amber-500 text-heritage-dark border-amber-600 font-bold shadow-sm'
                              : 'bg-rice-paper/50 dark:bg-white/5 text-text-secondary dark:text-white/40 border-line dark:border-white/10'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-mono">{day}</span>
                          {isCompleted ? (
                            <Flame className="w-4 h-4 fill-current" />
                          ) : (
                            <CircleDashed className="w-4 h-4 opacity-40" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Multipliers Rule Table */}
                <div className="p-4 rounded-2xl bg-surface dark:bg-white/5 border border-line dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-green dark:text-antique-gold flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>Hệ Thống Thưởng Multiplier</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-rice-paper/60 dark:bg-black/20 border border-line dark:border-white/10 space-y-1">
                      <span className="font-bold text-heritage-green dark:text-warm-ivory block">
                        Chuỗi 3 - 6 Ngày
                      </span>
                      <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                        +10% XP (1.1x)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-rice-paper/60 dark:bg-black/20 border border-line dark:border-white/10 space-y-1">
                      <span className="font-bold text-heritage-green dark:text-warm-ivory block">
                        Chuỗi 7 - 13 Ngày
                      </span>
                      <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                        +25% XP (1.25x)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-rice-paper/60 dark:bg-black/20 border border-line dark:border-white/10 space-y-1">
                      <span className="font-bold text-heritage-green dark:text-warm-ivory block">
                        Chuỗi 14+ Ngày
                      </span>
                      <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        +50% XP (1.5x)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TAB: BADGES & TITLES */}
            {activeTab === 'badges' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {allBadges.map((badge) => {
                    const isUnlocked = stats.unlockedBadges.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                          isUnlocked
                            ? 'bg-rice-paper/80 dark:bg-heritage-forest/60 border-antique-gold/60 shadow-sm'
                            : 'bg-surface dark:bg-white/5 border-line dark:border-white/10 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isUnlocked
                              ? 'bg-heritage-green text-antique-gold border border-antique-gold/40 shadow-xs'
                              : 'bg-black/10 dark:bg-white/10 text-text-secondary dark:text-white/40'
                          }`}
                        >
                          <Award className="w-5 h-5" />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-heritage-green dark:text-warm-ivory">
                              {badge.name}
                            </h4>
                            {isUnlocked ? (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                                Đã Mở
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-line dark:bg-white/10 text-text-secondary dark:text-white/50">
                                Chưa Khóa
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-antique-rich dark:text-antique-gold">
                            {badge.title}
                          </p>
                          <p className="text-[10px] text-text-secondary dark:text-white/60 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. TAB: SHOP & REWARDS */}
            {activeTab === 'shop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {shopFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-antique-gold" />
                    <span>{shopFeedback}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {shopItems.map((item) => {
                    const canAfford = stats.coins >= item.cost;
                    const isPurchased = stats.inventory.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-rice-paper/60 dark:bg-white/5 border border-line dark:border-white/10 flex flex-col justify-between gap-3 hover:bg-rice-paper dark:hover:bg-white/10 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-heritage-green text-antique-gold flex items-center justify-center border border-antique-gold/30 shrink-0">
                                <ShoppingBag className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-heritage-green dark:text-warm-ivory">
                                  {item.name}
                                </h4>
                                <span className="text-[10px] text-antique-rich dark:text-antique-gold font-semibold uppercase">
                                  {item.tag}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[11px] text-text-secondary dark:text-white/70 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-line dark:border-white/10 flex items-center justify-between">
                          <span className="text-xs font-extrabold text-antique-gold flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" />
                            <span>{item.cost} Xu</span>
                          </span>

                          {isPurchased ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đã Sở Hữu</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleBuy(item)}
                              disabled={!canAfford}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer focus-ring ${
                                canAfford
                                  ? 'bg-heritage-green text-warm-ivory hover:bg-heritage-dark shadow-sm'
                                  : 'bg-line dark:bg-white/10 text-text-secondary dark:text-white/40 cursor-not-allowed'
                              }`}
                            >
                              <Coins className="w-3 h-3 text-antique-gold" />
                              <span>Đổi Quà</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MissionsModal;
