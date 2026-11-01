import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, Headphones, Layers, Mic, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Navbar } from '@/components/Navbar';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { PATHS } from '@/routes/paths';

const colors = [
  { name: 'Hành động', className: 'bg-action', value: 'action' },
  { name: 'Nền trang', className: 'bg-surface', value: 'surface' },
  { name: 'Nền nội dung', className: 'bg-surface-raised', value: 'surface-raised' },
  { name: 'Chữ chính', className: 'bg-ink', value: 'ink' },
  { name: 'Chữ phụ', className: 'bg-ink-faint', value: 'ink-faint' },
  { name: 'Điểm nhấn', className: 'bg-accent-soft', value: 'accent-soft' },
];

const brandColors = [
  { name: 'Kem sáng', className: 'bg-warm-ivory', token: 'warm-ivory', role: 'Nền chính' },
  { name: 'Kem giấy', className: 'bg-rice-paper', token: 'rice-paper', role: 'Nền phụ' },
  { name: 'Xanh trời', className: 'bg-sky-mist', token: 'sky-mist', role: 'Section và banner' },
  { name: 'Xanh horizon', className: 'bg-horizon-blue', token: 'horizon-blue', role: 'Card nổi bật' },
  { name: 'Teal núi', className: 'bg-mountain-teal', token: 'mountain-teal', role: 'Minh họa' },
  { name: 'Xanh di sản', className: 'bg-heritage-green', token: 'heritage-green', role: 'Chữ và nút chính' },
  { name: 'Vàng cổ', className: 'bg-antique-gold', token: 'antique-gold', role: 'Viền và trang trí' },
  { name: 'Hồng sen', className: 'bg-lotus-pink', token: 'lotus-pink', role: 'Điểm nhấn nhẹ' },
  { name: 'Be mây', className: 'bg-mist-cloud', token: 'mist-cloud', role: 'Divider và nền trung gian' },
];

const skills = [
  { icon: BookOpen, title: 'Đọc để hiểu', content: 'Bài đọc là trọng tâm. Bản dịch và từ vựng xuất hiện khi cần, không cạnh tranh với nội dung.' },
  { icon: Headphones, title: 'Nghe và chép', content: 'Một đoạn âm thanh, một ô trả lời. Transcript chỉ mở sau khi thử nghe hoặc khi người học cần hỗ trợ.' },
  { icon: Mic, title: 'Nói và nhại giọng', content: 'Nghe mẫu, thu âm, nghe lại. Mỗi bước làm rõ hành động tiếp theo, phản hồi sau lượt thực hành.' },
  { icon: Layers, title: 'Nhớ từ trong ngữ cảnh', content: 'Một thẻ tại một thời điểm. Người học nhớ lại trước khi mở nghĩa và tự đánh giá mức độ ghi nhớ.' },
];

