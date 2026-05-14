'use client';

import React, { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSettingsStore } from '@/stores/settingsStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

function ThemeUpdater() {
  const activeTheme = useSettingsStore(s => s.activeTheme);
  
  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-sepia');
    document.body.classList.add(`theme-${activeTheme}`);
  }, [activeTheme]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeUpdater />
      {children}
    </QueryClientProvider>
  );
}
