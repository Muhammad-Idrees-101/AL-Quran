import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AudioReciter } from '@/types/quran';
import { env } from '@/lib/env';

// ─── Audio URL Builder ──────────────────────────────────────
export function buildAudioUrl(surahId: number, ayahNumber: number, reciter: AudioReciter): string {
  const s = String(surahId).padStart(3, '0');
  const a = String(ayahNumber).padStart(3, '0');
  return `${env.NEXT_PUBLIC_AUDIO_CDN}/${reciter}/${s}${a}.mp3`;
}


// ─── Full Surah URL Builder ─────────────────────────────────
export function getFullSurahUrl(surahId: number, reciter: AudioReciter): string {
  const s = String(surahId).padStart(3, '0');
  
  // Mapping from our everyayah identifiers to mp3quran endpoints
  const reciterMap: Record<string, string> = {
    [AudioReciter.MISHARY]: 'server8.mp3quran.net/afs',
    [AudioReciter.HUSSARY]: 'server13.mp3quran.net/husr',
    [AudioReciter.HUSSARY_MUJAWWAD]: 'server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad',
    [AudioReciter.SUDAIS]: 'server11.mp3quran.net/sds',
    [AudioReciter.SHURAYM]: 'server7.mp3quran.net/shur',
    [AudioReciter.BASIT_MURATTAL]: 'server7.mp3quran.net/basit',
    [AudioReciter.BASIT_MUJAWWAD]: 'server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad',
    [AudioReciter.MINSHAWI_MURATTAL]: 'server10.mp3quran.net/minsh',
    [AudioReciter.MINSHAWI_MUJAWWAD]: 'server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad',
    [AudioReciter.MAHER_MUAIQLY]: 'server12.mp3quran.net/maher',
    [AudioReciter.HUDHAIFY]: 'server9.mp3quran.net/hthfi',
    [AudioReciter.MUHSIN_QASIM]: 'server8.mp3quran.net/qasm',
    [AudioReciter.BUDAIR]: 'server6.mp3quran.net/s_bud',
    [AudioReciter.ABU_BAKR_SHAATREE]: 'server11.mp3quran.net/shatri',
    [AudioReciter.HANI_RIFAI]: 'server8.mp3quran.net/hani',
    [AudioReciter.MUHAMMAD_AYYOUB]: 'server8.mp3quran.net/ayyub',
    [AudioReciter.MUHAMMAD_JIBREEL]: 'server8.mp3quran.net/jbrl',
    [AudioReciter.NASSER_ALQATAMI]: 'server6.mp3quran.net/qtm',
    [AudioReciter.YASSER_DUSSARY]: 'server11.mp3quran.net/yasser',
    [AudioReciter.ABDULLAH_BASFAR]: 'server6.mp3quran.net/bsfr',
    [AudioReciter.BUKHATIR]: 'server8.mp3quran.net/bu_khtr',
    [AudioReciter.GHAMADI]: 'server7.mp3quran.net/s_gmd',
    [AudioReciter.ALI_JABER]: 'server11.mp3quran.net/a_jbr',
    [AudioReciter.KHALID_QAHTANI]: 'server10.mp3quran.net/qht',
    [AudioReciter.FARES_ABBAD]: 'server8.mp3quran.net/frs_a',
    [AudioReciter.IBRAHIM_AKHDAR]: 'server6.mp3quran.net/akdr',
    [AudioReciter.SAHL_YASEEN]: 'server6.mp3quran.net/shl',
    [AudioReciter.AKRAM_ALAQMI]: 'server9.mp3quran.net/akrm',
  };

  const domainAndPath = reciterMap[reciter] || 'server8.mp3quran.net/afs';
  return `https://${domainAndPath}/${s}.mp3`;
}

// ─── Store Interface ────────────────────────────────────────
export interface PlayerState {
  // Current track info
  isPlaying: boolean;
  currentAyahId: number | null;
  currentSurahId: number | null;
  currentAyahNumber: number | null;
  currentSurahName: string | null;
  currentSurahArabic: string | null;
  surahAyahCount: number | null;

  // Audio controls
  playbackRate: number;
  volume: number;
  currentTime: number;
  duration: number;
  audioUrl: string | null;
  reciter: AudioReciter;
  isLoading: boolean;
  hasError: boolean;
  isContinuousPlay: boolean;

  // Actions
  setIsPlaying: (playing: boolean) => void;
  setCurrentAyah: (params: {
    ayahId: number;
    surahId: number;
    ayahNumber: number;
    surahName: string;
    surahArabic: string;
    surahAyahCount: number;
  }) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setAudioUrl: (url: string) => void;
  setReciter: (reciter: AudioReciter) => void;
  setIsLoading: (loading: boolean) => void;
  setHasError: (error: boolean) => void;
  playNextAyah: () => void;
  playPrevAyah: () => void;
  playFullSurah: (params: {
    surahId: number;
    surahName: string;
    surahArabic: string;
    surahAyahCount: number;
  }) => void;
  resetPlayer: () => void;
  toggleContinuousPlay: () => void;
}

