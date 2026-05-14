'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TOPICS = [
  { id: 'prayer', label: 'Prayer & Salah', icon: '🕌', color: 'from-emerald-900/40 to-teal-900/30', borderColor: 'border-emerald-500/20', surahs: [2, 4, 9, 17, 20, 29] },
  { id: 'patience', label: 'Patience & Sabr', icon: '⏳', color: 'from-amber-900/40 to-yellow-900/30', borderColor: 'border-amber-500/20', surahs: [2, 3, 8, 16, 39, 103] },
  { id: 'prophets', label: 'Stories of Prophets', icon: '📜', color: 'from-blue-900/40 to-indigo-900/30', borderColor: 'border-blue-500/20', surahs: [10, 11, 12, 14, 19, 21, 27, 28] },
  { id: 'jannah', label: 'Jannah & Paradise', icon: '🌿', color: 'from-green-900/40 to-emerald-900/30', borderColor: 'border-green-500/20', surahs: [3, 4, 9, 10, 13, 47, 55, 56, 76] },
  { id: 'hellfire', label: 'Hell & Warning', icon: '🔥', color: 'from-red-900/40 to-orange-900/30', borderColor: 'border-red-500/20', surahs: [2, 4, 9, 67, 74, 83, 88, 104] },
  { id: 'tawhid', label: 'Oneness of Allah', icon: '☀️', color: 'from-yellow-900/40 to-amber-900/30', borderColor: 'border-yellow-500/20', surahs: [1, 2, 3, 6, 39, 112] },
  { id: 'forgiveness', label: 'Forgiveness & Tawbah', icon: '💧', color: 'from-sky-900/40 to-blue-900/30', borderColor: 'border-sky-500/20', surahs: [3, 4, 9, 39, 40, 66] },
  { id: 'family', label: 'Family & Marriage', icon: '👨‍👩‍👧', color: 'from-pink-900/40 to-rose-900/30', borderColor: 'border-pink-500/20', surahs: [2, 4, 24, 33, 65, 66] },
  { id: 'creation', label: 'Creation & Nature', icon: '🌌', color: 'from-purple-900/40 to-violet-900/30', borderColor: 'border-purple-500/20', surahs: [2, 3, 6, 7, 10, 13, 16, 30, 36] },
  { id: 'hereafter', label: 'The Hereafter', icon: '⚖️', color: 'from-slate-800/60 to-gray-900/40', borderColor: 'border-slate-500/20', surahs: [4, 6, 7, 17, 18, 19, 36, 39, 56, 69, 75, 78, 99] },
  { id: 'quran', label: 'About the Quran', icon: '📖', color: 'from-gold-900/40 to-amber-900/30', borderColor: 'border-yellow-500/20', surahs: [2, 10, 12, 15, 16, 17, 18, 41, 56] },
  { id: 'zikr', label: 'Dhikr & Remembrance', icon: '🤲', color: 'from-teal-900/40 to-cyan-900/30', borderColor: 'border-teal-500/20', surahs: [2, 3, 13, 29, 33, 62] },
];

import { SURAHS } from '@/lib/mockData';

export default function TopicsPage() {
  const router = useRouter();
  const [selected, setSelected] = React.useState<string | null>(null);

  const activeTopic = TOPICS.find(t => t.id === selected);
  const topicSurahs = activeTopic
    ? SURAHS.filter(s => activeTopic.surahs.includes(s.id))
    : [];

  return (
    <div className="min-h-screen px-4 md:px-8 pt-8 pb-20">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => router.push('/')} className="text-xs text-gray-500 hover:text-white mb-4 flex items-center gap-1 transition-colors">
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">📂 Topics</h1>
        <p className="text-sm text-gray-400 mb-8">Browse Surahs by theme and subject</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
        {TOPICS.map((topic, i) => (
          <motion.button
            key={topic.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelected(selected === topic.id ? null : topic.id)}
            className={`bg-gradient-to-br ${topic.color} border ${topic.borderColor} rounded-2xl p-4 text-left transition-all ${
              selected === topic.id ? 'ring-2 ring-islamic-gold/50 border-islamic-gold/40' : 'hover:border-white/20'
            }`}
          >
            <div className="text-2xl mb-2">{topic.icon}</div>
            <h3 className="text-sm font-semibold text-white leading-snug">{topic.label}</h3>
            <p className="text-[10px] text-gray-400 mt-1">{topic.surahs.length} Surahs</p>
          </motion.button>
        ))}
      </div>

      {/* Topic Surahs */}
      {activeTopic && (
        <motion.div
          key={activeTopic.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>{activeTopic.icon}</span> {activeTopic.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topicSurahs.map((surah, i) => (
              <motion.div
                key={surah.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/player/${surah.id}`}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.1] rounded-xl p-3 hover:bg-white/[0.09] hover:border-islamic-gold/30 transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-gray-500 bg-white/[0.06] rounded-lg px-2 py-1 tabular-nums">{surah.id}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{surah.name_english}</p>
                      <p className="text-[10px] text-gray-500">{surah.ayah_count} Ayahs • {surah.revelation_type}</p>
                    </div>
                    <p className="font-arabic text-base text-islamic-gold/80" dir="rtl">{surah.name_arabic}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
