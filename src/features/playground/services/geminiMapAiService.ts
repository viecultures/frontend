import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { getProvinceCultureData } from '../data/vietnamProvincesDetail';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  focusedProvinceId?: string;
  suggestedItinerary?: string[];
  culturalTags?: string[];
}

export interface MapAiResponse {
  text: string;
  focusedProvinceId?: string;
  suggestedItinerary?: string[];
  culturalTags?: string[];
}

const SYSTEM_PROMPT = `
Bạn là "Sứ Giả Văn Hóa AI" (VieCultures AI Map Assistant) — trợ lý đàm thoại thông minh chuyên sâu về 34 tỉnh thành và di sản văn hóa, địa lý, ẩm thực Việt Nam.

QUY TẮC CỐT LÕI:
1. Bạn trả lời thân thiện, uyên bác, giàu chất văn hóa, truyền cảm hứng khám phá Việt Nam.
2. Khi người dùng nhắc tới hoặc hỏi về một tỉnh thành/địa danh Việt Nam (ví dụ: Hà Nội, Cố đô Huế, Vịnh Hạ Long/Quảng Ninh, Đà Nẵng, Phố cổ Hội An/Quảng Nam, TP. Hồ Chí Minh, Ninh Bình, Sapa/Lào Cai, Cao Bằng, Lâm Đồng/Đà Lạt, v.v.):
   - Hãy chỉ định rõ tỉnh thành trọng tâm (Focus Province) bằng cách để tên tỉnh đó rõ ràng trong lời nói.
   - Giới thiệu di tích lịch sử UNESCO, ẩm thực đặc trưng và gợi ý 1-2 trải nghiệm văn hóa không thể bỏ lỡ.
3. Nếu người dùng hỏi bằng tiếng Việt, hãy trả lời bằng tiếng Việt văn phong chuẩn mực kết hợp giải thích 1-2 từ vựng tiếng Anh chủ đề di sản (ví dụ: Imperial Citadel, Ancient Port, Floating Market).
4. Nếu người dùng hỏi bằng tiếng Anh, hãy trả lời bằng tiếng Anh lưu loát và cung cấp góc nhìn bản địa sâu sắc.
5. Giữ câu trả lời cô đọng (khoảng 2-3 đoạn ngắn), có bullet points dễ đọc trên giao diện bản đồ.
`;

/**
 * Normalizes string for accent-insensitive search
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

/**
 * Identifies province from user query or AI response text
 */
export function detectProvinceFromText(text: string): ProvinceMapItem | null {
  const norm = normalizeText(text);

  // Direct special aliases mapping
  const aliasMap: Record<string, string> = {
    'ha noi': 'ha-noi',
    'hanoi': 'ha-noi',
    'thang long': 'ha-noi',
    'ho guom': 'ha-noi',
    'pho co': 'ha-noi',
    'hue': 'thua-thien-hue',
    'co do hue': 'thua-thien-hue',
    'thua thien hue': 'thua-thien-hue',
    'sai gon': 'ho-chi-minh',
    'tphcm': 'ho-chi-minh',
    'ho chi minh': 'ho-chi-minh',
    'ha long': 'quang-ninh',
    'quang ninh': 'quang-ninh',
    'yen tu': 'quang-ninh',
    'hoi an': 'quang-nam',
    'quang nam': 'quang-nam',
    'my son': 'quang-nam',
    'da nang': 'da-nang',
    'ba na': 'da-nang',
    'cau vang': 'da-nang',
    'ninh binh': 'ninh-binh',
    'trang an': 'ninh-binh',
    'hoa lu': 'ninh-binh',
    'da lat': 'lam-dong',
    'lam dong': 'lam-dong',
    'langbiang': 'lam-dong',
    'phong nha': 'quang-binh',
    'son doong': 'quang-binh',
    'quang binh': 'quang-binh',
    'can tho': 'can-tho',
    'cai rang': 'can-tho',
    'ninh kieu': 'can-tho',
    'phu quoc': 'kien-giang',
    'kien giang': 'kien-giang',
    'ban gioc': 'cao-bang',
    'cao bang': 'cao-bang',
    'fansipan': 'lao-cai',
    'sapa': 'lao-cai',
    'lao cai': 'lao-cai',
  };

  for (const [alias, slug] of Object.entries(aliasMap)) {
    if (norm.includes(alias)) {
      const match = VIETNAM_34_PROVINCES.find(p => p.slug === slug || p.id === slug);
      if (match) return match;
    }
  }

  // Exact province name match
  for (const p of VIETNAM_34_PROVINCES) {
    const pNorm = normalizeText(p.name);
    if (norm.includes(pNorm)) {
      return p;
    }
  }

  return null;
}

/**
 * Intelligent local fallback generator when API is offline or key is not provided
 */
