'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/atoms';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { AudioReciter, Theme } from '@/types/quran';

// ─── Reciter Metadata (Duplicated for Audio Player) ──────────
const RECITERS = {
  [AudioReciter.MISHARY]: { label: 'Mishary Alafasy', arabicName: 'مشاري العفاسي', style: 'Murattal' },
  [AudioReciter.HUSSARY]: { label: 'Mahmoud Al-Husary', arabicName: 'محمود الحصري', style: 'Murattal' },
  [AudioReciter.SUDAIS]: { label: 'Abdurrahman As-Sudais', arabicName: 'عبدالرحمن السديس', style: 'Murattal' },
  [AudioReciter.BASIT_MURATTAL]: { label: 'Abdul Basit', arabicName: 'عبد الباسط', style: 'Murattal' },
  [AudioReciter.MINSHAWI_MURATTAL]: { label: 'Siddiq Al-Minshawi', arabicName: 'محمد المنشاوي', style: 'Murattal' },
  [AudioReciter.MAHER_MUAIQLY]: { label: 'Maher Al-Muaiqly', arabicName: 'ماهر المعيقلي', style: 'Murattal' },
  [AudioReciter.YASSER_DUSSARY]: { label: 'Yasser Ad-Dussary', arabicName: 'ياسر الدوسري', style: 'Murattal' },
  [AudioReciter.NASSER_ALQATAMI]: { label: 'Nasser Al-Qatami', arabicName: 'ناصر القطامي', style: 'Murattal' },
};

function formatTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

