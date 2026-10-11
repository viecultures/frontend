import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  MapPin,
  RotateCcw,
  Landmark,
  Utensils,
  ChevronRight,
  Lightbulb,
  X
} from 'lucide-react';
import { VietnamMap } from '@/components/map/VietnamMap';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { getProvinceCultureData } from '../../data/vietnamProvincesDetail';
import type { ProvinceCultureData } from '../../data/vietnamProvincesDetail';
import { sendMapAiPrompt, detectProvinceFromText } from '../../services/geminiMapAiService';
import type { ChatMessage } from '../../services/geminiMapAiService';

export const VietnamMapAiScreen: React.FC = () => {
  // State management
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>('ha-noi');
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      text: 'Xin chào bạn! Tôi là Sứ Giả Văn Hóa AI của VieCultures, đồng hành cùng bạn khám phá 34 tỉnh thành và di sản văn hóa Việt Nam. Bạn muốn tìm hiểu về vùng đất, di tích UNESCO hay đặc sản ẩm thực nào hôm nay?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      focusedProvinceId: 'ha-noi',
      culturalTags: ['Bắc Bộ', 'Thủ Đô Ngàn Năm', 'UNESCO'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [showHoverMenu, setShowHoverMenu] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Active province cultural data (priority: hovered province -> selected province)
  const activeProvinceId = hoveredProvinceId || selectedProvinceId || 'ha-noi';
  const activeProvinceItem = VIETNAM_34_PROVINCES.find((p) => p.id === activeProvinceId) || VIETNAM_34_PROVINCES[0];
  const provinceDetail: ProvinceCultureData = getProvinceCultureData(activeProvinceId, activeProvinceItem?.name);

  // Auto scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice synthesis (Text to Speech)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown asterisks and symbols before speaking
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .slice(0, 300);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Speech to Text (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedProvinceId, messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech API.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // If user query mentions a province directly, immediately update map focus
    const detected = detectProvinceFromText(text);
    if (detected) {
      setSelectedProvinceId(detected.id);
      setShowHoverMenu(true);
    }

    try {
      const response = await sendMapAiPrompt(text, messages, selectedProvinceId || undefined);

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        focusedProvinceId: response.focusedProvinceId || detected?.id || selectedProvinceId || undefined,
        suggestedItinerary: response.suggestedItinerary,
        culturalTags: response.culturalTags,
      };

      setMessages((prev) => [...prev, agentMessage]);

      if (response.focusedProvinceId) {
        setSelectedProvinceId(response.focusedProvinceId);
        setShowHoverMenu(true);
      }

      if (autoSpeak) {
        speakText(response.text);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle province selection on the map
  const handleSelectProvince = (province: ProvinceMapItem | null) => {
    if (province) {
      setSelectedProvinceId(province.id);
      setShowHoverMenu(true);
    } else {
      setSelectedProvinceId(null);
    }
  };

  // Quick prompt buttons
  const quickPrompts = [
    { label: 'Cố đô Huế', prompt: 'Hãy giới thiệu về Cố đô Huế và ẩm thực cung đình đặc sắc nơi đây.' },
    { label: 'Ẩm thực Hà Nội', prompt: 'Top 5 món ăn truyền thống không thể bỏ lỡ tại thủ đô Hà Nội là gì?' },
    { label: 'Di sản Hội An', prompt: 'Phố cổ Hội An và Thánh địa Mỹ Sơn có gì đặc biệt về lịch sử?' },
    { label: 'Hang động Quảng Bình', prompt: 'Vương quốc hang động Quảng Bình và Hang Sơn Đoòng có điểm gì kỳ vĩ?' },
    { label: 'Đà Lạt & Tây Nguyên', prompt: 'Gợi ý lịch trình 2 ngày khám phá di sản cồng chiêng và thiên nhiên Đà Lạt Lâm Đồng.' },
    { label: 'Chợ nổi Cần Thơ', prompt: 'Nét đẹp văn hóa sông nước Chợ nổi Cái Răng tại Cần Thơ.' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EE] dark:bg-[#0E1A17] text-[#1E2925] dark:text-[#E8EFEA] overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-14 px-6 border-b border-[#1E4B43]/15 dark:border-[#1E4B43]/30 bg-white/70 dark:bg-[#121E1B]/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1E4B43] text-[#D4AF37] flex items-center justify-center shadow-md">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base tracking-tight text-[#1E4B43] dark:text-[#E8DCC4]">
                Vietnam Map AI &amp; Cultural Guide
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Multimodal Engine
              </span>
            </div>
            <p className="text-[11px] text-[#5D706A] dark:text-[#8E9F99]">
              Khám phá 34 tỉnh thành Việt Nam qua tương tác giọng nói &amp; bản đồ số thông minh
            </p>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Auto Speak Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              autoSpeak
                ? 'bg-[#1E4B43] text-[#D4AF37] border-[#D4AF37]/50 shadow-sm'
                : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border-black/10 dark:border-white/10 text-[#5D706A] dark:text-[#8E9F99]'
            }`}
            title="Tự động đọc phản hồi AI bằng giọng nói"
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoSpeak ? 'Tự Đọc: Bật' : 'Tự Đọc: Tắt'}</span>
          </button>

          {/* Reset Conversation */}
          <button
            onClick={() => {
              setMessages([
                {
                  id: 'msg-welcome-reset',
                  sender: 'agent',
                  text: 'Đã thiết lập lại cuộc trò chuyện. Bạn muốn cùng tôi khám phá vùng đất nào của Việt Nam?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  focusedProvinceId: 'ha-noi',
                  culturalTags: ['Bắc Bộ', 'Thủ Đô Ngàn Năm'],
                },
              ]);
            }}
            className="p-2 rounded-lg text-xs border border-black/10 dark:border-white/10 text-[#5D706A] dark:text-[#8E9F99] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Split-Screen Content */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: AI Voice & Cultural Chat Workspace (46% on desktop) */}
        <section className="w-full lg:w-[46%] h-full flex flex-col border-r border-[#1E4B43]/15 dark:border-[#1E4B43]/30 bg-white/40 dark:bg-[#121E1B]/50 backdrop-blur-sm z-10">
          {/* Messages Stream Container */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 select-text">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              const targetProv = msg.focusedProvinceId
                ? VIETNAM_34_PROVINCES.find((p) => p.id === msg.focusedProvinceId)
                : null;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    {isAgent ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E4B43] dark:text-[#D4AF37]">
                        <Bot className="w-3.5 h-3.5" />
                        <span>Sứ Giả Văn Hóa AI</span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-[#5D706A] dark:text-[#9FB1AA]">Bạn</span>
                    )}
                    <span className="text-[10px] text-[#8E9F99] font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble Card */}
                  <div
                    className={`max-w-[92%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed border ${
                      isAgent
                        ? 'bg-white dark:bg-[#1A2824] border-[#1E4B43]/15 dark:border-[#D4AF37]/20 text-[#1E2925] dark:text-[#E8EFEA]'
                        : 'bg-[#1E4B43] border-[#1E4B43] text-[#FBF7EE] rounded-tr-none'
                    }`}
                  >
                    {/* Message Body Content */}
                    <div className="whitespace-pre-line space-y-2">
                      {msg.text}
                    </div>

                    {/* Agent Extra Cultural Spotlight / Tags */}
                    {isAgent && (
                      <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                        {targetProv && (
                          <button
                            onClick={() => {
                              setSelectedProvinceId(targetProv.id);
                              setShowHoverMenu(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E4B43]/10 dark:bg-[#D4AF37]/15 text-[#1E4B43] dark:text-[#D4AF37] hover:bg-[#1E4B43] hover:text-[#FBF7EE] text-xs font-semibold transition-all cursor-pointer border border-[#1E4B43]/20 dark:border-[#D4AF37]/30"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Xem {targetProv.name} trên bản đồ</span>
                          </button>
                        )}

                        {/* Read-out loud button */}
                        <button
                          onClick={() => speakText(msg.text)}
                          className="p-1.5 rounded-md text-[#5D706A] hover:text-[#1E4B43] dark:text-[#8E9F99] dark:hover:text-[#D4AF37] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                          title="Đọc to nội dung này"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-[#1E4B43]/15 text-[#1E4B43] dark:text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#1A2824] border border-[#1E4B43]/15 text-xs text-[#5D706A] dark:text-[#8E9F99] flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Sứ Giả AI đang tra cứu dữ liệu địa lý di sản...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Cultural Prompt Suggestions */}
          <div className="px-4 py-2 border-t border-black/5 dark:border-white/5 bg-white/60 dark:bg-[#121E1B]/60 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-2 w-max">
              <span className="text-[11px] font-medium text-[#8E9F99] flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#D4AF37]" /> Gợi ý:
              </span>
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#1E4B43]/5 dark:bg-white/5 hover:bg-[#1E4B43] hover:text-[#FBF7EE] dark:hover:bg-[#1E4B43] dark:hover:text-[#FBF7EE] text-[#1E4B43] dark:text-[#D4AF37] border border-[#1E4B43]/15 dark:border-[#D4AF37]/20 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Microphone Control Bar */}
          <div className="p-3 sm:p-4 border-t border-[#1E4B43]/15 dark:border-[#1E4B43]/30 bg-white/90 dark:bg-[#121E1B]/95 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-lg ring-2 ring-rose-500/40'
                    : 'bg-[#1E4B43]/10 dark:bg-white/10 text-[#1E4B43] dark:text-[#D4AF37] border-[#1E4B43]/20 dark:border-white/15 hover:bg-[#1E4B43] hover:text-white'
                }`}
                title={isListening ? 'Đang lắng nghe... Nhấn để dừng' : 'Bật micro đàm thoại với AI'}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Đang lắng nghe giọng nói của bạn...'
                      : 'Hỏi về di sản, ẩm thực, lộ trình 34 tỉnh...'
                  }
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF7EE] dark:bg-[#1E2925] border border-[#1E4B43]/20 dark:border-[#D4AF37]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4B43] dark:focus:ring-[#D4AF37] placeholder:text-[#8E9F99]"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-xl bg-[#1E4B43] text-[#D4AF37] hover:bg-[#15342F] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0 shadow-md"
                title="Gửi câu hỏi"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </section>

        {/* Right Column: Native VietnamMap with Compact Hover Menu (54% on desktop) */}
        <section className="w-full lg:w-[54%] h-full relative flex flex-col overflow-hidden bg-[#F2ECE1]/50 dark:bg-[#081210]/70">
          {/* Main Map Component (showRegionTabs=false to remove top tabs bar) */}
          <div className="w-full h-full relative flex items-center justify-center p-2">
            <VietnamMap
              selectedProvinceId={selectedProvinceId}
              onSelectProvince={handleSelectProvince}
              showControls={true}
              showRegionTabs={false}
              showPoiPins={true}
              showSeaLayer={true}
              showLabels={true}
              showTooltip={false}
              className="w-full h-full max-h-full"
            />
          </div>

          {/* Compact Floating Hover / Selection Menu Card (Small, non-intrusive) */}
          {showHoverMenu && provinceDetail && (
            <div className="absolute top-4 right-4 z-30 w-72 sm:w-80 bg-white/95 dark:bg-[#162420]/95 backdrop-blur-xl border border-[#1E4B43]/20 dark:border-[#D4AF37]/30 rounded-2xl shadow-2xl p-3.5 animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1E4B43] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
                    <Landmark className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif font-bold text-sm text-[#1E4B43] dark:text-[#FBF7EE] leading-tight">
                        {provinceDetail.name}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1E4B43]/10 dark:bg-[#D4AF37]/20 text-[#1E4B43] dark:text-[#D4AF37] font-medium">
                        {provinceDetail.regionName}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-[#5D706A] dark:text-[#8E9F99] leading-none mt-0.5">
                      {provinceDetail.capital}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakText(`Tỉnh ${provinceDetail.name}, ${provinceDetail.regionName}. ${provinceDetail.summary}`)}
                    className="p-1 rounded-md text-[#5D706A] hover:text-[#1E4B43] dark:text-[#8E9F99] dark:hover:text-[#D4AF37] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                    title="Nghe phát âm giới thiệu"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowHoverMenu(false)}
                    className="p-1 rounded-md text-[#5D706A] hover:text-[#1E4B43] dark:text-[#8E9F99] dark:hover:text-[#D4AF37] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                    title="Đóng menu"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Highlights & Specialties Summary */}
              <div className="space-y-2 text-xs">
                {/* UNESCO / Heritage Title */}
                {provinceDetail.unescoTitle && (
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/20 text-[10.5px] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="line-clamp-1 font-medium">{provinceDetail.unescoTitle}</span>
                  </div>
                )}

                {/* Cultural Highlights (Top 2) */}
                <div className="flex items-start gap-1.5 text-[11px] text-[#1E2925] dark:text-[#D1E0DA]">
                  <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {provinceDetail.landmarks.slice(0, 3).join(' • ')}
                  </span>
                </div>

                {/* Culinary Specialties */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#1E2925] dark:text-[#D1E0DA]">
                  <Utensils className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="line-clamp-1 font-medium text-amber-900 dark:text-amber-300">
                    {provinceDetail.specialties.slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>

              {/* Ask AI Mini Button */}
              <button
                onClick={() => {
                  handleSendMessage(`Hãy chia sẻ sâu hơn về lịch sử, di tích và ẩm thực tiêu biểu của ${provinceDetail.name}.`);
                }}
                className="w-full mt-2.5 py-1.5 px-3 rounded-lg bg-[#1E4B43] hover:bg-[#15342F] text-[#D4AF37] font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Bot className="w-3 h-3" />
                <span>Hỏi Sứ Giả AI về {provinceDetail.name}</span>
                <ChevronRight className="w-3 h-3 ml-auto" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default VietnamMapAiScreen;
