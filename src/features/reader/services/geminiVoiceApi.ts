/**
 * geminiVoiceApi.ts — Client service to call Spring Boot Backend for Google Gemini Voice Generation
 */

export interface GenerateVoiceResult {
  success: boolean;
  audioUrl?: string;
  filename?: string;
  voiceName?: string;
  message?: string;
  timestamp?: string;
}

export async function requestGeminiVoiceGeneration(
  textContent: string,
  voiceName: string,
  outputFilename?: string
): Promise<GenerateVoiceResult> {
  const backendUrl = "http://localhost:8080/api/voice/generate";
  const res = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      textContent,
      voiceName,
      outputFilename,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Lỗi HTTP ${res.status} từ backend Spring Boot`);
  }

  return await res.json();
}
