'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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

const MOBILE_BOTTOM_NAV = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/player', label: 'Quran', icon: '📖' },
  { href: '/qibla', label: 'Qibla', icon: '🕌' },
  { href: '/bookmarks', label: 'Saved', icon: '🔖' },
];

export const SidebarNavigation: React.FC = () => {
  const pathname = usePathname();
  const { toggleDrawer, activeTheme, setActiveTheme } = useSettingsStore();
  const { currentSurahName, isPlaying } = usePlayerStore();
  const { bookmarks } = useFeaturesStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = activeTheme === Theme.DARK;
  const toggleTheme = () => setActiveTheme(isDark ? Theme.LIGHT : Theme.DARK);

  return (
    <>
      {/* =========================================
          MOBILE LAYOUT (Hidden on md and up)
      ========================================= */}
      <div className="md:hidden">
        {/* Mobile Top Header */}
        <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-black/40 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden relative">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Al-Quran</h1>
              <span className="text-[10px] font-medium text-islamic-gold">Interactive</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-sm"
            >
              {isDark ? '🌙' : '☀️'}
            </button>
            {/* Settings Toggle */}
            <button
              onClick={toggleDrawer}
              className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-sm"
            >
              ⚙️
            </button>
            {/* More Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile "More" Fullscreen Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 top-16 bottom-16 z-30 bg-black/95 backdrop-blur-3xl overflow-y-auto p-4 border-t border-white/[0.05]"
            >
              <div className="grid grid-cols-2 gap-3 pb-6">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={`more-${item.href}`}
                      href={item.href === '/player' ? '/player/1' : item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className={cn(
                        'flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all',
                        isActive 
                          ? 'bg-islamic-gold/15 border-islamic-gold/30 text-islamic-gold' 
                          : 'bg-white/[0.03] border-white/[0.05] text-gray-300'
                      )}>
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Now Playing Mini Pill */}
        <AnimatePresence>
          {currentSurahName && !mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 left-4 right-4 z-30 bg-teal-950/80 backdrop-blur-md border border-teal-500/30 rounded-2xl p-2.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {isPlaying ? (
                  <div className="flex items-end gap-0.5 h-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-[2px] bg-islamic-gold rounded-full waveform-bar" style={{ height: '3px' }} />
                    ))}
                  </div>
                ) : (
                  <span className="text-sm">⏸️</span>
                )}
                <div>
                  <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wide leading-none mb-0.5">Now Playing</p>
                  <p className="text-xs text-white font-medium leading-none">{currentSurahName}</p>
                </div>
              </div>
              <Link href="/player/1" className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white">Open</Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Sticky Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 z-40 bg-black/80 backdrop-blur-xl border-t border-white/[0.08] flex items-center justify-around px-2 pb-safe">
          {MOBILE_BOTTOM_NAV.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={`bottom-${item.href}`} href={item.href === '/player' ? '/player/1' : item.href} className="w-16 h-full flex flex-col items-center justify-center gap-1">
                <span className={cn('text-xl transition-transform duration-300', isActive && 'scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]')}>
                  {item.icon}
                </span>
                <span className={cn('text-[9px] font-bold transition-colors duration-300', isActive ? 'text-islamic-gold' : 'text-gray-500')}>
                  {item.label}
                </span>
                {item.href === '/bookmarks' && bookmarks.length > 0 && (
                  <span className="absolute top-2 right-3 w-3 h-3 bg-red-500 rounded-full border border-black text-[7px] text-white flex items-center justify-center font-bold">
                    {bookmarks.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* =========================================
          DESKTOP LAYOUT (Hidden on < md)
      ========================================= */}
      <motion.div
        className="hidden md:flex fixed left-0 top-0 h-screen w-64 z-40 min-[1200px]:h-20 min-[1200px]:w-full min-[1200px]:flex-col"
        initial={false}
      >
        <div className="h-full theme-nav-bg backdrop-blur-xl border-r min-[1200px]:border-r-0 min-[1200px]:border-b border-white/[0.08] flex flex-col min-[1200px]:flex-row px-4 py-6 min-[1200px]:py-0 min-[1200px]:px-8 min-[1200px]:items-center overflow-y-auto min-[1200px]:overflow-visible">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 mb-8 min-[1200px]:mb-0 min-[1200px]:mr-8 px-2 min-[1200px]:px-0 cursor-pointer group shrink-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform relative">
                <Image src="/logo.png" alt="Al-Quran Logo" fill className="object-cover" />
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
                  key={`desktop-${item.href}`}
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
                        layoutId="nav-indicator-desktop"
                        className="ml-auto w-1.5 h-5 rounded-full bg-islamic-gold min-[1200px]:hidden"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Right-side controls */}
          <div className="min-[1200px]:ml-auto flex items-center gap-2 shrink-0 mt-auto min-[1200px]:mt-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
              className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-300 transition-all hover:bg-white/[0.12] hover:text-white flex items-center justify-center text-base"
            >
              {isDark ? '🌙' : '☀️'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleDrawer}
              className="w-full min-[1200px]:w-auto px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-300 text-sm font-medium transition-all hover:bg-white/[0.1] hover:text-white flex items-center justify-center gap-2"
            >
              <span>⚙️</span> <span className="min-[1200px]:hidden">Settings</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

SidebarNavigation.displayName = 'SidebarNavigation';
