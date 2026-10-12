/**
 * MapAiDebugDrawer
 *
 * Developer Diagnostic Terminal & Simulator for Vietnam Map AI Tutor.
 * Docked at the BOTTOM (IDE Terminal style) or FAR-LEFT so it NEVER covers the Vietnam map.
 * Condition: Only rendered when VITE_MAP_AI_DEBUG=true or import.meta.env.DEV is true.
 * Strictly adheres to Lucide React SVG iconography (0 emojis).
 */

import React, { useState, useMemo } from 'react';
import {
  Terminal,
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
  PanelBottom,
  PanelLeft,
  Maximize2,
  Minimize2,
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
    dockPosition,
    setDockPosition,
    toggleDrawer,
    setDrawerOpen,
    setActiveTab,
    setSelectedCategory,
    setSearchQuery,
    clearLogs,
  } = useMapAiDebugStore();

  const { connected, client, volume } = useLiveAPIContext();
  const { cameraTarget, highlightedPlaceId, markers } = useMapStore();
  const { model, activeLessonId, proficiencyLevel } = useSettings();

  const [isMaximized, setIsMaximized] = useState(false);
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
    action: () => Promise<any> | void
  ) => {
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

  return (
    <>
      {/* FLOATING TRIGGER BADGE (Docked bottom-left, never blocks the map) */}
      {!isDrawerOpen && (
        <button
          onClick={toggleDrawer}
          className="fixed bottom-3 left-3 z-40 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0c1422] text-slate-300 border border-[#223854] shadow-xl hover:border-amber-400/80 hover:text-white transition-all cursor-pointer backdrop-blur-md font-mono text-xs"
          title="Mở Debug Console / Terminal (Dev Mode)"
          aria-label="Mở Bảng Chẩn Đoán & Giả Lập Map AI"
        >
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold tracking-wider">TERMINAL</span>

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

      {/* DOCKED CONSOLE PANEL (BOTTOM TERMINAL OR FAR-LEFT SIDEBAR) */}
      {isDrawerOpen && (
        <div
          className={`fixed z-50 bg-[#080d16] text-slate-200 shadow-2xl flex flex-col font-sans select-text border-[#1b2b40] transition-all duration-200 ${
            dockPosition === 'bottom'
              ? `inset-x-0 bottom-0 border-t ${
                  isMaximized ? 'h-[75vh]' : 'h-80 sm:h-96'
                }`
              : `inset-y-0 left-0 border-r w-full sm:w-[520px] ${
                  isMaximized ? 'sm:w-[760px]' : ''
                }`
          }`}
        >
          {/* TERMINAL TOP TOOLBAR (VS Code Style) */}
          <div className="h-10 px-3 border-b border-[#1b2b40] bg-[#0c1320] flex items-center justify-between shrink-0">
            {/* Left: Tab selectors */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 mr-3 pr-3 border-r border-[#1b2b40] text-amber-400 font-mono text-xs font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>TERMINAL</span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  DEV
                </span>
              </div>

              <button
                onClick={() => setActiveTab('logs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'logs'
                    ? 'bg-[#162338] text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1726]'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>Nhật Ký Trace ({logs.length})</span>
                {errorCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-bold">
                    {errorCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('health')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'health'
                    ? 'bg-[#162338] text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1726]'
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>Hệ Thống</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'simulator'
                    ? 'bg-[#162338] text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1726]'
                }`}
              >
                <Wrench className="w-3 h-3" />
                <span>Giả Lập (Simulator)</span>
              </button>
            </div>

            {/* Right: Quick system info + dock switcher & close */}
            <div className="flex items-center gap-2">
              {/* WS Live status dot */}
              <div
                className={`hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border ${
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

              {/* Dock position toggle button */}
              <button
                onClick={() =>
                  setDockPosition(p => (p === 'bottom' ? 'left' : 'bottom'))
                }
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={
                  dockPosition === 'bottom'
                    ? 'Chuyển sang thanh bên trái ngoài cùng (Far-Left)'
                    : 'Chuyển sang thanh Terminal dưới đáy (Bottom)'
                }
              >
                {dockPosition === 'bottom' ? (
                  <PanelLeft className="w-3.5 h-3.5" />
                ) : (
                  <PanelBottom className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Maximize / Restore height button */}
              <button
                onClick={() => setIsMaximized(m => !m)}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={isMaximized ? 'Thu nhỏ cửa sổ' : 'Phóng to cửa sổ'}
              >
                {isMaximized ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Close button */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Đóng Terminal"
                aria-label="Đóng Terminal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TERMINAL BODY */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3">
            {/* 1. TRACE LOGS TAB */}
            {activeTab === 'logs' && (
              <div className="space-y-2.5">
                {/* Search & Actions Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm log, transcript, tên tool, lỗi..."
                      className="w-full bg-[#0e1625] border border-[#1b2b40] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1 text-[11px] font-mono">
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
                        className={`px-2 py-1 rounded cursor-pointer uppercase transition-colors ${
                          selectedCategory === cat
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-[#0e1625] text-slate-400 border border-[#1b2b40] hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={handleCopyLogs}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0e1625] border border-[#1b2b40] text-slate-300 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Sao chép toàn bộ logs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copySuccess ? 'Đã chép' : 'Chép'}</span>
                    </button>

                    <button
                      onClick={handleDownloadLogs}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0e1625] border border-[#1b2b40] text-slate-300 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Tải logs JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải</span>
                    </button>

                    <button
                      onClick={clearLogs}
                      className="p-1.5 rounded-lg bg-[#0e1625] border border-[#1b2b40] text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-xs transition-colors cursor-pointer"
                      title="Xóa logs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Log Event Stream */}
                {filteredLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono">
                    Chưa có nhật ký nào phù hợp bộ lọc.
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
                          <div className="flex items-start justify-between gap-2">
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
                                title="Xem payload chi tiết"
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

            {/* 2. SYSTEM HEALTH TAB */}
            {activeTab === 'health' && (
              <div
                className={`grid gap-3 ${
                  dockPosition === 'bottom'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {/* WebSocket Card */}
                <div className="p-3.5 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
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
                <div className="p-3.5 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
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
                <div className="p-3.5 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
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
                <div className="p-3.5 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
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

            {/* 3. SIMULATOR TAB */}
            {activeTab === 'simulator' && (
              <div
                className={`grid gap-3 ${
                  dockPosition === 'bottom'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {/* Section 1: Map Tools Simulator */}
                <div className="p-3.5 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
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
                <div className="p-3.5 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
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
                <div className="p-3.5 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
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
                      className="w-full px-2 py-1.5 rounded bg-amber-950/50 border border-amber-800 text-amber-300 hover:bg-amber-900 text-xs font-medium text-left cursor-pointer transition-colors flex items-center justify-between"
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
                      className="w-full px-2 py-1.5 rounded bg-cyan-950/50 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-medium text-left cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <span>Thẻ từ vựng Quan họ</span>
                      <Play className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Section 4: Speech Assessment Simulator */}
                <div className="p-3.5 rounded-xl bg-[#0e1625] border border-[#1b2b40] space-y-2">
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
                    className="w-full px-2 py-1.5 rounded bg-rose-950/40 border border-rose-800 text-rose-300 hover:bg-rose-900 text-xs font-medium text-left cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <span>Mô Phỏng Sửa Lỗi Nói</span>
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MapAiDebugDrawer;
