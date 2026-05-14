'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel, Button } from '@/components/atoms';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { AudioReciter, Theme } from '@/types/quran';
import { SURAHS } from '@/lib/mockData';

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

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Sync audio element with store
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

    const onCanPlay = () => {
      setIsLoading(false);
      if (isPlaying) {
        audio.play().catch(() => setHasError(true));
      }
    };
    const onError = () => { setIsLoading(false); setHasError(true); };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
    };
  }, [isPlaying, setIsLoading, setHasError]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && audio.readyState >= 3) {
      audio.play().catch(() => { });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };
  const handleLoadedMeta = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };
  const handleEnded = () => { playNextAyah(); };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {audioUrl && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: isCollapsed ? '100%' : '0%',
            opacity: 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          {/* Toggle Button (Floating Center Button) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[100%] z-50">
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ y: -6, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`px-6 py-2 backdrop-blur-xl border border-white/10 border-b-0 rounded-t-2xl text-islamic-gold transition-all duration-500 ease-out flex items-center justify-center ${isLight ? 'bg-white/80' : 'bg-black/60'
                }`}
            >
              {isCollapsed ? (
                <span className="text-[10px] font-black  uppercase tracking-widest flex items-center gap-2">
                  ▴ Audio Player
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  ▾ Hide
                </span>
              )}
            </motion.button>
          </div>
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMeta}
            onEnded={handleEnded}
            preload="auto"
          />

          <div className={`pt-6 pb-2 px-4 md:px-6 backdrop-blur-heavy transition-colors duration-500 ${isLight
            ? 'bg-gradient-to-t from-white/95 via-white/90 to-transparent border-t border-black/[0.05]'
            : 'bg-gradient-to-t from-black/90 via-black/80 to-transparent'
            }`}>
            {/* Progress Bar */}
            <div
              className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer mb-3 group"
              onClick={handleSeek}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-islamic-gold to-amber-400 rounded-full relative"
                style={{ width: `${pct}%` }}
                transition={{ type: 'tween', duration: 0.1 }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-islamic-gold rounded-full shadow-glow-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              {/* Track Info */}
              <div className="hidden sm:flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-islamic-gold font-arabic text-lg flex-shrink-0 ${isLight ? 'bg-islamic-emerald/10' : 'bg-islamic-emerald/30'
                  }`}>
                  ﷽
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    {currentSurahName || 'No track'}
                  </p>
                  <p className={`text-xs truncate ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                    {currentSurahArabic} {currentAyahNumber ? `• Ayah ${currentAyahNumber}` : ''}
                    {surahAyahCount ? ` / ${surahAyahCount}` : ''}
                  </p>
                </div>
              </div>

              {/* Waveform (when playing) */}
              {isPlaying && !isLoading && (
                <div className="hidden md:flex items-end gap-[2px] h-5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-[3px] bg-islamic-gold/70 rounded-full waveform-bar" style={{ height: '4px' }} />
                  ))}
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={playPrevAyah} className="!p-2">⏮</Button>
                <Button
                  variant="gold" size="md"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="!w-10 !h-10 !rounded-full !p-0"
                >
                  {isLoading ? (
                    <span className="animate-spin text-sm">⟳</span>
                  ) : isPlaying ? '⏸' : '▶'}
                </Button>
                <Button variant="ghost" size="sm" onClick={playNextAyah} className="!p-2">⏭</Button>
              </div>

              {/* Time */}
              <div className={`text-xs font-mono whitespace-nowrap min-w-[80px] text-center ${isLight ? 'text-gray-500' : 'text-gray-400'
                }`}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Speed */}
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className={`hidden md:block border text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-islamic-gold transition-colors ${isLight
                  ? 'bg-gray-100 border-gray-200 text-gray-800'
                  : 'bg-white/10 border-white/20 text-white'
                  }`}
              >
                <option value={0.5}>0.5×</option>
                <option value={0.75}>0.75×</option>
                <option value={1}>1×</option>
                <option value={1.25}>1.25×</option>
                <option value={1.5}>1.5×</option>
                <option value={2}>2×</option>
              </select>

              {/* Volume */}
              <div className="hidden lg:flex items-center gap-2">
                <span className={`text-xs ${isLight ? 'opacity-60' : 'text-gray-400'}`}>🔊</span>
                <input
                  type="range" min="0" max="100" value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className={`w-20 accent-islamic-gold ${isLight ? 'opacity-70' : ''}`}
                />
              </div>

              {/* Error indicator */}
              {hasError && (
                <span className="text-xs text-red-400" title="Audio unavailable">⚠</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

GlobalAudioPlayer.displayName = 'GlobalAudioPlayer';
