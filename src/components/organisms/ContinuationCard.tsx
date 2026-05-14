'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel, Button, Badge } from '@/components/atoms';
import Link from 'next/link';
import type { ContinuationData } from '@/types/quran';

export const ContinuationCard: React.FC = () => {
  const [data, setData] = useState<ContinuationData | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('quran-continuation');
      if (stored) setData(JSON.parse(stored));
    } catch {}
  }, []);

  const dismiss = () => {
    localStorage.removeItem('quran-continuation');
    setData(null);
  };

  if (!data) {
    // Default "start reading" card
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <GlassPanel className="p-6 border-2 border-islamic-emerald/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-islamic-emerald/20 flex items-center justify-center text-lg">📖</div>
            <div>
              <h3 className="font-bold text-white text-sm">Start Your Journey</h3>
              <p className="text-xs text-gray-400">Begin reading the Holy Quran</p>
            </div>
          </div>
          <p className="font-arabic text-2xl text-center text-islamic-gold leading-relaxed my-4" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <Link href="/player/1">
            <Button variant="gold" className="w-full">
              Open Al-Fatiha →
            </Button>
          </Link>
        </GlassPanel>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <GlassPanel className="p-6 border-2 border-islamic-gold/20 relative overflow-hidden">
        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-500 hover:text-white text-xs transition-colors z-10"
          title="Dismiss"
        >✕</button>

        {/* Decorative glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-islamic-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-islamic-gold/15 flex items-center justify-center">
              <span className="text-xl">📌</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Jump Back In</h3>
              <p className="text-xs text-gray-400">
                {data.surahName} • Ayah {data.ayahNumber}
              </p>
            </div>
            <Badge variant="gold" className="ml-auto">{data.surahArabic || ''}</Badge>
          </div>

          <p
            className="font-arabic text-xl text-right leading-[2.5rem] text-gray-200 mb-4 line-clamp-2"
            dir="rtl"
          >
            {data.ayahText}
          </p>

          {data.savedAt && (
            <p className="text-[10px] text-gray-500 mb-3">
              Last read: {new Date(data.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}

          <Link href={`/player/${data.surahId}?ayah=${data.ayahNumber}`}>
            <Button variant="gold" className="w-full">
              Continue Reading →
            </Button>
          </Link>
        </div>
      </GlassPanel>
    </motion.div>
  );
};

ContinuationCard.displayName = 'ContinuationCard';
