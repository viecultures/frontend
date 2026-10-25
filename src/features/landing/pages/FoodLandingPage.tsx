import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Bookmark, Headphones, Menu, Pause, Play, RotateCcw, X } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { getPublishedSeries } from '@/data/series';
import type { SeriesMetadata } from '@/data/series/types';
import { PATHS, paths } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';
import '../food-landing.css';

const cuisineSeries = getPublishedSeries().filter((series) => series.theme === 'cuisine');
const featuredSeries = cuisineSeries.find((series) => series.id === 'pho') ?? cuisineSeries[0];
const otherSeries = cuisineSeries.filter((series) => series.id !== featuredSeries?.id);

const firstChapterPath = (series: SeriesMetadata | undefined) =>
  series?.chapters[0] ? paths.reader({ story: series.chapters[0].id }) : PATHS.discovery;

const LEARNING_STEPS = [
  { icon: BookOpen, number: '01', title: 'Taste the story', copy: 'Follow a dish from its ingredients to the people and places behind it.' },
  { icon: Headphones, number: '02', title: 'Hear the language', copy: 'Read in English and Vietnamese, then listen to the words in context.' },
  { icon: Bookmark, number: '03', title: 'Keep what stays', copy: 'Save useful expressions and return to them with flashcards.' },
];

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  enabled: boolean;
}