function generateLocalFallbackResponse(query: string, currentProvinceId?: string): MapAiResponse {
  const detected = detectProvinceFromText(query);
  const targetId = detected?.id || currentProvinceId || 'ha-noi';
  const province = VIETNAM_34_PROVINCES.find(p => p.id === targetId) || VIETNAM_34_PROVINCES[0];
  const detail = getProvinceCultureData(province.id, province.name);
  const normQuery = normalizeText(query);

  let text = '';
  const culturalTags = [detail.regionName, detail.heritageType || 'Di sản văn hóa'];

  if (normQuery.includes('an') || normQuery.includes('am thuc') || normQuery.includes('dac san') || normQuery.includes('food')) {
    text = `✨ **Khám phá Ẩm thực trứ danh tại ${province.name}**\n\n${province.name} mang nét đặc trưng ẩm thực độc đáo của vùng đất ${detail.regionName}:\n\n` +
      detail.specialties.map((s) => `* **${s}**`).join('\n') +
      `\n\n💡 *Từ vựng di sản tiếng Anh:* **Local Specialty** (\`/ˈləʊ.kəl ˈspeʃ.əl.ti/\` - Đặc sản địa phương) & **Culinary Heritage** (\`/ˈkʌl.ɪ.nər.i ˈher.ɪ.tɪdʒ/\`).`;
  } else if (normQuery.includes('lo trinh') || normQuery.includes('tour') || normQuery.includes('itinerary') || normQuery.includes('ngay')) {
    text = `🗺️ **Gợi ý Hành trình Khám phá Di sản tại ${province.name}**\n\n` +
      detail.itinerary.map((it) => `* **${it}**`).join('\n') +
      `\n\n📌 *Lời khuyên hành trình:* ${detail.travelTips}`;
  } else if (normQuery.includes('tieng anh') || normQuery.includes('english') || normQuery.includes('vocab')) {
    text = `📖 **Bộ Từ Vựng Tiếng Anh Di Sản về ${province.name}**\n\n` +
      detail.englishVocab.map((v) => `* **${v.word}** \`${v.ipa}\`: *${v.meaning}*`).join('\n') +
      `\n\n*Hãy thử áp dụng những từ vựng học thuật này vào bài viết hoặc phần thi thuyết trình về văn hóa Việt Nam nhé!*`;
  } else {
    text = `🏛️ **Giới thiệu Văn hóa & Di sản tại ${province.name}**\n\n` +
      `${detail.summary}\n\n` +
      `**Điểm đến tiêu biểu:**\n` +
      detail.landmarks.slice(0, 4).map((l) => `* ${l}`).join('\n') +
      `\n\n**Món ngon không thể bỏ qua:** ${detail.specialties.slice(0, 3).join(', ')}.`;
  }

  return {
    text,
    focusedProvinceId: province.id,
    suggestedItinerary: detail.itinerary,
    culturalTags,
  };
}

/**
 * Main service to send prompt to Gemini Live/REST API with robust error boundary
 */
export async function sendMapAiPrompt(
  prompt: string,
  history: ChatMessage[] = [],
  currentSelectedProvinceId?: string
): Promise<MapAiResponse> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  const modelName = (import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash').trim();

  // If no API key configured or invalid placeholder, use rich local intelligence engine
  if (!apiKey || apiKey.startsWith('AQ.Ab8RN6JMaHFJUzjpELT3IWoO') === false && apiKey.length < 10) {
    return generateLocalFallbackResponse(prompt, currentSelectedProvinceId);
  }

  try {
    const detectedProvince = detectProvinceFromText(prompt);
    const activeProvinceId = detectedProvince?.id || currentSelectedProvinceId;
    const activeProvinceData = activeProvinceId ? getProvinceCultureData(activeProvinceId) : null;

    const contextAddition = activeProvinceData
      ? `\n[Ngữ cảnh tỉnh thành đang chọn: ${activeProvinceData.name} (${activeProvinceData.regionName}). Thủ phủ: ${activeProvinceData.capital}. Danh lam: ${activeProvinceData.landmarks.join(', ')}. Đặc sản: ${activeProvinceData.specialties.join(', ')}]`
      : '';

    // Convert chat history
    const contents = history.slice(-6).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    contents.push({
      role: 'user',
      parts: [{ text: prompt + contextAddition }],
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Switching to local cultural intelligence.`);
      return generateLocalFallbackResponse(prompt, currentSelectedProvinceId);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return generateLocalFallbackResponse(prompt, currentSelectedProvinceId);
    }

    const matchedProvinceInResponse = detectProvinceFromText(candidateText) || detectedProvince;
    const finalProvinceId = matchedProvinceInResponse?.id || currentSelectedProvinceId;
    const finalDetail = finalProvinceId ? getProvinceCultureData(finalProvinceId) : null;

    return {
      text: candidateText,
      focusedProvinceId: finalProvinceId,
      suggestedItinerary: finalDetail?.itinerary,
      culturalTags: finalDetail ? [finalDetail.regionName, finalDetail.heritageType || 'Di sản văn hóa'] : [],
    };
  } catch (err) {
    console.warn('Gemini API call failed, using local engine:', err);
    return generateLocalFallbackResponse(prompt, currentSelectedProvinceId);
  }
}
