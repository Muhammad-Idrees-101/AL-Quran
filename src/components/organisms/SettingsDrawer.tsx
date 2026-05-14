'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePlayerStore } from '@/stores/playerStore';
import { Theme, ScriptType, AudioReciter } from '@/types/quran';

// ─── Reciter Metadata ────────────────────────────────────────
interface ReciterMeta {
  label: string;
  arabicName: string;
  style: 'Murattal' | 'Mujawwad';
  quality: string;
  group: string;
}

const RECITERS: Record<AudioReciter, ReciterMeta> = {
  // ── World-Famous Masters ─────────────────────────────────
  [AudioReciter.MISHARY]: {
    label: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'Murattal', quality: '128kbps', group: 'World-Famous Masters',
  },
  [AudioReciter.HUSSARY]: {
    label: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'Murattal', quality: '128kbps', group: 'World-Famous Masters',
  },
  [AudioReciter.HUSSARY_MUJAWWAD]: {
    label: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'Mujawwad', quality: '128kbps', group: 'World-Famous Masters',
  },
  [AudioReciter.SUDAIS]: {
    label: 'Abdurrahman As-Sudais',
    arabicName: 'عبدالرحمن السديس',
    style: 'Murattal', quality: '192kbps', group: 'World-Famous Masters',
  },
  [AudioReciter.SHURAYM]: {
    label: 'Saud Al-Shuraym',
    arabicName: 'سعود الشريم',
    style: 'Murattal', quality: '128kbps', group: 'World-Famous Masters',
  },
  // ── Abdul Basit ───────────────────────────────────────────
  [AudioReciter.BASIT_MURATTAL]: {
    label: 'Abdul Basit Abdus-Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    style: 'Murattal', quality: '192kbps', group: 'Abdul Basit',
  },
  [AudioReciter.BASIT_MUJAWWAD]: {
    label: 'Abdul Basit Abdus-Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    style: 'Mujawwad', quality: '128kbps', group: 'Abdul Basit',
  },
  // ── Al-Minshawi ───────────────────────────────────────────
  [AudioReciter.MINSHAWI_MURATTAL]: {
    label: 'Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    style: 'Murattal', quality: '128kbps', group: 'Al-Minshawi',
  },
  [AudioReciter.MINSHAWI_MUJAWWAD]: {
    label: 'Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    style: 'Mujawwad', quality: '192kbps', group: 'Al-Minshawi',
  },
  // ── Madinah & Makkah Imams ────────────────────────────────
  [AudioReciter.MAHER_MUAIQLY]: {
    label: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    style: 'Murattal', quality: '128kbps', group: 'Madinah & Makkah Imams',
  },
  [AudioReciter.HUDHAIFY]: {
    label: 'Ali Abdur-Rahman Al-Hudhaify',
    arabicName: 'علي عبد الرحمن الحذيفي',
    style: 'Murattal', quality: '128kbps', group: 'Madinah & Makkah Imams',
  },
  [AudioReciter.MUHSIN_QASIM]: {
    label: 'Muhsin Al-Qasim',
    arabicName: 'محسن القاسم',
    style: 'Murattal', quality: '192kbps', group: 'Madinah & Makkah Imams',
  },
  [AudioReciter.BUDAIR]: {
    label: 'Salah Al-Budair',
    arabicName: 'صلاح البدير',
    style: 'Murattal', quality: '128kbps', group: 'Madinah & Makkah Imams',
  },
  // ── Distinguished Reciters ────────────────────────────────
  [AudioReciter.ABU_BAKR_SHAATREE]: {
    label: 'Abu Bakr Ash-Shaatree',
    arabicName: 'أبو بكر الشاطري',
    style: 'Murattal', quality: '128kbps', group: 'Distinguished Reciters',
  },
  [AudioReciter.HANI_RIFAI]: {
    label: 'Hani Rifai',
    arabicName: 'هاني الرفاعي',
    style: 'Murattal', quality: '192kbps', group: 'Distinguished Reciters',
  },
  [AudioReciter.MUHAMMAD_AYYOUB]: {
    label: 'Muhammad Ayyoub',
    arabicName: 'محمد أيوب',
    style: 'Murattal', quality: '128kbps', group: 'Distinguished Reciters',
  },
  [AudioReciter.MUHAMMAD_JIBREEL]: {
    label: 'Muhammad Jibreel',
    arabicName: 'محمد جبريل',
    style: 'Murattal', quality: '128kbps', group: 'Distinguished Reciters',
  },
  [AudioReciter.NASSER_ALQATAMI]: {
    label: 'Nasser Al-Qatami',
    arabicName: 'ناصر القطامي',
    style: 'Murattal', quality: '128kbps', group: 'Distinguished Reciters',
  },
  [AudioReciter.YASSER_DUSSARY]: {
    label: 'Yasser Ad-Dussary',
    arabicName: 'ياسر الدوسري',
    style: 'Murattal', quality: '128kbps', group: 'Distinguished Reciters',
  },
  [AudioReciter.ABDULLAH_BASFAR]: {
    label: 'Abdullah Basfar',
    arabicName: 'عبدالله بصفر',
    style: 'Murattal', quality: '192kbps', group: 'Distinguished Reciters',
  },
  [AudioReciter.BUKHATIR]: {
    label: 'Salaah Bukhatir',
    arabicName: 'صلاح بوخاطر',
    style: 'Murattal', quality: '128kbps', group: 'Distinguished Reciters',
  },
  [AudioReciter.GHAMADI]: {
    label: "Sa'd Al-Ghamdi",
    arabicName: 'سعد الغامدي',
    style: 'Murattal', quality: '40kbps', group: 'Distinguished Reciters',
  },
  [AudioReciter.ALI_JABER]: {
    label: 'Ali Jaber',
    arabicName: 'علي جابر',
    style: 'Murattal', quality: '64kbps', group: 'Distinguished Reciters',
  },
  // ── Rising & Beloved Voices ───────────────────────────────
  [AudioReciter.KHALID_QAHTANI]: {
    label: 'Khalid Al-Qahtani',
    arabicName: 'خالد القحطاني',
    style: 'Murattal', quality: '192kbps', group: 'Rising & Beloved Voices',
  },
  [AudioReciter.FARES_ABBAD]: {
    label: 'Fares Abbad',
    arabicName: 'فارس عباد',
    style: 'Murattal', quality: '64kbps', group: 'Rising & Beloved Voices',
  },
  [AudioReciter.IBRAHIM_AKHDAR]: {
    label: 'Ibrahim Al-Akhdar',
    arabicName: 'إبراهيم الأخضر',
    style: 'Murattal', quality: '32kbps', group: 'Rising & Beloved Voices',
  },
  [AudioReciter.SAHL_YASEEN]: {
    label: 'Sahl Yassin',
    arabicName: 'سهل ياسين',
    style: 'Murattal', quality: '128kbps', group: 'Rising & Beloved Voices',
  },
  [AudioReciter.AKRAM_ALAQMI]: {
    label: 'Akram Al-Alaqimy',
    arabicName: 'أكرم العلقمي',
    style: 'Murattal', quality: '128kbps', group: 'Rising & Beloved Voices',
  },
  [AudioReciter.AYMAN_SOWAID]: {
    label: 'Ayman Sowaid',
    arabicName: 'أيمن سويد',
    style: 'Murattal', quality: '64kbps', group: 'Rising & Beloved Voices',
  },
};

