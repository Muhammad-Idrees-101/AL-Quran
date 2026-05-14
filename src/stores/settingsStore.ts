import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, ScriptType } from '@/types/quran';

export interface SettingsState {
  fontScale: number;
  activeTheme: Theme;
  scriptType: ScriptType;
  isDrawerOpen: boolean;
  isSidebarOpen: boolean;
  readingLanguage: 'en' | 'ur';
  showTranslation: boolean;
  showTafseer: boolean;

  // Actions
  setFontScale:      (scale: number) => void;
  setActiveTheme:    (theme: Theme) => void;
  setScriptType:     (script: ScriptType) => void;
  setIsDrawerOpen:   (open: boolean) => void;
  setIsSidebarOpen:  (open: boolean) => void;
  setReadingLanguage:(lang: 'en' | 'ur') => void;
  toggleDrawer:      () => void;
  toggleSidebar:     () => void;
  setShowTranslation:(show: boolean) => void;
  setShowTafseer:    (show: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontScale:       1,
      activeTheme:     Theme.DARK,
      scriptType:      ScriptType.UTHMANI,
      isDrawerOpen:    false,
      isSidebarOpen:   true,
      readingLanguage: 'en',
      showTranslation: true,
      showTafseer:     false,

      setFontScale:      (scale)  => set({ fontScale: Math.max(0.8, Math.min(2.5, scale)) }),
      setActiveTheme:    (theme)  => set({ activeTheme: theme }),
      setScriptType:     (script) => set({ scriptType: script }),
      setIsDrawerOpen:   (open)   => set({ isDrawerOpen: open }),
      setIsSidebarOpen:  (open)   => set({ isSidebarOpen: open }),
      setReadingLanguage:(lang)   => set({ readingLanguage: lang }),
      toggleDrawer:      ()       => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
      toggleSidebar:     ()       => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      setShowTranslation:(show)   => set({ showTranslation: show }),
      setShowTafseer:    (show)   => set({ showTafseer: show }),
    }),
    {
      name: 'quran-settings-storage',
      partialize: (state) => ({
        fontScale:       state.fontScale,
        activeTheme:     state.activeTheme,
        scriptType:      state.scriptType,
        readingLanguage: state.readingLanguage,
        showTranslation: state.showTranslation,
        showTafseer:     state.showTafseer,
      }),
    }
  )
);
