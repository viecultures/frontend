import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Globe,
  Radio,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';
import { AdminDialog } from '../AdminDialog';

interface AiTtsSubViewProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

interface PhoneticEntry {
  id: string;
  vietnameseWord: string;
  phoneticSpelling: string;
  ipaNotation?: string;
  notes?: string;
}

const DEFAULT_PHONETIC_LEXICON: PhoneticEntry[] = [
  {
    id: 'pho',
    vietnameseWord: 'Phở',
    phoneticSpelling: 'fuh',
    ipaNotation: '/fɜː/',
    notes: 'Món ăn quốc hồn quốc túy của Việt Nam, phát âm thanh tao như chữ fuh.',
  },
  {
    id: 'banh_mi',
    vietnameseWord: 'Bánh mì',
    phoneticSpelling: 'bahn mee',
    ipaNotation: '/bɑːn miː/',
    notes: 'Bánh mì kẹp giòn rụm với pate và rau củ.',
  },
  {
    id: 'ao_dai',
    vietnameseWord: 'Áo dài',
    phoneticSpelling: 'ow zye',
    ipaNotation: '/aʊ zaɪ/',
    notes: 'Trang phục truyền thống phụ nữ Việt Nam.',
  },
  {
    id: 'com_lang_vong',
    vietnameseWord: 'Cốm Làng Vòng',
    phoneticSpelling: 'kohm lahng vong',
    ipaNotation: '/koʊm lɑːŋ vɒŋ/',
    notes: 'Hạt lúa non mùa thu Hà Nội.',
  },
  {
    id: 'don_ca_tai_tu',
    vietnameseWord: 'Đờn ca tài tử',
    phoneticSpelling: 'don ca tie tu',
    ipaNotation: '/dɔːn kɑː taɪ tuː/',
    notes: 'Di sản văn hóa phi vật thể Nam Bộ.',
  },
];

const LOCAL_STORAGE_LEXICON_KEY = 'viecultures_admin_tts_phonetic_lexicon';

