/**
 * MapAiDebugDrawer
 *
 * Left-Sidebar Diagnostic & Simulation Hub for Vietnam Map AI Tutor.
 * In-flow layout on the far left, guaranteeing ZERO overlap on Chat or Vietnam Map.
 * Strictly adheres to Lucide React SVG iconography (0 emojis).
 */

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Wrench,
  X,
  Trash2,
  Copy,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Play,
  Volume2,
  Radio,
  MapPin,
  Compass,
  BookOpen,
  Sparkles,
  Terminal,
} from 'lucide-react';
import {
  useMapAiDebugStore,
  debugLog,
  isMapAiDebugEnabled,
  type DebugLogEntry,
  type LogCategory,
  type LogLevel,
} from '../lib/debug-logger';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { useMapStore, useSettings } from '../lib/state';
import { toolRegistry } from '../lib/tools/tool-registry';

export interface MapAiDebugDrawerProps {
  mode?: 'button' | 'panel' | 'all';
}

export const MapAiDebugDrawer: React.FC<MapAiDebugDrawerProps> = ({ mode = 'all' }) => {
  if (!isMapAiDebugEnabled()) {
    return null;
  }

  return <MapAiDebugDrawerInner mode={mode} />;
};

function MapAiDebugDrawerInner({ mode }: { mode: 'button' | 'panel' | 'all' }) {
  const {
    logs,
    isDrawerOpen,
    activeTab,
    selectedCategory,
    searchQuery,
    errorCount,
    toggleDrawer,
    setDrawerOpen,
    setActiveTab,
    setSelectedCategory,
    setSearchQuery,
    clearLogs,
  } = useMapAiDebugStore();

  const { activeView, connected, client, volume } = useLiveAPIContext();
  const { cameraTarget, highlightedPlaceId, markers } = useMapStore();
  const { model, activeLessonId, proficiencyLevel } = useSettings();

  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [simRunning, setSimRunning] = useState<string | null>(null);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (selectedCategory !== 'all' && log.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesMsg = log.message.toLowerCase().includes(query);
        const matchesData = log.data
          ? JSON.stringify(log.data).toLowerCase().includes(query)
          : false;
        return matchesMsg || matchesData;
      }
      return true;
    });
  }, [logs, selectedCategory, searchQuery]);

  // Copy logs as text / JSON
  const handleCopyLogs = async () => {
    try {
      const formatted = JSON.stringify(logs, null, 2);
      await navigator.clipboard.writeText(formatted);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy logs', err);
    }
  };

  // Download logs as JSON file
  const handleDownloadLogs = () => {
    const jsonString = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        systemState: {
          wsConnected: connected,
          model,
          activeLessonId,
          proficiencyLevel,
          highlightedPlaceId,
          cameraTarget,
        },
        logs,
      },
      null,
      2
    );
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `map-ai-trace-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simulator runner
  const runSimulation = async (
    name: string,
    action: () => Promise<unknown> | void
  ) => {
    if (!activeView) return;
    setSimRunning(name);
    debugLog.info(`Bắt đầu chạy giả lập: [${name}]`);
    try {
      const res = await action();
      debugLog.info(`Giả lập [${name}] hoàn tất`, res);
    } catch (err) {
      debugLog.error(`Giả lập [${name}]`, err);
    } finally {
      setSimRunning(null);
    }
  };

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            ERR
          </span>
        );
      case 'warn':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            WARN
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            OK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            <Info className="w-3 h-3 text-cyan-400" />
            INFO
          </span>
        );
    }
  };

  const getCategoryBadge = (category: LogCategory) => {
    const colors: Record<LogCategory, string> = {
      asr: 'text-pink-300 bg-pink-950/60 border-pink-800',
      ws: 'text-purple-300 bg-purple-950/60 border-purple-800',
      audio: 'text-sky-300 bg-sky-950/60 border-sky-800',
      tool: 'text-amber-300 bg-amber-950/60 border-amber-800',
      map: 'text-emerald-300 bg-emerald-950/60 border-emerald-800',
      system: 'text-slate-300 bg-slate-900 border-slate-700',
    };
    return (
      <span
        className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase border ${
          colors[category] || colors.system
        }`}
      >
        {category}
      </span>
    );
  };

  if (!activeView) return null;

  const showButton = (mode === 'button' || mode === 'all') && !isDrawerOpen;
  const showPanel = (mode === 'panel' || mode === 'all') && isDrawerOpen;

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Docked bottom-left when closed) */}
      {showButton && (
        <button
          onClick={toggleDrawer}
          className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0c1422] text-slate-300 border border-[#223854] shadow-xl hover:border-amber-400/80 hover:text-white transition-all cursor-pointer backdrop-blur-md font-mono text-xs"
          title="Mở Bảng Điều Khiển &amp; Debug Hub (Dev Mode)"
          aria-label="Mở Bảng Điều Khiển &amp; Debug Hub"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold tracking-wider">AI MAP HUB</span>

          {/* Connection Dot */}
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
          />

          {/* Error Counter Badge */}
          {errorCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
              {errorCount}
            </span>
          )}
        </button>
      )}

      {/* DOCKED LEFT HUB PANEL (In-flow column on the far left) */}
      {showPanel && (
        <aside className="w-80 sm:w-96 shrink-0 h-full border-r border-[#1b2b40] bg-[#080d16] text-slate-200 shadow-xl flex flex-col font-sans select-text z-20 overflow-hidden">
          {/* HEADER ROW 1: Brand Title, WS Badge & Close Button */}
          <div className="h-12 px-3.5 border-b border-[#1b2b40] bg-[#0c1320] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">
                  AI MAP HUB
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                  DEV
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Live WS Status Badge */}
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                  connected
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : 'bg-rose-950/60 text-rose-300 border-rose-800'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    connected ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <span>{connected ? 'WS LIVE' : 'WS OFF'}</span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Đóng Hub Điều Khiển"
                aria-label="Đóng Hub Điều Khiển"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* HEADER ROW 2: Segmented Tabs Navigation Bar (Full Width, Equal Columns) */}
          <div className="px-3 py-2 border-b border-[#1b2b40] bg-[#090f1a] shrink-0">
            <div className="grid grid-cols-3 gap-1 bg-[#060a12] p-1 rounded-lg border border-[#162335]">
              {/* Tab 1: Simulator */}
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'simulator'
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1726]'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 shrink-0" />
                <span>Giả Lập</span>
              </button>

              {/* Tab 2: Trace Logs */}
              <button
                onClick={() => setActiveTab('logs')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'logs'
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1726]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 shrink-0" />
                <span>Nhật Ký</span>
                {logs.length > 0 && (
                  <span
                    className={`px-1 py-0.2 rounded text-[10px] font-mono ${
                      activeTab === 'logs'
                        ? 'bg-black/20 text-black'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {logs.length}
                  </span>
                )}
              </button>

              {/* Tab 3: Health */}
              <button
                onClick={() => setActiveTab('health')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'health'
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1726]'
                }`}
              >
                <Activity className="w-3.5 h-3.5 shrink-0" />
                <span>Hệ Thống</span>
              </button>
            </div>
          </div>

          {/* HUB BODY (Scrollable content) */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3.5">
            {/* 1. SIMULATOR TAB */}
            {activeTab === 'simulator' && (
              <div className="space-y-3.5">
                {/* Section 1: Map Tools Simulator */}
                <div className="p-3 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Highlight Province</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Highlight Hà Nội', async () => {
                          return await toolRegistry.highlightMapProvince({
                            provinceName: 'Hà Nội',
                            culturalTopic: 'Phở & Cốm Làng Vòng',
                          });
                        })
                      }
                      className="px-2 py-1.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-xs font-medium text-left cursor-pointer transition-colors"
                    >
                      Hà Nội
                    </button>

                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Highlight Đà Nẵng', async () => {
                          return await toolRegistry.highlightMapProvince({
                            provinceName: 'Đà Nẵng',
                            culturalTopic: 'Cầu Rồng & Ngũ Hành Sơn',
                          });
                        })
                      }
                      className="px-2 py-1.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-xs font-medium text-left cursor-pointer transition-colors"
                    >
                      Đà Nẵng
                    </button>

                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Highlight TP. Hồ Chí Minh', async () => {
                          return await toolRegistry.highlightMapProvince({
                            provinceName: 'TP. Hồ Chí Minh',
                            culturalTopic: 'Chợ Bến Thành',
                          });
                        })
                      }
                      className="px-2 py-1.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-xs font-medium text-left cursor-pointer transition-colors"
                    >
                      TP. HCM
                    </button>

                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Highlight Bắc Ninh', async () => {
                          return await toolRegistry.highlightMapProvince({
                            provinceName: 'Bắc Ninh',
                            culturalTopic: 'Dân ca Quan họ',
                          });
                        })
                      }
                      className="px-2 py-1.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300 hover:bg-amber-900 text-xs font-medium text-left cursor-pointer transition-colors"
                    >
                      Bắc Ninh
                    </button>
                  </div>
                </div>

                {/* Section 2: Region Focus Simulator */}
                <div className="p-3 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
                  <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Focus Map Region</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Focus Miền Bắc', async () => {
                          return await toolRegistry.focusMapRegion({ region: 'north' });
                        })
                      }
                      className="px-2 py-1.5 rounded bg-sky-950/60 border border-sky-800 text-sky-300 hover:bg-sky-900 text-xs font-medium text-left cursor-pointer transition-colors"
                    >
                      Miền Bắc
                    </button>

                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Focus Miền Trung', async () => {
                          return await toolRegistry.focusMapRegion({ region: 'central' });
                        })
                      }
                      className="px-2 py-1.5 rounded bg-sky-950/60 border border-sky-800 text-sky-300 hover:bg-sky-900 text-xs font-medium text-left cursor-pointer transition-colors"
                    >
                      Miền Trung
                    </button>

                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Focus Miền Nam', async () => {
                          return await toolRegistry.focusMapRegion({ region: 'south' });
                        })
                      }
                      className="px-2 py-1.5 rounded bg-sky-950/60 border border-sky-800 text-sky-300 hover:bg-sky-900 text-xs font-medium text-left cursor-pointer transition-colors"
                    >
                      Miền Nam
                    </button>

                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Reset Toàn Quốc', async () => {
                          return await toolRegistry.focusMapRegion({ region: 'all' });
                        })
                      }
                      className="px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium text-left cursor-pointer transition-colors"
                    >
                      Toàn Quốc
                    </button>
                  </div>
                </div>

                {/* Section 3: Pedagogical Lesson Tools */}
                <div className="p-3 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lesson Plans &amp; Vocab</span>
                  </h4>
                  <div className="space-y-1.5">
                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Load Plan: Phở Hà Nội', async () => {
                          return await toolRegistry.loadLessonDiscussionPlan({
                            lessonId: 'pho-hanoi-history',
                            level: 'Level 2',
                          });
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-amber-950/50 border border-amber-800 text-amber-300 hover:bg-amber-900 text-xs font-medium text-left cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <span>Plan: Phở Hà Nội</span>
                      <Play className="w-3 h-3" />
                    </button>

                    <button
                      disabled={!!simRunning}
                      onClick={() =>
                        runSimulation('Thẻ Từ Vựng Quan Họ', async () => {
                          return await toolRegistry.displayCulturalVocab({
                            word: 'antiphonal singing',
                            ipa: '/ænˈtɪfənəl ˈsɪŋɪŋ/',
                            vietnameseMeaning: 'Hát đối đáp giao duyên Quan họ',
                            exampleSentence:
                              'Quan họ is famous for its lyrical antiphonal singing between male and female troupes.',
                          });
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-cyan-950/50 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-medium text-left cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <span>Thẻ từ vựng Quan họ</span>
                      <Play className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Section 4: Speech Assessment Simulator */}
                <div className="p-3 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Speech Evaluation</span>
                  </h4>
                  <button
                    disabled={!!simRunning}
                    onClick={() =>
                      runSimulation('Đánh Giá Luyện Nói Mẫu', async () => {
                        return await toolRegistry.evaluateSpeechOrGrammar({
                          learnerUtterance:
                            'I want to know about Quan Ho folk singing in Bac Ninh.',
                          correctionSuggestion:
                            'Natural phrasing: "Could you share the cultural origins of Quan họ singing?"',
                          scoreOutOf10: 9,
                          positiveEncouragement:
                            'Excellent pronunciation of Vietnamese cultural heritage terms!',
                        });
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded bg-rose-950/40 border border-rose-800 text-rose-300 hover:bg-rose-900 text-xs font-medium text-left cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <span>Mô Phỏng Sửa Lỗi Nói</span>
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. TRACE LOGS TAB */}
            {activeTab === 'logs' && (
              <div className="space-y-2.5">
                {/* Search & Actions Bar */}
                <div className="space-y-2">
                  <div className="relative w-full">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Tìm log, transcript, tool..."
                      className="w-full bg-[#0e1625] border border-[#1b2b40] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px] font-mono">
                    {(
                      [
                        'all',
                        'asr',
                        'tool',
                        'ws',
                        'audio',
                        'map',
                        'system',
                      ] as const
                    ).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-0.5 rounded cursor-pointer uppercase transition-colors shrink-0 ${
                          selectedCategory === cat
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-[#0e1625] text-slate-400 border border-[#1b2b40] hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopyLogs}
                        className="px-2 py-1 rounded bg-[#0e1625] border border-[#1b2b40] text-slate-300 hover:text-white hover:bg-slate-800 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Sao chép logs"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copySuccess ? 'Đã chép' : 'Chép'}</span>
                      </button>

                      <button
                        onClick={handleDownloadLogs}
                        className="px-2 py-1 rounded bg-[#0e1625] border border-[#1b2b40] text-slate-300 hover:text-white hover:bg-slate-800 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Tải JSON"
                      >
                        <Download className="w-3 h-3" />
                        <span>Tải</span>
                      </button>
                    </div>

                    <button
                      onClick={clearLogs}
                      className="p-1 rounded bg-[#0e1625] border border-[#1b2b40] text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-[11px] transition-colors cursor-pointer"
                      title="Xóa logs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Log Event Stream */}
                {filteredLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono">
                    Chưa có nhật ký nào phù hợp.
                  </div>
                ) : (
                  <div className="space-y-1 font-mono text-[11px]">
                    {filteredLogs.map(log => {
                      const isExpanded = expandedLogId === log.id;
                      const hasData =
                        log.data !== undefined && log.data !== null;

                      return (
                        <div
                          key={log.id}
                          className={`p-2 rounded-md border transition-all ${
                            log.level === 'error'
                              ? 'bg-rose-950/20 border-rose-800/60'
                              : log.level === 'warn'
                              ? 'bg-amber-950/20 border-amber-800/60'
                              : log.level === 'success'
                              ? 'bg-emerald-950/15 border-emerald-800/40'
                              : log.category === 'asr'
                              ? 'bg-pink-950/15 border-pink-800/40'
                              : 'bg-[#0d1422] border-[#182638]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-slate-500 text-[10px]">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              {getLevelBadge(log.level)}
                              {getCategoryBadge(log.category)}
                              <span className="text-slate-200 break-words font-medium">
                                {log.message}
                              </span>
                            </div>

                            {hasData && (
                              <button
                                onClick={() =>
                                  setExpandedLogId(isExpanded ? null : log.id)
                                }
                                className="text-slate-400 hover:text-white p-0.5 cursor-pointer shrink-0"
                                title="Xem payload"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Expanded JSON Payload */}
                          {isExpanded && hasData && (
                            <div className="mt-2 p-2 rounded bg-[#060a12] border border-[#172435] overflow-x-auto text-[10px] text-amber-200">
                              <pre>{JSON.stringify(log.data, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. SYSTEM HEALTH TAB */}
            {activeTab === 'health' && (
              <div className="space-y-3">
                {/* WebSocket Card */}
                <div className="p-3 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-purple-400" />
                      Gemini Live WebSocket
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        connected
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {connected ? 'CONNECTED' : 'OFF'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono space-y-1 bg-[#090e17] p-2 rounded border border-[#1b2b40]">
                    <div>
                      <span className="text-slate-500">Model: </span>
                      <span className="text-slate-200 font-bold truncate">
                        {model}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Status: </span>
                      <span className="text-slate-200 font-bold">
                        {client.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audio Resampling Card */}
                <div className="p-3 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                      Audio Resampler Worklet
                    </span>
                    <span className="text-[10px] font-mono text-sky-400">
                      16kHz PCM16
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Live Volume:</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-400 transition-all duration-75"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, volume * 200)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Vector Map State Card */}
                <div className="p-3 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      Vector Map State
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      {cameraTarget?.region || 'all'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono space-y-1 bg-[#090e17] p-2 rounded border border-[#1b2b40]">
                    <div>
                      <span className="text-slate-500">Tỉnh chọn: </span>
                      <span className="text-amber-300 font-bold truncate">
                        {highlightedPlaceId || 'None'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Markers: </span>
                      <span className="text-slate-200 font-bold">
                        {markers.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lesson & Level Card */}
                <div className="p-3 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      Bài Học &amp; Trình Độ
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">
                      {proficiencyLevel}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono bg-[#090e17] p-2 rounded border border-[#1b2b40] text-slate-300 truncate">
                    Lesson: <span className="text-white font-bold">{activeLessonId}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}

export default MapAiDebugDrawer;