export const GlobalAudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    isPlaying, playbackRate, volume, currentTime, duration, audioUrl,
    currentSurahName, currentSurahArabic, currentAyahNumber, surahAyahCount,
    reciter, isLoading, hasError,
    setIsPlaying, setCurrentTime, setDuration, setIsLoading, setHasError,
    playNextAyah, playPrevAyah, setPlaybackRate, setVolume, setReciter,
  } = usePlayerStore();
  const { activeTheme } = useSettingsStore();
  const isLight = activeTheme === Theme.LIGHT;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.src = audioUrl;
    audio.load();
    setIsLoading(true);
    setHasError(false);
  }, [audioUrl, setIsLoading, setHasError]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onCanPlay = () => { setIsLoading(false); if (isPlaying) audio.play().catch(() => setHasError(true)); };
    const onError = () => { setIsLoading(false); setHasError(true); };
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);
    return () => { audio.removeEventListener('canplay', onCanPlay); audio.removeEventListener('error', onError); };
  }, [isPlaying, setIsLoading, setHasError]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && audio.readyState >= 3) { audio.play().catch(() => { }); } else { audio.pause(); }
  }, [isPlaying]);

  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = playbackRate; }, [playbackRate]);
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume / 100; }, [volume]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;
  const activeReciterMeta = RECITERS[reciter as keyof typeof RECITERS] || RECITERS[AudioReciter.MISHARY];

  return (
    <>
      <AnimatePresence>
        {audioUrl && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: isCollapsed ? '100%' : '0%', opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 z-40 pb-safe ${isCollapsed ? 'pb-0' : 'pb-[72px] md:pb-0'}`} // extra padding for bottom nav on mobile
          >
            {/* Toggle Button */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[100%] z-50">
              <motion.button
                onClick={() => setIsCollapsed(!isCollapsed)}
                whileTap={{ scale: 0.9 }}
                className={`px-6 py-2 backdrop-blur-xl border border-white/10 border-b-0 rounded-t-2xl text-islamic-gold transition-all duration-500 flex items-center justify-center ${isLight ? 'bg-white/90' : 'bg-[#0A1118]/90 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  {isCollapsed ? '▴ Show Player' : '▾ Hide'}
                </span>
              </motion.button>
            </div>
            
            <audio
              ref={audioRef}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={playNextAyah}
              preload="auto"
            />

            <div className={`pt-4 pb-4 px-4 md:px-6 backdrop-blur-3xl transition-colors duration-500 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] ${isLight ? 'bg-white/95 border-t border-gray-200' : 'bg-[#0A1118]/95 border-t border-white/[0.08]'}`}>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/10 rounded-full cursor-pointer mb-4 group relative" onClick={handleSeek}>
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-islamic-gold rounded-full relative"
                  style={{ width: `${pct}%` }}
                  transition={{ type: 'tween', duration: 0.1 }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-islamic-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)] opacity-100 transition-opacity" />
                </motion.div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Mobile Top Row: Info + Reciter Button */}
                <div className="flex items-center justify-between w-full md:w-auto md:flex-1 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-islamic-gold font-arabic text-xl shadow-lg shrink-0 ${isLight ? 'bg-teal-500/10' : 'bg-teal-900/40 border border-teal-500/30'}`}>
                      ﷽
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm md:text-base font-bold truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {currentSurahName || 'No track'}
                      </p>
                      <p className={`text-[10px] md:text-xs truncate ${isLight ? 'text-gray-500' : 'text-teal-400'}`}>
                        {currentSurahArabic} {currentAyahNumber ? `• Ayah ${currentAyahNumber}` : ''}
                      </p>
                    </div>
                  </div>
                  
                  {/* Player Settings / Reciter Modal Trigger (Mobile Only) */}
                  <button 
                    onClick={() => setShowSettingsModal(true)}
                    className="md:hidden flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] active:scale-95 transition-transform"
                  >
                    <span className="text-lg">🎙️</span>
                    <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Settings</span>
                  </button>
                </div>

                {/* Controls Row */}
                <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-4">
                  {/* Time & Playback Controls */}
                  <div className="flex items-center justify-between w-full md:w-auto md:gap-6">
                    <span className={`text-[10px] md:text-xs font-mono font-medium ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatTime(currentTime)}
                    </span>
                    
                    <div className="flex items-center gap-4 md:gap-3">
                      <button onClick={playPrevAyah} className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 active:scale-90 transition-all text-xl">
                        ⏮
                      </button>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-islamic-gold to-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center justify-center text-black text-2xl active:scale-90 transition-transform"
                      >
                        {isLoading ? <span className="animate-spin">⟳</span> : isPlaying ? '⏸' : '▶'}
                      </button>
                      <button onClick={playNextAyah} className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 active:scale-90 transition-all text-xl">
                        ⏭
                      </button>
                    </div>

                    <span className={`text-[10px] md:text-xs font-mono font-medium ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Desktop Only: Volume & Speed & Reciter */}
                  <div className="hidden md:flex items-center gap-3">
                    <button 
                      onClick={() => setShowSettingsModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/[0.1] transition-colors flex items-center gap-2"
                    >
                      🎙️ {activeReciterMeta?.label.split(' ')[0]}
                    </button>
                    
                    <select
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                      className="border text-xs rounded-lg px-2 py-1.5 bg-white/10 border-white/20 text-white focus:outline-none"
                    >
                      <option value={0.75}>0.75×</option>
                      <option value={1}>1×</option>
                      <option value={1.5}>1.5×</option>
                      <option value={2}>2×</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">🔊</span>
                      <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="w-16 accent-islamic-gold" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Player Settings Modal (Mobile & Desktop) ─── */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:bg-black/60 md:backdrop-blur-sm"
          >
            <div className="w-full md:w-[400px] h-[85vh] md:h-[600px] bg-[#0A1118] md:rounded-3xl border-t md:border border-white/[0.1] shadow-2xl flex flex-col">
              
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/[0.08]">
                <h3 className="text-lg font-bold text-white">Player Settings</h3>
                <button onClick={() => setShowSettingsModal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                
                {/* Mobile Playback Controls */}
                <div className="md:hidden space-y-4 bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Speed</p>
                    <div className="flex gap-2">
                      {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackRate(speed)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${playbackRate === speed ? 'bg-islamic-gold text-black border-islamic-gold' : 'bg-transparent text-gray-400 border-white/[0.1]'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Volume</p>
                    <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="w-full accent-islamic-gold" />
                  </div>
                </div>

                {/* Reciter Selection */}
                <div>
                  <p className="text-xs font-semibold text-islamic-gold mb-3 uppercase tracking-wider">🎙️ Choose Reciter</p>
                  <div className="space-y-2">
                    {Object.entries(RECITERS).map(([id, meta]) => {
                      const isActive = reciter === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setReciter(id as AudioReciter)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${isActive ? 'bg-teal-500/10 border-teal-500/30' : 'bg-white/[0.03] border-transparent hover:bg-white/[0.06]'}`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? 'bg-islamic-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-white/10 text-gray-400'}`}>
                            {meta.label.charAt(0)}
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`text-sm font-bold ${isActive ? 'text-islamic-gold' : 'text-white'}`}>{meta.label}</p>
                            <p className="text-[10px] text-gray-500">{meta.style}</p>
                          </div>
                          {isActive && <span className="text-islamic-gold text-xl">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

GlobalAudioPlayer.displayName = 'GlobalAudioPlayer';
