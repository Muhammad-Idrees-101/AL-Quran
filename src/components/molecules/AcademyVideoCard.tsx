'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video } from '@/types/quran';
import { GlassPanel, Badge, Button } from '@/components/atoms';
import { cn } from '@/utils/cn';

interface AcademyVideoCardProps {
  video: Video;
  onPlayClick?: () => void;
  onGoToAyahClick?: (surahId: number, ayahNumber: number) => void;
}

function formatDuration(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const AcademyVideoCard: React.FC<AcademyVideoCardProps> = ({
  video, onPlayClick, onGoToAyahClick,
}) => {
  const [showEmbed, setShowEmbed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumb = video.thumbnail || 'https://archive.org/services/img/QuranTafseerInUrduFULLDr.IsrarAhmed';

  // When the modal opens, seek to startTime (NO autoplay)
  useEffect(() => {
    if (showEmbed && videoRef.current && video.startTime) {
      videoRef.current.currentTime = video.startTime;
    }
  }, [showEmbed, video.startTime]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowEmbed(false);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="h-full"
      >
        <div className="h-full bg-white/[0.05] backdrop-blur-md border border-white/[0.1] rounded-2xl overflow-hidden hover:border-white/[0.2] transition-all duration-300 hover:shadow-glass-hover flex flex-col">
          {/* Thumbnail */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-islamic-emerald/20 to-islamic-gold/10 overflow-hidden group cursor-pointer"
            onClick={() => setShowEmbed(true)}>
            <img src={thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-islamic-gold/90 rounded-full flex items-center justify-center shadow-glow-gold">
                <svg className="w-6 h-6 text-dark-slate ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>

            {/* Duration */}
            <div className="absolute bottom-2 right-2">
              <Badge variant="slate" size="sm">{formatDuration(video.duration)}</Badge>
            </div>

            {/* Category */}
            <div className="absolute top-2 left-2">
              <Badge variant="emerald" size="sm">{video.category}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1 gap-3">
            <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{video.title}</h3>

            {/* Scholar */}
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white',
                video.scholar.color
              )}>
                {video.scholar.initials}
              </div>
              <div>
                <p className="text-xs text-gray-300 font-medium">{video.scholar.name}</p>
                {video.views && <p className="text-[10px] text-gray-500">{video.views}</p>}
              </div>
            </div>

            <p className="text-xs text-gray-500 line-clamp-2 flex-1">{video.description}</p>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="glass" onClick={() => setShowEmbed(true)} className="flex-1">
                ▶ Watch
              </Button>
              {video.linkedAyahs && video.linkedAyahs.length > 0 && (
                <Button size="sm" variant="gold"
                  onClick={() => onGoToAyahClick?.(video.linkedAyahs[0].surahId, video.linkedAyahs[0].ayahNumber)}
                  className="flex-1">
                  🔗 Go to {video.linkedAyahs[0].label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Modal — supports Archive.org HTML5 and YouTube iframe, NO autoplay */}
      <AnimatePresence>
        {showEmbed && (video.videoUrl || video.youtubeId) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl rounded-2xl overflow-hidden border border-white/[0.15] relative bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button onClick={handleClose}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 text-gray-300 hover:text-white flex items-center justify-center text-sm transition-colors">
                ✕
              </button>

              {/* Video Title Bar */}
              <div className="theme-bg-gradient px-5 py-3 border-b border-white/[0.08]">
                <h3 className="text-sm font-semibold text-white truncate">{video.title}</h3>
                <p className="text-[10px] text-gray-500">{video.scholar.name}</p>
              </div>

              {/* Player: Archive.org HTML5 or YouTube iframe */}
              {video.videoUrl ? (
                <video
                  ref={videoRef}
                  controls
                  preload="metadata"
                  className="w-full aspect-video bg-black"
                  src={video.videoUrl + (video.startTime ? `#t=${video.startTime}` : '')}
                >
                  Your browser does not support the video tag.
                </video>
              ) : video.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
                  className="w-full aspect-video"
                  allow="encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

AcademyVideoCard.displayName = 'AcademyVideoCard';
