import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { PATHS } from '@/routes/paths';
import type importedDrafts from '@/data/series/drafts/exe101.json';
import { API_BASE_URL } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';
import './cuisine-draft-preview.css';

type Level = 'Level 1' | 'Level 2' | 'Level 3';

const LEVELS: Level[] = ['Level 1', 'Level 2', 'Level 3'];

const photoReferences: Record<string, string> = {
  'goi-ca-nhech': 'https://drive.google.com/file/d/1Ct2-xOJLIxdh5lY9714U4RH0qOxZgSCe/view',
  'be-chao': 'https://drive.google.com/file/d/18xdfkAQG1lzuY3UWZVRAgm1lrS7gQt4d/view',
  'xoi-nep-nuong': 'https://drive.google.com/file/d/187KbecbEFpAppOnf9KhylkjJCGoYwMD4/view',
  'banh-chung-lang-dam': 'https://drive.google.com/file/d/1K27gnqJ1lloewfQLpRfF0j5_6lzHCfcM/view',
  'khau-nhuc-lang-son': 'https://drive.google.com/file/d/1HIwAoVKq5AcZX6tsB7rXOQRgHcw9_LOn/view',
  'thang-co': 'https://drive.google.com/file/d/1XZ9oCBcxdDlkDSP8na2NpCWQAWehb_Vn/view',
};

