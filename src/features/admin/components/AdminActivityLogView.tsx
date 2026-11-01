import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

export type LogEventType =
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'POST_CREATE'
  | 'POST_UPDATE'
  | 'POST_DELETE'
  | 'USER_ROLE_CHANGE'
  | 'JOURNEY_UPDATE'
  | 'SYSTEM_CACHE_FLUSH'
  | 'SYSTEM_SYNC';

export interface ActivityActor {
  id: string;
  email: string;
  role: string;
  ipAddress?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  eventType: LogEventType;
  level: LogLevel;
  actor: ActivityActor;
  action: string;
  target?: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: Record<string, unknown>;
}

const INITIAL_LOGS: ActivityLogItem[] = [
  {
    id: 'log-001',
    timestamp: '2026-11-01T07:20:15Z',
    eventType: 'POST_UPDATE',
    level: 'AUDIT',
    actor: {
      id: 'usr-admin-01',
      email: 'admin@viecultures.com',
      role: 'ADMIN',
      ipAddress: '192.168.1.10',
    },
    action: 'Cập nhật nội dung bài đọc',
    target: 'reading-post-104',
    status: 'SUCCESS',
    details: {
      postTitle: 'Nghệ thuật làm gốm Bát Tràng',
      fieldChanged: 'level',
      previousValue: 'B1',
      newValue: 'B2',
      updatedBy: 'admin@viecultures.com',
    },
  },
  {
    id: 'log-002',
    timestamp: '2026-11-01T07:15:42Z',
    eventType: 'USER_ROLE_CHANGE',
    level: 'WARN',
    actor: {
      id: 'usr-admin-01',
      email: 'admin@viecultures.com',
      role: 'ADMIN',
      ipAddress: '192.168.1.10',
    },
    action: 'Nâng cấp quyền tài khoản người dùng',
    target: 'usr-test-88',
    status: 'SUCCESS',
    details: {
      targetEmail: 'editor@viecultures.com',
      previousRole: 'LEARNER',
      assignedRole: 'STAFF',
      grantedPermissions: ['POST_CREATE', 'POST_EDIT'],
    },
  },
  {
    id: 'log-003',
    timestamp: '2026-11-01T06:58:10Z',
    eventType: 'JOURNEY_UPDATE',
    level: 'INFO',
    actor: {
      id: 'usr-staff-03',
      email: 'content.lead@viecultures.com',
      role: 'STAFF',
      ipAddress: '192.168.1.14',
    },
    action: 'Cập nhật cấu trúc trạm hành trình',
    target: 'journey-mien-bac',
    status: 'SUCCESS',
    details: {
      journeyId: 'journey-north',
      reorderedNodesCount: 8,
      milestoneTitle: 'Chinh phục Đất Tổ Phú Thọ',
    },
  },
  {
    id: 'log-004',
    timestamp: '2026-11-01T06:40:00Z',
    eventType: 'SYSTEM_CACHE_FLUSH',
    level: 'INFO',
    actor: {
      id: 'sys-cron',
      email: 'system.daemon@viecultures.internal',
      role: 'SYSTEM',
    },
    action: 'Xóa bộ nhớ đệm danh mục khám phá',
    target: 'cache-discovery-tree',
    status: 'SUCCESS',
    details: {
      cacheKeysCleared: 142,
      durationMs: 48,
      triggeredBy: 'SCHEDULED_JOB',
    },
  },
  {
    id: 'log-005',
    timestamp: '2026-11-01T06:22:18Z',
    eventType: 'POST_DELETE',
    level: 'AUDIT',
    actor: {
      id: 'usr-admin-01',
      email: 'admin@viecultures.com',
      role: 'ADMIN',
      ipAddress: '192.168.1.10',
    },
    action: 'Xóa bài viết nháp đã hủy',
    target: 'reading-post-099',
    status: 'SUCCESS',
    details: {
      postTitle: 'Bản thảo thử nghiệm di sản Ca trù',
      reason: 'Trùng lặp nội dung với bài chính thức',
    },
  },
  {
    id: 'log-006',
    timestamp: '2026-11-01T05:45:09Z',
    eventType: 'AUTH_LOGIN',
    level: 'WARN',
    actor: {
      id: 'usr-guest-99',
      email: 'unknown.operator@external.net',
      role: 'ANONYMOUS',
      ipAddress: '203.113.152.8',
    },
    action: 'Đăng nhập trang quản trị thất bại',
    target: 'auth-gateway',
    status: 'FAILED',
    details: {
      failureReason: 'Mật khẩu không chính xác vượt quá 3 lần',
      ipBlockedTemporary: false,
    },
  },
  {
    id: 'log-007',
    timestamp: '2026-11-01T05:00:00Z',
    eventType: 'SYSTEM_SYNC',
    level: 'INFO',
    actor: {
      id: 'sys-sync',
      email: 'sync.worker@viecultures.internal',
      role: 'SYSTEM',
    },
    action: 'Đồng bộ điểm văn hóa từ dữ liệu gốc',
    target: 'service-curator',
    status: 'SUCCESS',
    details: {
      syncedRecords: 320,
      validationPassed: true,
    },
  },
];

