'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

function calcQiblaBearing(lat: number, lng: number): number {
  const MECCA_LAT = 21.3891 * (Math.PI / 180);
  const MECCA_LNG = 39.8579 * (Math.PI / 180);
  const userLat = lat * (Math.PI / 180);
  const dLng = MECCA_LNG - lng * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(MECCA_LAT);
  const x = Math.cos(userLat) * Math.sin(MECCA_LAT) - Math.sin(userLat) * Math.cos(MECCA_LAT) * Math.cos(dLng);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function calcDistance(lat: number, lng: number): number {
  const R = 6371;
  const MECCA_LAT = 21.3891;
  const MECCA_LNG = 39.8579;
  const dLat = ((MECCA_LAT - lat) * Math.PI) / 180;
  const dLng = ((MECCA_LNG - lng) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat * Math.PI) / 180) * Math.cos((MECCA_LAT * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function QiblaCompass() {
  const [bearing, setBearing] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'denied' | 'ready' | 'error'>('loading');
  const [heading, setHeading] = useState<number | null>(null);
  const [orientationPermission, setOrientationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  useEffect(() => {
    if (!navigator.geolocation) { setStatus('error'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setBearing(calcQiblaBearing(latitude, longitude));
        setDistance(calcDistance(latitude, longitude));
        setStatus('ready');
      },
      () => setStatus('denied'),
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    const handleOrientation = (e: any) => {
      let compassHeading = null;
      // iOS
      if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        compassHeading = e.webkitCompassHeading;
      } 
      // Android absolute
      else if (e.absolute && e.alpha !== null) {
        compassHeading = 360 - e.alpha;
      }
      // Android relative fallback
      else if (e.alpha !== null) {
        compassHeading = 360 - e.alpha;
      }

      if (compassHeading !== null) {
        setHeading(compassHeading);
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientationabsolute', handleOrientation);
      window.addEventListener('deviceorientation', handleOrientation);
      return () => {
        window.removeEventListener('deviceorientationabsolute', handleOrientation);
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, []);

  const requestOrientationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        setOrientationPermission(permissionState);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center animate-pulse">
        <div className="w-32 h-32 rounded-full bg-white/10 mb-4" />
        <div className="h-3 w-40 bg-white/10 rounded" />
      </div>
    );
  }

  if (status === 'denied' || status === 'error') {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">🧭</div>
        <h3 className="text-sm font-semibold text-white mb-1">Qibla Direction</h3>
        <p className="text-xs text-gray-400">
          {status === 'denied' ? 'Location access denied. Please enable location permission.' : 'Geolocation is not supported in this browser.'}
        </p>
      </div>
    );
  }

  // Calculate dynamic rotation for perfect arrow
  let arrowRotation = bearing ?? 0;
  let isAligned = false;
  
  if (bearing !== null && heading !== null) {
    arrowRotation = bearing - heading;
    // Normalize to -180 to 180 for simpler alignment check
    let normalizedDiff = ((arrowRotation + 540) % 360) - 180;
    if (Math.abs(normalizedDiff) < 5) {
      isAligned = true; // green if within 5 degrees
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-950/50 to-teal-950/30 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center w-full max-w-sm mx-auto"
    >
      <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">🧭 Qibla Direction</h3>
      {distance && <p className="text-[10px] text-gray-400 mb-5">{distance.toLocaleString()} km to Mecca</p>}

      {/* Main Compass */}
      <div className="relative w-36 h-36 mb-4">
        {/* Compass Rose */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 bg-black/30 flex items-center justify-center">
          {/* Cardinal Directions */}
          {['N', 'E', 'S', 'W'].map((dir, i) => {
            const angle = i * 90;
            const rad = (angle - 90) * (Math.PI / 180);
            const r = 55;
            const x = 72 + r * Math.cos(rad);
            const y = 72 + r * Math.sin(rad);
            return (
              <span key={dir} className="absolute text-[9px] font-bold text-gray-500" style={{ left: x - 4, top: y - 5 }}>
                {dir}
              </span>
            );
          })}

          {/* Kaaba indicator — rotated to Qibla bearing */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: bearing ?? 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-start pt-2"
            style={{ transformOrigin: 'center center' }}
          >
            <div className="flex flex-col items-center">
              <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-islamic-gold to-transparent" />
              <span className="text-lg -mt-1">🕋</span>
            </div>
          </motion.div>

          {/* Center dot */}
          <div className="w-3 h-3 rounded-full bg-islamic-gold z-10 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
        </div>
      </div>

      {bearing !== null && (
        <div className="text-center mb-8">
          <p className="text-2xl font-bold text-islamic-gold">{Math.round(bearing)}°</p>
          <p className="text-[10px] text-gray-400">from North</p>
        </div>
      )}

      {/* Perfect Direction Arrow */}
      {bearing !== null && (
        <div className="mt-8 w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-8 flex flex-col items-center">
          {/* Subtle background glow when aligned */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${isAligned ? 'bg-emerald-900/20 opacity-100' : 'opacity-0'}`} />
          
          <h4 className="text-sm font-semibold text-white mb-6 z-10 flex items-center gap-2">
            Align Your Device
            {isAligned && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                ✓
              </motion.span>
            )}
          </h4>
          
          <div className="relative w-48 h-48 flex items-center justify-center z-10 mb-2">
            {/* Concentric rings */}
            <div className={`absolute inset-0 rounded-full border transition-all duration-700 ${isAligned ? 'border-emerald-500/40 bg-emerald-500/[0.05]' : 'border-white/10'}`} />
            <div className={`absolute inset-4 rounded-full border border-dashed transition-all duration-700 ${isAligned ? 'border-emerald-500/30' : 'border-white/10'}`} />
            <div className={`absolute inset-10 rounded-full border transition-all duration-700 ${isAligned ? 'border-emerald-500/20' : 'border-white/5'}`} />
            
            {/* Dynamic Arrow */}
            <motion.div
              animate={{ rotate: arrowRotation }}
              transition={{ type: 'spring', stiffness: 45, damping: 15 }}
              className="absolute inset-0 flex flex-col items-center justify-start pt-3"
            >
              {/* Elegant navigation arrow */}
              <svg 
                width="56" 
                height="56" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-500 drop-shadow-xl ${isAligned ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-islamic-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]'}`}
              >
                <path d="M12 2L21 21L12 17.5L3 21L12 2Z" fill="currentColor" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
              </svg>
            </motion.div>
            
            {/* Center point */}
            <div className={`w-2 h-2 rounded-full transition-colors duration-500 z-10 ${isAligned ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-white/30'}`} />
          </div>

          <p className="text-[11px] text-gray-400 text-center max-w-[220px] z-10 mt-4">
            {typeof window !== 'undefined' && !window.isSecureContext ? (
              <span className="text-red-400">Compass requires a secure connection (HTTPS or localhost).</span>
            ) : heading !== null ? (
              isAligned ? "Perfect alignment detected." : "Rotate your phone until the arrow points straight up."
            ) : (
              "Waiting for device compass sensor..."
            )}
          </p>
          
          {typeof window !== 'undefined' && window.isSecureContext && typeof (DeviceOrientationEvent as any)?.requestPermission === 'function' && orientationPermission !== 'granted' && (
            <button 
              onClick={requestOrientationPermission}
              className="mt-5 relative z-10 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] rounded-full transition-all"
            >
              Enable Sensor
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
