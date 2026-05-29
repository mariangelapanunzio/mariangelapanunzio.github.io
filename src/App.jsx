import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaLinkedin, FaEnvelope, FaGithub, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './i18n';

// Varianti animazione
const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// AVATAR SEMPLIFICATO (no rotazione per performance)
const InteractiveAvatar = ({ mousePosition }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (mousePosition) {
      setTilt({
        x: (mousePosition.y / window.innerHeight - 0.5) * 8,
        y: (mousePosition.x / window.innerWidth - 0.5) * 8,
      });
    }
  }, [mousePosition]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      className="relative w-full h-full"
    >
      {/* Glow dinamico */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-[2rem] rotate-6 opacity-50 blur-3xl animate-pulse" />
      
      {/* Foto */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/20 dark:border-white/10">
        <img
          src="/mp.png"
          alt="Mariangela"
          className="w-full h-full object-cover brightness-100 dark:brightness-95 hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
};

// Componente SkipToContent
const SkipToContent = ({ t }) => (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-pink-500 focus:text-white focus:rounded-lg focus:font-bold text-sm"
    >
      {t('skip_to_content')}
    </a>
);

// Noise Overlay
const NoiseOverlay = () => (
    <div 
      className="fixed inset-0 z-50 pointer-events-none opacity-[0.05] mix-blend-overlay" 
      style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      aria-hidden="true"
    />
);

export default function App() {
    const [dark, setDark] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState(null);
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    // Gestione tema
    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setDark(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDark(prefersDark);
      }
    }, []);

    useEffect(() => {
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    // Mouse tracking per avatar
    useEffect(() => {
      const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Scroll progress
    useEffect(() => {
      let ticking = false;
      const updateScrollProgress = () => {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollPx / winHeightPx) * 100;
        setScrollProgress(scrolled);
        setShowScrollTop(scrollPx > 300);
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateScrollProgress);
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Menu mobile
    useEffect(() => {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isMenuOpen]);

    const experiences = [
      {
        role: t('exp_role_1'),
        company: 'Deloitte',
        time: t('present'),
        desc: t('exp_desc_1'),
        tags: ['Python', 'React', 'SQL', 'Azure', 'GCP'],
      },
    ];

    return (
      <div 
        className={`min-h-screen selection:bg-pink-500 selection:text-white transition-colors duration-700 font-sans ${dark ? 'bg-[#050505] text-gray-100' : 'bg-white text-gray-900'}`}
        lang={lang}
      >
        <SkipToContent t={t} />
        <NoiseOverlay />

        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-[30%] -left-[20%] w-[80vw] h-[80vw] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-lighten opacity-40 animate-pulse will-change-transform" />
          <div className="absolute top-[10%] -right-[20%] w-[70vw] h-[70vw] bg-pink-500/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-lighten opacity-40 will-change-transform" />
          <div className="absolute bottom-0 left-[10%] w-[60vw] h-[60vw] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-lighten opacity-30 will-change-transform" />
        </div>

        {/* Progress Bar */}
        <div 
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 origin-left z-50"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 md:px-12 py-4 xs:py-6 md:py-12 space-y-12 xs:space-y-16 sm:space-y-20 md:space-y-32">
          
          {/* HEADER */}
          <header className="flex justify-between items-center backdrop-blur-md bg-white/80 dark:bg-black/20 border border-neutral-300 dark:border-white/10 rounded-2xl xs:rounded-2xl md:rounded-full px-3 xs:px-4 md:px-6 py-2.5 xs:py-3 md:py-4 sticky top-3 z-40 shadow-lg">
            <h1 className="text-xs xs:text-sm md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 truncate">
              {t('name')}
            </h1>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6 items-center font-medium text-sm">
              <button 
                onClick={() => i18n.changeLanguage('it')} 
                className={`hover:text-pink-500 transition ${lang === 'it' ? 'text-pink-500 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
              >
                IT
              </button>
              <button 
                onClick={() => i18n.changeLanguage('en')} 
                className={`hover:text-pink-500 transition ${lang === 'en' ? 'text-pink-500 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setDark(!dark)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 hover:scale-110 transition text-lg"
              >
                {dark ? '🌞' : '🌚'}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:scale-105 transition flex-shrink-0"
            >
              <span className={`w-4 h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-4 h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-4 h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </header>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center gap-6 pt-20"
                onClick={() => setIsMenuOpen(false)}
              >
                <nav className="flex flex-col items-center gap-4 text-lg font-bold">
                  <a href="#education" onClick={() => setIsMenuOpen(false)} className="hover:text-pink-500 transition">{t('education_title')}</a>
                  <a href="#experiences" onClick={() => setIsMenuOpen(false)} className="hover:text-pink-500 transition">{t('experiences_title')}</a>
                  <a href="#skills" onClick={() => setIsMenuOpen(false)} className="hover:text-pink-500 transition">{t('skills_title')}</a>
                  <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-pink-500 transition">Contact</a>
                </nav>
                <div className="flex gap-4 items-center text-base">
                  <button onClick={() => { i18n.changeLanguage('it'); setIsMenuOpen(false); }} className={`font-medium ${lang === 'it' ? 'text-pink-500 font-bold' : ''}`}>IT</button>
                  <button onClick={() => { i18n.changeLanguage('en'); setIsMenuOpen(false); }} className={`font-medium ${lang === 'en' ? 'text-pink-500 font-bold' : ''}`}>EN</button>
                  <button onClick={() => { setDark(!dark); setIsMenuOpen(false); }} className="text-xl">{dark ? '🌞' : '🌚'}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN */}
          <main id="main-content">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={containerVars} className='space-y-12 xs:space-y-16 sm:space-y-20 md:space-y-32'>

              {/* HERO */}
              <motion.section variants={itemVars} className="grid lg:grid-cols-2 gap-4 xs:gap-6 lg:gap-12 items-center min-h-[50vh] xs:min-h-[60vh] md:min-h-[70vh]">
                <div className="space-y-4 xs:space-y-6 md:space-y-8 order-2 lg:order-1">
                  <motion.div variants={itemVars} className="inline-block px-2.5 xs:px-3 md:px-4 py-1 xs:py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-500 text-[10px] xs:text-xs font-bold uppercase tracking-widest">
                    {t('available')}
                  </motion.div>
                  
                  <motion.h2 variants={itemVars} className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight xs:leading-tight md:leading-[0.9]">
                    {t('hero_title_1')} <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                      {t('hero_title_2')}
                    </span>
                  </motion.h2>
                  
                  <motion.p variants={itemVars} className="text-sm xs:text-base sm:text-lg md:text-xl text-neutral-700 dark:text-neutral-400 max-w-lg leading-relaxed">
                    {t('hero_subtitle')}
                  </motion.p>
                  
                  <motion.div variants={itemVars} className="flex flex-col xs:flex-row gap-2.5 xs:gap-3 pt-2 xs:pt-4">
                    <a 
                      href="#contact" 
                      className="group relative px-4 xs:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 bg-white dark:bg-white text-black font-bold rounded-lg xs:rounded-xl md:rounded-2xl overflow-hidden transition-all hover:scale-105 shadow-lg hover:shadow-xl text-center text-xs xs:text-sm md:text-base"
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        {t('cta_talk')} <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform text-xs xs:text-sm"/>
                      </span>
                    </a>
                    <a 
                      href="/resume.pdf" 
                      className="px-4 xs:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 rounded-lg xs:rounded-xl md:rounded-2xl border-2 border-neutral-400 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition font-medium text-center text-xs xs:text-sm md:text-base text-neutral-900 dark:text-white"
                      download
                    >
                      {t('cta_resume')}
                    </a>
                  </motion.div>
                </div>

                {/* AVATAR */}
                <motion.div variants={itemVars} className="relative flex justify-center lg:justify-end order-1 lg:order-2">
                  <div className="w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-96">
                    <InteractiveAvatar mousePosition={mousePosition} />
                    <div className="absolute bottom-3 xs:bottom-4 left-3 xs:left-4 right-3 xs:right-4 text-white z-10 text-center">
                      <p className="text-[10px] xs:text-xs uppercase tracking-widest opacity-80">{t('based_in')}</p>
                      <p className="text-xs xs:text-sm md:text-base font-bold">{t('city')}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.section>

              {/* EDUCATION */}
              <motion.section 
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={containerVars}
                id="education" 
                className="relative space-y-6 xs:space-y-8 md:space-y-12 py-6 xs:py-8 md:py-10"
              >
                <div className="flex flex-col items-center text-center mb-8 xs:mb-10 md:mb-16">
                  <motion.h3 variants={itemVars} className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 xs:mb-4">
                    {t('education_title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{t('education_highlight')}</span>
                  </motion.h3>
                  <motion.div variants={itemVars} className="h-1 w-16 xs:w-20 md:w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                </div>

                <div className="relative max-w-4xl mx-auto">
                  <div className="absolute left-[10px] xs:left-[12px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-400 dark:via-neutral-700 to-transparent md:-translate-x-1/2" />

                  {[
                    { title: t('master_degree'), uni: 'Università degli Studi di Bari "Aldo Moro"', spec: t('master_spec'), time: '2022 — 2024', color: 'pink' },
                    { title: t('bachelor_degree'), uni: 'Università degli Studi di Bari "Aldo Moro"', spec: t('bachelor_spec'), time: '2019 — 2022', color: 'purple' },
                    { title: t('diploma'), uni: 'I.I.S.S. Galileo Ferraris', spec: '', time: '2014 — 2019', color: 'indigo' },
                  ].map((item, idx) => (
                    <motion.article variants={itemVars} key={idx} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-2 xs:gap-3 md:gap-8 mb-6 xs:mb-8 md:mb-12 last:mb-0">
                      {/* Text */}
                      <div className="md:text-right md:pr-12 md:order-1 min-w-0">
                        <h4 className="text-[10px] xs:text-xs sm:text-sm md:text-xl font-bold text-neutral-900 dark:text-white leading-tight break-words line-clamp-2">{item.title}</h4>
                        <p className={`text-[11px] xs:text-xs md:text-sm font-medium mt-0.5 xs:mt-1 ${item.color === 'pink' ? 'text-pink-500' : item.color === 'purple' ? 'text-purple-500' : 'text-indigo-500'}`}>{item.uni}</p>
                        {item.spec && <p className="text-[11px] xs:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 xs:mt-1">{item.spec}</p>}
                      </div>
                      
                      {/* Dot */}
                      <div className="absolute left-[10px] xs:left-[12px] md:left-1/2 top-1 xs:top-1.5 md:top-auto md:-translate-x-1/2 w-5 h-5 xs:w-6 xs:h-6 md:w-8 md:h-8 rounded-full bg-white dark:bg-[#111] border-3 xs:border-4 border-neutral-300 dark:border-neutral-700 z-20 md:order-2 flex items-center justify-center shadow-lg flex-shrink-0">
                        <div className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full ${item.color === 'pink' ? 'bg-pink-500' : item.color === 'purple' ? 'bg-purple-500' : 'bg-indigo-500'}`} />
                      </div>

                      {/* Time */}
                      <div className="pl-7 xs:pl-8 md:pl-0 md:order-3 md:flex md:items-center">
                        <time className="inline-block px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs md:text-sm font-bold border backdrop-blur-md" 
                          style={{
                            backgroundColor: item.color === 'pink' ? 'rgba(236, 72, 153, 0.15)' : item.color === 'purple' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                            borderColor: item.color === 'pink' ? 'rgba(236, 72, 153, 0.4)' : item.color === 'purple' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(99, 102, 241, 0.4)',
                            color: item.color === 'pink' ? '#ec4899' : item.color === 'purple' ? '#a855f7' : '#6366f1'
                          }}>
                          {item.time}
                        </time>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.section>

              {/* EXPERIENCES */}
              <motion.section 
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVars}
                id="experiences" 
                className="space-y-6 xs:space-y-8 md:space-y-12"
              >
                <motion.h3 variants={itemVars} className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  {t('experiences_title')}
                </motion.h3>

                <div className="grid md:grid-cols-2 gap-3 xs:gap-4 md:gap-6">
                  {experiences.map((exp, idx) => (
                    <motion.article
                      key={idx}
                      variants={itemVars}
                      className="relative p-4 xs:p-6 md:p-8 rounded-lg xs:rounded-2xl bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-300 dark:border-white/10 hover:border-pink-400 dark:hover:border-pink-500/30 hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 xs:gap-0 mb-3 xs:mb-4">
                        <h4 className="text-xs xs:text-lg md:text-xl font-bold text-pink-500">{exp.role}</h4>
                        <span className="text-[10px] xs:text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{exp.time}</span>
                      </div>
                      <p className="text-xs xs:text-base md:text-lg font-medium mb-2 xs:mb-3 text-neutral-900 dark:text-gray-100">{exp.company}</p>
                      <p className="text-xs xs:text-sm md:text-base text-neutral-700 dark:text-neutral-300 mb-4 xs:mb-6 leading-relaxed">{exp.desc}</p>
                      <div className="flex flex-wrap gap-1.5 xs:gap-2">
                        {exp.tags.map(tag => (
                          <span key={tag} className="px-2 xs:px-3 py-0.5 xs:py-1 text-[10px] xs:text-xs md:text-sm font-semibold rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.section>

              {/* SKILLS */}
              <motion.section 
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVars}
                id="skills" 
                className="space-y-6 xs:space-y-8 md:space-y-12"
              >
                <motion.h3 variants={itemVars} className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center md:text-right">
                  {t('skills_arsenal')} <span className="text-pink-500">{t('skills_title')}</span>
                </motion.h3>
                
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 xs:gap-3 md:gap-4">
                  {["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "Framer", "Three.js", "Python", "Figma", "Git", "GraphQL", "Docker"].map((s) => (
                    <motion.div 
                      key={s} 
                      variants={itemVars}
                      whileHover={{ scale: 1.05 }}
                      className="h-20 xs:h-24 md:h-28 flex flex-col justify-between p-2.5 xs:p-3 md:p-4 rounded-lg xs:rounded-xl md:rounded-2xl bg-white dark:bg-neutral-900/50 border border-neutral-300 dark:border-neutral-800 hover:border-pink-400 dark:hover:border-pink-500/50 transition-all cursor-default shadow-sm dark:shadow-none"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                      <span className="font-semibold text-[11px] xs:text-xs md:text-base text-neutral-900 dark:text-white">{s}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* CONTACT */}
              <motion.section 
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVars}
                id="contact" 
                className="relative py-8 xs:py-12 md:py-20"
              >
                <div className="relative bg-white dark:bg-neutral-900/50 rounded-xl xs:rounded-2xl md:rounded-3xl p-6 xs:p-10 md:p-16 text-center border border-neutral-300 dark:border-white/10 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-700" />

                  <motion.h3 variants={itemVars} className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-4 md:mb-6 tracking-tight z-10 relative text-neutral-900 dark:text-white">
                    {t('contact_title_1')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">{t('contact_title_2')}</span>
                  </motion.h3>
                  
                  <motion.p variants={itemVars} className="text-xs xs:text-sm md:text-lg text-neutral-700 dark:text-neutral-300 mb-6 xs:mb-8 max-w-2xl mx-auto z-10 relative leading-relaxed">
                    {t('contact_text')}
                  </motion.p>

                  <motion.div variants={itemVars} className="inline-block z-10 relative mb-6 xs:mb-8">
                    <a href="mailto:panunzioxmariangela@gmail.com" className="block px-4 xs:px-8 md:px-10 py-2.5 xs:py-4 md:py-5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg xs:rounded-full font-bold text-xs xs:text-base md:text-lg shadow-lg hover:shadow-pink-500/25 hover:scale-105 transition-all break-all xs:break-normal">
                      panunzioxmariangela@gmail.com
                    </a>
                  </motion.div>

                  <motion.div variants={itemVars} className="flex justify-center gap-4 xs:gap-6 md:gap-8 z-10 relative text-lg xs:text-2xl md:text-3xl">
                    <a href="https://www.linkedin.com/in/mariangela-panunzio-152817183/" target="_blank" rel="noopener noreferrer" className="text-neutral-800 dark:text-neutral-300 hover:text-pink-500 dark:hover:text-pink-400 transition-transform hover:-translate-y-1"><FaLinkedin /></a>
                    <a href="https://github.com/mariangelapanunzio" target="_blank" rel="noopener noreferrer" className="text-neutral-800 dark:text-neutral-300 hover:text-pink-500 dark:hover:text-pink-400 transition-transform hover:-translate-y-1"><FaGithub /></a>
                    <a href="mailto:panunzioxmariangela@gmail.com" className="text-neutral-800 dark:text-neutral-300 hover:text-pink-500 dark:hover:text-pink-400 transition-transform hover:-translate-y-1"><FaEnvelope /></a>
                  </motion.div>
                </div>
              </motion.section>

              {/* FOOTER */}
              <motion.footer variants={itemVars} className="flex flex-col xs:flex-row justify-between items-center xs:items-end border-t border-neutral-300 dark:border-neutral-800 pt-6 xs:pt-8 text-[10px] xs:text-xs md:text-sm opacity-50 dark:opacity-50 font-mono gap-3 xs:gap-0">
                <div className="text-center xs:text-left">
                  <p>© {new Date().getFullYear()} {t('name')}.</p>
                  <p>{t('footer_crafted')}.</p>
                </div>
                <div className="text-center xs:text-right">
                  <p>Local time: {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>{t('city')}</p>
                </div>
              </motion.footer>
            </motion.div>
          </main>

          {/* Scroll To Top */}
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-4 xs:bottom-6 right-4 xs:right-6 w-10 xs:w-12 h-10 xs:h-12 flex items-center justify-center rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 hover:scale-110 transition-all z-50 text-sm xs:text-base"
            >
              ↑
            </motion.button>
          )}
        </div>
      </div>
    );
}