const STYLE_COLORS = {
  Murattal: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Mujawwad: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

// ─── Component ───────────────────────────────────────────────
export const SettingsDrawer: React.FC = () => {
  const {
    fontScale, activeTheme, scriptType, isDrawerOpen, showTranslation, readingLanguage,
    toggleDrawer, setFontScale, setActiveTheme, setScriptType, setShowTranslation, setReadingLanguage,
  } = useSettingsStore();
  const { reciter, setReciter } = usePlayerStore();
  const [reciterSearch, setReciterSearch] = useState('');

  const filteredEntries = (Object.entries(RECITERS) as [AudioReciter, ReciterMeta][]).filter(
    ([, meta]) =>
      reciterSearch === '' ||
      meta.label.toLowerCase().includes(reciterSearch.toLowerCase()) ||
      meta.arabicName.includes(reciterSearch) ||
      meta.group.toLowerCase().includes(reciterSearch.toLowerCase())
  );

  const groups = Array.from(new Set(filteredEntries.map(([, m]) => m.group)));
  const activeReciterMeta = RECITERS[reciter];

  const getInitials = (label: string) =>
    label.split(' ').map(w => w[0]).slice(0, 2).join('');

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 overflow-y-auto"
          >
            <div className="h-auto theme-bg-gradient backdrop-blur-xl border-l border-white/[0.08] p-6 space-y-8">

              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={toggleDrawer}
                  className="text-gray-400 hover:text-white transition-colors text-lg">✕</motion.button>
              </div>

              {/* Font Scale */}
              <Section title="📐 Text Size">
                <input type="range" min="0.8" max="2.5" step="0.1" value={fontScale}
                  onChange={(e) => setFontScale(parseFloat(e.target.value))}
                  className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Small</span>
                  <span className="text-islamic-gold font-semibold">{fontScale.toFixed(1)}×</span>
                  <span>Large</span>
                </div>
                <p className="font-arabic text-center text-gray-200 mt-3 leading-relaxed"
                  style={{ fontSize: `${1.5 * fontScale}rem` }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </Section>

              {/* Theme */}
              <Section title="🎨 Theme">
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { t: Theme.DARK, label: 'Dark', swatch: 'bg-slate-900' },
                    { t: Theme.LIGHT, label: 'Light', swatch: 'bg-gray-100' },
                    { t: Theme.SEPIA, label: 'Sepia', swatch: 'bg-amber-100' },
                  ] as const).map(({ t, label, swatch }) => (
                    <button key={t} onClick={() => setActiveTheme(t)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${activeTheme === t
                        ? 'bg-islamic-gold/20 ring-2 ring-islamic-gold text-islamic-gold'
                        : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.1]'
                        }`}>
                      <div className={`w-8 h-8 rounded-lg ${swatch} border border-white/20`} />
                      <span className="text-xs font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
              </Section>

              {/* Language */}
              <Section title="🌍 Translation Language">
                <div className="flex bg-white/[0.04] rounded-xl p-1 border border-white/[0.08]">
                  {(['en', 'ur'] as const).map((lang) => (
                    <button key={lang} onClick={() => setReadingLanguage(lang)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${readingLanguage === lang
                        ? 'bg-islamic-gold text-dark-slate shadow-md'
                        : 'text-gray-400 hover:text-white'
                        }`}>
                      {lang === 'en' ? 'English' : 'Urdu (اردو)'}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Script */}
              <Section title="✍️ Quran Script">
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { s: ScriptType.UTHMANI, label: 'Uthmani' },
                    { s: ScriptType.INDOPAK, label: 'Indo-Pak' },
                  ] as const).map(({ s, label }) => (
                    <button key={s} onClick={() => setScriptType(s)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${scriptType === s
                        ? 'bg-islamic-emerald/30 text-emerald-300 ring-2 ring-islamic-emerald'
                        : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.1]'
                        }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* ── Reciter Library ─────────────────────────────── */}
              <Section title="🎙️ Reciter Library">

                {/* Active reciter card */}
                {activeReciterMeta && (
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-islamic-gold/10 border border-islamic-gold/25 mb-3">
                    <div className="w-8 h-8 rounded-full bg-islamic-gold flex items-center justify-center text-xs font-bold text-dark-slate shrink-0">
                      {getInitials(activeReciterMeta.label)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-islamic-gold truncate">{activeReciterMeta.label}</p>
                      <p className="text-[10px] font-arabic text-islamic-gold/70">{activeReciterMeta.arabicName}</p>
                    </div>
                    <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${STYLE_COLORS[activeReciterMeta.style]}`}>
                      {activeReciterMeta.style}
                    </span>
                  </div>
                )}

                {/* Search box */}
                {/* <input
                  type="text"
                  placeholder="Search by name or group…"
                  value={reciterSearch}
                  onChange={e => setReciterSearch(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-islamic-gold/50 mb-1"
                /> */}

                {/* <p className="text-[10px] text-gray-600 mb-3">
                  {filteredEntries.length} of {Object.keys(RECITERS).length} reciters • everyayah.com
                </p> */}

                {/* Grouped list */}
                <div className="space-y-5 max-h-[400px] overflow-y-auto show-scrollbar pr-1">
                  {groups.map(group => (
                    <div key={group}>
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                        <span className="flex-1 h-px bg-white/[0.06]" />
                        {group}
                        <span className="flex-1 h-px bg-white/[0.06]" />
                      </p>
                      <div className="space-y-1">
                        {filteredEntries
                          .filter(([, m]) => m.group === group)
                          .map(([value, meta]) => {
                            const isActive = reciter === value;
                            return (
                              <motion.button
                                key={value}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setReciter(value as AudioReciter)}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2.5 ${isActive
                                  ? 'bg-islamic-gold/15 border border-islamic-gold/25'
                                  : 'bg-white/[0.03] border border-transparent hover:bg-white/[0.07] hover:border-white/[0.08]'
                                  }`}
                              >
                                {/* Avatar */}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${isActive ? 'bg-islamic-gold text-dark-slate' : 'bg-white/10 text-gray-400'
                                  }`}>
                                  {getInitials(meta.label)}
                                </div>
                                {/* Name + Arabic */}
                                <div className="min-w-0 flex-1">
                                  <p className={`font-semibold truncate leading-snug ${isActive ? 'text-islamic-gold' : 'text-gray-300'}`}>
                                    {meta.label}
                                  </p>
                                  <p className="text-[9px] font-arabic  text-white leading-none mt-0.5">{meta.arabicName}</p>
                                </div>
                                {/* Style badge */}
                                <span className={`shrink-0 text-[8px] px-1.5 py-0.5 rounded-full border font-semibold ${STYLE_COLORS[meta.style]}`}>
                                  {meta.style}
                                </span>
                                {/* Check */}
                                {isActive && <span className="text-islamic-gold shrink-0">✓</span>}
                              </motion.button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                  {filteredEntries.length === 0 && (
                    <p className="text-center text-xs text-gray-600 py-6">No reciters found</p>
                  )}
                </div>
              </Section>

              {/* Display */}
              <Section title="👁️ Display">
                <div className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowTranslation(!showTranslation)}>
                  <span className="text-sm text-gray-300">Show Translation</span>
                  <div className={`w-9 h-5 rounded-full transition-colors relative ${showTranslation ? 'bg-islamic-gold' : 'bg-white/20'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showTranslation ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              </Section>

              {/* Footer */}
              <div className="border-t border-white/[0.08] pt-4 pb-2 text-xs text-gray-600">
                <p>Al-Quran Interactive v1.0</p>
                <p>All Rights Reserved © 2026 - Developed By <a href="https://github.com/Muhammad-Idrees-101" className="hover:text-gray-400">Muhammad Idrees</a></p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
      {children}
    </div>
  );
}

SettingsDrawer.displayName = 'SettingsDrawer';
