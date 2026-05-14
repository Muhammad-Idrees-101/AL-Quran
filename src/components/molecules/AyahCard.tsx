'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ayah, Surah, Theme } from '@/types/quran';
import { GlassPanel, Badge, Button } from '@/components/atoms';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useFeaturesStore } from '@/stores/featuresStore';
import { WordByWord } from '@/components/molecules/WordByWord';
import { cn } from '@/utils/cn';

interface AyahCardProps {
  ayah: Ayah;
  surah: Surah;
  index: number;
  isScrollTarget?: boolean;
}

export const AyahCard: React.FC<AyahCardProps> = ({ ayah, surah, index, isScrollTarget }) => {
  const [isTafseerOpen, setIsTafseerOpen] = useState(false);
  const [isWordByWordOpen, setIsWordByWordOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { currentAyahId, setCurrentAyah, isPlaying, setIsPlaying } = usePlayerStore();
  const { fontScale, scriptType, showTranslation, readingLanguage, activeTheme } = useSettingsStore();
  const { addBookmark, removeBookmark, isBookmarked, bookmarks } = useFeaturesStore();

  const isLight = activeTheme === Theme.LIGHT;

  const isActive = currentAyahId === ayah.id;
  const bookmarked = isBookmarked(surah.id, ayah.ayah_number);

  let textContent = scriptType === 'uthmani' ? ayah.text_uthmani : ayah.text_indopak;

  // Remove redundant Bismillah prefix from the first Ayah (except Surah 1 and 9)
  if (ayah.ayah_number === 1 && surah.id !== 1 && surah.id !== 9) {
    // Robust regex to catch various Uthmani/IndoPak spellings of Bismillah at the start
    textContent = textContent.replace(/^بِسْمِ[\s\S]{15,40}رَّحِيمِ\s*/, '');
    textContent = textContent.replace(/^بِسْمِ[\s\S]{15,40}رَّحِيْمِ\s*/, '');
    // Fallback exact match for the local JSON data
    textContent = textContent.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
  }
  const currentTranslation = readingLanguage === 'ur' ? ayah.translation_ur : ayah.translation_en;
  const currentTafseer = readingLanguage === 'ur' ? ayah.tafseer_ur : ayah.tafseer_en;
  const isUrdu = readingLanguage === 'ur';

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isActive) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAyah({
        ayahId: ayah.id,
        surahId: surah.id,
        ayahNumber: ayah.ayah_number,
        surahName: surah.name_english,
        surahArabic: surah.name_arabic,
        surahAyahCount: surah.ayah_count,
      });
      // Save continuation
      const cont = {
        surahId: surah.id, surahName: surah.name_english, surahArabic: surah.name_arabic,
        ayahNumber: ayah.ayah_number, ayahText: ayah.text_uthmani, savedAt: new Date().toISOString(),
      };
      localStorage.setItem('quran-continuation', JSON.stringify(cont));
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) {
      const bm = bookmarks.find(b => b.surahId === surah.id && b.ayahNumber === ayah.ayah_number);
      if (bm) removeBookmark(bm.id);
    } else {
      addBookmark({
        surahId: surah.id,
        surahName: surah.name_english,
        surahArabic: surah.name_arabic,
        ayahNumber: ayah.ayah_number,
        ayahText: ayah.text_uthmani,
        translation: currentTranslation || undefined,
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      id={`ayah-${ayah.ayah_number}`}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: Math.min(index * 0.02, 0.3) }}
    >
      <div
        className={cn(
          'rounded-2xl p-5 md:p-6 transition-all duration-500 border',
          isActive
            ? (isLight ? 'bg-islamic-gold/[0.12] border-islamic-gold/40 shadow-sm' : 'bg-islamic-gold/[0.08] border-islamic-gold/30 ayah-active-glow')
            : (isLight ? 'bg-white border-gray-200 shadow-sm hover:border-islamic-gold/30' : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15]'),
          isScrollTarget && !isActive && (isLight ? 'ring-2 ring-islamic-emerald/30' : 'ring-2 ring-islamic-emerald/40')
        )}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Ayah Number Badge */}
            <div className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold',
              isActive
                ? (isLight ? 'bg-islamic-gold text-white' : 'bg-islamic-gold/25 text-islamic-gold')
                : (isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/[0.08] text-gray-400')
            )}>
              {ayah.ayah_number}
            </div>
            <span className={`text-[10px] uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>Ayah</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Word-by-Word Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsWordByWordOpen(!isWordByWordOpen)}
              className={cn(
                'text-xs px-2 py-1 rounded-lg transition-all',
                isWordByWordOpen
                  ? 'bg-islamic-gold/20 text-islamic-gold'
                  : 'text-gray-400 hover:text-islamic-gold hover:bg-white/[0.06]'
              )}
              title="Word-by-word translation"
            >
              🔤
            </motion.button>

            {/* Bookmark Button */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              animate={{ scale: bookmarked ? [1, 1.3, 1] : 1 }}
              onClick={handleBookmark}
              className={cn(
                'text-xs px-2 py-1 rounded-lg transition-all',
                bookmarked
                  ? 'text-islamic-gold bg-islamic-gold/15'
                  : isLight ? 'text-gray-400 hover:text-islamic-gold hover:bg-gray-100' : 'text-gray-400 hover:text-islamic-gold hover:bg-white/[0.06]'
              )}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark this ayah'}
            >
              {bookmarked ? '🔖' : '🔖'}
            </motion.button>

            {/* Play Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all',
                isActive && isPlaying
                  ? 'bg-islamic-gold text-dark-slate shadow-lg shadow-islamic-gold/20'
                  : isLight ? 'bg-gray-100 text-gray-600 hover:bg-islamic-gold/20 hover:text-islamic-gold' : 'bg-white/10 text-gray-300 hover:bg-islamic-gold/20 hover:text-islamic-gold'
              )}
              title="Play this Ayah"
            >
              {isActive && isPlaying ? '⏸' : '▶'}
            </motion.button>

            {/* Tafseer Toggle */}
            {currentTafseer && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsTafseerOpen(!isTafseerOpen)}
                className={cn(
                  'text-xs transition-colors px-2 py-1 rounded-lg',
                  isLight ? 'text-gray-500 hover:text-islamic-gold hover:bg-gray-100' : 'text-gray-400 hover:text-islamic-gold hover:bg-white/[0.06]'
                )}
              >
                📖 {isTafseerOpen ? 'Hide' : 'Tafseer'} {isTafseerOpen ? '▴' : '▾'}
              </motion.button>
            )}
          </div>
        </div>

        {/* Arabic Text */}
        <div
          className={cn(
            "leading-[2.8] text-right mb-3 transition-all duration-300",
            scriptType === 'indopak' ? 'font-indopak' : 'font-arabic'
          )}
          style={{ fontSize: `${scriptType === 'indopak' ? 2 * fontScale : 1.75 * fontScale}rem` }}
          dir="rtl"
        >
          <bdo dir="rtl" className={cn(
            'transition-colors duration-300',
            isActive
              ? (isLight ? 'text-islamic-emerald' : 'text-white')
              : (isLight ? 'text-gray-900' : 'text-gray-100')
          )}>
            {textContent}
          </bdo>
        </div>

        {/* Word by Word */}
        <AnimatePresence>
          {isWordByWordOpen && (
            <WordByWord surahId={surah.id} ayahNumber={ayah.ayah_number} language={readingLanguage} />
          )}
        </AnimatePresence>

        {/* Translation */}
        {showTranslation && currentTranslation && (
          <p
            className={cn(
              "text-sm leading-relaxed italic border-t pt-3 transition-colors",
              isLight ? 'text-gray-600 border-gray-100' : 'text-gray-400 border-white/[0.06]',
              isUrdu && "font-arabic text-lg not-italic text-right"
            )}
            dir={isUrdu ? "rtl" : "ltr"}
          >
            {currentTranslation}
          </p>
        )}

        {/* Expandable Tafseer */}
        <AnimatePresence>
          {isTafseerOpen && currentTafseer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`mt-4 rounded-xl p-4 border transition-colors ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/[0.04] border-white/[0.08]'
                }`}>
                <div className={cn("flex items-center gap-2 mb-2", isUrdu && "flex-row-reverse")}>
                  <Badge variant="gold" size="sm">Tafseer</Badge>
                  <span className={`text-[10px] ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>Brief Commentary</span>
                </div>
                <p
                  className={cn(
                    "text-sm leading-7 transition-colors",
                    isLight ? 'text-gray-700' : 'text-gray-300',
                    isUrdu && "font-arabic text-base text-right leading-loose"
                  )}
                  dir={isUrdu ? "rtl" : "ltr"}
                >
                  {currentTafseer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active indicator dot */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center mt-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-islamic-gold animate-pulse" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

AyahCard.displayName = 'AyahCard';
