import React, { useState, useEffect } from 'react';
import {
  Cpu,
  BarChart3,
  Sliders,
  Volume2,
  History,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';
import { AiOverviewSubView } from './AiOverviewSubView';
import { AiPromptStudioView } from './AiPromptStudioView';
import { AiProvidersSubView } from './AiProvidersSubView';
import { AiTtsSubView } from './AiTtsSubView';
import { AiLogsSubView } from './AiLogsSubView';

export type AiSubRouteKey = 'overview' | 'prompts' | 'providers' | 'tts' | 'logs';

export interface AiConfigManagementViewProps {
  activeSubRoute?: AiSubRouteKey;
}

export const AiConfigManagementView: React.FC<AiConfigManagementViewProps> = ({
  activeSubRoute = 'overview',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = resolveLanguage(lang);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleNotify = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const navItems: { key: AiSubRouteKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'overview', label: 'Tổng quan & Chi phí', icon: BarChart3 },
    { key: 'prompts', label: 'Kho System Prompts', icon: Sliders },
    { key: 'providers', label: 'Mô hình & Khóa API', icon: Cpu },
    { key: 'tts', label: 'Giọng đọc & Phát âm TTS', icon: Volume2 },
    { key: 'logs', label: 'Nhật ký & Giám sát', icon: History },
  ];

  return (
    <div className="w-full space-y-5 pb-12">
      {/* ── Toast Notification Bar ─────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-md animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 text-red-900 border border-red-300 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-[11px] font-bold hover:underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* ── Sub-view Render based on Active Sub-Route ────────────────────────── */}
      {activeSubRoute === 'overview' && <AiOverviewSubView onNotify={handleNotify} />}
      {activeSubRoute === 'prompts' && <AiPromptStudioView onNotify={handleNotify} />}
      {activeSubRoute === 'providers' && <AiProvidersSubView onNotify={handleNotify} />}
      {activeSubRoute === 'tts' && <AiTtsSubView onNotify={handleNotify} />}
      {activeSubRoute === 'logs' && <AiLogsSubView onNotify={handleNotify} />}
    </div>
  );
};

export default AiConfigManagementView;
