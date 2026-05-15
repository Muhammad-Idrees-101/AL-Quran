'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AyahCard } from '@/components/molecules';
import { Badge, Button } from '@/components/atoms';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useFeaturesStore } from '@/stores/featuresStore';
import { Ayah, Surah, Theme } from '@/types/quran';
import { SURAHS } from '@/lib/mockData';
import { cn } from '@/utils/cn';

interface Props {
  surah: Surah;
  ayahs: Ayah[];
  initialAyah: number;
}

export function QuranPlayerContent({ surah, ayahs, initialAyah }: Props) {
  const { currentAyahNumber, setCurrentAyah, playFullSurah } = usePlayerStore();
  const { toggleDrawer, activeTheme } = useSettingsStore();
  const { markSurahRead } = useFeaturesStore();
  const isLight = activeTheme === Theme.LIGHT;
  const scrollTargetRef = useRef<boolean>(false);

  // Track reading progress
  useEffect(() => {
    markSurahRead(surah.id);
  }, [surah.id]);

  // Scroll to initial ayah on mount
  useEffect(() => {
    if (initialAyah > 1 && !scrollTargetRef.current) {
      scrollTargetRef.current = true;
      setTimeout(() => {
        const el = document.getElementById(`ayah-${initialAyah}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [initialAyah]);

  // Auto-scroll to currently playing ayah
  useEffect(() => {
    if (currentAyahNumber && currentAyahNumber > 1) {
      const el = document.getElementById(`ayah-${currentAyahNumber}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentAyahNumber]);

  // Find adjacent surahs for navigation
  const prevSurah = SURAHS.find((s) => s.id === surah.id - 1);
  const nextSurah = SURAHS.find((s) => s.id === surah.id + 1);

  return (
    <div>
      {/* Sticky Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`sticky top-16 lg:top-0 min-[1200px]:top-20 z-20 theme-sticky-header backdrop-blur-xl border-b px-4 md:px-8 py-4 transition-colors duration-500 ${isLight ? 'border-gray-100 bg-white/95' : 'border-white/[0.06]'
          }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <Link href="/">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="text-xs text-gray-500 hover:text-white transition-colors mb-2 flex items-center gap-1"
              >
                ← Back to Discovery
              </motion.button>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl md:text-3xl font-bold truncate transition-colors ${isLight ? 'text-gray-900' : 'text-white'
                }`}>
                {surah.name_english}
              </h1>
              <span className="font-arabic text-xl text-islamic-gold">{surah.name_arabic}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="emerald">{surah.revelation_type}</Badge>
            <Badge variant="gold">{surah.ayah_count} Ayahs</Badge>
            <Badge variant="slate">Surah {surah.id}</Badge>

            <PlayDropdown
              surah={surah}
              onFullPlay={() => playFullSurah({
                surahId: surah.id,
                surahName: surah.name_english,
                surahArabic: surah.name_arabic,
                surahAyahCount: surah.ayah_count
              })}
              onAyahPlay={() => setCurrentAyah({
                ayahId: ayahs[0].id,
                surahId: surah.id,
                ayahNumber: 1,
                surahName: surah.name_english,
                surahArabic: surah.name_arabic,
                surahAyahCount: surah.ayah_count,
              })}
            />

            <Link href={`/tafseer`}>
              <Button variant="glass" size="sm">🎬 Watch Tafseer</Button>
            </Link>
            <Button variant="glass" size="sm" onClick={toggleDrawer}>
              ⚙️ Settings
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Surah Info */}
      <section className="px-4 md:px-8 py-6 text-center border-b border-white/[0.04]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
          <p className="text-xs text-gray-500">
            Revelation Order:{' '}
            <span className="text-islamic-gold">#{surah.revelation_order}</span>
            <span className="mx-2">•</span>
            Pages:{' '}
            <span className="text-islamic-gold">
              {surah.page_start}–{surah.page_end}
            </span>
          </p>
        </motion.div>
      </section>

      {/* ── Jump to Ayah Panel ── */}
      <JumpToAyahPanel
        ayahCount={surah.ayah_count}
        activeAyah={currentAyahNumber || initialAyah}
      />

      {/* Bismillah */}
      {surah.bismillah_pre !== false && surah.id !== 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="py-8 md:py-12"
        >
          <p className={cn(
            "bismillah transition-colors duration-500",
            isLight ? "text-islamic-emerald drop-shadow-sm" : "text-islamic-gold"
          )}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </motion.div>
      )}

      {/* Ayahs */}
      <section className="px-4 md:px-8 py-8">
        <div className="space-y-4 max-w-4xl mx-auto">
          {ayahs.map((ayah, index) => (
            <AyahCard
              key={ayah.id}
              ayah={ayah}
              surah={surah}
              index={index}
              isScrollTarget={ayah.ayah_number === initialAyah && initialAyah > 1}
            />
          ))}
        </div>
      </section>

      {/* Navigation between Surahs */}
      <section className="px-4 md:px-8 py-8 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto flex justify-between">
          {prevSurah ? (
            <Link href={`/player/${prevSurah.id}`}>
              <Button variant="glass" size="sm">← {prevSurah.name_english}</Button>
            </Link>
          ) : (
            <div />
          )}
          {nextSurah ? (
            <Link href={`/player/${nextSurah.id}`}>
              <Button variant="glass" size="sm">{nextSurah.name_english} →</Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
      {/* ── Floating Controls ── */}
      <FloatingControls />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Play Dropdown Component
───────────────────────────────────────────────────────────── */
function PlayDropdown({
  surah,
  onFullPlay,
  onAyahPlay
}: {
  surah: Surah,
  onFullPlay: () => void,
  onAyahPlay: () => void
}) {
  const { activeTheme } = useSettingsStore();
  const isLight = activeTheme === Theme.LIGHT;
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="gold"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group"
      >
        <span>▶ Play Surah</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[10px] opacity-70 group-hover:opacity-100"
        >
          ▾
        </motion.span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute top-full mt-2 right-0 sm:left-0 sm:right-auto min-w-[220px] z-30 border rounded-xl shadow-2xl overflow-hidden py-1.5 transition-colors",
              isLight
                ? "bg-white border-gray-200"
                : "bg-[#0A1A14] border-white/[0.08]"
            )}
          >
            <button
              onClick={() => {
                onFullPlay();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-islamic-gold/10 transition-colors group"
            >
              <span className="w-8 h-8 rounded-lg bg-islamic-gold/20 flex items-center justify-center text-islamic-gold group-hover:bg-islamic-gold/30 transition-colors">
                🌊
              </span>
              <div>
                <p className={`text-sm font-semibold transition-colors ${isLight ? 'text-gray-900' : 'text-white'}`}>Seamless Play</p>
                <p className="text-[10px] text-gray-500">Full Surah (No gaps)</p>
              </div>
            </button>

            <div className={`h-px my-1 mx-2 ${isLight ? 'bg-gray-100' : 'bg-white/[0.06]'}`} />

            <button
              onClick={() => {
                onAyahPlay();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-islamic-gold/10 transition-colors group"
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? 'bg-gray-100 text-gray-500 group-hover:bg-gray-200' : 'bg-white/10 text-gray-400 group-hover:bg-white/20'}`}>
                🔢
              </span>
              <div>
                <p className={`text-sm font-semibold transition-colors ${isLight ? 'text-gray-900' : 'text-white'}`}>Continuous Play</p>
                <p className="text-[10px] text-gray-500">Ayah-by-Ayah mode</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Floating Controls (Scroll to Top)
───────────────────────────────────────────────────────────── */
function FloatingControls() {
  const [showTopBtn, setShowTopBtn] = React.useState(false);
  const { currentAyahId } = usePlayerStore();
  const { activeTheme } = useSettingsStore();
  const isLight = activeTheme === Theme.LIGHT;

  React.useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showTopBtn && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className={`fixed right-6 z-50 transition-all duration-500 ease-out ${currentAyahId ? 'bottom-20 md:bottom-24' : 'bottom-14 md:bottom-20'
            }`}
        >
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
            className={cn(
              "group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full backdrop-blur-xl border transition-all duration-300",
              isLight
                ? "bg-white border-gray-200 text-islamic-emerald shadow-lg shadow-black/5"
                : "bg-gradient-to-t from-[#0A1A14] to-[#0d1b2a] border-islamic-gold/30 text-islamic-gold shadow-[0_0_20px_rgba(212,165,116,0.15)]"
            )}
          >
            {/* Inner glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-full transition-colors duration-300",
              isLight ? "group-hover:bg-gray-50" : "group-hover:bg-islamic-gold/20"
            )} />

            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300"
            >
              <path d="M17 11l-5-5-5 5M17 18l-5-5-5 5" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   Jump to Ayah Panel Component
───────────────────────────────────────────────────────────── */
function JumpToAyahPanel({
  ayahCount,
  activeAyah,
}: {
  ayahCount: number;
  activeAyah: number;
}) {
  const { activeTheme } = useSettingsStore();
  const isLight = activeTheme === Theme.LIGHT;
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputVal, setInputVal] = React.useState('');
  const [jumpedTo, setJumpedTo] = React.useState<number | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const scrollToAyah = (num: number) => {
    const el = document.getElementById(`ayah-${num}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setJumpedTo(num);
      // Apply flash animation class
      el.classList.add('jump-highlight');
      setTimeout(() => el.classList.remove('jump-highlight'), 1800);
    }
  };

  const handleInputChange = (raw: string) => {
    const num = parseInt(raw);
    if (raw === '' || (num >= 1 && num <= ayahCount)) {
      setInputVal(raw);
    }
  };

  const handleJump = () => {
    const num = parseInt(inputVal);
    if (num >= 1 && num <= ayahCount) {
      scrollToAyah(num);
      setInputVal('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleJump();
    if (e.key === 'Escape') setIsOpen(false);
  };

  // Focus input when panel opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 220);
    }
  }, [isOpen]);

  // Scroll active ayah button into view within the grid
  React.useEffect(() => {
    if (isOpen && activeAyah && gridRef.current) {
      const btn = gridRef.current.querySelector<HTMLButtonElement>(
        `[data-ayah="${activeAyah}"]`
      );
      if (btn) {
        btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      }
    }
  }, [isOpen, activeAyah]);

  const ayahNumbers = Array.from({ length: ayahCount }, (_, i) => i + 1);

  return (
    <>
      {/* Flash animation style */}
      <style>{`
        .jump-highlight {
          animation: jumpFlash 1.8s ease-out forwards;
        }
        @keyframes jumpFlash {
          0%   { box-shadow: 0 0 0 3px rgba(212,165,116,0.95), 0 0 32px rgba(212,165,116,0.55); }
          55%  { box-shadow: 0 0 0 2px rgba(212,165,116,0.35), 0 0 14px rgba(212,165,116,0.18); }
          100% { box-shadow: none; }
        }
        /* Remove number input spin buttons */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div className="px-4 md:px-8 border-b border-white/[0.04]">
        {/* ── Toggle Button ── */}
        <div className="max-w-4xl mx-auto py-3 flex items-center gap-3">
          <motion.button
            onClick={() => setIsOpen((v) => !v)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.015 }}
            id="jump-to-ayah-toggle"
            aria-expanded={isOpen}
            aria-label="Toggle Jump to Ayah panel"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium group border",
              isLight
                ? "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-islamic-gold/40"
                : "bg-white/[0.05] border-white/[0.1] text-gray-300 hover:bg-islamic-gold/10 hover:border-islamic-gold/30"
            )}
          >
            <span className="text-base">🔢</span>
            <span>Jump to Ayah</span>
            <span className={cn(
              "text-[11px] rounded-md px-2 py-0.5 tabular-nums font-mono",
              isLight ? "bg-gray-200 text-gray-600" : "text-gray-500 bg-white/[0.06]"
            )}>
              1–{ayahCount}
            </span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="text-gray-600 group-hover:text-islamic-gold text-xs"
            >
              ▾
            </motion.span>
          </motion.button>

          {/* Quick jump hint badge */}
          {!isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] text-gray-600 hidden sm:block"
            >
              Currently at Ayah{' '}
              <span className="text-islamic-gold/80 font-semibold tabular-nums">
                {activeAyah}
              </span>{' '}
              of {ayahCount}
            </motion.span>
          )}
        </div>

        {/* ── Collapsible Panel ── */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="jump-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="max-w-4xl mx-auto pb-5 space-y-4">

                {/* Quick Input Row */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">
                      #
                    </span>
                    <input
                      ref={inputRef}
                      id="ayah-jump-input"
                      type="number"
                      min={1}
                      max={ayahCount}
                      value={inputVal}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`1 – ${ayahCount}`}
                      className={cn(
                        "w-full outline-none rounded-xl pl-8 pr-9 py-2.5 text-sm transition-all duration-200 tabular-nums border",
                        isLight
                          ? "bg-gray-50 border-gray-200 text-gray-900 focus:border-islamic-gold/50 focus:bg-white"
                          : "bg-white/[0.06] border-white/[0.1] text-white focus:border-islamic-gold/50 focus:bg-white/[0.09]"
                      )}
                    />
                    {inputVal && (
                      <button
                        onClick={() => setInputVal('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs leading-none"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <motion.button
                    onClick={handleJump}
                    whileTap={{ scale: 0.93 }}
                    disabled={!inputVal}
                    id="ayah-jump-go"
                    className="px-5 py-2.5 rounded-xl bg-islamic-gold/20 border border-islamic-gold/35 text-islamic-gold text-sm font-semibold hover:bg-islamic-gold/30 disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
                  >
                    Go <span className="text-xs opacity-70">↵</span>
                  </motion.button>

                  <AnimatePresence>
                    {jumpedTo && (
                      <motion.span
                        key={jumpedTo}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-emerald-400 font-medium whitespace-nowrap"
                      >
                        ✓ Ayah {jumpedTo}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Numbered Ayah Grid ── */}
                <div
                  ref={gridRef}
                  className="grid gap-1.5 overflow-y-auto max-h-[120px] show-scrollbar pr-1 pt-0.5"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(2.7rem, 1fr))' }}
                  role="listbox"
                  aria-label="Ayah numbers"
                >
                  {ayahNumbers.map((num) => {
                    const isActive = num === activeAyah;
                    const isJumped = num === jumpedTo;
                    return (
                      <motion.button
                        key={num}
                        data-ayah={num}
                        onClick={() => scrollToAyah(num)}
                        whileTap={{ scale: 0.82 }}
                        title={`Jump to Ayah ${num}`}
                        role="option"
                        aria-selected={isActive}
                        className={cn(
                          'relative flex items-center justify-center rounded-lg text-xs font-bold tabular-nums transition-all duration-150 h-9 w-full select-none border',
                          isActive
                            ? 'bg-islamic-gold text-[#0A1A14] shadow-md shadow-islamic-gold/40 ring-2 ring-islamic-gold/50 scale-105 border-transparent'
                            : isJumped
                              ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                              : isLight
                                ? 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-islamic-gold/15 hover:border-islamic-gold/30 hover:text-islamic-gold'
                                : 'bg-white/[0.05] border-white/[0.07] text-gray-400 hover:bg-islamic-gold/15 hover:border-islamic-gold/30 hover:text-islamic-gold',
                        )}
                      >
                        {num}
                        {isActive && (
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-islamic-gold rounded-full ring-1 ring-[#0A1A14] animate-ping opacity-75" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-[10px] text-gray-600 text-center leading-relaxed">
                  Tap any number to jump instantly • Type a number and press{' '}
                  <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-gray-500 font-mono text-[9px]">
                    Enter
                  </kbd>{' '}
                  to go
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
