import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { FaLinkedin, FaEnvelope, FaGithub, FaArrowRight, FaKeyboard } from 'react-icons/fa';
// Importa i componenti motion per le animazioni Framer Motion
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './i18n';

// DEFINIZIONE DELLE VARIANTI DI ANIMAZIONE (Mancavano nel codice)
const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
// --- FINE VARIANTI DI ANIMAZIONE ---


// Componente per Skip Navigation (Accessibilità)
const SkipToContent = ({ t }) => (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-pink-500 focus:text-white focus:rounded-lg focus:font-bold focus:shadow-xl"
    >
      {t('skip_to_content')}
    </a>
)

// Noise Overlay ottimizzato
const NoiseOverlay = () => (
    <div 
      className="fixed inset-0 z-50 pointer-events-none opacity-[0.05] mix-blend-overlay" 
      style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      aria-hidden="true"
    />
)

// Loading Spinner
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#050505]">
      <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" role="status" aria-label="Loading" />
    </div>
)

export default function App() {
    const [dark, setDark] = useState(true)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)
    const { t, i18n } = useTranslation()
    const lang = i18n.language;

    // Gestione tema con localStorage
    useEffect(() => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        setDark(savedTheme === 'dark')
      } else {
        // Rispetta preferenza sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setDark(prefersDark)
      }
    }, [])

    useEffect(() => {
      document.documentElement.classList.toggle('dark', dark)
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }, [dark])

    // Rileva preferenza reduced motion (Accessibilità)
    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      
      const handleChange = (e) => setReducedMotion(e.matches)
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    // Scroll progress ottimizzato con throttle
    useEffect(() => {
      let ticking = false
      
      const updateScrollProgress = () => {
        const scrollPx = document.documentElement.scrollTop
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scrolled = (scrollPx / winHeightPx) * 100
        
        setScrollProgress(scrolled)
        setShowScrollTop(scrollPx > 300)
        ticking = false
      }

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateScrollProgress)
          ticking = true
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Keyboard navigation (Accessibilità)
    useEffect(() => {
      const handleKeyPress = (e) => {
        // ESC per chiudere menu mobile
        if (e.key === 'Escape' && isMenuOpen) {
          setIsMenuOpen(false)
        }
      }
      
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isMenuOpen])

    const toggleTheme = useCallback(() => {
      setDark(prev => !prev)
    }, [])

    const scrollToTop = useCallback(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    // Gestione focus trap per mobile menu (Accessibilità)
    useEffect(() => {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [isMenuOpen])

    // Dati di esempio per le esperienze (era incompleto)
    const experiences = [
      {
        role: t('exp_role_1'),
        company: 'Deloitte',
        time: `${t('present')}`,
        desc: t('exp_desc_1'),
        tags: ['Python', 'React', 'SQL', 'Azure', 'Google Cloud Platoform']
      }
    //   },
    //   {
    //     role: 'Junior Web Developer',
    //     company: 'Digital Agency Z',
    //     time: '2020 - 2022',
    //     desc: 'Collaborazione allo sviluppo di siti e-commerce B2B. Implementazione di API RESTful e ottimizzazione della SEO.',
    //     tags: ['Vue.js', 'PHP', 'SCSS']
    //   }
    ]

    return (
      <div 
        // CAMBIATO: bg-[#f0f0f0] a bg-white per max contrasto in light mode
        className={`min-h-screen selection:bg-pink-500 selection:text-white transition-colors duration-700 font-sans ${dark ? 'bg-[#050505] text-gray-100' : 'bg-white text-gray-900'}`}
        lang={lang}
      >
        <SkipToContent t={t} />
        <NoiseOverlay />

        {/* BACKGROUND FLUIDO - Ottimizzato per performance */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-lighten opacity-40 animate-pulse will-change-transform" />
          <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-pink-500/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-lighten opacity-40 will-change-transform" />
          <div className="absolute bottom-0 left-[20%] w-[50vw] h-[50vw] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-lighten opacity-30 will-change-transform" />
        </div>

        {/* PROGRESS BAR - Con ARIA */}
        <div 
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 origin-left z-50 transition-transform"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Scroll progress"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12 space-y-20 md:space-y-32">
          
          {/* HEADER - Mobile First con Hamburger */}
          {/* CAMBIATO: bg-white/5 a bg-white e border-white/10 a border-neutral-300 */}
          <header className="flex justify-between items-center backdrop-blur-md bg-white dark:bg-black/5 border border-neutral-300 dark:border-white/5 rounded-full px-4 md:px-6 py-3 md:py-4 sticky top-4 md:top-6 z-40 shadow-xl ring-1 ring-black/5">
            <h1 className="text-lg md:text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              {t('name')}
            </h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 items-center font-medium text-sm" aria-label="Main navigation">
              <button 
                onClick={() => i18n.changeLanguage('it')} 
                className={`hover:text-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1 ${lang === 'it' ? 'text-pink-500 font-bold' : ''}`}
                aria-label="Switch to Italian"
              >
                IT
              </button>
              <button 
                onClick={() => i18n.changeLanguage('en')} 
                className={`hover:text-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1 ${lang === 'en' ? 'text-pink-500 font-bold' : ''}`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button 
                onClick={toggleTheme}
                // CAMBIATO: bg-neutral-200 a bg-neutral-100 (light) e aggiunto text-neutral-800
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-gray-100 hover:scale-110 transition active:scale-90 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                aria-label={t('toggle_theme')}
              >
                {dark ? '🌞' : '🌚'}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              // CAMBIATO: bg-neutral-200 a bg-neutral-100
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:scale-110 transition active:scale-90 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}
              aria-expanded={isMenuOpen}
            >
              <span className={`w-5 h-0.5 bg-current transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-current transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </header>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
              {isMenuOpen && (
                  <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center gap-8"
                      role="dialog"
                      aria-modal="true"
                      onClick={() => setIsMenuOpen(false)}
                  >
                      <button
                          onClick={() => setIsMenuOpen(false)}
                          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-800 text-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                          aria-label={t('close_menu')}
                      >
                          ✕
                      </button>
                      
                      <nav className="flex flex-col items-center gap-6 text-2xl font-bold">
                          <a href="#education" className="hover:text-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-4 py-2" onClick={() => setIsMenuOpen(false)}>
                              {t('education_title')}
                          </a>
                          <a href="#experiences" className="hover:text-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-4 py-2" onClick={() => setIsMenuOpen(false)}>
                              {t('experiences_title')}
                          </a>
                          <a href="#skills" className="hover:text-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-4 py-2" onClick={() => setIsMenuOpen(false)}>
                              {t('skills_title')}
                          </a>
                          <a href="#contact" className="hover:text-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-4 py-2" onClick={() => setIsMenuOpen(false)}>
                              {t('contact_title_1')}
                          </a>
                      </nav>

                      <div className="flex gap-6 items-center text-lg">
                          <button onClick={() => { i18n.changeLanguage('it'); setIsMenuOpen(false); }} className={`hover:text-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-3 py-2 ${lang === 'it' ? 'text-pink-500 font-bold' : ''}`}>IT</button>
                          <button onClick={() => { i18n.changeLanguage('en'); setIsMenuOpen(false); }} className={`hover:text-pink-500 transition focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-3 py-2 ${lang === 'en' ? 'text-pink-500 font-bold' : ''}`}>EN</button>
                          <button onClick={toggleTheme} className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-800 text-2xl focus:outline-none focus:ring-2 focus:ring-pink-500">
                              {dark ? '🌞' : '🌚'}
                          </button>
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>

          {/* MAIN CONTENT */}
          <main id="main-content">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={containerVars} className='space-y-20 md:space-y-32'>

              {/* HERO SECTION - Mobile Optimized */}
              <motion.section variants={itemVars} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh] md:min-h-[60vh]">
                <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
                  <div className="inline-block px-3 md:px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-500 text-xs font-bold uppercase tracking-widest">
                    {t('available')}
                  </div>
                  
                  <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9]">
                    {t('hero_title_1')} <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                      {t('hero_title_2')}
                    </span>
                  </h2>
                  
                  <p className="text-lg sm:text-xl md:text-2xl text-neutral-800 dark:text-neutral-400 max-w-lg leading-relaxed font-light"> {/* CAMBIATO: text-neutral-600 a text-neutral-800 */}
                    {t('hero_subtitle')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a 
                      href="#contact" 
                      className="group relative px-6 md:px-8 py-3 md:py-4 bg-white dark:bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 text-center"
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        {t('cta_talk')} <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform"/>
                      </span>
                    </a>
                    <a 
                      href="/resume.pdf" 
                      // CAMBIATO: border-neutral-300 a border-neutral-400 (light) per maggiore visibilità su sfondo bianco
                      className="px-6 md:px-8 py-3 md:py-4 rounded-2xl border border-neutral-400 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 text-center"
                      download
                    >
                      {t('cta_resume')}
                    </a>
                  </div>
                </div>

                {/* FOTO - Mobile Optimized */}
                <motion.div variants={itemVars} className="relative flex justify-center lg:justify-end group order-1 lg:order-2">
                  <div className="relative w-64 h-80 sm:w-80 sm:h-96 lg:w-[28rem] lg:h-[34rem]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-[2rem] rotate-6 opacity-40 blur-2xl group-hover:opacity-60 transition duration-500 animate-pulse" aria-hidden="true" />
                    
                    <div className="absolute inset-0 bg-neutral-200 dark:bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl z-10 group-hover:scale-105 transition-transform duration-500">
                      <img 
                        src="/mp.png" 
                        alt="Profile picture of Mariangela" 
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-700 scale-105 hover:scale-110"
                        loading="lazy"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" aria-hidden="true" />
                      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white">
                        <p className="text-xs uppercase tracking-widest opacity-80">{t('based_in')}</p>
                        <p className="text-lg md:text-xl font-bold">{t('city')}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.section>

              {/* EDUCATION - Timeline Accessibile */}
              <motion.section 
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={containerVars}
                id="education" 
                className="relative space-y-8 md:space-y-12 py-10"
              >
                <div className="flex flex-col items-center text-center mb-12 md:mb-16">
                  <motion.h3 variants={itemVars} className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                    {t('education_title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{t('education_highlight')}</span>
                  </motion.h3>
                  <motion.div variants={itemVars} className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" aria-hidden="true" />
                </div>

                <div className="relative max-w-4xl mx-auto">
                  {/* CAMBIATO: via-neutral-300 a via-neutral-400 per la linea della timeline */}
                  <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-400 dark:via-neutral-700 to-transparent md:-translate-x-1/2" aria-hidden="true" />

                  {/* Timeline Item 1 */}
                  <motion.article variants={itemVars} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
                    <div className="md:text-right md:pr-12 order-2 md:order-1 self-center">
                      <h4 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-white">{t('master_degree')}</h4>
                      <p className="text-pink-500 font-medium">Università degli Studi di Bari "Aldo Moro"</p>
                      <p className="text-sm text-neutral-500 mt-2">{t('master_spec')}</p>
                    </div>
                    
                    {/* CAMBIATO: border-white a border-gray-200 */}
                    <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-neutral-100 dark:bg-[#111] border-4 border-gray-200 dark:border-[#050505] shadow-[0_0_20px_rgba(236,72,153,0.5)] z-20 order-1 md:order-2" aria-hidden="true">
                      <div className="w-2 md:w-3 h-2 md:h-3 bg-pink-500 rounded-full animate-pulse" />
                    </div>

                    <div className="pl-12 md:pl-12 order-3 self-center">
                      <time className="inline-block px-3 md:px-4 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs md:text-sm font-bold border border-pink-500/20 backdrop-blur-md">
                        2022 — 2024
                      </time>
                    </div>
                  </motion.article>

                  {/* Timeline Item 2 */}
                  <motion.article variants={itemVars} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
                    <div className="md:text-right md:pr-12 order-2 md:order-1 self-center hidden md:block">
                      <time className="inline-block px-3 md:px-4 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs md:text-sm font-bold border border-purple-500/20 backdrop-blur-md">
                        2019 — 2022
                      </time>
                    </div>
                    
                    {/* CAMBIATO: border-white a border-gray-200 */}
                    <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-full bg-neutral-100 dark:bg-[#111] border-4 border-gray-200 dark:border-[#050505] z-20 order-1 md:order-2" aria-hidden="true">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    </div>

                    <div className="pl-12 md:pl-12 order-3 md:order-2 self-center">
                      <h4 className="text-lg md:text-xl font-bold text-neutral-800 dark:text-white">{t('bachelor_degree')}</h4>
                      <p className="text-purple-500 font-medium">Università degli Studi di Bari "Aldo Moro"</p>
                      <p className="text-sm text-neutral-500 mt-2">{t('bachelor_spec')}</p>
                      <time className="md:hidden mt-2 inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold">2017 — 2020</time>
                    </div>
                  </motion.article>

                  {/* Timeline Item 3 */}
                  <motion.article variants={itemVars} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="md:text-right md:pr-12 order-2 md:order-1 self-center">
                      <h4 className="text-base md:text-lg font-bold text-neutral-700 dark:text-neutral-300">{t('diploma')}</h4>
                      <p className="text-indigo-500 font-medium">I.I.S.S. Galileo Ferraris</p>
                      <time className="md:hidden mt-2 inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold">2012 — 2017</time>
                    </div>
                    
                    {/* CAMBIATO: border-white a border-gray-200 */}
                    <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-5 md:w-6 h-5 md:h-6 rounded-full bg-neutral-100 dark:bg-[#111] border-4 border-gray-200 dark:border-[#050505] z-20 order-1 md:order-2" aria-hidden="true">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    </div>

                    <div className="pl-12 md:pl-12 order-3 self-center hidden md:block">
                      <time className="inline-block px-3 md:px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs md:text-sm font-bold border border-indigo-500/20 backdrop-blur-md">
                        2014 — 2019
                      </time>
                    </div>
                  </motion.article>
                </div>
              </motion.section>

              {/* EXPERIENCES */}
              <motion.section 
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={containerVars}
                id="experiences" 
                className="space-y-8 md:space-y-12"
              >
                <div className="flex flex-col md:flex-row items-start md:items-end gap-2 md:gap-4 mb-6 md:mb-8">
                  <motion.h3 variants={itemVars} className="text-4xl md:text-5xl font-bold tracking-tighter">{t('experiences_title')}</motion.h3>
                  <motion.div variants={itemVars} className="h-[2px] flex-grow bg-neutral-200 dark:bg-neutral-800 mb-1 md:mb-3 rounded-full hidden md:block" aria-hidden="true" />
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  {experiences.map((exp, index) => (
                    <motion.article
                      key={index}
                      variants={itemVars}
                      // MANTENUTO: bg-white e border-neutral-200 da correzione precedente
                      className="group relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 overflow-hidden transition-all hover:border-pink-500/30 hover:shadow-2xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-pink-500"
                      tabIndex="0"
                    >
                      <div className="flex justify-between items-start mb-4">
                          <h4 className="text-xl md:text-2xl font-bold text-pink-500">{exp.role}</h4>
                          <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">{exp.time}</span>
                      </div>
                      <p className="text-lg font-medium mb-3">{exp.company}</p>
                      {/* MANTENUTO: text-neutral-700 da correzione precedente */}
                      <p className="text-neutral-700 dark:text-neutral-300 mb-6">{exp.desc}</p>
                      <div className="flex flex-wrap gap-2">
                          {exp.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                  {tag}
                              </span>
                          ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.section>

              {/* SKILLS - BENTO GRID STYLE */}
              <motion.section 
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVars}
                id="skills" 
                className="space-y-12"
              >
                <motion.h3 variants={itemVars} className="text-4xl md:text-5xl font-bold tracking-tighter text-right">
                  {t('skills_arsenal')} <span className="text-pink-500">{t('skills_title')}</span>
                </motion.h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "Framer", "Three.js", "Python", "Figma", "Git", "GraphQL", "Docker"].map((s, i) => (
                  <motion.div 
                      key={s} 
                      variants={itemVars}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                      className={`
                      ${i === 0 || i === 1 ? 'col-span-2 md:col-span-2' : ''} 
                      h-28 flex flex-col justify-between p-4 rounded-2xl 
                      bg-white dark:bg-neutral-900/50 backdrop-blur-md // CAMBIATO: bg-white/50 a bg-white
                      border border-neutral-300 dark:border-neutral-800 // CAMBIATO: border-neutral-200 a border-neutral-300
                      cursor-default transition-colors hover:border-pink-500/50
                      `}
                  >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" aria-hidden="true"></div>
                      <span className="font-semibold text-lg tracking-tight">{s}</span>
                  </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* CONTACT - MAGNETIC & MINIMAL */}
              <motion.section 
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVars}
                id="contact" 
                className="relative py-20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-[3rem] opacity-10 blur-3xl" aria-hidden="true"></div>
                
                {/* CAMBIATO: bg-neutral-50 a bg-white per contrasto */}
                <div className="relative bg-white dark:bg-[#0a0a0a] rounded-[3rem] p-10 md:p-20 text-center border border-neutral-200 dark:border-neutral-800 overflow-hidden group">
                  {/* Animazione sfondo hover */}
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.1),transparent)] opacity-0 group-hover:opacity-100 transition duration-700" aria-hidden="true"></div>

                  <motion.h3 variants={itemVars} className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter z-10 relative">
                    {t('contact_title_1')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">{t('contact_title_2')}</span>
                  </motion.h3>
                  
                  {/* CAMBIATO: text-neutral-500 a text-neutral-700 per contrasto */}
                  <motion.p variants={itemVars} className="text-xl text-neutral-700 dark:text-neutral-400 mb-10 max-w-2xl mx-auto z-10 relative">
                    {t('contact_text')}
                  </motion.p>

                  <motion.div variants={itemVars} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block z-10 relative">
                    <a href="mailto:panunzioxmariangela@gmail.com" className="px-10 py-5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-xl shadow-2xl hover:shadow-pink-500/25 transition-all focus:outline-none focus:ring-4 focus:ring-pink-500/50">
                      panunzioxmariangela@gmail.com
                    </a>
                  </motion.div>

                  <motion.div variants={itemVars} className="flex justify-center gap-8 mt-12 z-10 relative text-3xl">
                    <a href="https://www.linkedin.com/in/mariangela-panunzio-152817183/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-transform hover:-translate-y-1" aria-label="LinkedIn Profile"><FaLinkedin /></a>
                    <a href="https://github.com/mariangelapanunzio" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-transform hover:-translate-y-1" aria-label="GitHub Profile"><FaGithub /></a>
                    <a href="mailto:panunzioxmariangela@gmail.com" className="hover:text-pink-500 transition-transform hover:-translate-y-1" aria-label="Email Address"><FaEnvelope /></a>
                  </motion.div>
                </div>
              </motion.section>

              {/* FOOTER */}
              <motion.footer variants={itemVars} className="flex justify-between items-end border-t border-neutral-200 dark:border-neutral-800 pt-10 text-sm opacity-50 font-mono">
                <div>
                  <p>© {new Date().getFullYear()} {t('name')}.</p>
                  <p>{t('footer_crafted')}.</p>
                </div>
                <div className="text-right">
                  <p>Local time: {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>{t('city').split(',')[0]}, Italy</p>
                </div>
              </motion.footer>
            </motion.div>
          </main>

          {/* Scroll To Top Button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-all focus:outline-none focus:ring-4 focus:ring-pink-500/50 z-50"
              aria-label="Scroll to top"
            >
              ↑
            </button>
          )}
        </div>
      </div>
    )
}