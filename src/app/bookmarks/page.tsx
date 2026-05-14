'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFeaturesStore } from '@/stores/featuresStore';

export default function BookmarksPage() {
  const router = useRouter();
  const { bookmarks, removeBookmark } = useFeaturesStore();

  return (
    <div className="min-h-screen px-4 md:px-8 pt-8 pb-20">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => router.push('/')} className="text-xs text-gray-500 hover:text-white mb-4 flex items-center gap-1 transition-colors">
          ← Back
        </button>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              🔖 Bookmarks
            </h1>
            <p className="text-sm text-gray-400 mt-1">{bookmarks.length} saved ayahs</p>
          </div>
        </div>
      </motion.div>

      {bookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="text-6xl mb-4">🔖</div>
          <h2 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-xs">
            Tap the bookmark icon on any ayah while reading to save it here.
          </p>
          <Link href="/player/1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl bg-islamic-gold/15 text-islamic-gold border border-islamic-gold/25 font-semibold text-sm hover:bg-islamic-gold/25 transition-all"
            >
              Start Reading →
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {bookmarks.map((bm, i) => (
              <motion.div
                key={bm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.07] hover:border-white/[0.15] transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-bold text-islamic-gold bg-islamic-gold/10 px-2 py-0.5 rounded-lg">
                        {bm.surahName}
                      </span>
                      <span className="text-xs text-gray-500">Ayah {bm.ayahNumber}</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-[10px] text-gray-600">
                        {new Date(bm.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Arabic text */}
                    <p className="font-arabic text-xl text-white leading-loose text-right mb-3" dir="rtl">
                      {bm.ayahText}
                    </p>

                    {/* Translation */}
                    {bm.translation && (
                      <p className="text-sm text-gray-400 leading-relaxed italic">
                        {bm.translation}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link href={`/player/${bm.surahId}?ayah=${bm.ayahNumber}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 rounded-lg bg-islamic-gold/10 text-islamic-gold text-xs font-semibold hover:bg-islamic-gold/20 transition-all"
                      >
                        Go to Ayah →
                      </motion.button>
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeBookmark(bm.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-gray-500 text-xs hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      Remove
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
