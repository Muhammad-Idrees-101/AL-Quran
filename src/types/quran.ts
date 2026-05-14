// ─── Quran Core Types ───────────────────────────────────────

export interface Ayah {
  id: number;
  surah_id: number;
  ayah_number: number;
  text_uthmani: string;
  text_indopak: string;
  translation_en?: string;
  translation_ur?: string;
  tafseer_en?: string;
  tafseer_ur?: string;
  timeStart?: number;
  timeEnd?: number;
}

export interface Surah {
  id: number;
  name_arabic: string;
  name_english: string;
  name_simple: string;
  revelation_type: 'Meccan' | 'Medinan';
  revelation_order: number;
  ayah_count: number;
  page_start: number;
  page_end: number;
  bismillah_pre?: boolean; // false for Surah 1 and 9
}

// ─── Settings & Theme ───────────────────────────────────────

export enum ScriptType {
  UTHMANI = 'uthmani',
  INDOPAK = 'indopak',
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  SEPIA = 'sepia',
}

export enum AudioReciter {
  // ── World-Famous Masters ────────────────────────────────
  MISHARY = 'Alafasy_128kbps',
  HUSSARY = 'Husary_128kbps',
  HUSSARY_MUJAWWAD = 'Husary_128kbps_Mujawwad',
  SUDAIS = 'Abdurrahmaan_As-Sudais_192kbps',
  SHURAYM = 'Saood_ash-Shuraym_128kbps',

  // ── Abdul Basit (two styles) ────────────────────────────
  BASIT_MURATTAL = 'Abdul_Basit_Murattal_192kbps',
  BASIT_MUJAWWAD = 'Abdul_Basit_Mujawwad_128kbps',

  // ── Minshawi (two styles) ───────────────────────────────
  MINSHAWI_MURATTAL = 'Minshawy_Murattal_128kbps',
  MINSHAWI_MUJAWWAD = 'Minshawy_Mujawwad_192kbps',

  // ── Madinah / Makkah Imams ─────────────────────────────
  MAHER_MUAIQLY = 'MaherAlMuaiqly128kbps',
  HUDHAIFY = 'Hudhaify_128kbps',
  MUHSIN_QASIM = 'Muhsin_Al_Qasim_192kbps',
  BUDAIR = 'Salah_Al_Budair_128kbps',

  // ── Distinguished Reciters ──────────────────────────────
  ABU_BAKR_SHAATREE = 'Abu_Bakr_Ash-Shaatree_128kbps',
  HANI_RIFAI = 'Hani_Rifai_192kbps',
  MUHAMMAD_AYYOUB = 'Muhammad_Ayyoub_128kbps',
  MUHAMMAD_JIBREEL = 'Muhammad_Jibreel_128kbps',
  NASSER_ALQATAMI = 'Nasser_Alqatami_128kbps',
  YASSER_DUSSARY = 'Yasser_Ad-Dussary_128kbps',
  ABDULLAH_BASFAR = 'Abdullah_Basfar_192kbps',
  BUKHATIR = 'Salaah_AbdulRahman_Bukhatir_128kbps',
  GHAMADI = 'Ghamadi_40kbps',
  ALI_JABER = 'Ali_Jaber_64kbps',

  // ── Rising & Beloved Voices ─────────────────────────────
  KHALID_QAHTANI = 'Khaalid_Abdullaah_al-Qahtaanee_192kbps',
  FARES_ABBAD = 'Fares_Abbad_64kbps',
  IBRAHIM_AKHDAR = 'Ibrahim_Akhdar_32kbps',
  SAHL_YASEEN = 'Sahl_Yassin_128kbps',
  AKRAM_ALAQMI = 'Akram_AlAlaqimy_128kbps',
  AYMAN_SOWAID = 'Ayman_Sowaid_64kbps',
}

// ─── Scholar & Video ────────────────────────────────────────

export interface ScholarProfile {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  initials: string;
  color: string; // tailwind bg color class
  expertise: string[];
  videoCount: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId?: string;
  videoUrl?: string;
  startTime?: number;
  endTime?: number | null;
  thumbnail?: string;
  scholar: ScholarProfile;
  duration: number; // seconds
  linkedAyahs: Array<{ surahId: number; ayahNumber: number; label: string }>;
  category: string;
  createdAt: Date;
  views?: string;
}

// ─── Tafseer ────────────────────────────────────────────────

export interface TafseerId {
  id: string;
  name: string;
  author: string;
  shortName: string;
  language: string;
  period: string;
  color: string; // accent color class
}

export interface TafseerContent {
  tafsirId: string;
  surahId: number;
  intro: string;
  body: string[];
  keyInsights: string[];
  crossReferences: CrossReference[];
}

export interface CrossReference {
  label: string;
  surahId: number;
  ayahNumber: number;
  surahName: string;
  text: string;
}

// ─── Player State (for localStorage) ───────────────────────

export interface ContinuationData {
  surahId: number;
  surahName: string;
  surahArabic: string;
  ayahNumber: number;
  ayahText: string;
  savedAt: string; // ISO date
}

// ─── Watch History ──────────────────────────────────────────

export interface WatchHistoryItem {
  videoId: string;
  title: string;
  scholarName: string;
  youtubeId?: string;
  watchedAt: string; // ISO date
}
