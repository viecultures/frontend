import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, User, Sparkles, Clock, Target } from 'lucide-react';
import type { UserProfileData } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onSave: (updates: Partial<UserProfileData>) => void;
}

const PRESET_AVATARS = [
  { label: 'NL', bg: 'bg-[#1E4B43]' },
  { label: 'VC', bg: 'bg-[#9E2A2B]' },
  { label: 'HN', bg: 'bg-[#B45309]' },
  { label: 'SG', bg: 'bg-[#0D9488]' },
  { label: 'HUE', bg: 'bg-[#6D28D9]' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar || 'NL');
  const [bio, setBio] = useState(profile.bio || '');
  const [dailyMinutes, setDailyMinutes] = useState(profile.dailyTargetMinutes || 15);
  const [targetCefr, setTargetCefr] = useState(profile.targetCefr || 'B1 - Giao tiếp & Thuyết trình');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || profile.name,
      avatar,
      bio: bio.trim(),
      dailyTargetMinutes: Number(dailyMinutes),
      targetCefr,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#FBF7EE] dark:bg-[#122A22] border-2 border-[#D9B76A] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#3F5550] dark:text-[#FBF7EE] z-10 font-sans"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="font-serif text-2xl font-bold text-[#1E4B43] dark:text-[#FBF7EE] mb-1">
            Chỉnh Sửa Hồ Sơ Cá Nhân
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
            Cập nhật thông tin học viên và mục tiêu rèn luyện tiếng Anh di sản mỗi ngày.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* Avatar Selector */}
            <div>
              <label className="block font-bold text-[#1E4B43] dark:text-[#D9B76A] mb-1.5 uppercase tracking-wider text-[11px]">
                Chọn Phù Hiệu Avatar
              </label>
              <div className="flex items-center gap-2.5">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.label}
                    type="button"
                    onClick={() => setAvatar(av.label)}
                    className={`w-11 h-11 rounded-full ${av.bg} text-[#FBF7EE] font-bold text-xs flex items-center justify-center transition-all cursor-pointer border-2 ${
                      avatar === av.label
                        ? 'border-[#D9B76A] ring-2 ring-[#D9B76A]/50 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {av.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-bold text-[#1E4B43] dark:text-[#D9B76A] mb-1.5 uppercase tracking-wider text-[11px]">
                Họ và Tên Học Viên
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Ninh Thiên Luân"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6EEDC] dark:bg-[#1A3D34] border border-[#D9B76A]/40 text-[#1E4B43] dark:text-[#FBF7EE] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D9B76A]"
                required
              />
            </div>

            {/* Bio / Motivation */}
            <div>
              <label className="block font-bold text-[#1E4B43] dark:text-[#D9B76A] mb-1.5 uppercase tracking-wider text-[11px]">
                Châm Ngôn / Lời Tự Thuật
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Chia sẻ lý do bạn muốn học tiếng Anh qua văn hóa Việt..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6EEDC] dark:bg-[#1A3D34] border border-[#D9B76A]/40 text-[#1E4B43] dark:text-[#FBF7EE] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D9B76A]"
              />
            </div>

            {/* Target Daily Minutes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-[#1E4B43] dark:text-[#D9B76A] mb-1.5 uppercase tracking-wider text-[11px]">
                  Mục Tiêu Mỗi Ngày
                </label>
                <select
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6EEDC] dark:bg-[#1A3D34] border border-[#D9B76A]/40 text-[#1E4B43] dark:text-[#FBF7EE] focus:outline-none focus:ring-2 focus:ring-[#D9B76A]"
                >
                  <option value={10}>10 phút / ngày (Nhẹ nhàng)</option>
                  <option value={15}>15 phút / ngày (Tiêu chuẩn)</option>
                  <option value={30}>30 phút / ngày (Tập trung)</option>
                  <option value={45}>45 phút / ngày (Chuyên sâu)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1E4B43] dark:text-[#D9B76A] mb-1.5 uppercase tracking-wider text-[11px]">
                  Mục Tiêu CEFR
                </label>
                <select
                  value={targetCefr}
                  onChange={(e) => setTargetCefr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6EEDC] dark:bg-[#1A3D34] border border-[#D9B76A]/40 text-[#1E4B43] dark:text-[#FBF7EE] focus:outline-none focus:ring-2 focus:ring-[#D9B76A]"
                >
                  <option value="A2 - Nền tảng văn hóa cơ bản">A2 - Cơ bản</option>
                  <option value="B1 - Giao tiếp & Thuyết trình Văn hóa">B1 - Trung cấp</option>
                  <option value="B2 - Phân tích & Tranh biện Di sản">B2 - Nâng cao</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 font-bold transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1E4B43] hover:bg-[#163731] text-[#FBF7EE] font-bold shadow-md hover:shadow-lg transition-all cursor-pointer focus-ring"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