export default function CuisineDraftPreviewPage() {
  const { lang } = useParams<{ lang?: string }>();
  const [drafts, setDrafts] = useState<typeof importedDrafts>([]);
  const [loadError, setLoadError] = useState('');
  const [seriesId, setSeriesId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [level, setLevel] = useState<Level>('Level 2');

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoadError('Cần đăng nhập quản trị để xem nội dung nháp.');
      return;
    }
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/v1/admin/cuisine-drafts`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    }).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }).then(data => {
      if (Array.isArray(data)) {
        setDrafts(data as typeof importedDrafts);
      } else {
        setLoadError('Phản hồi từ BE không đúng định dạng.');
      }
    }).catch(error => {
      if (error.name !== 'AbortError') setLoadError('Không tải được bản nháp từ BE.');
    });
    return () => controller.abort();
  }, []);

  const series = useMemo(() => drafts.find(item => item.id === seriesId) ?? drafts[0], [seriesId]);
  const chapter = series?.chapters.find(item => item.id === chapterId) ?? series?.chapters[0];
  const variant = chapter?.variants[level];
  const hasEnglish = Boolean(variant?.englishParagraphs.length);
  const hasTranslation = Boolean(variant?.vietnameseParagraphs.length);
  const ready = Boolean(variant?.completePairing && variant.vocabularySource.trim());

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px', color: '#183b36' }}>
      <Link to={PATHS.admin}>← Quản trị</Link>
      <header style={{ margin: '24px 0 32px' }}>
        <p style={{ color: '#9a6718', fontWeight: 700, margin: 0 }}>Nguồn biên tập nội dung</p>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', margin: '8px 0' }}>Series ẩm thực EXE101</h1>
        <p style={{ maxWidth: 760 }}>Xem dữ liệu nguồn từ BE. Các cấp độ đủ cặp đoạn và từ vựng đã được mở công khai; cấp độ còn thiếu tiếp tục ở đây để biên tập.</p>
        {loadError && <p role="alert" style={{ color: '#a43c2a' }}>{loadError}</p>}
      </header>

      <div className="cuisine-draft-layout">
        <aside style={{ display: 'grid', gap: 8 }} aria-label="Chọn series">
          {drafts.map(item => (
            <button key={item.id} type="button" onClick={() => { setSeriesId(item.id); setChapterId(item.chapters[0]?.id ?? ''); }}
              aria-current={item.id === series?.id ? 'true' : undefined}
              style={{ textAlign: 'left', border: `1px solid ${item.id === series?.id ? '#0e6154' : '#ddd2bd'}`, borderRadius: 12, padding: 14, background: item.id === series?.id ? '#e5f2ed' : '#fffdf7', cursor: 'pointer', color: 'inherit' }}>
              <strong>{item.titleVi}</strong><br />
              <small>{item.chapters.length} bài · {item.sourceSheet} · Nguồn biên tập</small>
            </button>
          ))}
          <div style={{ border: '1px dashed #c8b999', borderRadius: 12, padding: 14, background: '#fffaf0' }}>
            <strong>Giữ nội dung hiện tại</strong>
            <p style={{ marginBottom: 0 }}>Cơm Cháy Ninh Bình và Bánh Cáy Làng Nguyễn tiếp tục dùng bài đọc, từ vựng và ảnh hiện tại theo quyết định của nhóm.</p>
          </div>
        </aside>

        <section aria-label="Bài nháp" style={{ minWidth: 0 }}>
          {series && <>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              {series.imageUrl && <img src={series.imageUrl} alt="" style={{ width: 180, aspectRatio: '16 / 10', objectFit: 'cover', borderRadius: 12 }} />}
              <div>
                <h2 style={{ margin: '0 0 6px' }}>{series.titleVi}</h2>
                <p style={{ margin: '0 0 8px' }}>{series.provinceId} · {series.chapters.length} bài · Nguồn biên tập</p>
                {photoReferences[series.id] && <a href={photoReferences[series.id]} target="_blank" rel="noopener noreferrer">Xem ảnh tham khảo trên Drive</a>}
              </div>
            </div>
            <nav aria-label="Chọn bài" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {series.chapters.map(item => <button key={item.id} type="button" onClick={() => setChapterId(item.id)}
                aria-current={item.id === chapter?.id ? 'true' : undefined}
                style={{ border: '1px solid #c8b999', borderRadius: 8, padding: '8px 12px', background: item.id === chapter?.id ? '#e5f2ed' : '#fff', color: 'inherit', cursor: 'pointer' }}>Bài {item.order}</button>)}
            </nav>
            <nav aria-label="Chọn cấp độ" style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {LEVELS.map(item => <button key={item} type="button" onClick={() => setLevel(item)}
                aria-pressed={item === level} style={{ border: '1px solid #c8b999', borderRadius: 8, padding: '8px 12px', background: item === level ? '#0e6154' : '#fff', color: item === level ? '#fff' : '#183b36', cursor: 'pointer' }}>{item}</button>)}
            </nav>
            <h3 style={{ fontSize: 25, marginBottom: 8 }}>{variant?.titleEn || chapter?.titleEn || chapter?.titleVi}</h3>
            <p style={{ color: ready ? '#246b4b' : '#9a6718' }}>{ready ? 'Đã tách được cặp đoạn; vẫn cần duyệt biên tập' : 'Cần rà nội dung hoặc ghép cặp đoạn trước khi xuất bản'} · Nguồn: {variant?.sourceCell}</p>
            <div className="cuisine-draft-reading">
              <article style={{ background: '#fffdf7', border: '1px solid #e5dac6', borderRadius: 12, padding: 20 }}>
                <h4>English reading</h4>
                {hasEnglish ? variant?.englishParagraphs.map((text, index) => <p key={index} style={{ lineHeight: 1.8 }}>{text}</p>) : <p>Chưa có bài đọc tiếng Anh.</p>}
              </article>
              <article style={{ background: '#fffdf7', border: '1px solid #e5dac6', borderRadius: 12, padding: 20 }}>
                <h4>Bản dịch tiếng Việt</h4>
                {hasTranslation ? variant?.vietnameseParagraphs.map((text, index) => <p key={index} style={{ lineHeight: 1.8 }}>{text}</p>) : <p>Chưa có bản dịch.</p>}
              </article>
            </div>
            <section style={{ background: '#fffaf0', border: '1px solid #e5dac6', borderRadius: 12, padding: 20, marginTop: 20 }}>
              <h4>Từ vựng trong nguồn</h4>
              <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{variant?.vocabularySource || 'Chưa có danh sách từ vựng trong ô nguồn.'}</pre>
            </section>
          </>}
        </section>
      </div>
      <p style={{ marginTop: 32, color: '#65756d' }}>Đường dẫn xem trước: /{lang || 'vi'}/admin/cuisine-drafts</p>
    </main>
  );
}
