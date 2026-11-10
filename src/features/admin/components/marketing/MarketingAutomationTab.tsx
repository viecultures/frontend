import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Play,
  Pause,
  Edit3,
  Clock,
  Target,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Bell,
  Mail,
  Smartphone,
  Globe,
  Sliders,
  X,
  History,
} from 'lucide-react';
import { growthEngineService } from '../../services/growthEngineService';
import type {
  AutomationWorkflowItem,
  AutomationExecutionLog,
  MarketingDeliveryChannel,
} from '../../types/marketing.contract';
import { AdminDialog } from '../AdminDialog';

export const MarketingAutomationTab: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflowItem[]>([]);
  const [logs, setLogs] = useState<AutomationExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit Workflow Modal
  const [editingWorkflow, setEditingWorkflow] = useState<AutomationWorkflowItem | null>(null);
  const [modalHeadline, setModalHeadline] = useState<string>('');
  const [modalBody, setModalBody] = useState<string>('');
  const [modalDeepLink, setModalDeepLink] = useState<string>('');
  const [modalButtonText, setModalButtonText] = useState<string>('');
  const [modalCappingHours, setModalCappingHours] = useState<number>(24);
  const [isSavingWorkflow, setIsSavingWorkflow] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [wfList, logsList] = await Promise.all([
        growthEngineService.getAutomationWorkflows(),
        growthEngineService.getAutomationLogs(),
      ]);
      setWorkflows(wfList);
      setLogs(logsList);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi tải luồng tự động hóa';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Toggle Active/Inactive
  const handleToggle = async (id: string) => {
    try {
      const updated = await growthEngineService.toggleWorkflow(id);
      if (updated) {
        setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, isActive: updated.isActive } : w)));
      }
    } catch {
      // Ignored
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (wf: AutomationWorkflowItem) => {
    setEditingWorkflow(wf);
    setModalHeadline(wf.templateHeadline);
    setModalBody(wf.templateBody);
    setModalDeepLink(wf.actionDeepLink);
    setModalButtonText(wf.actionText);
    setModalCappingHours(wf.frequencyCappingHours);
  };

  // Handle Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkflow) return;

    setIsSavingWorkflow(true);
    try {
      const updatedItem: AutomationWorkflowItem = {
        ...editingWorkflow,
        templateHeadline: modalHeadline.trim(),
        templateBody: modalBody.trim(),
        actionDeepLink: modalDeepLink.trim(),
        actionText: modalButtonText.trim(),
        frequencyCappingHours: Number(modalCappingHours) || 24,
      };

      await growthEngineService.updateWorkflow(updatedItem);
      setWorkflows((prev) => prev.map((w) => (w.id === updatedItem.id ? updatedItem : w)));
      setEditingWorkflow(null);
      setFeedbackMessage(`Đã cập nhật kịch bản "${updatedItem.title}" thành công.`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch {
      // Ignored
    } finally {
      setIsSavingWorkflow(false);
    }
  };

  const getChannelBadge = (ch: MarketingDeliveryChannel) => {
    switch (ch) {
      case 'EMAIL':
        return (
          <span key={ch} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
            <Mail className="w-3 h-3" />
            <span>Email</span>
          </span>
        );
      case 'WEB_PUSH':
        return (
          <span key={ch} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Globe className="w-3 h-3" />
            <span>Web Push</span>
          </span>
        );
      case 'MOBILE_PUSH':
        return (
          <span key={ch} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300">
            <Smartphone className="w-3 h-3" />
            <span>Mobile Push</span>
          </span>
        );
      case 'IN_APP':
        return (
          <span key={ch} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
            <Bell className="w-3 h-3" />
            <span>In-App</span>
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse" aria-busy="true">
        <div className="h-20 rounded-xl bg-stone-100 dark:bg-stone-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-xl bg-stone-100 dark:bg-stone-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-heritage-green" aria-hidden="true" />
            <span>Luồng Tự động hóa Giữ chân & Nhắc học (Retention Workflows)</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Hệ thống tự động lắng nghe hành vi học viên và kích hoạt thông báo đa kênh theo thời gian thực thay vì gửi tay thủ công.
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

      {feedbackMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Danh sách 5 Kịch bản Tự động hóa Cốt lõi ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className={`p-5 rounded-xl border transition-all duration-150 flex flex-col justify-between space-y-4 ${
              wf.isActive
                ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs'
                : 'bg-stone-50/75 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800/60 opacity-80'
            }`}
          >
            {/* Header Kịch bản & Nút Toggle */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-heritage-green tracking-wide">
                    {wf.targetGoal}
                  </span>
                  <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
                    {wf.title}
                  </h3>
                </div>

                {/* Công tắc Bật/Tắt */}
                <button
                  type="button"
                  onClick={() => handleToggle(wf.id)}
                  title={wf.isActive ? 'Đang hoạt động - Bấm để tạm dừng' : 'Đang tạm dừng - Bấm để kích hoạt'}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-heritage-green ${
                    wf.isActive ? 'bg-heritage-green' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  role="switch"
                  aria-checked={wf.isActive}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      wf.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Điều kiện kích hoạt (Trigger) */}
              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 text-xs text-stone-700 dark:text-stone-300">
                <div className="font-semibold text-stone-800 dark:text-stone-200 mb-0.5">
                  Điều kiện kích hoạt (Trigger):
                </div>
                <div className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400">
                  {wf.triggerDescription}
                </div>
              </div>

              {/* Kênh phát tán */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-stone-400">Kênh:</span>
                {wf.channels.map(getChannelBadge)}
              </div>
            </div>

            {/* Thông số hiệu quả & Nút Tinh chỉnh */}
            <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">Đã kích hoạt</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                    {wf.stats.triggeredCount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Tỷ lệ chuyển đổi</span>
                  <span className="font-mono font-bold text-heritage-green">
                    {wf.stats.conversionRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Chống spam</span>
                  <span className="text-[11px] text-stone-500">
                    {wf.frequencyCappingHours}h
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEdit(wf)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Nội dung</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bảng Lịch sử Thực thi Tự động Gần nhất (Activity Feed) ─────────── */}
      <section className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-heritage-green" aria-hidden="true" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Nhật ký Thực thi Tự động Gần nhất
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            Hệ thống tự động chạy ngầm theo lịch Cronjob
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 dark:text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-lg">
            Chưa có lượt kích hoạt tự động nào được ghi nhận. Hệ thống sẽ tự động lưu nhật ký khi các kịch bản chạy ngầm.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-700">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-100/75 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Kịch bản Kích hoạt</th>
                  <th className="py-2.5 px-3">Học viên nhận</th>
                  <th className="py-2.5 px-3">Kênh</th>
                  <th className="py-2.5 px-3 text-right">Kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700/60 text-stone-800 dark:text-stone-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="py-2.5 px-3 text-stone-500 whitespace-nowrap">
                      {new Date(log.executedAt).toLocaleDateString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900 dark:text-stone-100">
                      {log.workflowTitle}
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{log.userName}</div>
                      <div className="text-[11px] text-stone-400">{log.userEmail}</div>
                    </td>
                    <td className="py-2.5 px-3">{getChannelBadge(log.channel)}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          log.status === 'CONVERTED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300'
                        }`}
                      >
                        {log.status === 'CONVERTED' ? 'Đã vào học ngay' : 'Đã phát thành công'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Modal Tinh chỉnh Nội dung Kịch bản ─────────────────────────────── */}
      {editingWorkflow && (
        <AdminDialog
          title={`Tinh chỉnh Kịch bản: ${editingWorkflow.title}`}
          onClose={() => setEditingWorkflow(null)}
        >
          <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-w-lg">
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs space-y-1">
              <span className="font-bold text-stone-800 dark:text-stone-200">Mục tiêu tăng trưởng:</span>
              <p className="text-stone-600 dark:text-stone-400">{editingWorkflow.targetGoal}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Tiêu đề Thông báo (Headline) *
              </label>
              <input
                type="text"
                required
                value={modalHeadline}
                onChange={(e) => setModalHeadline(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Nội dung Tin nhắn (Hỗ trợ biến động `{'{{ten_hoc_vien}}'}`) *
              </label>
              <textarea
                rows={4}
                required
                value={modalBody}
                onChange={(e) => setModalBody(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 p-3 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Đường dẫn Deep Link
                </label>
                <input
                  type="text"
                  value={modalDeepLink}
                  onChange={(e) => setModalDeepLink(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Chữ trên nút (Button Text)
                </label>
                <input
                  type="text"
                  value={modalButtonText}
                  onChange={(e) => setModalButtonText(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Giãn cách Chống làm phiền (Frequency Capping - Giờ)
              </label>
              <input
                type="number"
                min={1}
                max={720}
                value={modalCappingHours}
                onChange={(e) => setModalCappingHours(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Không gửi lặp lại thông báo này cho cùng một học viên trong khoảng thời gian trên.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setEditingWorkflow(null)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSavingWorkflow}
                className="px-4 py-1.5 rounded-lg bg-heritage-green text-white text-xs font-bold hover:bg-heritage-green/90 transition-colors disabled:opacity-50"
              >
                {isSavingWorkflow ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </AdminDialog>
      )}
    </div>
  );
};