export const AdminActivityLogView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>(INITIAL_LOGS);
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedEventType !== 'ALL' && log.eventType !== selectedEventType) {
        return false;
      }
      if (selectedLevel !== 'ALL' && log.level !== selectedLevel) {
        return false;
      }
      if (selectedStatus !== 'ALL' && log.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesActor = log.actor.email.toLowerCase().includes(q);
        const matchesTarget = (log.target || '').toLowerCase().includes(q);
        const matchesType = log.eventType.toLowerCase().includes(q);
        return matchesAction || matchesActor || matchesTarget || matchesType;
      }
      return true;
    });
  }, [logs, selectedEventType, selectedLevel, selectedStatus, searchQuery]);

  const handleRefresh = () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setLogs(INITIAL_LOGS);
        setIsLoading(false);
      }, 300);
    } catch (err) {
      console.error('Lỗi khi làm mới nhật ký hành vi:', err);
      setIsLoading(false);
    }
  };

  const handleCopyJson = (details: Record<string, unknown>) => {
    try {
      const formatted = JSON.stringify(details, null, 2);
      navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Lỗi sao chép JSON:', err);
    }
  };

  const getLevelBadgeClass = (level: LogLevel) => {
    switch (level) {
      case 'AUDIT':
        return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-300';
      case 'WARN':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'ERROR':
        return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-300';
      case 'INFO':
      default:
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-300';
    }
  };

  const getStatusBadgeClass = (status: 'SUCCESS' | 'WARNING' | 'FAILED') => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'WARNING':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'FAILED':
        return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Summary Counters ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="text-text-muted text-xs font-semibold">Tổng bản ghi sự kiện</div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
            {logs.length}
          </div>
          <p className="text-[11px] text-text-secondary">Hoạt động trong 24 giờ qua</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="text-text-muted text-xs font-semibold">Kiểm toán can thiệp</div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-purple-700 dark:text-purple-400">
            {logs.filter((l) => l.level === 'AUDIT').length}
          </div>
          <p className="text-[11px] text-text-secondary">Sửa đổi nội dung & phân quyền</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="text-text-muted text-xs font-semibold">Cảnh báo bảo mật</div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-amber-700 dark:text-amber-400">
            {logs.filter((l) => l.level === 'WARN').length}
          </div>
          <p className="text-[11px] text-text-secondary">Cần giám sát định kỳ</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="text-text-muted text-xs font-semibold">Tỷ lệ thành công</div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
            {Math.round(
              (logs.filter((l) => l.status === 'SUCCESS').length / (logs.length || 1)) * 100
            )}
            %
          </div>
          <p className="text-[11px] text-text-secondary">Thao tác thực thi hợp lệ</p>
        </div>
      </div>

      {/* ── Filters Section ─────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tác nhân, hành động hoặc mục tiêu..."
            className="w-full px-3.5 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
          >
            <option value="ALL">Tất cả loại sự kiện</option>
            <option value="AUTH_LOGIN">AUTH_LOGIN</option>
            <option value="POST_CREATE">POST_CREATE</option>
            <option value="POST_UPDATE">POST_UPDATE</option>
            <option value="POST_DELETE">POST_DELETE</option>
            <option value="USER_ROLE_CHANGE">USER_ROLE_CHANGE</option>
            <option value="JOURNEY_UPDATE">JOURNEY_UPDATE</option>
            <option value="SYSTEM_CACHE_FLUSH">SYSTEM_CACHE_FLUSH</option>
            <option value="SYSTEM_SYNC">SYSTEM_SYNC</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
          >
            <option value="ALL">Mọi cấp độ</option>
            <option value="INFO">INFO</option>
            <option value="AUDIT">AUDIT</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
          >
            <option value="ALL">Mọi trạng thái</option>
            <option value="SUCCESS">Thành công</option>
            <option value="WARNING">Cảnh báo</option>
            <option value="FAILED">Thất bại</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
      </div>

      {/* ── Main Layout: Table and JSON Inspector ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Column */}
        <div className={`overflow-hidden rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm ${selectedLog ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-heritage-green/10 dark:bg-white/5 border-b border-antique-gold/20 text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Thời gian</th>
                  <th className="py-3.5 px-4">Sự kiện</th>
                  <th className="py-3.5 px-4">Cấp độ</th>
                  <th className="py-3.5 px-4">Tác nhân</th>
                  <th className="py-3.5 px-4">Thao tác</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-antique-gold/15">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-text-muted">
                      Không tìm thấy bản ghi nhật ký phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((item) => {
                    const isSelected = selectedLog?.id === item.id;
                    const dateFormatted = new Date(item.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    });

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedLog(item)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-antique-gold/15 dark:bg-white/10'
                            : 'hover:bg-warm-ivory/60 dark:hover:bg-white/5'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono text-[11px] text-text-secondary">
                          {dateFormatted}
                        </td>
                        <td className="py-3.5 px-4 font-semibold font-mono text-[11px] text-heritage-green dark:text-antique-bright">
                          {item.eventType}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadgeClass(
                              item.level
                            )}`}
                          >
                            {item.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-text-body dark:text-warm-ivory max-w-[140px] truncate" title={item.actor.email}>
                          {item.actor.email}
                        </td>
                        <td className="py-3.5 px-4 text-text-secondary max-w-[200px] truncate" title={item.action}>
                          {item.action}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(item);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-heritage-green/10 hover:bg-heritage-green text-heritage-dark hover:text-warm-ivory dark:text-warm-ivory text-[10px] font-bold transition-all cursor-pointer"
                          >
                            {isSelected ? 'Đang chọn' : 'Xem JSON'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Inspector Panel Column */}
        <AnimatePresence>
          {selectedLog && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/80 border border-antique-gold/40 p-5 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-antique-gold/25 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-antique-gold">
                    Chi tiết bản ghi
                  </div>
                  <h4 className="font-heading font-bold text-sm text-text-body dark:text-warm-ivory">
                    {selectedLog.eventType}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyJson(selectedLog.details)}
                    className="px-2.5 py-1 rounded-lg bg-antique-gold/20 hover:bg-antique-gold text-heritage-dark text-[11px] font-bold transition-all cursor-pointer"
                  >
                    {copied ? 'Đã sao chép' : 'Sao chép JSON'}
                  </button>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-antique-gold/15">
                  <span className="text-text-muted">Mã bản ghi:</span>
                  <span className="font-mono font-semibold">{selectedLog.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-antique-gold/15">
                  <span className="text-text-muted">Thời gian ghi nhận:</span>
                  <span className="font-mono">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-antique-gold/15">
                  <span className="text-text-muted">Tác nhân thực hiện:</span>
                  <span className="font-semibold">{selectedLog.actor.email} ({selectedLog.actor.role})</span>
                </div>
                {selectedLog.actor.ipAddress && (
                  <div className="flex justify-between py-1 border-b border-antique-gold/15">
                    <span className="text-text-muted">Địa chỉ IP:</span>
                    <span className="font-mono">{selectedLog.actor.ipAddress}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-antique-gold/15">
                  <span className="text-text-muted">Hành động:</span>
                  <span>{selectedLog.action}</span>
                </div>
                {selectedLog.target && (
                  <div className="flex justify-between py-1 border-b border-antique-gold/15">
                    <span className="text-text-muted">Mục tiêu tác động:</span>
                    <span className="font-mono text-heritage-green dark:text-antique-bright">{selectedLog.target}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-antique-gold/15">
                  <span className="text-text-muted">Trạng thái:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(selectedLog.status)}`}>
                    {selectedLog.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                  Dữ liệu trọng tải (Payload JSON)
                </div>
                <pre className="p-3.5 rounded-2xl bg-heritage-forest text-warm-ivory font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72 border border-antique-gold/30">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminActivityLogView;
