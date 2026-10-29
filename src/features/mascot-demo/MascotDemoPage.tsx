import { useEffect, useState } from 'react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowLeft, ArrowUpRight, Check, CirclePause, Hand, MessageCircle, Moon, MousePointer2, Play, Award, Sun, VolumeX } from 'lucide-react';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import type { OwlState } from '@/components/mascot/OwlMascot';
import './mascot-demo.css';

const STATES = [
  { id: 'idle', name: 'Chờ', caption: 'Dõi theo con trỏ, chớp mắt nhẹ.', icon: MousePointer2, message: 'Mình ở đây. Hôm nay ta khám phá đâu nhỉ?', duration: 6500 },
  { id: 'talking', name: 'Nói chuyện', caption: 'Mấp máy mỏ, nhún theo nhịp nói.', icon: MessageCircle, message: 'Bạn biết không, mỗi vùng đất đều có một câu chuyện…', duration: 6000 },
  { id: 'celebrating', name: 'Chúc mừng', caption: 'Cười tươi, nảy vui cùng những tia sáng.', icon: Award, message: 'Làm tốt lắm! Thêm một điều thú vị được khám phá.', duration: 4500 },
  { id: 'sleeping', name: 'Ngủ gật', caption: 'Lim dim, thở chậm và gật gù.', icon: Moon, message: 'Mình nghỉ mắt một chút… Chạm để gọi mình nhé.', duration: 6000 },
] as const;

export function MascotDemoPage() {
  const [state, setState] = useState<OwlState>('idle');
  const [autoplay, setAutoplay] = useState(false);
  const [dark, setDark] = useState(false);
  const [size, setSize] = useState(280);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const [assets, setAssets] = useState<'loading' | 'ready' | 'error'>('loading');
  const current = STATES.find(item => item.id === state)!;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduceMotion(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let active = true;
    const images = ['directions', 'reactions'].map(sheet => new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(); image.onerror = reject;
      image.src = `${import.meta.env.BASE_URL}mascots/owl-${sheet}.webp`;
    }));
    Promise.all(images).then(() => { if (active) setAssets('ready'); }).catch(() => { if (active) setAssets('error'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!autoplay || assets !== 'ready') return;
    const timer = window.setTimeout(() => setState(STATES[(STATES.findIndex(item => item.id === state) + 1) % STATES.length].id), current.duration);
    return () => window.clearTimeout(timer);
  }, [autoplay, state, current.duration, assets]);

  const selectState = (next: OwlState) => { setAutoplay(false); setState(next); };
  const motionReduced = reduceMotion || systemReduceMotion;

  return (
    <div className="mascot-lab" data-theme={dark ? 'night' : 'day'}>
      <div className="mascot-lab__shell">
        <header className="mascot-lab__header">
          <Link to="/playground" className="mascot-lab__back"><ArrowLeft size={16} /> Về AI Map</Link>
          <span className="mascot-lab__brand">VieCultures <span>/</span> Mascot Lab</span>
          <button className="mascot-lab__theme" type="button" aria-label={dark ? 'Dùng nền sáng' : 'Dùng nền tối'} onClick={() => setDark(value => !value)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </header>

        <div className="mascot-lab__intro">
          <p className="mascot-lab__eyebrow"><span /> THỬ NGHIỆM 01 · BẠN ĐỒNG HÀNH AI MAP</p>
          <h1>Một người bạn nhỏ.<br /><em>Nhiều điều muốn kể.</em></h1>
          <p>Cùng cú mèo thử một chút tò mò, một chút hào hứng<br className="mascot-lab__desktop-break" /> và cả những phút… buồn ngủ.</p>
        </div>

        <div className="mascot-lab__workspace">
          <section className="mascot-lab__stage" aria-label="Sân khấu cú mèo" data-state={state} data-reduced={motionReduced}>
            <div className="mascot-lab__stage-top"><span><span className="mascot-lab__status-dot" /> {autoplay ? 'ĐANG CHẠY LẦN LƯỢT' : 'XEM TRỰC TIẾP'}</span><span>CÚ MÈO / 01</span></div>
            <div className="mascot-lab__bubble" aria-live="polite" aria-atomic="true">{current.message}</div>
            <div className="mascot-lab__owl-area">
              <div className="mascot-lab__orbit mascot-lab__orbit--outer" /><div className="mascot-lab__orbit" />
              <div className="mascot-lab__shadow" />
              {assets === 'ready' ? <OwlMascot state={state} size={size} reducedMotion={motionReduced} onWake={() => selectState('idle')} /> : <p role="status">{assets === 'error' ? 'Chưa tải được ảnh cú mèo. Hãy tải lại trang.' : 'Cú mèo đang đến…'}</p>}
            </div>
            <div className="mascot-lab__stage-bottom"><span><Hand size={15} /> {state === 'sleeping' ? 'Chạm cú mèo để đánh thức' : state === 'idle' ? 'Di chuột quanh mình hoặc chạm thử' : 'Chạm cú mèo để trở về chờ'}</span><span className="mascot-lab__state-pill">{current.name}</span></div>
          </section>

          <aside className="mascot-lab__controls" aria-label="Điều khiển hoạt ảnh">
            <div className="mascot-lab__control-heading"><span>CHỌN MỘT TRẠNG THÁI</span><span>04</span></div>
            <div className="mascot-lab__states">{STATES.map((item, index) => {
              const Icon = item.icon;
              return <button key={item.id} type="button" className="mascot-lab__state-button" aria-pressed={state === item.id} onClick={() => selectState(item.id)}><span className="mascot-lab__state-icon"><Icon size={20} /></span><span><strong>{item.name}</strong><small>{item.caption}</small></span><span className="mascot-lab__state-number">{state === item.id ? <Check size={16} /> : `0${index + 1}`}</span></button>;
            })}</div>
            <button type="button" className="mascot-lab__play" aria-pressed={autoplay} disabled={assets !== 'ready'} onClick={() => setAutoplay(value => !value)}>{autoplay ? <CirclePause size={18} /> : <Play size={18} />} {autoplay ? 'Dừng ở trạng thái này' : 'Chạy lần lượt cả 4 trạng thái'}</button>
            <div className="mascot-lab__settings">
              <label htmlFor="owl-size">Kích thước cú mèo <span>{size}px</span></label>
              <input id="owl-size" type="range" min="180" max="300" step="10" value={size} onChange={event => setSize(Number(event.target.value))} />
              <label className="mascot-lab__reduce"><input type="checkbox" checked={motionReduced} disabled={systemReduceMotion} onChange={event => setReduceMotion(event.target.checked)} /><span>Giảm chuyển động{systemReduceMotion ? ' (theo thiết bị)' : ''}</span></label>
            </div>
            <p className="mascot-lab__note"><VolumeX size={15} /> Bản thử chuyển động, không phát âm thanh. Nói chuyện đang được mô phỏng bằng biểu cảm có sẵn.</p>
          </aside>
        </div>
        <footer className="mascot-lab__footer"><span>Một chút sống động cho hành trình khám phá.</span><a href="https://github.com/nilbuild/page-mascot" target="_blank" rel="noreferrer">Artwork & nền tảng: page-mascot · MIT <ArrowUpRight size={13} /></a></footer>
      </div>
    </div>
  );
}