// ─── Store Implementation ───────────────────────────────────
export const usePlayerStore = create<PlayerState>()(
  subscribeWithSelector((set, get) => ({
    isPlaying: false,
    currentAyahId: null,
    currentSurahId: null,
    currentAyahNumber: null,
    currentSurahName: null,
    currentSurahArabic: null,
    surahAyahCount: null,
    playbackRate: 1,
    volume: 85,
    currentTime: 0,
    duration: 0,
    audioUrl: null,
    reciter: AudioReciter.MISHARY,
    isLoading: false,
    hasError: false,
    isContinuousPlay: true,

    setIsPlaying: (playing) => set({ isPlaying: playing }),

    setCurrentAyah: ({ ayahId, surahId, ayahNumber, surahName, surahArabic, surahAyahCount }) => {
      const { reciter } = get();
      const audioUrl = buildAudioUrl(surahId, ayahNumber, reciter);
      set({
        currentAyahId: ayahId,
        currentSurahId: surahId,
        currentAyahNumber: ayahNumber,
        currentSurahName: surahName,
        currentSurahArabic: surahArabic,
        surahAyahCount,
        audioUrl,
        isPlaying: true,
        hasError: false,
        currentTime: 0,
      });
    },

    setPlaybackRate: (rate) => set({ playbackRate: Math.max(0.5, Math.min(2, rate)) }),
    setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, volume)) }),
    setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ duration }),
    setAudioUrl: (url) => set({ audioUrl: url }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setHasError: (error) => set({ hasError: error }),

    setReciter: (reciter) => {
      const { currentSurahId, currentAyahNumber } = get();
      if (currentSurahId) {
        if (currentAyahNumber) {
          // Ayah-by-Ayah mode
          const audioUrl = buildAudioUrl(currentSurahId, currentAyahNumber, reciter);
          set({ reciter, audioUrl, isPlaying: true, currentTime: 0 });
        } else {
          // Full Surah mode
          const audioUrl = getFullSurahUrl(currentSurahId, reciter);
          set({ reciter, audioUrl, isPlaying: true, currentTime: 0 });
        }
      } else {
        set({ reciter });
      }
    },

    playNextAyah: () => {
      const { currentSurahId, currentAyahNumber, surahAyahCount, reciter } = get();
      if (!currentSurahId || !currentAyahNumber || !surahAyahCount) return;
      if (currentAyahNumber >= surahAyahCount) return; // last ayah

      const nextAyahNumber = currentAyahNumber + 1;
      const nextAyahId = currentSurahId * 1000 + nextAyahNumber;
      const audioUrl = buildAudioUrl(currentSurahId, nextAyahNumber, reciter);

      set({
        currentAyahId: nextAyahId,
        currentAyahNumber: nextAyahNumber,
        audioUrl,
        isPlaying: true,
        currentTime: 0,
        hasError: false,
      });
    },

    playPrevAyah: () => {
      const { currentSurahId, currentAyahNumber, reciter } = get();
      if (!currentSurahId || !currentAyahNumber) return;
      if (currentAyahNumber <= 1) return; // first ayah

      const prevAyahNumber = currentAyahNumber - 1;
      const prevAyahId = currentSurahId * 1000 + prevAyahNumber;
      const audioUrl = buildAudioUrl(currentSurahId, prevAyahNumber, reciter);

      set({
        currentAyahId: prevAyahId,
        currentAyahNumber: prevAyahNumber,
        audioUrl,
        isPlaying: true,
        currentTime: 0,
        hasError: false,
      });
    },

    playFullSurah: ({ surahId, surahName, surahArabic, surahAyahCount }) => {
      const { reciter } = get();
      const audioUrl = getFullSurahUrl(surahId, reciter);
      
      set({
        currentSurahId: surahId,
        currentSurahName: surahName,
        currentSurahArabic: surahArabic,
        currentAyahId: null,
        currentAyahNumber: null,
        surahAyahCount,
        audioUrl,
        isPlaying: true,
        hasError: false,
        currentTime: 0,
      });
    },

    toggleContinuousPlay: () => set((s) => ({ isContinuousPlay: !s.isContinuousPlay })),

    resetPlayer: () =>
      set({
        isPlaying: false,
        currentAyahId: null,
        currentSurahId: null,
        currentAyahNumber: null,
        currentSurahName: null,
        currentSurahArabic: null,
        surahAyahCount: null,
        playbackRate: 1,
        volume: 85,
        currentTime: 0,
        duration: 0,
        audioUrl: null,
        isLoading: false,
        hasError: false,
        isContinuousPlay: true,
      }),
  }))
);