// Development-only reference using the actual shared components.
export default function DesignSystemPage() {
  const navigate = useAppNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const wasDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', isDark);
    return () => {
      document.documentElement.classList.toggle('dark', wasDark);
    };
  }, [isDark]);

  return (
    <div>
      <div className="min-h-screen bg-surface text-ink-soft">
        <Navbar activeView="discovery" onNavigateToSection={navigate} />
        <main className="mx-auto max-w-6xl space-y-14 px-5 py-10 sm:px-8 sm:py-16">
          <header className="flex flex-col items-start justify-between gap-6 sm:flex-row">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-medium text-accent-ink">VieCultures · Hệ thống giao diện</p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">Ít phân tâm hơn.<br />Hiểu và nhớ nhiều hơn.</h1>
              <p className="max-w-prose text-base">Chữ dễ đọc, màu sắc có vai trò rõ ràng và mỗi thời điểm đều có một hành động chính để người học tiếp tục.</p>
            </div>
            <Button type="button" variant="outline" size="sm" aria-pressed={isDark} onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
              {isDark ? 'Xem giao diện sáng' : 'Xem giao diện tối'}
            </Button>
          </header>

          <section aria-labelledby="lesson-example" className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <Card className="space-y-6 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="cefr-b1">B1 · Trung cấp</Badge>
                <span className="text-sm text-ink-faint">Bài học mẫu · 5 phút đọc</span>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-medium text-accent-ink">Ẩm thực và đời sống</p>
                <h2 id="lesson-example" className="font-bold text-3xl leading-snug text-ink">Một buổi sáng ở Hà Nội</h2>
                <p className="max-w-prose text-reading">Trong một con ngõ nhỏ, hương phở nóng hòa cùng tiếng trò chuyện đầu ngày. Khám phá câu chuyện phía sau một món ăn quen thuộc và học cách kể lại bằng tiếng Anh.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
                <Button type="button" onClick={() => setIsModalOpen(true)}>Đọc bài mẫu <ArrowRight className="size-4" aria-hidden="true" /></Button>
                <Button type="button" variant="ghost" onClick={() => navigate(PATHS.discovery)}>Khám phá chủ đề</Button>
              </div>
            </Card>
            <div className="space-y-5 self-center">
              <h2 className="text-xl font-semibold text-ink">Nhìn là biết nên làm gì tiếp theo</h2>
              <p>Nút đặc dành cho hành động chính. Hành động phụ nhẹ hơn; nhãn trình độ và thời lượng chỉ cung cấp thông tin.</p>
              <p className="text-sm text-ink-faint">Card thông tin không nhấc lên khi rê chuột. Khoảng trắng tách nội dung; không cần bao quanh mọi thứ bằng viền vàng.</p>
            </div>
          </section>

          <section aria-labelledby="type-heading" className="space-y-6">
            <h2 id="type-heading" className="text-2xl font-semibold text-ink">Một hệ chữ, rõ từng vai trò</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="space-y-4">
                <p className="text-sm text-ink-faint">Be Vietnam Pro · Giao diện</p>
                <h3 className="text-xl font-semibold text-ink">Học điều bạn quan tâm</h3>
                <p>Nội dung và nút chính dùng cỡ 16px. Nhãn phụ từ 14px, không dùng chữ siêu nhỏ cho hướng dẫn học.</p>
                <p className="text-sm text-ink-faint">Tiếng Việt rõ dấu: ă, â, ê, ô, ơ, ư, đ · Trường học, di sản, ký ức.</p>
              </Card>
              <Card className="space-y-4">
                <p className="text-sm text-ink-faint">Be Vietnam Pro · Tiêu đề nổi bật</p>
                <h3 className="font-bold text-3xl text-ink">Chuyện nhỏ, hiểu biết lớn</h3>
                <p className="text-reading">Nội dung học dài dùng cỡ 18px, giãn dòng thoáng và dòng đọc vừa phải.</p>
              </Card>
            </div>
          </section>

          <section aria-labelledby="color-heading" className="space-y-6">
            <h2 id="color-heading" className="text-2xl font-semibold text-ink">Màu sắc có nhiệm vụ</h2>
            <p>Nền kem chiếm phần lớn giao diện, xanh trời dành cho các vùng nổi bật. Xanh đậm dành cho chữ và hành động chính; vàng và hồng chỉ làm điểm nhấn.</p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {brandColors.map(color => (
                <div key={color.token} className="space-y-2">
                  <div className={`h-20 rounded-xl border border-line ${color.className}`} aria-hidden="true" />
                  <p className="text-sm font-medium text-ink">{color.name} · {color.role}</p>
                  <p className="text-xs text-ink-faint">{color.token}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-ink-soft">Component dùng các vai trò bên dưới để tự cập nhật khi bảng màu chung thay đổi. Không gán lại màu thương hiệu trong CSS của từng trang.</p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {colors.map(color => (
                <div key={color.value} className="space-y-3">
                  <div className={`h-20 rounded-xl border border-line ${color.className}`} aria-hidden="true" />
                  <p className="text-sm font-medium text-ink">{color.name}</p>
                  <p className="text-xs text-ink-faint">{color.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="bamboo"><Check className="mr-1.5 size-4" aria-hidden="true" />Đã hoàn thành</Badge>
              <Badge variant="cefr-b1">Đang học</Badge>
              <Badge variant="cefr-b2">Cần ôn lại</Badge>
              <Badge variant="lacquer">Chưa lưu được</Badge>
            </div>
          </section>

          <section aria-labelledby="skills-heading" className="space-y-6">
            <h2 id="skills-heading" className="text-2xl font-semibold text-ink">Cùng ngôn ngữ thiết kế, khác cách học</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {skills.map(({ icon: Icon, title, content }) => (
                <Card key={title} className="space-y-4">
                  <Icon className="size-6 text-action" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-ink">{title}</h3>
                  <p>{content}</p>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="states-heading" className="space-y-6 border-t border-line pt-10">
            <h2 id="states-heading" className="text-2xl font-semibold text-ink">Trạng thái component</h2>
            <p className="text-sm text-ink-faint">Khu vực kiểm tra tương tác; dùng Tab để kiểm tra focus. Các nút mẫu mở cùng một hộp thoại.</p>
            <div className="flex flex-wrap gap-3">
              <Button type="button" size="sm" onClick={() => setIsModalOpen(true)}>Nút nhỏ</Button>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(true)}>Hành động phụ</Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(true)}>Nút có viền</Button>
              <Button type="button" variant="gold" onClick={() => setIsModalOpen(true)}>Điểm nhấn</Button>
              <Button type="button" size="lg" disabled>Chưa khả dụng</Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Nghe mẫu" onClick={() => setIsModalOpen(true)}><Headphones className="size-5" /></Button>
            </div>
          </section>
        </main>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Một buổi sáng ở Hà Nội">
          <div className="space-y-6">
            <p className="text-reading">In a quiet Hanoi alley, the aroma of hot phở fills the morning air. Neighbours gather around small tables to share a familiar start to the day.</p>
            <p className="text-sm text-ink-faint">Bài mẫu minh họa hệ chữ và hộp thoại. Dùng Escape để đóng và trở lại nút vừa bấm.</p>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Đóng bài mẫu</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