const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, enabled }) => (
  <motion.div
    className={className}
    initial={enabled ? { opacity: 0, y: 46 } : false}
    whileInView={enabled ? { opacity: 1, y: 0 } : undefined}
    animate={enabled ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.18 }}
    transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const FoodLandingPage: React.FC = () => {
  const navigate = useAppNavigate();
  const reducedMotion = useReducedMotion();
  const [motionOn, setMotionOn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const canAnimate = !reducedMotion && motionOn;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const openStory = (series: SeriesMetadata | undefined) => navigate(firstChapterPath(series));
  const navItems = [
    { href: '#stories', label: 'Stories' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#journey', label: 'The journey' },
  ];

  return (
    <div className="food-landing">
      {canAnimate && <motion.div className="food-scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />}
      <header className="food-header">
        <div className="food-container food-header-inner">
          <Link to={PATHS.landingConcept} className="food-brand" aria-label="VieCultures food stories — back to top"><BrandLogo size="md" theme="light" /></Link>
          <nav className="food-desktop-nav" aria-label="Landing navigation">
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
          <div className="food-header-actions">
            <button type="button" className="food-motion-toggle" onClick={() => setMotionOn((on) => !on)} aria-label={canAnimate ? 'Pause page motion' : 'Enable page motion'} title={canAnimate ? 'Pause page motion' : 'Enable page motion'} disabled={!!reducedMotion}>
              {canAnimate ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
            </button>
            <button type="button" className="food-button food-button-small" onClick={() => openStory(featuredSeries)}>Start reading <ArrowUpRight size={16} aria-hidden="true" /></button>
            <button type="button" className="food-menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="food-mobile-nav" aria-expanded={menuOpen}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && <nav id="food-mobile-nav" className="food-mobile-nav food-container" aria-label="Mobile landing navigation">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}
          <button type="button" onClick={() => { setMenuOpen(false); openStory(featuredSeries); }}>Start reading <ArrowUpRight size={16} aria-hidden="true" /></button>
        </nav>}
      </header>

      <main>
        <section className="food-hero" aria-labelledby="food-title">
          <div className="food-container food-hero-grid">
            <div className="food-hero-copy">
              <motion.div initial={canAnimate ? { opacity: 0, y: 24 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
                <span className="food-eyebrow"><span className="food-eyebrow-line" /> ENGLISH, SERVED WITH STORIES</span>
              </motion.div>
              <motion.h1 id="food-title" initial={canAnimate ? { opacity: 0, y: 42 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
                Every dish has <em>a story to tell.</em>
              </motion.h1>
              <motion.p initial={canAnimate ? { opacity: 0, y: 26 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, delay: 0.27 }}>
                Come closer to Vietnam through its food. Discover where a dish comes from, how people make it, and the English to share its story.
              </motion.p>
              <motion.div className="food-hero-actions" initial={canAnimate ? { opacity: 0, y: 24 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, delay: 0.42 }}>
                <button type="button" className="food-button" onClick={() => openStory(featuredSeries)}>Start with a bowl of phở <ArrowUpRight size={18} aria-hidden="true" /></button>
                <a href="#stories" className="food-text-link">Explore the stories <ArrowDown size={18} aria-hidden="true" /></a>
              </motion.div>
              <motion.div className="food-hero-footnote" initial={canAnimate ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.6 }}>
                <span>{cuisineSeries.length} food series ready to read</span><span>Read in English & Vietnamese</span>
              </motion.div>
            </div>
            <motion.div className="food-hero-art" initial={canAnimate ? { opacity: 0, y: 62, scale: 0.96 } : false} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.15, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              <div className="food-hero-arch"><img src="/images/series/pho-hanoi.jpg" alt="A bowl of phở beside Hanoi's Hoàn Kiếm Lake" width="1024" height="576" fetchPriority="high" /></div>
              <div className="food-hero-inset"><img src="/images/series/bun-cha.jpg" alt="Bún chả with herbs and noodles" width="1024" height="576" /></div>
              <div className="food-hero-stamp" aria-hidden="true"><span>01</span><small>Begin with<br />a story</small></div>
              <p className="food-hero-art-caption">A familiar taste. A deeper way to learn.</p>
            </motion.div>
          </div>
          <div className="food-container food-hero-bottom"><span>FROM THE TABLE TO THE PAGE</span><span>SCROLL TO EXPLORE <ArrowDown size={15} aria-hidden="true" /></span></div>
        </section>

        <section id="how-it-works" className="food-section food-learning" aria-labelledby="food-learning-title">
          <div className="food-container">
            <Reveal enabled={canAnimate} className="food-section-heading"><span className="food-eyebrow">01 / A WAY INTO THE LANGUAGE</span><h2 id="food-learning-title">More than a recipe. <em>A way to understand.</em></h2><p>Begin with one dish, then follow the language and the lives around it.</p></Reveal>
            <div className="food-learning-grid">
              {LEARNING_STEPS.map(({ icon: Icon, number, title, copy }, index) => <Reveal key={title} enabled={canAnimate} delay={index * 0.15} className="food-learning-step"><span className="food-learning-top"><span>{number}</span><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></span><h3>{title}</h3><p>{copy}</p></Reveal>)}
            </div>
          </div>
        </section>

        <section id="stories" className="food-section food-stories" aria-labelledby="food-stories-title">
          <div className="food-container">
            <Reveal enabled={canAnimate} className="food-section-heading food-heading-row"><div><span className="food-eyebrow">02 / THE STORIES ON OUR TABLE</span><h2 id="food-stories-title">Find a dish, <em>stay for the story.</em></h2></div><p>Each series opens one familiar food through three connected chapters.</p></Reveal>
            {featuredSeries && <Reveal enabled={canAnimate} className="food-featured-story"><div className="food-featured-image"><img src={featuredSeries.imageUrl} alt="Illustrated bowl of phở in Hanoi" width="1024" height="576" loading="lazy" /></div><div className="food-featured-copy"><span className="food-card-kicker">FEATURED SERIES · {featuredSeries.chapters.length} CHAPTERS</span><h3>{featuredSeries.titleVi}</h3><p>{featuredSeries.description}</p><button type="button" className="food-text-link" onClick={() => openStory(featuredSeries)}>Read the first chapter <ArrowUpRight size={18} aria-hidden="true" /></button></div></Reveal>}
            <div className="food-series-grid">
              {otherSeries.map((series, index) => <Reveal key={series.id} enabled={canAnimate} delay={(index % 3) * 0.12} className="food-series-card"><button type="button" onClick={() => openStory(series)} aria-label={`Read ${series.titleVi}`}><span className="food-series-image"><img src={series.imageUrl} alt="" width="1024" height="576" loading="lazy" /><span className="food-series-arrow"><ArrowUpRight size={20} aria-hidden="true" /></span></span><span className="food-card-kicker">{series.chapters.length} CHAPTERS · {series.region === 'north' ? 'NORTHERN VIETNAM' : 'SOUTHERN VIETNAM'}</span><strong>{series.titleVi}</strong><small>{series.title}</small></button></Reveal>)}
            </div>
          </div>
        </section>

        {featuredSeries && <section id="journey" className="food-section food-deep-dive" aria-labelledby="food-deep-title"><div className="food-container food-deep-grid"><Reveal enabled={canAnimate} className="food-deep-visual"><img src={featuredSeries.imageUrl} alt="Phở and the landscape of Hanoi" width="1024" height="576" loading="lazy" /><span>ONE DISH · MANY LAYERS</span></Reveal><div className="food-deep-copy"><Reveal enabled={canAnimate}><span className="food-eyebrow">03 / GO DEEPER</span><h2 id="food-deep-title">One bowl of phở. <em>Three chapters to explore.</em></h2><p>From the kitchen to the morning street, follow one dish through the details that give it meaning.</p></Reveal><ol className="food-chapter-list">{featuredSeries.chapters.map((chapter, index) => <li key={chapter.id}><Reveal enabled={canAnimate} delay={index * 0.14}><button type="button" onClick={() => navigate(paths.reader({ story: chapter.id }))}><span className="food-chapter-number">0{index + 1}</span><span><strong>{chapter.titleEn}</strong><small>{chapter.summary}</small></span><ArrowUpRight size={18} aria-hidden="true" /></button></Reveal></li>)}</ol></div></div></section>}

        <section className="food-section food-regions" aria-labelledby="food-regions-title"><div className="food-container"><Reveal enabled={canAnimate} className="food-section-heading"><span className="food-eyebrow">04 / A JOURNEY STILL GROWING</span><h2 id="food-regions-title">A table as varied <em>as Vietnam.</em></h2><p>Our first published food stories begin in the North. More regional tables can join the journey as their stories are ready.</p></Reveal><div className="food-region-grid"><Reveal enabled={canAnimate} className="food-region-card is-ready"><span>01 / THE NORTH</span><h3>Start here</h3><p>Explore phở, bún chả, chả cá and the everyday traditions behind them.</p><a href="#stories" className="food-text-link">Explore published stories <ArrowRight size={17} aria-hidden="true" /></a></Reveal><Reveal enabled={canAnimate} delay={0.12} className="food-region-card"><span>02 / THE CENTRAL REGION</span><h3>More to discover</h3><p>Food stories from Central Vietnam will appear here when their chapters are ready.</p><small>IN DEVELOPMENT</small></Reveal><Reveal enabled={canAnimate} delay={0.24} className="food-region-card"><span>03 / THE SOUTH</span><h3>More to discover</h3><p>Southern food series will join the published collection when their chapters are ready.</p><small>IN DEVELOPMENT</small></Reveal></div></div></section>

        <section className="food-final" aria-labelledby="food-final-title"><div className="food-container food-final-inner"><Reveal enabled={canAnimate}><span className="food-eyebrow">YOUR NEXT STORY IS WAITING</span><h2 id="food-final-title">Begin with a taste.<br /><em>Leave with a story.</em></h2><p>Pick a familiar dish and discover how much language lives around it.</p><button type="button" className="food-button food-button-light" onClick={() => openStory(featuredSeries)}>Read your first chapter <ArrowUpRight size={18} aria-hidden="true" /></button></Reveal><div className="food-final-mark" aria-hidden="true"><BookOpen size={86} strokeWidth={0.8} /><RotateCcw size={40} strokeWidth={1} /></div></div></section>
      </main>
    </div>
  );
};

export default FoodLandingPage;
