import { env } from './env';

export const API_CONFIG = {
  // Quran Data APIs
  QURAN: {
    BASE_URL: env.NEXT_PUBLIC_QURAN_API,
    SURAHS: '/v1/surah',
    AYAH: '/v1/ayah',
    TRANSLATIONS: '/v1/edition?language=en',
  },

  // Audio API
  AUDIO: {
    BASE_URL: env.NEXT_PUBLIC_AUDIO_CDN,
    FORMATS: {
      MISHARY: '/mishary/{surahNum}.mp3',
      ABDUL_BASIT: '/abdul-basit/{surahNum}.mp3',
    },
  },

  // Video API
  VIDEOS: {
    BASE_URL: env.NEXT_PUBLIC_API_URL,
    ENDPOINT: '/v1/videos',
    SCHOLARS: '/v1/scholars',
  },

  // Search API
  SEARCH: {
    BASE_URL: env.NEXT_PUBLIC_API_URL,
    ENDPOINT: '/v1/search',
    AUTOCOMPLETE: '/v1/search/autocomplete',
  },

  // Authentication
  AUTH: {
    BASE_URL: env.NEXT_PUBLIC_API_URL,
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    REFRESH: '/v1/auth/refresh',
  },
};

// Feature Flags
export const FEATURES = {
  ENABLE_AUDIO_SYNC: true,
  ENABLE_USER_AUTH: env.NEXT_PUBLIC_ENV === 'development', // Example logic
  ENABLE_BOOKMARKS: true,
  ENABLE_SHARING: false,
  ENABLE_OFFLINE_MODE: false,
};


// Cache Durations (in seconds)
export const CACHE_DURATIONS = {
  SURAHS: 60 * 60 * 24, // 24 hours
  AYAHS: 60 * 60 * 24, // 24 hours
  VIDEOS: 60 * 60, // 1 hour
  SCHOLARS: 60 * 60 * 24 * 7, // 7 days
};

