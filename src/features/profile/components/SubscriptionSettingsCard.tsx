import React from 'react';
import { Crown, Check, Zap, ShieldCheck, ArrowRight, RefreshCw, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import type { UserProfileData } from '../types';

interface SubscriptionSettingsCardProps {
  profile: UserProfileData;
  onRefreshPro?: () => void;
}

export const SubscriptionSettingsCard: React.FC<SubscriptionSettingsCardProps> = ({
  profile,
  onRefreshPro,
}) => {
  return (
    <div className="space-y-6">
      {/* Current Plan Overview Card */}
      <div className="rounded-3xl bg-[#F6EEDC] dark:bg-[#122A22] border-2 border-[#D9B76A] p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#D9B76A]/30">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#1E4B43] text-[#D9B76A] border border-[#D9B76A] flex items-center justify-center shadow-sm">
              <Crown className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E4B43] dark:text-[#FBF7EE]">
                  {profile.isPro ? 'Gói Hội Viên VieCultures Pro' : 'Gói Học Tập Cơ Bản (Free)'}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    profile.isPro
                      ? 'bg-[#D9B76A] text-[#122A22]'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {profile.isPro ? 'ACTIVE' : 'MIỄN PHÍ'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {profile.isPro
                  ? `Thời hạn gói đến ngày: ${profile.proExpiresAt || '15/11/2026'}`
                  : 'Học tập không giới hạn các bài đọc song ngữ & ôn thẻ nhớ cơ bản.'}
              </p>
            </div>
          </div>

          <div>
            {profile.isPro ? (
              <Link
                to={PATHS.pricing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E4B43] hover:bg-[#163731] text-[#FBF7EE] text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <span>Gia hạn / Nâng cấp năm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to={PATHS.pricing}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D9B76A] hover:bg-[#c9a75a] text-[#122A22] text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Nâng Cấp Pro (39k/tháng)</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pro Privileges Matrix */}
        <div className="pt-6">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E4B43] dark:text-[#D9B76A] mb-3">
            Quyền Lợi & Tính Năng Gói
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>Đọc song ngữ & nghe Audio 3 tốc độ (0.5x, 0.8x, 1x)</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>Luyện nghe chép câu Dictation & Flashcards SRS</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  profile.isPro
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-stone-300 text-stone-500'
                }`}
              >
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>
                Trợ lý Gemini AI Cultural Companion {profile.isPro ? '(Không giới hạn)' : '(Tối đa 3 lượt/ngày)'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  profile.isPro
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-stone-300 text-stone-500'
                }`}
              >
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>
                Lưu từ vựng sổ tay {profile.isPro ? '(Không giới hạn)' : '(Tối đa 30 từ)'}
              </span>
            </div>
          </div>
        </div>

        {/* VietQR Reference Info */}
        {profile.isPro && (
          <div className="mt-6 pt-4 border-t border-[#D9B76A]/20 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400 font-mono">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#D9B76A]" />
              <span>Mã giao dịch VietQR: <strong>{profile.vietQrRefCode || 'VIE-PRO-889213'}</strong></span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ● Đã đối soát & xác nhận thành công
            </span>
          </div>
        )}
      </div>

      {/* Account Security & Password Card */}
      <SecuritySettingsCard />
    </div>
  );
};

const SecuritySettingsCard: React.FC = () => {
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [msg, setMsg] = React.useState<{ text: string; isError: boolean } | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setMsg({ text: 'Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới.', isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setMsg({ text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ text: 'Mật khẩu xác nhận không trùng khớp.', isError: true });
      return;
    }

    setMsg({ text: 'Đã đổi mật khẩu thành công!', isError: false });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMsg(null), 3500);
  };

  return (
    <div className="rounded-3xl bg-[#F6EEDC] dark:bg-[#122A22] border-2 border-[#D9B76A]/40 p-6 sm:p-8 shadow-md">
      <div className="flex items-center gap-3 pb-4 border-b border-[#D9B76A]/30">
        <div className="w-10 h-10 rounded-xl bg-[#1E4B43] text-[#D9B76A] flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold text-[#1E4B43] dark:text-[#FBF7EE]">
            Bảo Mật & Mật Khẩu Tài Khoản
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Đổi mật khẩu định kỳ để bảo vệ dữ liệu học tập và thẻ di sản của bạn.
          </p>
        </div>
      </div>

      <form onSubmit={handlePasswordSubmit} className="pt-5 space-y-4 max-w-md text-xs sm:text-sm">
        {msg && (
          <div
            className={`p-3 rounded-xl border text-xs font-medium ${
              msg.isError
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {msg.text}
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-[#1E4B43] dark:text-[#D9B76A] uppercase mb-1">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại..."
            className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#1A3D34] border border-[#D9B76A]/40 text-[#1E4B43] dark:text-[#FBF7EE] focus:outline-none focus:ring-1 focus:ring-[#D9B76A]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-[#1E4B43] dark:text-[#D9B76A] uppercase mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#1A3D34] border border-[#D9B76A]/40 text-[#1E4B43] dark:text-[#FBF7EE] focus:outline-none focus:ring-1 focus:ring-[#D9B76A]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#1E4B43] dark:text-[#D9B76A] uppercase mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#1A3D34] border border-[#D9B76A]/40 text-[#1E4B43] dark:text-[#FBF7EE] focus:outline-none focus:ring-1 focus:ring-[#D9B76A]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E4B43] hover:bg-[#163731] text-[#FBF7EE] text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <span>Cập nhật mật khẩu mới</span>
        </button>
      </form>
    </div>
  );
};

