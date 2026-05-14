'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { OmniSearch } from '@/components/molecules';
import { ContinuationCard } from '@/components/organisms';
import { PrayerTimesWidget } from '@/components/organisms/PrayerTimesWidget';
import { GlassPanel, Badge, Button } from '@/components/atoms';
import { SURAHS } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { useFeaturesStore } from '@/stores/featuresStore';
import type { WatchHistoryItem } from '@/types/quran';

const QUICK_TOPICS = [
  { id: 'prayer', label: 'Prayer', icon: '🕌' },
  { id: 'patience', label: 'Patience', icon: '⏳' },
  { id: 'prophets', label: 'Prophets', icon: '📜' },
  { id: 'jannah', label: 'Jannah', icon: '🌿' },
  { id: 'tawhid', label: 'Tawhid', icon: '☀️' },
  { id: 'forgiveness', label: 'Forgiveness', icon: '💧' },
];

export default function HomePage() {
  const router = useRouter();
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const { readSurahs, bookmarks } = useFeaturesStore();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('quran-watch-history');
      if (stored) setWatchHistory(JSON.parse(stored));
    } catch { }
  }, []);

  // Build search items
  const searchItems = [
    ...SURAHS.map((s) => ({
      id: `surah-${s.id}`,
      label: `${s.name_english} (${s.name_arabic})`,
      description: `${s.ayah_count} Ayahs • ${s.revelation_type}`,
      category: 'Surahs',
      icon: '📖',
      onSelect: () => router.push(`/player/${s.id}`),
    })),
  ];

  const progressPct = Math.round((readSurahs.length / 114) * 100);

  return (
    <div>
      {/* Framer-style Hero */}
      <section className="relative px-4 md:px-8 pt-20 pb-16 md:pt-30 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">


        {/* Deep Blue/Teal Ambient Glow */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] theme-hero-glow blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] theme-hero-fade pointer-events-none" />


        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full">

          <Link href="/">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center mb-8 cursor-pointer"
            >
              <Image src="/logo.png" alt="Al-Quran Logo" width={64} height={64} className="object-cover" />
            </motion.div>
          </Link>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05] mb-6">
            The Quran is<br className="hidden sm:block" /> your guide.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-medium mb-10">
            Al-Quran Interactive is where you read, study, and listen to the divine revelation.
          </p>

          {/* Framer-style Search Bar */}
          <div className="w-full max-w-xl">
            <OmniSearch items={searchItems} placeholder="Search 114 Surahs, Videos..." />
          </div>
        </motion.div>
      </section>

      <section className="px-4 md:px-8 pb-20 space-y-10">
        {/* Jump Back In */}
        <ContinuationCard />

        {/* Stats Row — Progress + Bookmarks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Reading Progress */}

          <Link href="/player/1">
            <motion.div whileHover={{ y: -3 }} className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/20 rounded-2xl p-5 cursor-pointer hover:border-emerald-500/40 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 shrink-0">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                      strokeDasharray={`${progressPct * 0.942} 94.2`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-400">{progressPct}%</span>
                </div>
                <div>
                  <p className="text-xs text-emerald-400/80 font-semibold uppercase tracking-wider">Quran Progress</p>
                  <p className="text-2xl font-bold text-white">{readSurahs.length}<span className="text-sm font-normal text-gray-400"> / 114</span></p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Surahs read</p>
            </motion.div>
          </Link>

          {/* Bookmarks */}
          <Link href="/bookmarks">
            <motion.div whileHover={{ y: -3 }} className="bg-gradient-to-br from-indigo-900/30 to-blue-900/20 border border-indigo-500/20 rounded-2xl p-5 cursor-pointer hover:border-indigo-500/40 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔖</span>
                <div>
                  <p className="text-xs text-indigo-400/80 font-semibold uppercase tracking-wider">Bookmarks</p>
                  <p className="text-2xl font-bold text-white">{bookmarks.length} <span className="text-sm font-normal text-gray-400">saved</span></p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{bookmarks.length === 0 ? 'No ayahs saved yet' : `Last: ${bookmarks[0]?.surahName} ${bookmarks[0]?.ayahNumber}`}</p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Access CTA */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { title: 'Quran Reader', desc: 'Immersive reading with audio sync', href: '/player/1', icon: '📖', gradient: 'from-islamic-emerald/20 to-emerald-900/20' },
            { title: 'Video Academy', desc: 'Learn from renowned scholars', href: '/academy', icon: '🎓', gradient: 'from-blue-900/20 to-indigo-900/20' },
            { title: 'Tafseer Library', desc: 'Deep research & commentary', href: '/tafseer', icon: '📚', gradient: 'from-amber-900/20 to-orange-900/20' },
            { title: 'Duas Collection', desc: 'Authentic supplications', href: '/duas', icon: '🤲', gradient: 'from-violet-900/20 to-purple-900/20' },
          ].map((item, i) => (


            <motion.div key={item.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>

              <Link href={item.href}>
                <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
                  <div className={`bg-gradient-to-br ${item.gradient} backdrop-blur-md border border-white/[0.1] rounded-2xl p-6 h-full cursor-pointer hover:border-white/[0.2] transition-all duration-300`}>
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{item.desc}</p>
                    <span className="text-xs text-islamic-gold font-semibold">Explore →</span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Prayer Times */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🕌 Prayer Times & Qibla
            <Link href="/qibla">
              <span className="text-xs text-islamic-gold/70 font-normal hover:text-islamic-gold transition-colors ml-2">Full view →</span>
            </Link>
          </h2>
          <PrayerTimesWidget />
        </div>

        {/* Browse by Topic */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">📂 Browse by Topic</h2>
            <Link href="/topics">
              <span className="text-xs text-islamic-gold/70 hover:text-islamic-gold transition-colors">See all topics →</span>
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_TOPICS.map((topic, i) => (
              <motion.div key={topic.id}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}>
                <Link href={`/topics`}>
                  <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer">
                    <span className="text-2xl">{topic.icon}</span>
                    <span className="text-[11px] font-semibold text-gray-300 text-center">{topic.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Tafseer Lectures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🎬</span> Featured Tafseer
            </h2>
            <Link href="/academy">
              <span className="text-xs text-islamic-gold/70 hover:text-islamic-gold transition-colors">View all lectures →</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 36].map((surahId, i) => {
              const surah = SURAHS.find(s => s.id === surahId);
              return surah ? (
                <motion.div key={surahId} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <Link href="/academy">
                    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
                      <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl overflow-hidden hover:border-white/[0.2] transition-all">
                        <div className="aspect-video bg-gradient-to-br from-islamic-emerald/15 to-islamic-gold/10 relative flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-4xl font-bold text-islamic-gold/30">{surahId}</p>
                            <p className="text-xs text-gray-500">Bayan-ul-Quran</p>
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge variant="emerald" size="sm">Tafseer</Badge>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm font-semibold text-white line-clamp-1">Surah {surah.name_english}</h4>
                          <p className="text-xs text-gray-400">Dr. Israr Ahmed</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ) : null;
            })}
          </div>
        </div>

        {/* Ornament Divider */}
        <div className="ornament-divider">
          <span className="text-islamic-gold/40 text-lg">✦</span>
        </div>

        {/* All 114 Surahs Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📖</span> Browse All 114 Surahs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {SURAHS.map((surah, index) => {
              const isRead = readSurahs.includes(surah.id);
              return (
                <motion.div
                  key={surah.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ delay: Math.min(index * 0.01, 0.3) }}
                >
                  <Link href={`/player/${surah.id}`}>
                    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3.5 cursor-pointer hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 group relative">
                        {isRead && (
                          <span className="absolute top-2 right-2 text-[10px] text-emerald-400/70">✓</span>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-gray-500 bg-white/[0.06] rounded px-1.5 py-0.5 tabular-nums">
                                {surah.id}
                              </span>
                              <h3 className="text-sm font-semibold text-white truncate group-hover:text-islamic-gold transition-colors">
                                {surah.name_english}
                              </h3>
                            </div>
                            <p className="font-arabic text-base text-islamic-gold/80 text-right leading-relaxed" dir="rtl">
                              {surah.name_arabic}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                          <span>{surah.ayah_count} Ayahs</span>
                          <span>•</span>
                          <span>{surah.revelation_type}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
