'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@/components/atoms';
import { SURAHS } from '@/lib/mockData';
import { cn } from '@/utils/cn';
import drIsrarData from '@/data/dr_israr_tafseer.json';
import muftiTariqData from '@/data/mufti_tariq_masood_tafseer.json';
import muftiMenkData from '@/data/mufti_menk_tafseer.json';
import noumanAliKhanData from '@/data/nouman_ali_khan_tafseer.json';

const SCHOLARS = [
  {
    id: 'israr-ahmed',
    name: 'Dr. Israr Ahmed',
    bio: 'Renowned Islamic scholar. His Bayan-ul-Quran is one of the most comprehensive Urdu Tafseers.',
    initials: 'IA',
    image: 'https://upload.wikimedia.org/wikipedia/en/2/2f/Dr.Israr_Ahmed.jpg',
    color: 'bg-islamic-emerald',
    expertise: ['Tafseer', 'Islamic Revival'],
    videoCount: 108,
    data: drIsrarData
  },
  {
    id: 'tariq-masood',
    name: 'Mufti Tariq Masood',
    bio: 'Engaging Islamic scholar. This "Short Summary" series provides a concise yet profound explanation of the Quranic verses.',
    initials: 'TM',
    image: 'https://kulyatushariah.edu.pk/wp-content/uploads/2024/03/Mufti-tariq-masood-sab.jpg',
    color: 'bg-islamic-gold',
    expertise: ['Fiqh', 'Social Issues', 'Summary Tafseer'],
    videoCount: 126,
    data: muftiTariqData
  },
  {
    id: 'mufti-menk',
    name: 'Mufti Menk',
    bio: 'A world-renowned motivational speaker and scholar. His "Stories of the Prophets" series is legendary for its spiritual depth.',
    initials: 'MM',
    image: 'https://unavatar.io/twitter/muftimenk',
    color: 'bg-blue-600',
    expertise: ['Spirituality', 'Stories of Prophets'],
    videoCount: 20,
    data: muftiMenkData
  },
  {
    id: 'nouman-ali-khan',
    name: 'Nouman Ali Khan',
    bio: 'Founder of Bayyinah Institute. Known for his "Amazed by the Quran" series, exploring the linguistic beauty of the Quran.',
    initials: 'NK',
    image: 'https://unavatar.io/twitter/noumanbayyinah',
    color: 'bg-indigo-600',
    expertise: ['Linguistics', 'Quranic Miracles'],
    videoCount: 20,
    data: noumanAliKhanData
  }
];