export const AiTtsSubView: React.FC<AiTtsSubViewProps> = ({ onNotify }) => {
  // TTS Provider & Voice settings
  const [provider, setProvider] = useState<'azure' | 'gemini'>('azure');
  const [englishVoice, setEnglishVoice] = useState<string>('en-US-JennyMultilingualNeural');
  const [vietnameseVoice, setVietnameseVoice] = useState<string>('vi-VN-HoaiMyNeural');
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('0%');

  // Phonetic Lexicon State
  const [lexicon, setLexicon] = useState<PhoneticEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LEXICON_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PHONETIC_LEXICON;
  });

  // Modal create/edit entry
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalWord, setModalWord] = useState<string>('');
  const [modalPhonetic, setModalPhonetic] = useState<string>('');
  const [modalIpa, setModalIpa] = useState<string>('');
  const [modalNotes, setModalNotes] = useState<string>('');
  const [modalError, setModalError] = useState<string | null>(null);

  // Voice Sandbox state
  const [sandboxText, setSandboxText] = useState<string>(
    "Welcome to Hanoi! Let's enjoy a hot bowl of traditional Pho and put on our graceful Ao dai."
  );
  const [isPlayingSandbox, setIsPlayingSandbox] = useState<boolean>(false);
  const [sandboxLatency, setSandboxLatency] = useState<number | null>(null);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wordIdInput = useId();
  const phoneticIdInput = useId();

  // Save lexicon to localStorage
  const saveLexicon = (entries: PhoneticEntry[]) => {
    setLexicon(entries);
    try {
      localStorage.setItem(LOCAL_STORAGE_LEXICON_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  };

  // Play audio stream
  const playAudioStream = async (text: string, voice: string, onEnd?: () => void) => {
    const start = Date.now();
    try {
      const token = getStoredToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/tts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text,
          voice,
          speed: playbackSpeed,
          provider,
        }),
      });

      if (!res.ok) {
        throw new Error(`Lỗi tổng hợp âm thanh (HTTP ${res.status})`);
      }

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        if (onEnd) onEnd();
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        if (onEnd) onEnd();
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      setSandboxLatency(Date.now() - start);
    } catch (err: unknown) {
      // Fallback to browser SpeechSynthesis if backend audio fails
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.onend = () => {
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          if (onEnd) onEnd();
        };
        window.speechSynthesis.speak(utterance);
        setSandboxLatency(Date.now() - start);
      } else {
        const msg = err instanceof Error ? err.message : 'Lỗi khi phát âm';
        if (onNotify) onNotify(msg, 'error');
        if (onEnd) onEnd();
      }
    }
  };

  // Handle Play Sandbox
  const handlePlaySandbox = async () => {
    if (isPlayingSandbox) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingSandbox(false);
      return;
    }

    setIsPlayingSandbox(true);
    await playAudioStream(sandboxText, englishVoice, () => {
      setIsPlayingSandbox(false);
    });
  };

  // Play single word
  const handlePlayWord = async (entry: PhoneticEntry) => {
    if (playingWordId === entry.id) {
      if (audioRef.current) audioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingWordId(null);
      return;
    }
    setPlayingWordId(entry.id);
    await playAudioStream(entry.phoneticSpelling, englishVoice, () => {
      setPlayingWordId(null);
    });
  };

  // Modal submit
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalWord.trim() || !modalPhonetic.trim()) {
      setModalError('Vui lòng nhập từ gốc tiếng Việt và cách phiên âm');
      return;
    }

    if (modalMode === 'create') {
      const newEntry: PhoneticEntry = {
        id: `word_${Date.now()}`,
        vietnameseWord: modalWord.trim(),
        phoneticSpelling: modalPhonetic.trim(),
        ipaNotation: modalIpa.trim() || undefined,
        notes: modalNotes.trim() || undefined,
      };
      saveLexicon([...lexicon, newEntry]);
      if (onNotify) onNotify(`Đã thêm quy đổi phát âm cho [${newEntry.vietnameseWord}]`, 'success');
    } else if (modalMode === 'edit' && editingId) {
      const updated = lexicon.map((item) =>
        item.id === editingId
          ? {
              ...item,
              vietnameseWord: modalWord.trim(),
              phoneticSpelling: modalPhonetic.trim(),
              ipaNotation: modalIpa.trim() || undefined,
              notes: modalNotes.trim() || undefined,
            }
          : item
      );
      saveLexicon(updated);
      if (onNotify) onNotify(`Đã cập nhật quy đổi phát âm cho [${modalWord.trim()}]`, 'success');
    }

    setModalMode(null);
    setEditingId(null);
    setModalWord('');
    setModalPhonetic('');
    setModalIpa('');
    setModalNotes('');
    setModalError(null);
  };

  // Delete entry
  const handleDeleteWord = (id: string) => {
    const updated = lexicon.filter((item) => item.id !== id);
    saveLexicon(updated);
    if (onNotify) onNotify('Đã xóa từ vựng khỏi bảng chuẩn hóa phát âm', 'success');
  };

  // Reset to default lexicon
  const handleResetLexicon = () => {
    saveLexicon(DEFAULT_PHONETIC_LEXICON);
    if (onNotify) onNotify('Đã khôi phục từ điển phát âm về mặc định gốc', 'success');
  };

  return (
    <div className="w-full space-y-5">
      {/* ── Top Header Toolbar ──────────────────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/80 border border-antique-gold/30 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-heritage-green/10 dark:bg-antique-gold/10 flex items-center justify-center text-heritage-green dark:text-antique-bright">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-text-primary dark:text-warm-ivory">
              Giọng đọc Di sản & Chuẩn hóa Phát âm TTS
            </h2>
            <p className="text-xs text-text-muted">
              Quản lý giọng đọc đa ngữ Azure Neural TTS và bảng quy đổi phiên âm từ văn hóa Việt Nam trong bài đọc tiếng Anh.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetLexicon}
          className="px-3.5 py-1.5 rounded-xl border border-antique-gold/40 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-antique-gold/15 transition-all flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Khôi phục từ điển gốc</span>
        </button>
      </div>

      {/* ── Section 1: Provider & Voice Settings ─────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-heading text-sm font-bold text-text-primary dark:text-warm-ivory pb-2 border-b border-antique-gold/20 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-antique-gold" />
          Thiết lập Nhà cung cấp Giọng đọc (TTS Engine)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Provider Toggle */}
          <div className="p-4 rounded-xl bg-warm-ivory/60 dark:bg-stone-800/60 border border-antique-gold/30 space-y-2">
            <span className="font-heading text-xs font-bold text-text-primary dark:text-warm-ivory block">
              Bộ máy phát âm chính:
            </span>
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="tts_provider"
                  value="azure"
                  checked={provider === 'azure'}
                  onChange={() => setProvider('azure')}
                  className="text-heritage-green focus:ring-antique-gold"
                />
                <span>Microsoft Azure Neural TTS (Khuyên dùng)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-text-muted">
                <input
                  type="radio"
                  name="tts_provider"
                  value="gemini"
                  checked={provider === 'gemini'}
                  onChange={() => setProvider('gemini')}
                  className="text-heritage-green focus:ring-antique-gold"
                />
                <span>Google Gemini AI Voice (Thử nghiệm)</span>
              </label>
            </div>
            <p className="text-[11px] text-text-muted mt-2">
              Azure Neural TTS hỗ trợ các giọng đa ngữ cao cấp như JennyMultilingual, phát âm tiếng Anh chuẩn CEFR.
            </p>
          </div>

          {/* English Multilingual Voice */}
          <div className="p-4 rounded-xl bg-warm-ivory/60 dark:bg-stone-800/60 border border-antique-gold/30 space-y-2">
            <span className="font-heading text-xs font-bold text-text-primary dark:text-warm-ivory block">
              Giọng đọc tiếng Anh chính:
            </span>
            <select
              value={englishVoice}
              onChange={(e) => setEnglishVoice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs font-semibold text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
            >
              <option value="en-US-JennyMultilingualNeural">en-US-JennyMultilingualNeural (Đa ngữ chuẩn)</option>
              <option value="en-US-JennyNeural">en-US-JennyNeural (Tiêu chuẩn Mỹ)</option>
              <option value="en-US-GuyNeural">en-US-GuyNeural (Giọng nam trầm ấm)</option>
              <option value="en-GB-SoniaNeural">en-GB-SoniaNeural (Anh - Anh)</option>
            </select>
            <p className="text-[11px] text-text-muted">
              Giọng <strong>JennyMultilingualNeural</strong> có khả năng nhận biết và đọc đúng từ ngoại lai không bị nuốt âm.
            </p>
          </div>

          {/* Vietnamese Local Voice */}
          <div className="p-4 rounded-xl bg-warm-ivory/60 dark:bg-stone-800/60 border border-antique-gold/30 space-y-2">
            <span className="font-heading text-xs font-bold text-text-primary dark:text-warm-ivory block">
              Giọng đọc tiếng Việt phụ:
            </span>
            <select
              value={vietnameseVoice}
              onChange={(e) => setVietnameseVoice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs font-semibold text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
            >
              <option value="vi-VN-HoaiMyNeural">vi-VN-HoaiMyNeural (Nữ miền Bắc truyền cảm)</option>
              <option value="vi-VN-NamMinhNeural">vi-VN-NamMinhNeural (Nam miền Bắc ấm áp)</option>
            </select>
            <p className="text-[11px] text-text-muted">
              Dùng khi học viên chuyển sang chế độ luyện nói tiếng Việt hoặc nghe giải nghĩa song ngữ.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Bilingual Phonetic Dictionary ─────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-antique-gold/20">
          <div>
            <h3 className="font-heading text-sm font-bold text-text-primary dark:text-warm-ivory flex items-center gap-2">
              <Globe className="w-4 h-4 text-antique-gold" />
              Bảng Chuẩn hóa Phiên âm Tiếng Việt trong Bài đọc Anh (Phonetic Dictionary)
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Quy đổi các danh từ ẩm thực, di sản, địa danh Việt Nam sang ngữ âm SSML/IPA quốc tế để máy đọc tiếng Anh phát âm đúng dấu và ngữ điệu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalMode('create');
              setEditingId(null);
              setModalWord('');
              setModalPhonetic('');
              setModalIpa('');
              setModalNotes('');
              setModalError(null);
            }}
            className="min-h-[36px] px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory border border-antique-gold/40 shadow-sm transition-all flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm từ vựng quy đổi</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-antique-gold/20 text-text-muted font-bold">
                <th className="py-2.5 px-3">Từ tiếng Việt gốc</th>
                <th className="py-2.5 px-3">Cách phiên âm ngữ âm (Phonetic)</th>
                <th className="py-2.5 px-3">Ký âm IPA</th>
                <th className="py-2.5 px-3">Ghi chú ngữ cảnh</th>
                <th className="py-2.5 px-3 text-center">Nghe phát âm</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-antique-gold/15">
              {lexicon.map((item) => {
                const isPlayingThis = playingWordId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-warm-ivory/60 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-heading font-bold text-text-primary dark:text-warm-ivory">
                      {item.vietnameseWord}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-heritage-green dark:text-antique-bright">
                      {item.phoneticSpelling}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted">
                      {item.ipaNotation || '--'}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-text-secondary max-w-xs truncate">
                      {item.notes || '--'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handlePlayWord(item)}
                        title={`Nghe thử phát âm của ${item.vietnameseWord}`}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold ${
                          isPlayingThis
                            ? 'bg-antique-gold text-heritage-green border-antique-gold shadow-xs'
                            : 'border-antique-gold/40 hover:bg-antique-gold/15 text-text-primary dark:text-warm-ivory'
                        }`}
                      >
                        {isPlayingThis ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isPlayingThis ? 'Dừng' : 'Nghe'}</span>
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setModalMode('edit');
                          setModalWord(item.vietnameseWord);
                          setModalPhonetic(item.phoneticSpelling);
                          setModalIpa(item.ipaNotation || '');
                          setModalNotes(item.notes || '');
                          setModalError(null);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-antique-gold/40 text-[11px] font-semibold hover:bg-antique-gold/15 transition-all cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteWord(item.id)}
                        className="px-2.5 py-1 rounded-lg border border-red-300 dark:border-red-900 text-[11px] font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: Live Voice Sandbox ────────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="pb-3 border-b border-antique-gold/20">
          <h3 className="font-heading text-sm font-bold text-text-primary dark:text-warm-ivory flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-antique-gold" />
            Phòng Thử nghiệm Giọng đọc Trực tiếp (Live Voice Sandbox)
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Nhập một đoạn văn tiếng Anh có chứa các từ văn hóa Việt Nam để kiểm tra xem giọng đọc quốc tế có phát âm đúng không.
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            value={sandboxText}
            onChange={(e) => setSandboxText(e.target.value)}
            rows={3}
            className="w-full p-3.5 rounded-xl bg-warm-ivory dark:bg-stone-950 border border-antique-gold/40 text-xs font-mono text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold shadow-inner"
            placeholder="Nhập câu văn cần nghe thử..."
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePlaySandbox}
              className="min-h-[40px] px-5 py-2 rounded-xl font-heading text-xs font-bold bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory border border-antique-gold/40 shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start"
            >
              {isPlayingSandbox ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Đang phát... (Bấm để dừng)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-antique-gold" />
                  <span>Nghe thử đoạn văn này</span>
                </>
              )}
            </button>

            {sandboxLatency !== null && (
              <span className="font-mono text-xs text-text-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-heritage-green" />
                Thời gian sinh âm thanh: <strong>{sandboxLatency} ms</strong> | Định dạng audio/mpeg
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal Add / Edit Phonetic Entry ──────────────────────────────────── */}
      {modalMode && (
        <AdminDialog
          title={modalMode === 'create' ? 'Thêm từ quy đổi phát âm mới' : 'Chỉnh sửa quy đổi phát âm'}
          onClose={() => {
            setModalMode(null);
            setEditingId(null);
          }}
        >
          <form onSubmit={handleModalSubmit} className="p-6 space-y-4 max-w-md">
            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
                {modalError}
              </div>
            )}

            <div>
              <label htmlFor={wordIdInput} className="block text-xs font-bold text-text-primary dark:text-warm-ivory mb-1">
                Từ tiếng Việt gốc *
              </label>
              <input
                id={wordIdInput}
                type="text"
                required
                value={modalWord}
                onChange={(e) => setModalWord(e.target.value)}
                placeholder="Ví dụ: Phở"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
              />
            </div>

            <div>
              <label htmlFor={phoneticIdInput} className="block text-xs font-bold text-text-primary dark:text-warm-ivory mb-1">
                Cách phiên âm cho máy đọc tiếng Anh (Phonetic Spelling) *
              </label>
              <input
                id={phoneticIdInput}
                type="text"
                required
                value={modalPhonetic}
                onChange={(e) => setModalPhonetic(e.target.value)}
                placeholder="Ví dụ: fuh"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold font-mono"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                Viết theo âm tiết tiếng Anh dễ hiểu nhất để giọng đọc ngoại quốc phát âm chuẩn.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-warm-ivory mb-1">
                Ký âm IPA quốc tế (Tùy chọn)
              </label>
              <input
                type="text"
                value={modalIpa}
                onChange={(e) => setModalIpa(e.target.value)}
                placeholder="Ví dụ: /fɜː/"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-warm-ivory mb-1">
                Ghi chú ý nghĩa / Ngữ cảnh
              </label>
              <input
                type="text"
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                placeholder="Ví dụ: Món ăn truyền thống"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-antique-gold/20">
              <button
                type="button"
                onClick={() => {
                  setModalMode(null);
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory shadow-sm transition-all cursor-pointer"
              >
                Lưu từ quy đổi
              </button>
            </div>
          </form>
        </AdminDialog>
      )}
    </div>
  );
};

export default AiTtsSubView;
