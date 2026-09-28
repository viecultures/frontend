import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Sparkles, Monitor, Chrome, Bookmark, ArrowRight, ShieldCheck } from 'lucide-react';

interface SetNewTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeUrl: string;
}

export const SetNewTabModal: React.FC<SetNewTabModalProps> = ({ isOpen, onClose, homeUrl }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [activeTab, setActiveTab] = useState<'extension' | 'settings' | 'pwa'>('extension');

  if (!isOpen) return null;

  const extensionFolderPath = "c:\\Edisk\\dow\\Tai_lieu\\ky7\\exe\\viecultures\\viecultures-newtab-extension";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(homeUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(extensionFolderPath);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D1F1A] border-2 border-[#D9B76A]/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-[#163D37] to-[#122A22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9B76A]/20 border border-[#D9B76A] flex items-center justify-center text-[#D9B76A] shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FBF7EE] font-serif">
                Đặt VieCultures Làm Tab Mới (New Tab)
              </h2>
              <p className="text-xs text-[#BFE3EA]">
                Tự động mở phòng học văn hóa mỗi khi bạn mở tab mới trên trình duyệt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#0A1612]/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('extension')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'extension'
                ? 'border-[#D9B76A] text-[#D9B76A]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Chrome className="w-4 h-4" />
            <span>Cách 1: Tiện ích mở rộng (Tự động 100%)</span>
            <span className="text-[10px] bg-[#D9B76A]/20 text-[#D9B76A] px-1.5 py-0.5 rounded-full font-mono">
              Khuyên dùng
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-[#D9B76A] text-[#D9B76A]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Cách 2: Cài đặt Trình duyệt</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'extension' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#163D37]/50 border border-[#D9B76A]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D9B76A]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Tiện ích mở rộng đã được chuẩn bị sẵn trong mã nguồn</span>
                </div>
                <p className="text-xs text-[#E8DFCB] leading-relaxed">
                  Vì lý do bảo mật, trình duyệt hiện đại (Chrome, Edge, Brave, Cốc Cốc) không cho phép website tự ý đổi New Tab qua Javascript mà yêu cầu thông qua một extension nhỏ (chỉ 2KB, an toàn tuyệt đối).
                </p>
              </div>

              {/* 3 Steps Guide */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#D9B76A]">
                  3 Bước Cài Đặt Trong 30 Giây:
                </h3>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#D9B76A] text-[#1E4B43] flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </span>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-[#FBF7EE]">
                      Mở trang quản lý Tiện ích mở rộng trên trình duyệt
                    </p>
                    <p className="text-white/60">
                      Gõ vào thanh địa chỉ: <code className="bg-black/40 px-1.5 py-0.5 rounded text-[#D9B76A]">chrome://extensions</code> (hoặc <code className="bg-black/40 px-1.5 py-0.5 rounded text-[#D9B76A]">edge://extensions</code>).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#D9B76A] text-[#1E4B43] flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </span>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-[#FBF7EE]">
                      Bật "Chế độ dành cho nhà phát triển" (Developer mode)
                    </p>
                    <p className="text-white/60">
                      Gạt công tắc ở góc trên bên phải trang Tiện ích sang trạng thái <strong>BẬT</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#D9B76A] text-[#1E4B43] flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </span>
                  <div className="text-xs space-y-2 flex-1">
                    <p className="font-semibold text-[#FBF7EE]">
                      Bấm nút "Tải tiện ích đã giải nén" (Load unpacked) và chọn thư mục sau:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={extensionFolderPath}
                        className="flex-1 bg-black/40 border border-white/15 px-3 py-1.5 rounded-lg text-[11px] font-mono text-[#D9B76A] select-all focus:outline-none"
                      />
                      <button
                        onClick={handleCopyPath}
                        className="px-3 py-1.5 rounded-lg bg-[#D9B76A] text-[#1E4B43] font-bold text-xs flex items-center gap-1 hover:bg-[#c9a657] transition-all shrink-0"
                      >
                        {copiedPath ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPath ? 'Đã chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Hoàn tất! Giờ đây mỗi khi bạn ấn <kbd className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">Ctrl + T</kbd> (hoặc mở Tab mới), trình duyệt sẽ tự động đưa bạn vào thẳng VieCultures!
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                  Đặt Làm Trang Khởi Động (Không cần cài Extension):
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Nếu bạn không muốn cài extension, bạn có thể thiết lập để trình duyệt tự động mở VieCultures mỗi khi bạn khởi động trình duyệt:
                </p>

                <div className="space-y-2 text-xs text-[#E8DFCB]">
                  <p>1. Sao chép liên kết trang Home:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={homeUrl}
                      className="flex-1 bg-black/40 border border-white/15 px-3 py-1.5 rounded-lg text-xs font-mono text-[#D9B76A] select-all focus:outline-none"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="px-3 py-1.5 rounded-lg bg-[#D9B76A] text-[#1E4B43] font-bold text-xs flex items-center gap-1 hover:bg-[#c9a657] transition-all shrink-0"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl ? 'Đã chép URL' : 'Sao chép URL'}</span>
                    </button>
                  </div>

                  <p className="pt-2">
                    2. Vào <strong>Cài đặt trình duyệt (Settings)</strong> &rarr; Mục <strong>Khi khởi động (On startup)</strong>.
                  </p>
                  <p>
                    3. Chọn <strong>"Mở một trang cụ thể hoặc tập hợp các trang"</strong> &rarr; Dán liên kết vừa sao chép ở trên vào.
                  </p>
                </div>
              </div>

              {/* Bookmark Tip */}
              <div className="p-3.5 rounded-xl bg-[#D9B76A]/10 border border-[#D9B76A]/20 flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-[#D9B76A] shrink-0" />
                <div className="text-xs text-[#E8DFCB]">
                  <p className="font-bold text-[#FBF7EE]">Mẹo nhanh Bookmark Bar:</p>
                  <p className="text-white/70">
                    Nhấn phím <kbd className="bg-black/40 px-1.5 py-0.5 rounded text-[#D9B76A] font-mono">Ctrl + D</kbd> (hoặc <kbd className="bg-black/40 px-1.5 py-0.5 rounded text-[#D9B76A] font-mono">Cmd + D</kbd>) để đưa VieCultures lên thanh dấu trang, mở trong 1 cú click!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#0A1612] flex items-center justify-between">
          <span className="text-[11px] text-white/50">
            Hệ thống đã tự động ghi nhớ tùy chọn ưu tiên của bạn trên trình duyệt này.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D9B76A] to-[#c9a657] text-[#1E4B43] font-bold text-xs hover:shadow-lg transition-all"
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
export default SetNewTabModal;