export default function AcademyPage() {
  const router = useRouter();
  const [selectedScholarId, setSelectedScholarId] = useState(SCHOLARS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const selectedScholar = SCHOLARS.find(s => s.id === selectedScholarId)!;

  const filteredVideos = selectedScholar.data.filter((v: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const surahMatch = v.surahName ? v.surahName.toLowerCase().includes(q) : false;
    const titleMatch = v.title ? v.title.toLowerCase().includes(q) : false;
    const lectureMatch = String(v.lectureNumber) === searchQuery;
    const surahIdMatch = String(v.surahId) === searchQuery;
    return surahMatch || titleMatch || lectureMatch || surahIdMatch;
  });

  const handleClose = () => {
    if (videoRef.current) videoRef.current.pause();
    setActiveVideo(null);
    setIsVideoLoading(false);
  };

  const handleVideoSelect = (video: any) => {
    setActiveVideo(video);
    setIsVideoLoading(true);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="px-4 md:px-8 pt-12 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-islamic-gold/5 blur-[100px] rounded-full -mr-32 -mt-32" />
        <button onClick={() => router.push('/')} className="text-xs text-gray-500 hover:text-white mb-3 flex items-center gap-1 transition-colors">
          ← Back
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Video <span className="gradient-text-gold">Academy</span></h1>
        <p className="text-gray-400 text-lg">Master the Quran with guided lectures from elite scholars.</p>
      </motion.section>

      {/* Scholar Switcher */}
      <section className="px-4 md:px-8 py-4 mb-4">
        <div className="grid grid-cols-2 sm:flex p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl w-fit backdrop-blur-xl gap-1">
          {SCHOLARS.map(scholar => (
            <button
              key={scholar.id}
              onClick={() => {
                setSelectedScholarId(scholar.id);
                setSearchQuery('');
              }}
              className={cn(
                "px-4 sm:px-8 py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-[transform,shadow] duration-200 whitespace-nowrap",
                selectedScholarId === scholar.id
                  ? "bg-islamic-gold text-dark-slate shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
              )}
            >
              {scholar.name}
            </button>
          ))}
        </div>
      </section>

      {/* Selected Scholar Info */}
      <section className="px-4 md:px-8 py-4">
        <motion.div
          key={selectedScholarId}
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="relative bg-gradient-to-br from-white/[0.05] to-transparent rounded-3xl p-6 md:p-8 border border-white/[0.08] flex items-center gap-6 md:gap-8 flex-wrap overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="text-9xl font-black">{selectedScholar.initials}</span>
          </div>
          <div className={cn(
            "w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl relative z-10 overflow-hidden border-2 transition-[transform,shadow] duration-200 border-islamic-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]",
            selectedScholar.color
          )}>
            {selectedScholar.image ? (
              <img src={selectedScholar.image} alt={selectedScholar.name} className="w-full h-full object-cover" />
            ) : (
              selectedScholar.initials
            )}
          </div>
          <div className="flex-1 min-w-[280px] relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-white">{selectedScholar.name}</h2>
              <div className="h-px w-8 bg-white/10" />
              <Badge variant="gold" size="sm" className="bg-islamic-gold/10 border-islamic-gold/20 text-islamic-gold">Verified Scholar</Badge>
            </div>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed max-w-2xl">{selectedScholar.bio}</p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {selectedScholar.expertise.map(e => (
                <Badge key={e} variant="emerald" size="sm" className="bg-islamic-emerald/10 border-islamic-emerald/20">{e}</Badge>
              ))}
              <Badge variant="slate" size="sm" className="bg-white/5 border-white/10">{selectedScholar.videoCount} Episodes</Badge>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Search + Stats */}
      <section className="px-4 md:px-8 py-6 border-y border-white/[0.06] bg-white/[0.04] sticky top-20 z-30 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-islamic-gold rounded-full" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Archive Library</p>
              <p className="text-sm text-white font-bold">{filteredVideos.length} Available Lectures</p>
            </div>
          </div>
          <div className="relative group w-full sm:w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-islamic-gold transition-colors">🔍</span>
            <input
              type="text" placeholder={`Search ${selectedScholar.name.split(' ').pop()}'s series...`}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.1] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-islamic-gold/30 focus:bg-white/[0.08] w-full transition-all"
            />
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="px-4 md:px-8 py-12">
        <AnimatePresence mode="wait">
          {filteredVideos.length > 0 ? (
            <motion.div
              key={`${selectedScholarId}-${searchQuery}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredVideos.map((video: any, i: number) => {
                const surah = SURAHS.find(s => s.id === video.surahId);
                return (
                  <motion.div key={video.youtubeId || `vid-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.01, 0.3) }}
                  >
                    <motion.div whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }}
                      className="group bg-white/[0.03] border border-white/[0.05] rounded-[2rem] overflow-hidden hover:border-islamic-gold/40 transition-[transform,shadow] duration-300 cursor-pointer shadow-2xl relative"
                      onClick={() => handleVideoSelect(video)}
                    >
                      {/* Thumbnail Area */}
                      <div className="aspect-video bg-white/[0.02] relative flex items-center justify-center overflow-hidden">
                        {selectedScholarId !== 'israr-ahmed' && video.youtubeId ? (
                          <div className="w-full h-full relative">
                            <img
                              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                              alt={video.title || video.surahName}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-islamic-emerald/20 to-islamic-gold/10 hidden flex-col items-center justify-center">
                              <span className="text-6xl font-black text-white/10 tracking-tighter">{video.surahId || video.lectureNumber}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-islamic-emerald/20 to-islamic-gold/10 flex flex-col items-center justify-center">
                            <span className="text-6xl font-black text-white/10 tracking-tighter">{video.surahId || video.lectureNumber}</span>
                            {!video.surahId && <span className="text-[10px] text-white/20 font-bold uppercase mt-2">Lecture</span>}
                          </div>
                        )}

                        {/* Glass Overlay for Metadata */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <div className="w-16 h-16 bg-islamic-gold rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_40px_rgba(212,175,55,0.5)]">
                            <svg className="w-7 h-7 text-dark-slate ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        <div className="absolute top-4 left-4">
                          <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-islamic-gold animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                              {selectedScholarId === 'israr-ahmed' ? `Lec #${video.lectureNumber}` : `Class #${video.lectureNumber}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-lg overflow-hidden border border-islamic-gold",
                            selectedScholar.color
                          )}>
                            {selectedScholar.image ? (
                              <img src={selectedScholar.image} alt={selectedScholar.name} className="w-full h-full object-cover" />
                            ) : (
                              selectedScholar.initials
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">{selectedScholar.name}</span>
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-white leading-snug group-hover:text-islamic-gold transition-colors line-clamp-2 min-h-[48px]">
                          {video.title || `Surah ${video.surahName}`}
                        </h3>

                        <div className="mt-6 pt-5 border-t border-white/[0.04] flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Content</span>
                            <span className="text-[11px] text-gray-400 font-bold">
                              {surah ? `${surah.name_arabic}` : 'Tafseer Series'}
                            </span>
                          </div>
                          <motion.div whileHover={{ x: 5 }} className="text-islamic-gold">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-32">
              <div className="text-7xl mb-8 grayscale opacity-20">🕮</div>
              <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">No results for your search</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">We couldn't find any lectures matching your criteria for {selectedScholar.name}.</p>
              <Button variant="gold" size="lg" className="mt-10 rounded-2xl px-10" onClick={() => setSearchQuery('')}>Clear Filter</Button>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Premium Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-0 md:p-8"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 40 }}
              className="w-full max-w-6xl h-full md:h-auto md:aspect-video rounded-none md:rounded-[2.5rem] overflow-hidden border-0 md:border md:border-white/10 relative bg-black shadow-[0_0_150px_rgba(0,0,0,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar Overlay */}
              <div className="absolute top-0 left-0 right-0 z-20 px-8 py-6 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent">
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-2xl overflow-hidden transition-[transform,shadow] duration-300 border-islamic-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]",
                    selectedScholar.color
                  )}>
                    {selectedScholar.image ? (
                      <img src={selectedScholar.image} alt={selectedScholar.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-base font-black text-white">{selectedScholar.initials}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm md:text-lg font-black text-white tracking-tight">
                      {activeVideo.title || `Surah ${activeVideo.surahName}`}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] md:text-xs text-islamic-gold font-bold uppercase tracking-widest">Lecture #{activeVideo.lectureNumber}</span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <p className="text-[10px] md:text-xs text-gray-400 font-medium">{selectedScholar.name}</p>
                    </div>
                  </div>
                </div>
                <button onClick={handleClose}
                  className="w-12 h-12 rounded-2xl bg-white/5 text-white hover:bg-white/15 flex items-center justify-center transition-all backdrop-blur-xl border border-white/10 group">
                  <span className="group-hover:rotate-90 transition-transform duration-300">✕</span>
                </button>
              </div>

              {/* Loading Overlay */}
              {isVideoLoading && !activeVideo.youtubeId && (
                <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 border-[6px] border-islamic-gold/10 border-t-islamic-gold rounded-full animate-spin mb-6 shadow-[0_0_50px_rgba(212,175,55,0.2)]" />
                  <p className="text-islamic-gold font-black text-lg tracking-[0.3em] animate-pulse uppercase">Syncing Stream</p>
                  <p className="text-gray-500 text-xs mt-3 font-medium">Fetching lecture from high-priority servers...</p>
                </div>
              )}

              {/* Player Area */}
              <div className="w-full h-full md:aspect-video bg-black flex items-center justify-center">
                {activeVideo.youtubeId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&showinfo=0`}
                    title={activeVideo.title || `Surah ${activeVideo.surahName}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setIsVideoLoading(false)}
                  />
                ) : activeVideo.videoUrl ? (
                  <video
                    ref={videoRef}
                    controls
                    autoPlay
                    preload="auto"
                    onLoadStart={() => setIsVideoLoading(true)}
                    onCanPlay={() => setIsVideoLoading(false)}
                    onWaiting={() => setIsVideoLoading(true)}
                    onPlaying={() => setIsVideoLoading(false)}
                    onError={() => {
                      setIsVideoLoading(false);
                      console.error("Video failed to load:", activeVideo.videoUrl);
                    }}
                    className="w-full h-full"
                    src={activeVideo.videoUrl + (activeVideo.startTime ? `#t=${activeVideo.startTime}` : '')}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-500 mb-4">Video source not found</p>
                    <Button variant="glass" onClick={handleClose}>Close Player</Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
