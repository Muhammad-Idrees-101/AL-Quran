import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Bookmark {
  id: string;
  surahId: number;
  surahName: string;
  surahArabic: string;
  ayahNumber: number;
  ayahText: string;
  translation?: string;
  note?: string;
  savedAt: string;
}

export interface ReadingHistoryEntry {
  id: string;
  surahId: number;
  surahName: string;
  surahArabic: string;
  ayahStart: number;
  ayahEnd: number;
  readAt: string; // ISO timestamp
  durationSeconds?: number;
}

export interface FeaturesState {
  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (b: Omit<Bookmark, 'id' | 'savedAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (surahId: number, ayahNumber: number) => boolean;

  // Reading Progress (surahId -> visited)
  readSurahs: number[];
  markSurahRead: (surahId: number) => void;

  // Reading History
  readingHistory: ReadingHistoryEntry[];
  addHistoryEntry: (entry: Omit<ReadingHistoryEntry, 'id' | 'readAt'>) => void;
  clearHistory: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useFeaturesStore = create<FeaturesState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      readSurahs: [],
      readingHistory: [],

      addBookmark: (b) =>
        set((s) => ({
          bookmarks: [
            { ...b, id: `${b.surahId}-${b.ayahNumber}-${Date.now()}`, savedAt: new Date().toISOString() },
            ...s.bookmarks,
          ],
        })),

      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),

      isBookmarked: (surahId, ayahNumber) =>
        get().bookmarks.some((b) => b.surahId === surahId && b.ayahNumber === ayahNumber),

      markSurahRead: (surahId) =>
        set((s) => ({
          readSurahs: s.readSurahs.includes(surahId) ? s.readSurahs : [...s.readSurahs, surahId],
        })),

      addHistoryEntry: (entry) =>
        set((s) => ({
          readingHistory: [
            {
              ...entry,
              id: `${entry.surahId}-${Date.now()}`,
              readAt: new Date().toISOString(),
            },
            ...s.readingHistory.slice(0, 199), // keep last 200 entries
          ],
        })),

      clearHistory: () => set({ readingHistory: [] }),
    }),
    { name: 'quran-features-storage' }
  )
);
