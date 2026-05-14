'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WordData {
  text_uthmani: string;
  transliteration: string;
  translation: string;
}

const cache: Record<string, WordData[]> = {};

async function fetchWords(surahId: number, ayahNumber: number, language: string): Promise<WordData[]> {
  const key = `${surahId}:${ayahNumber}:${language}`;
  if (cache[key]) return cache[key];

  try {
    const res = await fetch(
      `https://api.qurancdn.com/api/qdc/verses/by_key/${surahId}:${ayahNumber}?words=true&translation_fields=text&word_fields=text_uthmani,transliteration&word_translation_language=${language}`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const words: WordData[] = (data?.verse?.words || [])
      .filter((w: any) => w.char_type_name === 'word')
      .map((w: any) => ({
        text_uthmani: w.text_uthmani || w.text || '',
        transliteration: w.transliteration?.text || '',
        translation: w.translation?.text || '',
      }));
    cache[key] = words;
    return words;
  } catch {
    return [];
  }
}

interface WordByWordProps {
  surahId: number;
  ayahNumber: number;
  language: string;
}

export function WordByWord({ surahId, ayahNumber, language }: WordByWordProps) {
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchWords(surahId, ayahNumber, language).then((w) => {
      setWords(w);
      setLoading(false);
    });
  }, [surahId, ayahNumber, language]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3 text-xs text-gray-500 animate-pulse">
        <span className="w-3 h-3 rounded-full bg-islamic-gold/40 animate-bounce" />
        Loading word analysis…
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <p className="text-xs text-gray-500 py-2 italic">Word-by-word data unavailable for this ayah.</p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden mt-3 border-t border-white/[0.06] pt-3"
    >
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
        🔤 Word-by-Word Analysis
      </p>
      <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
        {words.map((word, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex flex-col items-center bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 min-w-[60px] hover:bg-white/[0.1] hover:border-islamic-gold/30 transition-all group"
          >
            <span className="font-arabic text-lg text-white group-hover:text-islamic-gold transition-colors leading-relaxed" dir="rtl">
              {word.text_uthmani}
            </span>
            {word.transliteration && (
              <span className="text-[9px] text-islamic-gold/70 mt-1" dir="ltr">{word.transliteration}</span>
            )}
            {word.translation && (
              <span 
                className={`text-[9px] text-gray-400 text-center mt-0.5 ${language === 'ur' ? 'font-arabic text-xs' : ''}`} 
                dir={language === 'ur' ? 'rtl' : 'ltr'}
              >
                {word.translation}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
