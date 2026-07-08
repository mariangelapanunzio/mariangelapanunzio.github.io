import React, { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaEnvelope, FaGithub, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './i18n';

const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVars = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 40, stiffness: 100 } },
};

// Minimal Avatar con smooth animation
const MinimalAvatar = ({ mousePosition }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (mousePosition) {
      setTilt({
        x: (mousePosition.y / window.innerHeight - 0.5) * 2,
        y: (mousePosition.x / window.innerWidth - 0.5) * 2,
      });
    }
  }, [mousePosition]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 30, stiffness: 100 }}
      style={{ rotateX: tilt.x, rotateY: tilt.y }}
      className="relative w-full h-full perspective"
    >
      <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 shadow-2xl">
        <img src="/mp.png" alt="Mariangela" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-black/30 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
};

// AI Widget - Apple Style
const AIWidget = ({ lang, dark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSmiling, setIsSmiling] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);

  const aiResponses = {
    it: {
      greeting: "Ciao! Sono Mariangela, AI Expert. Come posso aiutarti?",
      skills: "Python • React • TypeScript • Node.js • Machine Learning • Azure • GCP",
      passion: "Mi piace creare esperienze che uniscono design e intelligenza artificiale.",
      fun: "Fun fact: Questo portfolio è costruito con AI! 🤖",
      default: "Domanda interessante! Contattami per saperne di più."
    },
    en: {
      greeting: "Hi! I'm Mariangela, AI Expert. How can I help?",
      skills: "Python • React • TypeScript • Node.js • Machine Learning • Azure • GCP",
      passion: "I love creating experiences that blend design and artificial intelligence.",
      fun: "Fun fact: This portfolio is built with AI! 🤖",
      default: "Great question! Feel free to contact me to discuss more."
    }
  };

  const handleMessage = (text) => {
    const triggers = {
      it: { chi: 'greeting', skill: 'skills', passione: 'passion', divertente: 'fun' },
      en: { who: 'greeting', skill: 'skills', passion: 'passion', fun: 'fun' }
    };
    
    const text_lower = text.toLowerCase();
    let key = 'default';
    
    for (const [trigger, k] of Object.entries(triggers[lang] || {})) {
      if (text_lower.includes(trigger)) { key = k; break; }
    }

    setMessages(prev => [
      ...prev,
      { type: 'user', text },
      { type: 'ai', text: aiResponses[lang][key] }
    ]);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        let count = 0;
        const interval = setInterval(() => {
          setIsSmiling(Math.random() > 0.4);
          count++;
          if (count > 8) {
            clearInterval(interval);
            stream.getTracks().forEach(t => t.stop());
            setShowCamera(false);
            setIsSmiling(false);
          }
        }, 800);
      }
    } catch (err) {
      setShowCamera(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-20 md:right-24 w-12 h-12 md:w-14 md:h-14 rounded-full bg-neutral-950 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-950 shadow-2xl transition-all flex items-center justify-center text-lg font-bold hover:shadow-2xl"
      >
        ✨
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 150 }}
              className="fixed bottom-24 md:bottom-32 right-4 md:right-6 w-80 md:w-96 h-[520px] rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl z-40 flex flex-col overflow-hidden"
            >
              <div className="p-5 md:p-6 border-b border-neutral-200/50 dark:border-neutral-800/50 flex justify-between items-center backdrop-blur-xl bg-neutral-50/50 dark:bg-neutral-900/50">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">AI Assistant</h3>
                <motion.button 
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <FaTimes size={16} className="text-neutral-600 dark:text-neutral-400" />
                </motion.button>
              </div>

              {!showCamera ? (
                <>
                  <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 bg-neutral-50/50 dark:bg-neutral-900/50">
                    {messages.length === 0 ? (
                      <div className="text-center text-neutral-600 dark:text-neutral-400 text-sm pt-8">
                        <p className="mb-8 text-base font-medium text-neutral-900 dark:text-neutral-100">Ask me anything</p>
                        <div className="space-y-3">
                          {['Chi sei?', 'Quali skill?', 'Dimmi di te'].map(q => (
                            <motion.button 
                              key={q} 
                              whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.05)' }}
                              onClick={() => handleMessage(q)} 
                              className="block w-full p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm text-neutral-700 dark:text-neutral-300 font-medium"
                            >
                              {q}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      messages.map((msg, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", damping: 30 }}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'}`}>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="p-5 md:p-6 border-t border-neutral-200/50 dark:border-neutral-800/50 space-y-3 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-xl">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && input.trim() && (handleMessage(input), setInput(''))}
                        placeholder="Type..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all text-sm"
                      />
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => input.trim() && (handleMessage(input), setInput(''))} 
                        className="p-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-950 hover:opacity-80 transition-opacity"
                      >
                        <FaPaperPlane size={14} />
                      </motion.button>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      onClick={startCamera} 
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      📷 Detect Smile
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <video ref={videoRef} autoPlay playsInline className="w-40 h-40 rounded-2xl object-cover mb-4 border border-neutral-200 dark:border-neutral-700" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{isSmiling ? '😊 Smile detected!' : '📹 Look at camera'}</p>
                  {isSmiling && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-3xl">✨</motion.div>}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SkipToContent = ({ t }) => (
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-neutral-900 focus:text-white focus:rounded-lg focus:font-bold">
      {t('skip_to_content')}
    </a>
);

export default function App() {
    const [dark, setDark] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState(null);
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { scrollYProgress } = useScroll();

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      setDark(savedTheme ? savedTheme === 'dark' : true);
    }, []);

    useEffect(() => {
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    useEffect(() => {
      const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
      let ticking = false;
      const updateScrollProgress = () => {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        setScrollProgress((scrollPx / winHeightPx) * 100);
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

    useEffect(() => {
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
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
      <div className={`min-h-screen transition-colors duration-500 ${dark ? 'bg-black text-white' : 'bg-white text-black'}`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif' }} lang={lang}>
        <SkipToContent t={t} />

        {/* Progress bar */}
        <motion.div 
          className={`fixed top-0 left-0 right-0 h-0.5 z-50 ${dark ? 'bg-white' : 'bg-black'} origin-left`}
          style={{ scaleX: scrollYProgress }}
        />

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 100 }}
          className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 md:py-5 border-b border-neutral-200/30 dark:border-neutral-800/30 backdrop-blur-2xl bg-white/70 dark:bg-black/70"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.h1 
              className="text-base md:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              {t('name')}
            </motion.h1>
            
            <nav className="hidden md:flex gap-12 items-center text-sm text-neutral-600 dark:text-neutral-400">
              <motion.button 
                whileHover={{ color: dark ? '#f5f5f5' : '#000' }}
                onClick={() => i18n.changeLanguage('it')} 
                className={`transition-colors ${lang === 'it' ? (dark ? 'text-white' : 'text-black') + ' font-semibold' : ''}`}
              >
                IT
              </motion.button>
              <motion.button 
                whileHover={{ color: dark ? '#f5f5f5' : '#000' }}
                onClick={() => i18n.changeLanguage('en')} 
                className={`transition-colors ${lang === 'en' ? (dark ? 'text-white' : 'text-black') + ' font-semibold' : ''}`}
              >
                EN
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDark(!dark)} 
                className="p-2.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-lg"
              >
                {dark ? '☀️' : '🌙'}
              </motion.button>
            </nav>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`w-5 h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-5 h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-5 h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </motion.button>
          </div>
        </motion.header>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-white dark:bg-black z-30 flex flex-col items-center justify-center gap-8 pt-20"
            >
              <nav className="flex flex-col items-center gap-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  href="#education" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('education_title')}
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  href="#experiences" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('experiences_title')}
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  href="#skills" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('skills_title')}
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  href="#contact" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </motion.a>
              </nav>
              <div className="flex gap-8 text-neutral-600 dark:text-neutral-400">
                <motion.button 
                  whileHover={{ color: dark ? '#fff' : '#000' }}
                  onClick={() => { i18n.changeLanguage('it'); setIsMenuOpen(false); }} 
                  className={`font-semibold ${lang === 'it' ? (dark ? 'text-white' : 'text-black') : ''}`}
                >
                  IT
                </motion.button>
                <motion.button 
                  whileHover={{ color: dark ? '#fff' : '#000' }}
                  onClick={() => { i18n.changeLanguage('en'); setIsMenuOpen(false); }} 
                  className={`font-semibold ${lang === 'en' ? (dark ? 'text-white' : 'text-black') : ''}`}
                >
                  EN
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main */}
        <div className="relative pt-20 md:pt-24 max-w-7xl mx-auto px-4 md:px-8 pb-24">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={containerVars} className="space-y-32 md:space-y-48">

            {/* HERO - Ultra Modern 2026 */}
            <motion.section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 md:pt-20">
              {/* Animated gradient background */}
              <motion.div
                animate={{ 
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(0,0,0,0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.1) 0%, transparent 50%)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-0 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-black dark:to-neutral-900 bg-gradient-to-br from-neutral-50 via-white to-neutral-100"
              />

              {/* Animated grid background */}
              <div className="absolute inset-0 opacity-20 dark:opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_1px,rgba(0,0,0,.05)_1px),linear-gradient(180deg,transparent_1px,rgba(0,0,0,.05)_1px)] dark:bg-[linear-gradient(90deg,transparent_1px,rgba(255,255,255,.03)_1px),linear-gradient(180deg,transparent_1px,rgba(255,255,255,.03)_1px)] bg-[size:50px_50px]" />
              </div>

              {/* Floating orbs */}
              <motion.div
                animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-br from-neutral-950/20 dark:from-neutral-50/10 to-transparent blur-3xl"
              />
              <motion.div
                animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-neutral-950/20 dark:from-neutral-50/10 to-transparent blur-3xl"
              />

              {/* Main content */}
              <div className="relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center px-4 md:px-8 max-w-7xl mx-auto">
                  
                  {/* Left: Image - Ultra Modern */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, x: -100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.2 }}
                    className="relative order-first lg:order-last flex justify-center items-center perspective"
                  >
                    <div className="relative w-72 h-96 sm:w-80 sm:h-[500px] md:w-96 md:h-[520px]">
                      
                      {/* Outer glow layers */}
                      <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-neutral-950 dark:from-neutral-50 via-transparent to-neutral-900 dark:to-neutral-100 blur-2xl"
                      />
                      
                      {/* Inner glass layer */}
                      <div className="absolute inset-0 rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 overflow-hidden">
                        {/* Image with parallax */}
                        <motion.img 
                          src="/mp.png" 
                          alt="Mariangela" 
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.5 }}
                        />
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Floating elements around image */}
                      <motion.div
                        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -top-10 -right-10 px-5 py-3 rounded-full backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20"
                      >
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">⚡ Creative</span>
                      </motion.div>

                      <motion.div
                        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 0.2 }}
                        className="absolute -bottom-10 -left-10 px-5 py-3 rounded-full backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20"
                      >
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">🤖 AI Expert</span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Right: Content - Ultra Bold */}
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 100, delay: 0.3 }}
                    className="order-last lg:order-first space-y-8 md:space-y-12 py-8"
                  >
                    
                    {/* Status indicator */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="inline-flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 w-fit"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-neutral-950 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300"
                      />
                      <span className="text-xs md:text-sm font-bold text-neutral-900 dark:text-neutral-100">{t('available')}</span>
                    </motion.div>

                    {/* Main heading with staggered letters */}
                    <motion.div className="space-y-6">
                      <div className="overflow-hidden">
                        <motion.h1 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-neutral-950 dark:text-neutral-50"
                        >
                          <motion.span
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", damping: 30, delay: 0.6 }}
                            className="block"
                          >
                            {t('name').split(' ')[0]}
                          </motion.span>
                          <motion.span
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", damping: 30, delay: 0.7 }}
                            className="block bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 dark:from-neutral-50 via-neutral-700 dark:via-neutral-300 to-neutral-950 dark:to-neutral-50"
                          >
                            {t('name').split(' ')[1]}
                          </motion.span>
                        </motion.h1>
                      </div>

                      {/* Animated underline */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="h-1.5 bg-gradient-to-r from-neutral-950 dark:from-neutral-50 via-neutral-700 dark:via-neutral-300 to-transparent rounded-full max-w-xs"
                      />
                    </motion.div>

                    {/* Subtitle with role */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-4"
                    >
                      <div className="text-lg md:text-xl lg:text-2xl font-light text-neutral-700 dark:text-neutral-300">
                        <span className="block mb-2">{t('hero_title_1')}</span>
                        <span className="font-black text-3xl md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 dark:from-neutral-50 via-neutral-700 dark:via-neutral-300 to-neutral-900 dark:to-neutral-100">
                          {t('hero_title_2')}
                        </span>
                      </div>
                      
                      <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed font-light pt-4">
                        {t('hero_subtitle')}
                      </p>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-col xs:flex-row gap-4 md:gap-5 pt-6 md:pt-10"
                    >
                      <motion.a 
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        href="#contact" 
                        className="group relative px-8 md:px-10 py-5 md:py-6 bg-neutral-950 dark:bg-neutral-50 text-white dark:text-black font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all text-center text-sm md:text-base overflow-hidden"
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-950 dark:from-neutral-200 dark:to-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="relative">{t('cta_talk')} →</span>
                      </motion.a>
                      
                      <motion.a 
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        href="/resume.pdf" 
                        className="px-8 md:px-10 py-5 md:py-6 border-2 border-neutral-950 dark:border-neutral-50 text-neutral-950 dark:text-neutral-50 font-bold rounded-2xl hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 backdrop-blur transition-all text-center text-sm md:text-base"
                        download
                      >
                        {t('cta_resume')}
                      </motion.a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="grid grid-cols-3 gap-6 pt-10 md:pt-16 border-t border-neutral-300/30 dark:border-neutral-700/30"
                    >
                      {[
                        { value: '10+', label: 'Projects' },
                        { value: '3+', label: 'Years' },
                        { value: 'AI', label: 'Expert' }
                      ].map((stat, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          className="text-center"
                        >
                          <p className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 dark:from-neutral-50 via-neutral-700 dark:via-neutral-300 to-neutral-900 dark:to-neutral-100">
                            {stat.value}
                          </p>
                          <p className="text-xs md:text-sm opacity-60 text-neutral-700 dark:text-neutral-400 font-medium pt-2">
                            {stat.label}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* Education */}
            <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVars} id="education" className="space-y-12">
              <motion.h3 variants={itemVars} className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-neutral-950 dark:text-neutral-50">
                {t('education_title')} <span className="font-semibold">{t('education_highlight')}</span>
              </motion.h3>

              <div className="space-y-4">
                {[
                  { title: t('master_degree'), uni: 'Università degli Studi di Bari', spec: t('master_spec'), time: '2022 — 2024' },
                  { title: t('bachelor_degree'), uni: 'Università degli Studi di Bari', spec: t('bachelor_spec'), time: '2019 — 2022' },
                  { title: t('diploma'), uni: 'I.I.S.S. Galileo Ferraris', spec: '', time: '2014 — 2019' },
                ].map((item, idx) => (
                  <motion.div 
                    variants={itemVars} 
                    key={idx} 
                    whileHover={{ backgroundColor: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                    className="group p-6 md:p-8 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-default"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-base md:text-lg font-semibold text-neutral-950 dark:text-neutral-50 pr-4">{item.title}</h4>
                      <span className="text-xs opacity-50 font-medium whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-sm opacity-70 text-neutral-700 dark:text-neutral-400 mb-1">{item.uni}</p>
                    {item.spec && <p className="text-xs opacity-60 text-neutral-600 dark:text-neutral-500">{item.spec}</p>}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Experiences */}
            <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVars} id="experiences" className="space-y-12">
              <motion.h3 variants={itemVars} className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-neutral-950 dark:text-neutral-50">
                {t('experiences_title')}
              </motion.h3>

              <div className="grid md:grid-cols-2 gap-6">
                {experiences.map((exp, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVars} 
                    whileHover={{ backgroundColor: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                    className="p-6 md:p-8 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                  >
                    <h4 className="text-base md:text-lg font-semibold text-neutral-950 dark:text-neutral-50 mb-1">{exp.role}</h4>
                    <p className="text-sm opacity-70 text-neutral-700 dark:text-neutral-400 mb-4">{exp.company} • {exp.time}</p>
                    <p className="text-sm leading-relaxed opacity-80 text-neutral-700 dark:text-neutral-300 mb-6">{exp.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Skills */}
            <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVars} id="skills" className="space-y-12">
              <motion.h3 variants={itemVars} className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-right text-neutral-950 dark:text-neutral-50">
                {t('skills_arsenal')} <span className="font-semibold">{t('skills_title')}</span>
              </motion.h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "Framer", "Python", "SQL", "Git", "Docker", "Azure", "GCP"].map((s) => (
                  <motion.div 
                    key={s} 
                    variants={itemVars}
                    whileHover={{ scale: 1.05, backgroundColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                    className="p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all text-center font-medium text-sm text-neutral-900 dark:text-neutral-100"
                  >
                    {s}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Contact */}
            <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVars} id="contact" className="py-16 md:py-20">
              <div className="text-center space-y-10">
                <motion.div variants={itemVars} className="space-y-6">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-950 dark:text-neutral-50">
                    {t('contact_title_1')}<br /><span className="font-semibold">{t('contact_title_2')}</span>
                  </h3>
                  <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                    {t('contact_text')}
                  </p>
                </motion.div>

                <motion.a 
                  variants={itemVars}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:panunzioxmariangela@gmail.com" 
                  className="inline-block px-8 py-4 md:py-5 bg-neutral-950 dark:bg-neutral-50 text-white dark:text-black font-semibold rounded-xl hover:opacity-80 transition-all text-sm md:text-base"
                >
                  panunzioxmariangela@gmail.com
                </motion.a>

                <motion.div variants={itemVars} className="flex justify-center gap-8 pt-4">
                  <motion.a 
                    whileHover={{ scale: 1.2, y: -4 }}
                    href="https://www.linkedin.com/in/mariangela-panunzio-152817183/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-2xl opacity-60 hover:opacity-100 transition-opacity text-neutral-900 dark:text-neutral-100"
                  >
                    <FaLinkedin />
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.2, y: -4 }}
                    href="https://github.com/mariangelapanunzio" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-2xl opacity-60 hover:opacity-100 transition-opacity text-neutral-900 dark:text-neutral-100"
                  >
                    <FaGithub />
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.2, y: -4 }}
                    href="mailto:panunzioxmariangela@gmail.com" 
                    className="text-2xl opacity-60 hover:opacity-100 transition-opacity text-neutral-900 dark:text-neutral-100"
                  >
                    <FaEnvelope />
                  </motion.a>
                </motion.div>
              </div>
            </motion.section>

            {/* Footer */}
            <motion.footer variants={itemVars} className="text-center pt-12 border-t border-neutral-200/50 dark:border-neutral-800/50 opacity-60 text-sm font-light text-neutral-700 dark:text-neutral-400">
              <p>© {new Date().getFullYear()} {t('name')} • {t('footer_crafted')}</p>
            </motion.footer>
          </motion.div>
        </div>

        {/* AI Widget */}
        <AIWidget lang={lang} dark={dark} />

        {/* Scroll to top */}
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-neutral-950 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-950 shadow-2xl transition-all flex items-center justify-center font-bold z-30"
          >
            ↑
          </motion.button>
        )}
      </div>
    );
}