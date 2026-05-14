'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Badge, GlassPanel } from '@/components/atoms';
import { SURAHS, TAFSEERS, getTafseerContent } from '@/lib/mockData';
import { useSettingsStore } from '@/stores/settingsStore';
import { cn } from '@/utils/cn';
import drIsrarData from '@/data/dr_israr_tafseer.json';

export default function TafseerPage() {
  const router = useRouter();
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTafsir, setSelectedTafsir] = useState('ibn-kathir');
  const [showToc, setShowToc] = useState(true);
  const [showCrossRefs, setShowCrossRefs] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const { readingLanguage, setReadingLanguage } = useSettingsStore();
  const isUrdu = readingLanguage === 'ur';
  const videoRef = useRef<HTMLVideoElement>(null);

  const surah = SURAHS.find((s) => s.id === selectedSurah);
  const content = getTafseerContent(selectedTafsir, selectedSurah, readingLanguage);
  const activeTafsir = TAFSEERS.find(t => t.id === selectedTafsir);

  const filteredSurahs = SURAHS.filter(s =>
    s.name_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name_arabic.includes(searchQuery) ||
    String(s.id) === searchQuery
  );

  // Get the Dr. Israr video for this surah (strict 1-to-1)
  const israrVideo = drIsrarData.find((v: any) => v.surahId === selectedSurah);

  const handleCloseVideo = () => {
    if (videoRef.current) videoRef.current.pause();
    setShowVideoModal(false);
  };

  // Reset video modal when surah changes
  useEffect(() => { setShowVideoModal(false); }, [selectedSurah]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 min-[1200px]:top-20 z-20 theme-sticky-header backdrop-blur-xl border-b border-white/[0.06] px-4 md:px-8 py-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <button onClick={() => router.push('/')} className="text-xs text-gray-500 hover:text-white mb-2 flex items-center gap-1">
              ← Back
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Tafseer Library</h1>
            <p className="text-xs text-gray-400">Academic study of the Quran</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setReadingLanguage(isUrdu ? 'en' : 'ur')}
            >
              🌍 {isUrdu ? 'اردو' : 'English'}
            </Button>
            <Button variant="glass" size="sm" onClick={() => setShowToc(!showToc)}>
              {showToc ? '⊟ Hide' : '⊞ Show'} TOC
            </Button>
            <Button variant="glass" size="sm" onClick={() => setShowCrossRefs(!showCrossRefs)}>
              {showCrossRefs ? '⊟' : '⊞'} Refs
            </Button>
          </div>
        </div>

        {/* Tafsir Tab Switcher */}
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

      {/* 3-Panel Layout */}
      <div className="flex-1 flex items-start">
        {/* Left: TOC */}
        <AnimatePresence>
          {showToc && (
            <motion.div
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex-shrink-0 border-r border-white/[0.06] sticky top-[150px] min-[1200px]:top-[230px] h-[calc(100vh-160px)] min-[1200px]:h-[calc(100vh-240px)] flex flex-col will-change-transform transform-gpu overflow-hidden"
              style={{ width: 240 }}
            >
              <div className="w-60 flex flex-col py-4 px-3 h-full">
                <div className="px-1 mb-3 shrink-0">
                  <input
                    type="text"
                    placeholder="Search Surah..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-islamic-gold/50"
                  />
                </div>
                <div className="space-y-0.5 overflow-y-auto flex-1 pb-4 show-scrollbar">
                  {filteredSurahs.map((s) => (
                    <motion.button key={s.id} whileHover={{ x: 2 }}
                      onClick={() => setSelectedSurah(s.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg transition-all text-xs',
                        selectedSurah === s.id
                          ? 'bg-islamic-gold/15 text-islamic-gold border border-islamic-gold/20'
                          : 'text-gray-400 hover:bg-white/[0.06] hover:text-white border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-600 tabular-nums w-5">{s.id}</span>
                        <div className="min-w-0">
                          <span className="font-medium block truncate">{s.name_english}</span>
                          <span className="text-[10px] text-gray-600 font-arabic">{s.name_arabic}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Content */}
        <div className="flex-1 px-4 md:px-8 pt-8 pb-12">
          {/* Surah Header */}
          {surah && (
            <motion.div
              key={selectedSurah}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-8 bg-white/[0.04] rounded-2xl p-6 border border-white/[0.08] transform-gpu will-change-transform"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-white">{surah.name_english}</h2>
                  <h3 className="text-xl font-arabic text-islamic-gold mt-1">{surah.name_arabic}</h3>
                </div>
                <div className="flex gap-2">
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
              className="mb-8 bg-gradient-to-br from-islamic-emerald/[0.08] to-islamic-gold/[0.05] rounded-2xl p-5 border border-islamic-emerald/20 transform-gpu will-change-transform"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-islamic-emerald flex items-center justify-center text-xs font-bold text-white overflow-hidden border border-islamic-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/2/2f/Dr.Israr_Ahmed.jpg"
                      alt="Dr. Israr Ahmed"
                      className="w-full h-full object-cover"
                      onError={(e: any) => { e.target.style.display = 'none' }}
                    />
                    {/* <span className="absolute">IA</span> */}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">🎬 Video Tafseer — Dr. Israr Ahmed</h4>
                    <p className="text-[10px] text-gray-400">
                      Bayan-ul-Quran • Lecture {israrVideo.lectureNumber} of 108
                      {israrVideo.startTime > 0 && ` • starts at ${Math.floor(israrVideo.startTime / 60)}m`}
                    </p>
                  </div>
                </div>
                <Button variant="gold" size="sm" onClick={() => setShowVideoModal(true)}>
                  ▶ Watch Tafseer
                </Button>
              </div>
            </motion.div>
          )}

          {/* Tafsir Meta */}
          {activeTafsir && (
            <div className="mb-6 flex items-center gap-3 text-xs text-gray-500">
              <span className={activeTafsir.color}>●</span>
              <span className="font-semibold text-gray-300">{activeTafsir.name}</span>
              <span>•</span>
              <span>{activeTafsir.author}</span>
              <span>•</span>
              <span>{activeTafsir.period}</span>
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
              <p className={cn("text-gray-200 leading-8 text-base mb-6", !isUrdu && "drop-cap")}>
                {content.intro}
              </p>

              {/* Body */}
              {content.body.map((para, i) => (
                <p key={i} className="text-gray-300 leading-8 text-sm mb-5">
                  {para}
                </p>
              ))}

              {/* Key Insights */}
              <div className="mt-8 bg-white/[0.04] rounded-2xl p-5 border border-white/[0.08]">
                <h4 className="text-sm font-bold text-islamic-gold mb-3 flex items-center gap-2">
                  <span>💡</span> {isUrdu ? 'کلیدی بصیرتیں' : 'Key Insights'}
                </h4>
                <ul className="space-y-2">
                  {content.keyInsights.map((insight, i) => (
                    <li key={i} className="text-sm text-gray-300 leading-6 flex items-start gap-2">
                      <span className="text-islamic-gold/60 mt-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>


        {/* Right: Cross-References */}
        <AnimatePresence>
          {showCrossRefs && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0 border-l border-white/[0.06] sticky top-[150px] min-[1200px]:top-[230px] h-[calc(100vh-160px)] min-[1200px]:h-[calc(100vh-240px)] flex flex-col"
            >
              <div className="w-[280px] h-full overflow-y-auto py-6 px-4">
                <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Cross-References
                </h3>
                <div className="space-y-3">
                  {content.crossReferences.map((ref, i) => (
                    <motion.div key={i} whileHover={{ x: 2 }}>
                      <button
                        onClick={() => router.push(`/player/${ref.surahId}?ayah=${ref.ayahNumber}`)}
                        className="w-full text-left bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all"
                      >
                        <p className="text-xs font-semibold text-islamic-gold mb-1">{ref.label}</p>
                        <p className="font-arabic text-sm text-gray-200 text-right leading-relaxed" dir="rtl">
                          {ref.text}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          {ref.surahName} • Ayah {ref.ayahNumber}
                        </p>
                        <span className="text-[10px] text-islamic-gold/60 mt-1 inline-block">🔗 Go to Ayah →</span>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dr. Israr Video Modal — NO autoplay */}
      <AnimatePresence>
        {showVideoModal && israrVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={handleCloseVideo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl rounded-2xl overflow-hidden border border-white/[0.15] relative bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={handleCloseVideo}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 text-gray-300 hover:text-white flex items-center justify-center text-sm transition-colors">
                ✕
              </button>
              <div className="bg-gradient-to-r from-[#0A1A14] to-[#0D1B2A] px-5 py-3 border-b border-white/[0.08]">
                <h3 className="text-sm font-semibold text-white truncate">
                  Surah {israrVideo.surahName} — Dr. Israr Ahmed
                </h3>
                <p className="text-[10px] text-gray-500">
                  Bayan-ul-Quran • Lecture {israrVideo.lectureNumber} of 108
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
