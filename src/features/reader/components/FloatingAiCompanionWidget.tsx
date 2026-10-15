import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Crown,
  Lock,
  LogIn,
  ChevronDown,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { READER_AI_QUICK_PROMPTS } from '../data/learningLoopData';
import { getStoredUser, getIsProUser, type AppUser } from '@/utils/auth-storage';

interface FloatingAiCompanionWidgetProps {
  articleTitle?: string;
  defaultOpen?: boolean;
}

export const FloatingAiCompanionWidget: React.FC<FloatingAiCompanionWidgetProps> = ({
  articleTitle = 'Tết Cổ Truyền: Đổi Mới, Nhớ Về Cội Nguồn & Phong Vị Ba Miền',
  defaultOpen = false,
}) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [user, setUser] = useState<AppUser | null>(getStoredUser());
  const [isPro, setIsPro] = useState<boolean>(getIsProUser());

  // Listen to auth and subscription change events
  useEffect(() => {
    const handleAuthChange = () => setUser(getStoredUser());
    const handleSubChange = () => setIsPro(getIsProUser());

    window.addEventListener('auth:change', handleAuthChange);
    window.addEventListener('subscription:change', handleSubChange);
    return () => {
      window.removeEventListener('auth:change', handleAuthChange);
      window.removeEventListener('subscription:change', handleSubChange);
    };
  }, []);

  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: 'ai' | 'user'; text: string; time: string }[]
  >([
    {
      id: 'm1',
      sender: 'ai',
      text: `Xin chào! Tôi là VieCultures Cultural Companion. Tôi luôn sẵn sàng đàm đạo sâu sắc cùng bạn về bài học "${articleTitle}".`,
      time: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const isLoggedIn = !!user;

  const handleSendMessage = (textToSend?: string) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!isPro) {
      navigate('/pricing');
      return;
    }

    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: text.trim(),
      time: 'Vừa xong',
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      const matchingPrompt = READER_AI_QUICK_PROMPTS.find(
        (p) => p.labelEn === text || p.labelVi === text
      );

      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: 'ai' as const,
        text:
          matchingPrompt?.responseEn ||
          `That is a wonderful perspective on Vietnamese heritage! Exploring language through the lens of traditions, philosophy, and seasonal cuisine fosters both communicative fluency and genuine cultural pride. What other aspect would you like to discuss?`,
        time: 'Vừa xong',
      };

      setChatMessages((prev) => [...prev, aiReply]);
    }, 700);
  };

  return (
    <aside aria-label="Trợ lý AI đàm đạo văn hóa" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* ── EXPANDED CHATBOT WINDOW (Bottom-right corner) ──────────────── */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-[#FBF7EE] dark:bg-[#141C1A] text-[#3F5550] dark:text-[#FBF7EE] border-2 border-[#D9B76A] rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden mb-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Header */}
          <div className="bg-[#1E4B43] text-white p-4 border-b border-[#D9B76A]/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#163D37] border border-[#D9B76A] flex items-center justify-center text-[#D9B76A]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-sm leading-tight text-white">
                    AI Cultural Companion
                  </h4>
                  {isPro && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-[#D9B76A] text-[#122A22] text-[9px] font-bold uppercase">
                      <Crown className="w-2.5 h-2.5 fill-current" />
                      Pro
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/70 block">
                  Đàm đạo văn hóa & tiếng Anh
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Thu nhỏ"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F6EEDC]/60 dark:bg-black/20 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-[#1E4B43] text-[#D9B76A] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1E4B43] text-white rounded-br-xs'
                      : 'bg-white dark:bg-[#1E2925] text-stone-800 dark:text-[#FBF7EE] rounded-bl-xs shadow-xs border border-stone-200 dark:border-white/10'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* ── CONDITIONAL GATEWAY: NOT LOGGED IN vs NOT PRO vs PRO ────── */}
          {!isLoggedIn ? (
            /* REQUIREMENT 1: PHẢI ĐĂNG NHẬP MỚI ĐƯỢC CHAT */
            <div className="p-4 bg-white dark:bg-[#1E2925] border-t border-stone-200 dark:border-white/10 text-center space-y-2 shrink-0">
              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 font-semibold">
                <LogIn className="w-4 h-4 text-[#D9B76A]" />
                <span>Vui lòng đăng nhập để đàm đạo cùng AI</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentPath = window.location.pathname + window.location.search;
                  navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
                }}
                className="w-full py-2.5 rounded-xl bg-[#1E4B43] hover:bg-[#163D37] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Đăng Nhập Ngay</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D9B76A]" />
              </button>
            </div>
          ) : !isPro ? (
            /* REQUIREMENT 2: ĐĂNG NHẬP XONG PHẢI CÓ GÓI PRO MỚI ĐƯỢC CHAT */
            <div className="p-4 bg-gradient-to-br from-[#122A22] to-[#1E4B43] text-[#FBF7EE] border-t border-[#D9B76A]/40 text-center space-y-2.5 shrink-0">
              <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold text-[#D9B76A]">
                <Crown className="w-4 h-4 fill-current" />
                <span>Dành riêng cho Hội Viên Pro</span>
              </div>
              <p className="text-[11px] text-white/80 leading-snug">
                Nâng cấp gói Pro (39.000đ/tháng) để trò chuyện không giới hạn và nhận phản hồi văn hóa chuyên sâu.
              </p>
              <button
                type="button"
                onClick={() => navigate('/pricing')}
                className="w-full py-2.5 rounded-xl bg-[#9E2A2B] hover:bg-[#852223] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md border border-[#D9B76A]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
                <span>Xem Gói Pro & Đối Chiếu (39k)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* REQUIREMENT 3: PRO MEMBER FULL CHAT */
            <div className="p-3 bg-white dark:bg-[#1E2925] border-t border-stone-200 dark:border-white/10 space-y-2 shrink-0">
              {/* Quick Prompts */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {READER_AI_QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt.labelEn)}
                    className="whitespace-nowrap text-[10px] px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-black/30 hover:bg-stone-200 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-white/10 shrink-0 cursor-pointer"
                  >
                    💬 {prompt.labelVi}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập câu hỏi đàm đạo cùng AI..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-white/20 bg-stone-50 dark:bg-black/20 focus:outline-none focus:border-[#1E4B43]"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  className="px-3.5 py-2 rounded-xl bg-[#1E4B43] hover:bg-[#163D37] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FLOATING CORNER BUTTON (Góc phải bên dưới) ────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-[#1E4B43] hover:bg-[#163D37] text-white shadow-[0_8px_30px_rgba(30,75,67,0.45)] border-2 border-[#D9B76A] transition-all transform hover:scale-105 cursor-pointer"
        title="Mở AI Cultural Companion"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-[#D9B76A]" />
          {isPro && (
            <Crown className="w-2.5 h-2.5 text-[#D9B76A] fill-current absolute -top-1 -right-1" />
          )}
        </div>
        <span className="font-serif font-bold text-xs tracking-wide">
          {isOpen ? 'Thu Nhỏ AI' : 'AI Companion'}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    </aside>
  );
};

export default FloatingAiCompanionWidget;
