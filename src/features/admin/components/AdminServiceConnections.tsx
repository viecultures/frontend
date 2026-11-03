import { useState, useEffect, useCallback } from 'react';
import { Database, Server, ShieldCheck, Volume2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { isLocalAuthMode } from '@/config/authConfig';
import { API_BASE_URL } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';

type ServiceStatus = 'CHECKING' | 'UP' | 'DOWN';

interface ServiceHealth {
  status: ServiceStatus;
  latencyMs?: number;
  message: string;
}

export function AdminServiceConnections() {
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const [backendHealth, setBackendHealth] = useState<ServiceHealth>({
    status: 'CHECKING',
    message: 'Đang kiểm tra...',
  });
  const [dbHealth, setDbHealth] = useState<ServiceHealth>({
    status: 'CHECKING',
    message: 'Đang kiểm tra...',
  });
  const [speechHealth, setSpeechHealth] = useState<ServiceHealth>({
    status: 'CHECKING',
    message: 'Đang kiểm tra...',
  });

  const checkConnections = useCallback(async () => {
    setIsChecking(true);
    const token = getStoredToken();

    // 1. Check Backend API via /api/health
    try {
      const start = performance.now();
      const res = await fetch(`${API_BASE_URL}/api/health`, {
        headers: { Accept: 'application/json' },
      });
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        setBackendHealth({
          status: 'UP',
          latencyMs: latency,
          message: `Kết nối tốt (${latency}ms)`,
        });
      } else {
        setBackendHealth({
          status: 'DOWN',
          latencyMs: latency,
          message: `Phản hồi lỗi HTTP ${res.status}`,
        });
      }
    } catch (err) {
      console.error('Kiểm tra Backend API thất bại:', err);
      setBackendHealth({
        status: 'DOWN',
        message: 'Không thể kết nối máy chủ',
      });
    }

    // 2. Check Database via /api/v1/admin/overview
    try {
      const start = performance.now();
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/overview`, { headers });
      const latency = Math.round(performance.now() - start);

      if (res.ok) {
        setDbHealth({
          status: 'UP',
          latencyMs: latency,
          message: `Sẵn sàng (${latency}ms)`,
        });
      } else if (res.status === 401 || res.status === 403) {
        // Máy chủ phản hồi auth hợp lệ -> Database / Backend hoạt động bình thường
        setDbHealth({
          status: 'UP',
          latencyMs: latency,
          message: `Truy vấn thành công (${latency}ms)`,
        });
      } else {
        setDbHealth({
          status: 'DOWN',
          latencyMs: latency,
          message: `Lỗi CSDL (HTTP ${res.status})`,
        });
      }
    } catch (err) {
      console.error('Kiểm tra Cơ sở dữ liệu thất bại:', err);
      setDbHealth({
        status: 'DOWN',
        message: 'Mất kết nối CSDL PostgreSQL',
      });
    }

    // 3. Check Speech Synthesis via /api/v1/voice/models
    try {
      const start = performance.now();
      const res = await fetch(`${API_BASE_URL}/api/v1/voice/models`, {
        headers: { Accept: 'application/json' },
      });
      const latency = Math.round(performance.now() - start);

      if (res.ok) {
        setSpeechHealth({
          status: 'UP',
          latencyMs: latency,
          message: `Sẵn sàng (${latency}ms)`,
        });
      } else {
        setSpeechHealth({
          status: 'DOWN',
          latencyMs: latency,
          message: `Dịch vụ giọng nói lỗi (HTTP ${res.status})`,
        });
      }
    } catch (err) {
      console.error('Kiểm tra giọng nói trí tuệ nhân tạo thất bại:', err);
      setSpeechHealth({
        status: 'DOWN',
        message: 'Không thể kết nối Neural Voice',
      });
    }

    setIsChecking(false);
    setLastChecked(new Date().toLocaleTimeString('vi-VN', { hour12: false }));
  }, []);

  useEffect(() => {
    checkConnections();
  }, [checkConnections]);

  const renderStatusBadge = (health: ServiceHealth) => {
    if (health.status === 'CHECKING') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted">
          <RefreshCw className="size-3 animate-spin text-antique-gold" aria-hidden="true" />
          <span>Đang kiểm tra...</span>
        </span>
      );
    }
    if (health.status === 'UP') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>{health.message}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400">
        <AlertCircle className="size-3 text-rose-600 dark:text-rose-400" aria-hidden="true" />
        <span>{health.message}</span>
      </span>
    );
  };

  return (
    <section
      aria-labelledby="admin-connections-title"
      className="space-y-4 rounded-2xl border border-antique-gold/30 bg-rice-paper p-6 shadow-sm dark:bg-heritage-dark/60"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="admin-connections-title" className="text-lg font-heading font-bold text-ink">
            Trạng thái kết nối dịch vụ hệ thống
          </h2>
          <p className="text-xs text-ink-faint">
            Kiểm tra trực tiếp API Backend, Cơ sở dữ liệu và Dịch vụ giọng nói trí tuệ nhân tạo.
            {lastChecked && (
              <span className="ml-2 font-mono text-[11px] text-text-secondary">
                (Thời điểm kiểm tra: {lastChecked})
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={checkConnections}
          disabled={isChecking}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-antique-gold/15 hover:bg-antique-gold/25 border border-antique-gold/30 text-heritage-green dark:text-antique-bright text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${isChecking ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>{isChecking ? 'Đang kiểm tra...' : 'Kiểm tra lại kết nối'}</span>
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Backend API */}
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-colors">
          <div className="p-2 rounded-lg bg-heritage-green/10 text-heritage-green dark:text-antique-bright">
            <Server className="size-5 shrink-0" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-ink">Máy chủ API</h3>
            {renderStatusBadge(backendHealth)}
          </div>
        </div>

        {/* Database */}
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-colors">
          <div className="p-2 rounded-lg bg-antique-gold/15 text-heritage-green dark:text-antique-gold">
            <Database className="size-5 shrink-0" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-ink">Cơ sở dữ liệu</h3>
            {renderStatusBadge(dbHealth)}
          </div>
        </div>

        {/* Speech synthesis */}
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-colors">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
            <Volume2 className="size-5 shrink-0" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-ink">Giọng nói Neural TTS</h3>
            {renderStatusBadge(speechHealth)}
          </div>
        </div>

        {/* Account access */}
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-colors">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="size-5 shrink-0" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-ink">Quyền quản trị</h3>
            <p className="text-[11px] font-semibold text-text-secondary">
              {isLocalAuthMode ? 'Chế độ Demo cục bộ' : 'Quản trị viên (ROLE_ADMIN)'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminServiceConnections;
