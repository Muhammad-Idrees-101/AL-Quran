'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel } from '@/components/atoms';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useFeaturesStore } from '@/stores/featuresStore';
import { cn } from '@/utils/cn';
import { Theme } from '@/types/quran';

const NAV_ITEMS = [
  { href: '/', label: 'Discovery', icon: '🏠', desc: 'Home Dashboard' },
  { href: '/player', label: 'Quran', icon: '📖', desc: 'Reading & Audio' },
  { href: '/academy', label: 'Academy', icon: '🎓', desc: 'Video Lectures' },
  { href: '/tafseer', label: 'Tafseer', icon: '📚', desc: 'Deep Research' },
  { href: '/topics', label: 'Topics', icon: '📂', desc: 'Browse by Theme' },
  { href: '/duas', label: 'Duas', icon: '🤲', desc: 'Supplications' },
  { href: '/bookmarks', label: 'Bookmarks', icon: '🔖', desc: 'Saved Ayahs' },
  { href: '/qibla', label: 'Qibla', icon: '🕌', desc: 'Prayer Times' },
];


interface SidebarNavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { toggleDrawer, isSidebarOpen, toggleSidebar, activeTheme, setActiveTheme } = useSettingsStore();
  const { currentSurahName, currentAyahNumber, isPlaying } = usePlayerStore();
  const { bookmarks } = useFeaturesStore();

  const sidebarOpen = isOpen && isSidebarOpen;

  const isDark = activeTheme === Theme.DARK;
  const toggleTheme = () => setActiveTheme(isDark ? Theme.LIGHT : Theme.DARK);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
        aria-label="Toggle menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar / Topnav */}
      <motion.div
        className={cn(
          'fixed left-0 top-0 h-screen w-64 z-40 transition-transform duration-300',
          !sidebarOpen && '-translate-x-full md:translate-x-0 md:w-64',
          'min-[1200px]:h-20 min-[1200px]:w-full min-[1200px]:translate-x-0 min-[1200px]:z-50'
        )}
        initial={false}
      >
        <div className="h-full theme-nav-bg backdrop-blur-xl border-r min-[1200px]:border-r-0 min-[1200px]:border-b border-white/[0.08] flex flex-col min-[1200px]:flex-row px-4 py-6 min-[1200px]:py-0 min-[1200px]:px-8 min-[1200px]:items-center overflow-y-auto min-[1200px]:overflow-visible">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 mb-8 min-[1200px]:mb-0 min-[1200px]:mr-8 px-2 min-[1200px]:px-0 cursor-pointer group shrink-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform">
                <Image src="/logo.png" alt="Al-Quran Logo" width={40} height={40} className="object-cover" />
              </div>
              <div className="min-[1200px]:hidden">
                <h1 className="text-base font-bold text-white leading-tight">Al-Quran</h1>
                <span className="text-xs font-medium text-islamic-gold">Interactive</span>
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1 min-[1200px]:space-y-0 min-[1200px]:flex min-[1200px]:items-center min-[1200px]:gap-1 min-[1200px]:overflow-x-auto min-[1200px]:pb-0">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              const showBadge = item.href === '/bookmarks' && bookmarks.length > 0;
              const isQibla = item.href === '/qibla';
              return (
                <Link
                  key={item.href}
                  href={item.href === '/player' ? '/player/1' : item.href}
                  className={isQibla ? 'min-[1200px]:hidden' : ''}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 group cursor-pointer relative',
                      isActive
                        ? 'bg-islamic-gold/15 border border-islamic-gold/25'
                        : 'hover:bg-white/[0.06] border border-transparent'
                    )}
                  >
                    <span className="text-base">{item.icon}</span>
                    <div className="min-w-0">
                      <span className={cn(
                        'block text-sm font-semibold whitespace-nowrap',
                        isActive ? 'text-islamic-gold' : 'text-gray-300 group-hover:text-white'
                      )}>
                        {item.label}
                      </span>
                      <span className="block text-[10px] text-gray-500 min-[1200px]:hidden">{item.desc}</span>
                    </div>
                    {showBadge && (
                      <span className="ml-auto min-[1200px]:ml-1 text-[10px] font-bold bg-islamic-gold/20 text-islamic-gold px-1.5 py-0.5 rounded-full">
                        {bookmarks.length}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="ml-auto w-1.5 h-5 rounded-full bg-islamic-gold min-[1200px]:hidden"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Now Playing Mini */}
          {currentSurahName && (
            <div className="mb-4 px-2 min-[1200px]:hidden">
              <div className="bg-white/[0.05] rounded-xl p-3 border border-white/[0.08]">
                <div className="flex items-center gap-2 mb-1">
                  {isPlaying && (
                    <div className="flex items-end gap-[2px] h-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-[2px] bg-islamic-gold rounded-full waveform-bar" style={{ height: '3px' }} />
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] text-islamic-gold font-semibold uppercase tracking-wider">
                    Now Playing
                  </span>
                </div>
                <p className="text-xs text-white font-medium truncate">{currentSurahName}</p>
                {currentAyahNumber && (
                  <p className="text-[10px] text-gray-400">Ayah {currentAyahNumber}</p>
                )}
              </div>
            </div>
          )}

          {/* Right-side controls */}
          <div className="min-[1200px]:ml-auto flex items-center gap-2 shrink-0">
            {/* 🌙/☀️ Dark/Light Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
              className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-300 transition-all hover:bg-white/[0.12] hover:text-white flex items-center justify-center text-base"
            >
              {isDark ? '🌙' : '☀️'}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleDrawer}
              className="w-full min-[1200px]:w-auto px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-300 text-sm font-medium transition-all hover:bg-white/[0.1] hover:text-white flex items-center justify-center gap-2"
            >
              <span>⚙️</span> <span className="min-[1200px]:hidden">Settings</span>
            </motion.button>
          </div>

          {/* Close (mobile) */}
          <button
            onClick={toggleSidebar}
            className="mt-3 md:hidden w-full px-3 py-2 text-gray-500 hover:text-white text-xs transition-colors"
          >
            ✕ Close Menu
          </button>
        </div>
      </motion.div>
    </>
  );
};

SidebarNavigation.displayName = 'SidebarNavigation';
