'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@/components/atoms';
import { SURAHS, TAFSEERS, getTafseerContent } from '@/lib/mockData';
import { useSettingsStore } from '@/stores/settingsStore';
import { cn } from '@/utils/cn';
import { useMounted } from '@/hooks/useMounted';
import drIsrarData from '@/data/dr_israr_tafseer.json';

export default function TafseerPage() {
  const router = useRouter();
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTafsir, setSelectedTafsir] = useState('ibn-kathir');

  // Desktop sidebars
  const [showTocDesktop, setShowTocDesktop] = useState(true);
  const [showCrossRefsDesktop, setShowCrossRefsDesktop] = useState(true);

  // Mobile Modals
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [mobileRefsOpen, setMobileRefsOpen] = useState(false);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const readingLanguage = useSettingsStore(s => s.readingLanguage);
  const setReadingLanguage = useSettingsStore(s => s.setReadingLanguage);
  const activeTheme = useSettingsStore(s => s.activeTheme);
  
  const mounted = useMounted();
  const safeReadingLanguage = mounted ? readingLanguage : 'en';
  const isLight = mounted ? activeTheme === 'light' : false;
  const isUrdu = safeReadingLanguage === 'ur';
  const videoRef = useRef<HTMLVideoElement>(null);

  const surah = SURAHS.find((s) => s.id === selectedSurah);
  const content = getTafseerContent(selectedTafsir, selectedSurah, safeReadingLanguage);
  const activeTafsir = TAFSEERS.find(t => t.id === selectedTafsir);

  const filteredSurahs = SURAHS.filter(s =>
    s.name_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name_arabic.includes(searchQuery) ||
    String(s.id) === searchQuery
  );

  const israrVideo = drIsrarData.find((v: any) => v.surahId === selectedSurah);

  const handleCloseVideo = () => {
    if (videoRef.current) videoRef.current.pause();
    setShowVideoModal(false);
  };

  useEffect(() => { setShowVideoModal(false); }, [selectedSurah]);

  // Mobile TOC Component
  const TocContent = () => (
    <div className="flex flex-col h-full bg-[#091a14]/97 backdrop-blur-3xl md:bg-transparent">
      <div className="px-4 py-4 shrink-0 md:px-1 md:mb-3">
        {/* Mobile Header for Modal */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-bold text-white">Select Surah</h2>
          <button onClick={() => setMobileTocOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">✕</button>
        </div>
        <input
          type="text"
          placeholder="Search Surah..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 md:py-2 text-sm md:text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-islamic-gold/50"
        />
      </div>
      <div className="space-y-1 md:space-y-0.5 overflow-y-auto flex-1 px-4 md:px-0 pb-20 md:pb-4 show-scrollbar">
        {filteredSurahs.map((s) => (
          <motion.button key={s.id} whileHover={{ x: 2 }}
            onClick={() => {
              setSelectedSurah(s.id);
              setMobileTocOpen(false); // Close modal on mobile after selection
            }}
            className={cn(
              'w-full text-left px-4 py-3 md:px-3 md:py-2 rounded-xl md:rounded-lg transition-all',
              selectedSurah === s.id
                ? 'bg-islamic-gold/15 text-islamic-gold border border-islamic-gold/20'
                : 'text-gray-400 hover:bg-white/[0.06] hover:text-white border border-transparent'
            )}
          >
            <div className="flex items-center gap-3 md:gap-2">
              <span className="text-xs md:text-[10px] text-gray-500 tabular-nums w-6 md:w-5">{s.id}</span>
              <div className="min-w-0 flex-1">
                <span className="font-medium block text-sm md:text-xs text-white md:text-inherit">{s.name_english}</span>
              </div>
              <span className="text-sm md:text-[10px] text-islamic-gold/60 md:text-gray-600 font-arabic">{s.name_arabic}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  // Mobile Refs Component
  const RefsContent = () => (
    <div className="h-full bg-[#091a14]/97 backdrop-blur-3xl md:bg-transparent overflow-y-auto py-6 px-5 md:px-4 pb-24 md:pb-6">
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h2 className="text-lg font-bold text-white">Cross References</h2>
        <button onClick={() => setMobileRefsOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">✕</button>
      </div>
      <h3 className="hidden md:block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Cross-References
      </h3>
      <div className="space-y-3">
        {content.crossReferences.map((ref, i) => (
          <motion.div key={i} whileHover={{ x: 2 }}>
            <button
              onClick={() => router.push(`/player/${ref.surahId}?ayah=${ref.ayahNumber}`)}
              className="w-full text-left bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 md:p-3 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all"
            >
              <p className="text-sm md:text-xs font-semibold text-islamic-gold mb-2 md:mb-1">{ref.label}</p>
              <p className="font-arabic text-base md:text-sm text-gray-200 text-right leading-relaxed" dir="rtl">
                {ref.text}
              </p>
              <p className="text-xs md:text-[10px] text-gray-500 mt-2 md:mt-1">
                {ref.surahName} • Ayah {ref.ayahNumber}
              </p>
              <span className="text-xs md:text-[10px] text-teal-400 mt-2 md:mt-1 inline-block">🔗 Go to Ayah →</span>
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-white/[0.06]">
        <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <Button variant="glass" size="sm" className="w-full mb-2"
          onClick={() => router.push(`/player/${selectedSurah}`)}>
          📖 Read This Surah
        </Button>
        <Button variant="glass" size="sm" className="w-full"
          onClick={() => router.push('/academy')}>
          🎓 Related Videos
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen pt-16 lg:pt-0 pb-16 lg:pb-0">
      {/* Mobile Top App Bar (Replaces Desktop Sticky Header on Mobile & Tablet) */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-[#0d2620]/92 backdrop-blur-xl border-b border-teal-500/10 p-3 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Tafseer Library</h1>
            <p className="text-[10px] text-teal-500">{surah?.name_english} • Surah {selectedSurah}</p>
          </div>
          <Button variant="glass" size="sm" onClick={() => setReadingLanguage(isUrdu ? 'en' : 'ur')}>
            🌍 {isUrdu ? 'اردو' : 'EN'}
          </Button>
        </div>

        {/* Mobile Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMobileTocOpen(true)}
            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-gray-300 hover:text-white"
          >
            <span>📑</span> Select Surah
          </button>
          <button
            onClick={() => setMobileRefsOpen(true)}
            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-gray-300 hover:text-white"
          >
            <span>🔗</span> References
          </button>
        </div>

        {/* Mobile Tafsir Switcher */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 show-scrollbar -mx-1 px-1">
          {TAFSEERS.map((tafsir) => (
            <button
              key={`mob-${tafsir.id}`}
              onClick={() => setSelectedTafsir(tafsir.id)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap',
                selectedTafsir === tafsir.id
                  ? 'bg-islamic-gold/15 text-islamic-gold border border-islamic-gold/30'
                  : 'bg-transparent text-gray-400 border border-white/[0.08]'
              )}
            >
              {tafsir.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:block sticky top-20 z-20 theme-sticky-header backdrop-blur-xl border-b border-white/[0.06] px-8 py-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <button onClick={() => router.push('/')} className="text-xs text-gray-500 hover:text-white mb-2 flex items-center gap-1">
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white">Tafseer Library</h1>
            <p className="text-xs text-gray-400">Academic study of the Quran</p>
          </div>
          <div className="flex gap-2">
            <Button variant="glass" size="sm" onClick={() => setReadingLanguage(isUrdu ? 'en' : 'ur')}>
              🌍 {isUrdu ? 'اردو' : 'English'}
            </Button>
            <Button variant="glass" size="sm" onClick={() => setShowTocDesktop(!showTocDesktop)}>
              {showTocDesktop ? '⊟ Hide' : '⊞ Show'} TOC
            </Button>
            <Button variant="glass" size="sm" onClick={() => setShowCrossRefsDesktop(!showCrossRefsDesktop)}>
              {showCrossRefsDesktop ? '⊟' : '⊞'} Refs
            </Button>
          </div>
        </div>

        {/* Desktop Tafsir Tab Switcher */}
        <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1">
          {TAFSEERS.map((tafsir) => (
            <motion.button
              key={tafsir.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTafsir(tafsir.id)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all relative',
                selectedTafsir === tafsir.id
                  ? 'bg-islamic-gold/15 text-islamic-gold border border-islamic-gold/25'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white border border-transparent hover:bg-white/[0.08]'
              )}
            >
              {tafsir.shortName}
              {selectedTafsir === tafsir.id && (
                <motion.div
                  layoutId="tafsir-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-islamic-gold rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* 3-Panel Layout (Desktop) / Mobile & Tablet Content */}
      <div className="flex-1 flex items-start mt-[130px] lg:mt-0">

        {/* Left: TOC (Desktop) */}
        <AnimatePresence>
          {showTocDesktop && (
            <motion.div
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="hidden lg:flex flex-shrink-0 border-r border-white/[0.06] sticky top-[230px] h-[calc(100vh-240px)] flex-col will-change-transform transform-gpu overflow-hidden"
              style={{ width: 240 }}
            >
              <TocContent />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Content */}
        <div className="flex-1 px-4 md:px-8 pt-4 md:pt-8 pb-12 w-full overflow-x-hidden">
          {/* Surah Header */}
          {surah && (
            <motion.div
              key={selectedSurah}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-6 md:mb-8 bg-white/[0.03] backdrop-blur-md rounded-2xl p-5 md:p-6 border border-white/[0.08] transform-gpu will-change-transform"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex justify-between items-start md:items-center w-full md:w-auto">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{surah.name_english}</h2>
                    <h3 className="text-lg md:text-xl font-arabic text-islamic-gold mt-1">{surah.name_arabic}</h3>
                  </div>
                  {/* Mobile Badge View */}
                  <div className="md:hidden flex flex-col gap-1 items-end">
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded-md">{surah.revelation_type}</span>
                    <span className="text-[10px] font-bold text-islamic-gold bg-islamic-gold/10 px-2 py-1 rounded-md">{surah.ayah_count} Ayahs</span>
                  </div>
                </div>
                {/* Desktop Badge View */}
                <div className="hidden md:flex gap-2">
                  <Badge variant="emerald">{surah.revelation_type}</Badge>
                  <Badge variant="gold">{surah.ayah_count} Ayahs</Badge>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dr. Israr Ahmed Video Tafseer Card */}
          {israrVideo && (
            <motion.div
              key={`video-${selectedSurah}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
              className="mb-6 md:mb-8 bg-gradient-to-br from-[#0d9488]/10 to-[#d4af37]/10 rounded-2xl p-4 md:p-5 border border-teal-500/20 transform-gpu will-change-transform flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-14 h-14 md:w-12 md:h-12 shrink-0 rounded-xl bg-teal-900 flex items-center justify-center text-xs font-bold text-white overflow-hidden border border-islamic-gold/50 shadow-lg">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/2/2f/Dr.Israr_Ahmed.jpg"
                    alt="Dr. Israr Ahmed"
                    className="w-full h-full object-cover"
                    onError={(e: any) => { e.target.style.display = 'none' }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm md:text-sm font-bold text-white mb-0.5">🎬 Video Tafseer — Dr. Israr</h4>
                  <p className="text-[10px] text-gray-300">
                    Bayan-ul-Quran • Lecture {israrVideo.lectureNumber}
                    {israrVideo.startTime > 0 && ` • Starts @ ${Math.floor(israrVideo.startTime / 60)}m`}
                  </p>
                </div>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="w-10 h-10 rounded-full bg-islamic-gold flex items-center justify-center text-black font-bold shadow-lg shadow-islamic-gold/30 hover:scale-105 transition-transform shrink-0 md:hidden"
                >
                  ▶
                </button>
              </div>
              <Button variant="gold" size="sm" onClick={() => setShowVideoModal(true)} className="hidden md:flex w-full sm:w-auto whitespace-nowrap">
                ▶ Watch Lecture
              </Button>
            </motion.div>
          )}

          {/* Tafsir Meta */}
          {activeTafsir && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-gray-500 border-b border-white/[0.05] pb-4">
              <span className={cn('w-2 h-2 rounded-full', activeTafsir.color.replace('text-', 'bg-'))} />
              <span className="font-bold text-teal-400">{activeTafsir.name}</span>
              <span>•</span>
              <span className="text-gray-400">{activeTafsir.author}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{activeTafsir.period}</span>
            </div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedSurah}-${selectedTafsir}-${readingLanguage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={cn("prose-tafseer transform-gpu will-change-transform", isUrdu && "text-right font-arabic text-lg")}
              dir={isUrdu ? "rtl" : "ltr"}
            >
              {/* Intro */}
              <p className={cn("text-gray-100 leading-relaxed text-[15px] md:text-base mb-6", !isUrdu && "drop-cap font-serif text-lg")}>
                {content.intro}
              </p>

              {/* Body */}
              {content.body.map((para, i) => (
                <p key={i} className="text-gray-300 leading-8 text-[15px] md:text-sm mb-6">
                  {para}
                </p>
              ))}

              <div className={cn(
                "mt-10 rounded-2xl p-5 md:p-6 border relative overflow-hidden transition-all duration-300",
                isLight 
                  ? "bg-white border-gray-200 shadow-md" 
                  : "bg-gradient-to-br from-[#0d2d24] via-[#0d2035] to-[#112240] border-teal-500/20 shadow-xl"
              )}>
                {/* Decorative background blur (only in dark mode) */}
                {(!isLight && mounted) && <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full pointer-events-none" />}

                <h4 className="text-base font-bold text-islamic-gold mb-4 flex items-center gap-2">
                  <span>💡</span> {isUrdu ? 'کلیدی بصیرتیں' : 'Key Insights'}
                </h4>
                <ul className="space-y-3 relative z-10">
                  {content.keyInsights.map((insight, i) => (
                    <li key={i} className="text-[15px] md:text-sm text-gray-200 leading-relaxed flex items-start gap-3">
                      <span className="text-islamic-gold mt-1 text-lg leading-none">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>


        {/* Right: Cross-References (Desktop) */}
        <AnimatePresence>
          {showCrossRefsDesktop && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden xl:flex flex-shrink-0 border-l border-white/[0.06] sticky top-[230px] h-[calc(100vh-240px)] flex-col"
            >
              <RefsContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE & TABLET MODALS */}
      <AnimatePresence>
        {mobileTocOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <TocContent />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileRefsOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <RefsContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dr. Israr Video Modal — NO autoplay */}
      <AnimatePresence>
        {showVideoModal && israrVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-4"
            onClick={handleCloseVideo}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full h-full md:h-auto md:max-w-5xl md:rounded-2xl flex flex-col overflow-hidden border border-white/[0.15] bg-[#0A1118]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 flex flex-col items-center justify-center pt-10 pb-4 md:py-0 px-4">
                <button onClick={handleCloseVideo}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-sm md:w-8 md:h-8 hover:bg-white/20 transition-colors">
                  ✕
                </button>
                <div className="w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl shadow-black">
                  <div className="bg-gradient-to-r from-teal-900 to-[#0D1B2A] px-5 py-4 border-b border-teal-500/20">
                    <h3 className="text-sm md:text-base font-bold text-white truncate">
                      Surah {israrVideo.surahName}
                    </h3>
                    <p className="text-[10px] md:text-xs text-teal-400 font-medium">
                      Bayan-ul-Quran • Lecture {israrVideo.lectureNumber}
                    </p>
                  </div>
                  <video
                    ref={videoRef}
                    controls
                    preload="metadata"
                    className="w-full aspect-video bg-black"
                    src={israrVideo.videoUrl + (israrVideo.startTime ? `#t=${israrVideo.startTime}` : '')}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
