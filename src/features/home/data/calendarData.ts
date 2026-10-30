import { formatLunarString } from '@/utils/lunarCalendar';

export interface CalendarCardItem {
  id: string;
  title: string;
  quote: string;
  authorQuote?: string;
  creator: string;
  dateSolar: {
    day: string;
    weekday: string;
    monthYear: string;
  };
  dateLunar: string;
  imageUrl: string;
  caption: string;
  mascotType: 'tennis' | 'owl';
  category: 'humor' | 'heritage' | 'today';
}

export const CALENDAR_CARDS: CalendarCardItem[] = [
  {
    id: 'daily-loading',
    title: 'Linh hồn đang loading',
    quote: 'Tôi ổn. Chỉ là linh hồn đang loading. Có thể phản hồi sau khi hệ điều hành cảm xúc khởi động xong.',
    creator: 'VieCultures Daily',
    dateSolar: {
      day: '14',
      weekday: 'Thứ Sáu',
      monthYear: 'Tháng 2, 2025',
    },
    dateLunar: '15 tháng Chạp, Giáp Thìn',
    imageUrl: '/images/calendar/daily-loading.webp',
    caption: 'Linh hồn đang loading.',
    mascotType: 'tennis',
    category: 'humor',
  },
  {
    id: 'daily-caffeine',
    title: 'Caffeine và trách nhiệm',
    quote: 'Đi làm bằng niềm tin và 3 tiếng ngủ. Hệ điều hành hôm nay chạy bằng caffeine và trách nhiệm.',
    creator: 'VieCultures Daily',
    dateSolar: {
      day: '04',
      weekday: 'Thứ Năm',
      monthYear: 'Tháng 12, 2025',
    },
    dateLunar: '5 tháng Chạp, Giáp Thìn',
    imageUrl: '/images/calendar/daily-caffeine.webp',
    caption: 'Chạy bằng caffeine và trách nhiệm.',
    mascotType: 'tennis',
    category: 'humor',
  },
  {
    id: 'heritage-hanoi',
    title: 'Hồ Gươm Hà Nội',
    quote: '« Chữ tâm kia mới bằng ba chữ tài. »',
    authorQuote: 'Nguyễn Du · Truyện Kiều',
    creator: 'VieCultures Heritage',
    dateSolar: {
      day: '14',
      weekday: 'Thứ Sáu',
      monthYear: 'Tháng 3, 2025',
    },
    dateLunar: '15 Tháng Hai, Năm Ất Tỵ',
    imageUrl: '/images/calendar/heritage-hanoi.webp',
    caption: 'Chữ tâm kia mới bằng ba chữ tài.',
    mascotType: 'owl',
    category: 'heritage',
  },
  {
    id: 'heritage-saigon',
    title: 'Hoàng hôn sông Sài Gòn',
    quote: '« Không có gì quý hơn độc lập, tự do. »',
    authorQuote: 'Hồ Chí Minh',
    creator: 'VieCultures Heritage',
    dateSolar: {
      day: '22',
      weekday: 'Thứ Bảy',
      monthYear: 'Tháng 3, 2025',
    },
    dateLunar: '23 Tháng Hai, Năm Ất Tỵ',
    imageUrl: '/images/calendar/heritage-saigon.webp',
    caption: 'Không có gì quý hơn độc lập, tự do.',
    mascotType: 'owl',
    category: 'heritage',
  },
  {
    id: 'heritage-halong',
    title: 'Vịnh Hạ Long',
    quote: '« Hiền tài là nguyên khí của quốc gia. »',
    authorQuote: 'Thân Nhân Trung',
    creator: 'VieCultures Heritage',
    dateSolar: {
      day: '10',
      weekday: 'Thứ Năm',
      monthYear: 'Tháng 4, 2025',
    },
    dateLunar: '13 Tháng Ba, Năm Ất Tỵ',
    imageUrl: '/images/calendar/heritage-halong.webp',
    caption: 'Hiền tài là nguyên khí quốc gia.',
    mascotType: 'owl',
    category: 'heritage',
  },
  {
    id: 'heritage-mucangchai',
    title: 'Mù Cang Chải',
    quote: '« Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chứ không chịu khuất phục trước cường quyền. »',
    authorQuote: 'Bà Triệu · Lời truyền lại',
    creator: 'VieCultures Heritage',
    dateSolar: {
      day: '26',
      weekday: 'Thứ Hai',
      monthYear: 'Tháng 5, 2025',
    },
    dateLunar: '29 Tháng Tư, Năm Ất Tỵ',
    imageUrl: '/images/calendar/heritage-mucangchai.webp',
    caption: 'Cưỡi cơn gió mạnh, đạp luồng sóng dữ.',
    mascotType: 'owl',
    category: 'heritage',
  }
];

const WEEKDAY_NAMES_VI = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export function createTodayCalendarCard(): CalendarCardItem {
  const now = new Date();
  const dayStr = String(now.getDate()).padStart(2, '0');
  const weekdayStr = WEEKDAY_NAMES_VI[now.getDay()];
  const monthYearStr = `Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
  const lunarStr = formatLunarString(now);

  return {
    id: 'today-live',
    title: 'Hôm nay · Lịch Vạn Niên',
    quote: 'Hành trình vạn dặm bắt đầu từ một bước chân nhỏ. Mỗi ngày học một chút di sản, làm giàu tâm hồn.',
    authorQuote: 'VieCultures Companion',
    creator: 'VieCultures Daily',
    dateSolar: {
      day: dayStr,
      weekday: weekdayStr,
      monthYear: monthYearStr,
    },
    dateLunar: lunarStr,
    imageUrl: '/images/calendar/daily-loading.webp',
    caption: `${weekdayStr}, ${dayStr} · Âm lịch: ${lunarStr}`,
    mascotType: 'owl',
    category: 'today',
  };
}
