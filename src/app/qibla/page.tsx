'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PrayerTimesWidget } from '@/components/organisms/PrayerTimesWidget';
import { QiblaCompass } from '@/components/organisms/QiblaCompass';

export default function QiblaPage() {
  const router = useRouter();
  return (
    <>
      {/* ── Desktop: not available ── */}
      <div className="hidden min-[1200px]:flex min-h-screen items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-md w-full text-center"
        >
          {/* Glowing icon */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full bg-islamic-gold/20 blur-3xl scale-150" />
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-islamic-gold/20 to-emerald-500/10 border border-islamic-gold/30 flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.2)]">
              <span className="text-5xl">📱</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Mobile &amp; Tablet Only
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
            The Qibla compass uses your device&apos;s built-in sensors. Please open this page on your <span className="text-islamic-gold font-semibold">phone or tablet</span> to find the direction of Mecca.
          </p>

          {/* Ayah card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Divine Command</p>
            <p className="text-xl font-arabic text-islamic-gold text-right mb-2 leading-loose" dir="rtl">
              فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
            </p>
            <p className="text-[12px] text-gray-400 italic">
              &quot;So turn your face toward al-Masjid al-Haram.&quot;
              <br />
              <span className="text-gray-500 text-[11px] not-italic">— Surah Al-Baqarah 2:144</span>
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-islamic-gold/10 border border-islamic-gold/25 text-islamic-gold text-sm font-semibold hover:bg-islamic-gold/20 transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          >
            ← Back to Dashboard
          </button>
        </motion.div>
      </div>

      {/* ── Mobile / Tablet: full page ── */}
      <div className="min-[1200px]:hidden min-h-screen px-4 md:px-8 pt-8 pb-20 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => router.push('/')} className="text-xs text-gray-500 hover:text-white mb-4 flex items-center gap-1 transition-colors">
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">🕌 Qibla &amp; Prayer Times</h1>
          <p className="text-sm text-gray-400 mb-8">Find the direction of Mecca and today&apos;s prayer schedule</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <QiblaCompass />
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">📍 About Qibla</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-5">
                The Qibla is the direction of the Kaaba in Mecca, Saudi Arabia. Muslims around the world face this fixed direction during their daily prayers (Salah).
              </p>

              <div className="mb-5 p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-10 -mt-10" />
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3 relative z-10">Divine Command</p>
                <p className="text-lg font-arabic text-islamic-gold text-right mb-2 leading-relaxed relative z-10" dir="rtl">
                  فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
                </p>
                <p className="text-[11px] text-gray-400 italic relative z-10">
                  &quot;So turn your face toward al-Masjid al-Haram.&quot;
                  <br /><span className="text-gray-500 text-[10px] not-italic mt-1 block">— Surah Al-Baqarah 2:144</span>
                </p>
              </div>

              <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mt-6 mb-3">Calibration Tips</h4>
              <ul className="text-[12px] text-gray-400 space-y-2 list-disc pl-4 mb-6">
                <li>Keep your device flat and perfectly horizontal.</li>
                <li>Stay clear of metallic objects, magnets, and heavy electronics to avoid interference.</li>
                <li>If the compass seems inaccurate, wave your phone in a large <strong>&quot;Figure 8&quot; (∞)</strong> motion to recalibrate its sensors.</li>
              </ul>
            </div>

            <div className="mt-auto pt-5 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-islamic-gold font-bold uppercase tracking-wider mb-1">Kaaba Location</p>
                  <p className="text-xs text-gray-400 font-mono">21° 25&apos; 21&quot; N, 39° 49&apos; 34&quot; E</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-islamic-gold/10 flex items-center justify-center border border-islamic-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.15)] text-lg">
                  🕋
                </div>
              </div>
            </div>
          </div>
        </div>

        <PrayerTimesWidget />
      </div>
    </>
  );
}

