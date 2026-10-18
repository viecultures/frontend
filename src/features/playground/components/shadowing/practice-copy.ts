// Keep presentation language separate from the recorder/player lifecycle.
const messages: Record<string, string> = {
  'Video đã dừng, tải đệm hoặc bị tua khi thu. Hãy thu lại; bản trước vẫn còn.': 'The video paused, buffered or skipped during recording. Try again; your previous recording is safe.',
  'Bộ nhớ phiên đã đầy. Xóa bớt bản thu trước khi thu tiếp.': 'Session storage is full. Delete a recording before continuing.',
  'Video chưa chạy đúng mốc câu. Bấm Play trên video rồi thử lại.': 'The video could not reach the sentence cue. Press Play on the video, then try again.',
  'Đã hủy thu.': 'Recording cancelled.',
  'Trình duyệt không phát được định dạng bản thu này. Hãy thu lại bằng trình duyệt hỗ trợ.': 'This browser cannot play the recording format. Record again using a supported browser.',
  'Trình duyệt cần HTTPS/localhost và hỗ trợ thu microphone.': 'Microphone recording requires HTTPS or localhost and a supported browser.',
  'Microphone đã ngắt kết nối. Hãy thu lại câu này.': 'The microphone disconnected. Record this sentence again.',
  'Đã đạt giới hạn bộ nhớ bản thu. Xóa bớt bản thu hoặc thu đoạn ngắn hơn.': 'Recording storage limit reached. Delete a recording or record a shorter sentence.',
  'Không ghi được audio. Bản thu trước vẫn được giữ.': 'Unable to record audio. Your previous recording is safe.',
  'Bản thu quá ngắn hoặc trống. Hãy thử lại.': 'The recording is empty or too short. Try again.',
  'Chưa được cấp quyền microphone. Hãy cho phép truy cập rồi thu lại; bản cũ vẫn còn.': 'Microphone access was denied. Allow access and try again; your previous recording is safe.',
  'Không mở được microphone. Kiểm tra quyền truy cập.': 'Unable to open the microphone. Check microphone permission.',
  'Đang phát': 'Playing', 'Đang tải video…': 'Buffering…', 'Tạm dừng': 'Paused', 'Đang chuẩn bị…': 'Preparing…',
};
export const practiceMessage = (message: string) => messages[message] ?? message;
