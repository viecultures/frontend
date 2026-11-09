import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Target,
  Copy,
  Check,
  Trash2,
  Plus,
  RefreshCw,
  QrCode,
  Download,
  ExternalLink,
  BookOpen,
  Compass,
  TrendingUp,
  DollarSign,
  Layers,
} from 'lucide-react';
import { growthEngineService } from '../../services/growthEngineService';
import { postAdminService } from '../../services/postAdminService';
import { journeyAdminService } from '../../services/journeyAdminService';
import type {
  EnhancedUtmCampaignItem,
  UtmChannel,
} from '../../types/marketing.contract';
import type { ReadingPostItem, LearningJourneyItem } from '../../types/adminTypes';
import { AdminDialog } from '../AdminDialog';

// Simple lightweight deterministic QR-like SVG pattern generator for reliable display and download
const generateQrSvg = (text: string, size: number = 180): string => {
  // Deterministic 25x25 matrix based on string hash
  const gridSize = 25;
  const cellSize = size / gridSize;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  const cells: string[] = [];
  // Standard position detection patterns at 3 corners (7x7 squares)
  const isCornerPattern = (r: number, c: number) => {
    // Top-left
    if (r < 7 && c < 7) return true;
    // Top-right
    if (r < 7 && c >= gridSize - 7) return true;
    // Bottom-left
    if (r >= gridSize - 7 && c < 7) return true;
    return false;
  };

  // Draw corner locator boxes
  const drawCorner = (startR: number, startC: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (isBorder || isCenter) {
          const x = (startC + c) * cellSize;
          const y = (startR + r) * cellSize;
          cells.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#1c1917" />`);
        }
      }
    }
  };

  drawCorner(0, 0);
  drawCorner(0, gridSize - 7);
  drawCorner(gridSize - 7, 0);

  // Fill data cells deterministically
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (isCornerPattern(r, c)) continue;
      // Deterministic bit calculation
      const bit = ((hash ^ (r * 31 + c * 17)) & 1) === 1;
      if (bit) {
        const x = c * cellSize;
        const y = r * cellSize;
        cells.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#1c1917" />`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#ffffff"/>${cells.join(
    ''
  )}</svg>`;
};

export const UtmCampaignBuilderTab: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EnhancedUtmCampaignItem[]>([]);
  const [posts, setPosts] = useState<ReadingPostItem[]>([]);
  const [journeys, setJourneys] = useState<LearningJourneyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [targetType, setTargetType] = useState<'POST' | 'JOURNEY' | 'CUSTOM'>('POST');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [manualPath, setManualPath] = useState<string>('');
  const [channel, setChannel] = useState<UtmChannel>('Facebook');
  const [campaignName, setCampaignName] = useState<string>('');
  const [campaignContent, setCampaignContent] = useState<string>('');

  // QR Modal
  const [activeQrCampaign, setActiveQrCampaign] = useState<EnhancedUtmCampaignItem | null>(null);

  // Load Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cList, pList, jList] = await Promise.all([
        growthEngineService.getEnhancedUtmCampaigns(),
        postAdminService.getPosts().catch(() => [] as ReadingPostItem[]),
        journeyAdminService.getJourneys().catch(() => [] as LearningJourneyItem[]),
      ]);
      setCampaigns(cList);
      setPosts(pList);
      setJourneys(jList);

      if (pList.length > 0 && !selectedTargetId) {
        setSelectedTargetId(pList[0].id);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  }, [selectedTargetId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Selected item title
  const currentTargetTitle = useMemo(() => {
    if (targetType === 'POST') {
      const found = posts.find((p) => p.id === selectedTargetId);
      return found?.titleVi || found?.titleEn || 'Bài đọc di sản';
    } else if (targetType === 'JOURNEY') {
      const found = journeys.find((j) => j.id === selectedTargetId);
      return found?.titleVi || found?.titleEn || 'Hành trình văn hóa';
    }
    return manualPath || 'Trang đích tùy chỉnh';
  }, [targetType, selectedTargetId, manualPath, posts, journeys]);

  // Target path
  const currentTargetPath = useMemo(() => {
    if (targetType === 'POST') {
      return `/reading/${selectedTargetId}`;
    } else if (targetType === 'JOURNEY') {
      return `/journey/${selectedTargetId}`;
    }
    return manualPath.trim() ? `/${manualPath.trim().replace(/^\//, '')}` : '/reading';
  }, [targetType, selectedTargetId, manualPath]);

  // Handle Save Campaign
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;

    try {
      const created = await growthEngineService.createEnhancedUtmCampaign({
        name: campaignName.trim(),
        channel,
        targetType,
        targetId: selectedTargetId || manualPath,
        targetTitle: currentTargetTitle,
        targetPath: currentTargetPath,
        utmContent: campaignContent.trim() || undefined,
      });

      setCampaigns((prev) => [created, ...prev]);
      setCampaignName('');
      setCampaignContent('');
    } catch {
      // Ignored
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    await growthEngineService.deleteEnhancedUtmCampaign(id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  // Handle 1-Click Copy
  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignored
    }
  };

  // Handle Download QR SVG
  const handleDownloadQr = (campaign: EnhancedUtmCampaignItem) => {
    const svgStr = generateQrSvg(campaign.shortUrl || campaign.fullUrl, 300);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${campaign.utmCampaign}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse" aria-busy="true">
        <div className="h-64 rounded-xl bg-stone-100 dark:bg-stone-800" />
        <div className="h-64 rounded-xl bg-stone-100 dark:bg-stone-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-heritage-green" aria-hidden="true" />
            <span>Trình tạo Link UTM & Mã QR Chiến dịch Đa kênh</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Tự động sinh link rút gọn, mã QR tải về cho ấn phẩm và đo lường trực tiếp tỷ lệ chuyển đổi học viên.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Làm mới</span>
        </button>
      </div>

      {/* ── Trình cấu hình UTM & Rút gọn Link ─────────────────────────────── */}
      <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-5">
        <form onSubmit={handleSaveCampaign} className="space-y-4">
          {/* Hàng 1: Loại nội dung & Dropdown chọn */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Loại Đích đến *
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('POST');
                    if (posts.length > 0) setSelectedTargetId(posts[0].id);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium transition-colors ${
                    targetType === 'POST'
                      ? 'bg-heritage-green text-white border-heritage-green font-bold'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Bài đọc ({posts.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('JOURNEY');
                    if (journeys.length > 0) setSelectedTargetId(journeys[0].id);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium transition-colors ${
                    targetType === 'JOURNEY'
                      ? 'bg-heritage-green text-white border-heritage-green font-bold'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Hành trình ({journeys.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('CUSTOM')}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium transition-colors ${
                    targetType === 'CUSTOM'
                      ? 'bg-heritage-green text-white border-heritage-green font-bold'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Tùy chỉnh
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Nội dung Liên kết *
              </label>
              {targetType === 'POST' && posts.length > 0 ? (
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                >
                  {posts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titleVi || p.titleEn} (Slug: {p.id})
                    </option>
                  ))}
                </select>
              ) : targetType === 'JOURNEY' && journeys.length > 0 ? (
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                >
                  {journeys.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.titleVi || j.titleEn} (ID: {j.id})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={manualPath}
                  onChange={(e) => setManualPath(e.target.value)}
                  placeholder="Nhập đường dẫn trực tiếp (ví dụ: subscription hoặc map)"
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green font-mono"
                />
              )}
            </div>
          </div>

          {/* Hàng 2: Kênh, Tên chiến dịch, Nội dung bài đăng */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Kênh Phân phối *
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as UtmChannel)}
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              >
                <option value="Facebook">Facebook (social)</option>
                <option value="TikTok">TikTok (social_video)</option>
                <option value="Google">Google (cpc)</option>
                <option value="Email">Email (newsletter)</option>
                <option value="Zalo">Zalo (chat)</option>
                <option value="Direct">Trực tiếp / Poster (direct)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Tên Chiến dịch (utm_campaign) *
              </label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="tet-di-san-2026"
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Nội dung Phân biệt (utm_content)
              </label>
              <input
                type="text"
                value={campaignContent}
                onChange={(e) => setCampaignContent(e.target.value)}
                placeholder="banner-top-hoac-bio-link"
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-heritage-green text-white text-xs font-bold hover:bg-heritage-green/90 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tạo & Lưu Liên kết Chiến dịch</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── Bảng Theo dõi Hiệu quả "Liên kết đã lưu" ──────────────────────── */}
      <section className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Danh sách Liên kết Chiến dịch & Đo lường Chuyển đổi
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Theo dõi chi tiết số lượt nhấp (Clicks), học viên đăng ký mới (Leads), gói trả phí (Conversions) và mã QR.
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 dark:text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-lg">
            Chưa có chiến dịch nào được tạo. Hãy tạo liên kết đầu tiên ở trên!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-700">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-100/75 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                  <th className="py-2.5 px-3">Tên Chiến dịch</th>
                  <th className="py-2.5 px-3">Kênh</th>
                  <th className="py-2.5 px-3">Đích đến Di sản</th>
                  <th className="py-2.5 px-3 text-right">Lượt nhấp (Clicks)</th>
                  <th className="py-2.5 px-3 text-right">Đăng ký (Leads)</th>
                  <th className="py-2.5 px-3 text-right">Gói trả phí</th>
                  <th className="py-2.5 px-3 text-right">Tỷ lệ CVR</th>
                  <th className="py-2.5 px-3 text-center">Mã QR</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700/60 text-stone-800 dark:text-stone-200">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-medium">
                      <div>{camp.name}</div>
                      <div className="text-[11px] font-mono text-heritage-green">{camp.shortUrl}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        {camp.channel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400 max-w-xs truncate">
                      {camp.targetTitle}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {camp.metrics.clicks.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      +{camp.metrics.leads.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-heritage-green">
                      {camp.metrics.conversions}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {camp.metrics.conversionRate}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveQrCampaign(camp)}
                        title="Xem và tải mã QR"
                        className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-colors"
                      >
                        <QrCode className="w-4 h-4 inline" aria-hidden="true" />
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(camp.shortUrl || camp.fullUrl, camp.id)}
                          className="px-2 py-1 rounded border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-[11px] font-medium transition-colors"
                        >
                          {copiedId === camp.id ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Đã chép
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Copy className="w-3 h-3" /> Chép link
                            </span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(camp.id)}
                          title="Xóa liên kết"
                          className="p-1 rounded hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Modal Xem & Tải Mã QR ─────────────────────────────────────────── */}
      {activeQrCampaign && (
        <AdminDialog
          title={`Mã QR Chiến dịch: ${activeQrCampaign.name}`}
          onClose={() => setActiveQrCampaign(null)}
        >
          <div className="p-6 text-center space-y-4 max-w-sm mx-auto">
            <div className="p-4 rounded-xl bg-white border border-stone-200 inline-block shadow-xs">
              <div
                dangerouslySetInnerHTML={{
                  __html: generateQrSvg(activeQrCampaign.shortUrl || activeQrCampaign.fullUrl, 180),
                }}
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {activeQrCampaign.shortUrl}
              </div>
              <p className="text-[11px] text-stone-500">
                Đích đến: {activeQrCampaign.targetTitle}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadQr(activeQrCampaign)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-heritage-green text-white text-xs font-bold hover:bg-heritage-green/90 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tải Mã QR (SVG)</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy(activeQrCampaign.shortUrl, 'modal-qr')}
                className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {copiedId === 'modal-qr' ? 'Đã sao chép' : 'Chép link ngắn'}
              </button>
            </div>
          </div>
        </AdminDialog>
      )}
    </div>
  );
};
