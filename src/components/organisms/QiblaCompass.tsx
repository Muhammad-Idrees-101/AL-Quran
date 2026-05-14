'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Mecca coords (Kaaba) ───────────────────────────────────────
const MECCA = { lat: 21.4225, lng: 39.8262 };

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Great-circle bearing from user to Mecca (degrees from True North, 0–360) */
function calcQiblaBearing(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(MECCA.lat);
  const Δλ = toRad(MECCA.lng - lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Haversine distance (km) */
function calcDistance(lat: number, lng: number): number {
  const R = 6371;
  const dLat = toRad(MECCA.lat - lat);
  const dLng = toRad(MECCA.lng - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(MECCA.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/** Smooth an angle stream to avoid 359→1 jumps */
function smoothAngle(prev: number, next: number): number {
  let diff = ((next - prev + 540) % 360) - 180;
  return (prev + diff * 0.2 + 360) % 360;
}

export function QiblaCompass() {
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [geoStatus, setGeoStatus] = useState<'loading' | 'denied' | 'ready' | 'error'>('loading');

  // Device compass heading (degrees True North that the top of the phone points to)
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const headingRef = useRef<number | null>(null);

  // Permission state for iOS 13+
  const [needsPermission, setNeedsPermission] = useState(false);

  // ── 1. GPS + Qibla bearing ──────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setQiblaBearing(calcQiblaBearing(latitude, longitude));
        setDistance(calcDistance(latitude, longitude));
        setGeoStatus('ready');

        // Reverse-geocode for city name
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const d = await r.json();
          const city =
            d?.address?.city ||
            d?.address?.town ||
            d?.address?.village ||
            d?.address?.county ||
            '';
          const country = d?.address?.country_code?.toUpperCase() || '';
          setLocationName(city ? `${city}, ${country}` : country);
        } catch {
          // fine — location name is optional
        }
      },
      () => setGeoStatus('denied'),
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // ── 2. Device orientation / compass ────────────────────────
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    let heading: number | null = null;

    // iOS provides webkitCompassHeading (already True North corrected)
    if (typeof (e as any).webkitCompassHeading === 'number') {
      heading = (e as any).webkitCompassHeading;
    }
    // Android (absolute = true): alpha is CCW from True North
    else if ((e as DeviceOrientationEvent & { absolute?: boolean }).absolute && e.alpha !== null) {
      heading = (360 - e.alpha) % 360;
    }
    // Android fallback (may be magnetic, not true north)
    else if (e.alpha !== null) {
      heading = (360 - e.alpha!) % 360;
    }

    if (heading !== null) {
      const smoothed = headingRef.current !== null
        ? smoothAngle(headingRef.current, heading)
        : heading;
      headingRef.current = smoothed;
      setDeviceHeading(smoothed);
    }
  }, []);

  const startOrientation = useCallback(() => {
    window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    window.addEventListener('deviceorientation', handleOrientation as EventListener, true);
  }, [handleOrientation]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // iOS 13+ requires explicit permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setNeedsPermission(true);
      return; // wait for user tap
    }

    startOrientation();
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
      window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
    };
  }, [handleOrientation, startOrientation]);

  const requestPermission = useCallback(async () => {
    try {
      const result = await (DeviceOrientationEvent as any).requestPermission();
      if (result === 'granted') {
        setNeedsPermission(false);
        startOrientation();
      }
    } catch (err) {
      console.error('Orientation permission error', err);
    }
  }, [startOrientation]);

  // ── Derived values ──────────────────────────────────────────
  // The needle should point to Qibla relative to screen (which might be rotated)
  // needleAngle = qiblaBearing - deviceHeading
  // If no device heading → show static bearing from North
  const needleAngle =
    qiblaBearing !== null && deviceHeading !== null
      ? ((qiblaBearing - deviceHeading + 360) % 360)
      : (qiblaBearing ?? 0);

  const isAligned =
    qiblaBearing !== null &&
    deviceHeading !== null &&
    Math.abs(((needleAngle + 180) % 360) - 180) < 5;

  // The compass rose rotates OPPOSITE to device heading so North always faces up
  const roseRotation = deviceHeading !== null ? -deviceHeading : 0;

  // ── Loading ─────────────────────────────────────────────────
  if (geoStatus === 'loading') {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center gap-3 animate-pulse">
        <div className="w-40 h-40 rounded-full bg-white/[0.06]" />
        <div className="h-3 w-32 bg-white/[0.06] rounded" />
        <div className="h-3 w-24 bg-white/[0.06] rounded" />
      </div>
    );
  }

  if (geoStatus === 'denied' || geoStatus === 'error') {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">🧭</div>
        <h3 className="text-sm font-semibold text-white mb-2">Qibla Direction</h3>
        <p className="text-xs text-gray-400 max-w-[220px] mx-auto">
          {geoStatus === 'denied'
            ? 'Location access denied. Please allow location permission in your browser settings and refresh.'
            : 'Geolocation is not supported in this browser.'}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border border-emerald-500/25 rounded-2xl p-6 flex flex-col items-center w-full"
    >
      {/* Header */}
      <h3 className="text-sm font-bold text-white mb-0.5 flex items-center gap-2 self-start">
        🧭 Qibla Direction
      </h3>
      <p className="text-[10px] text-gray-400 mb-5 self-start">
        {locationName || 'Your Location'} &nbsp;•&nbsp; {distance?.toLocaleString()} km to Mecca
      </p>

      {/* ── Compass Rose ─────────────────────────────── */}
      <div className="relative w-52 h-52 mb-4">
        {/* Outer glow ring */}
        <div className={`absolute inset-0 rounded-full blur-md transition-all duration-700 ${isAligned ? 'bg-emerald-500/20' : 'bg-emerald-900/10'}`} />

        {/* Compass plate — rotates with device so N always faces up on screen */}
        <motion.div
          animate={{ rotate: roseRotation }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          className="absolute inset-0 rounded-full border-2 border-white/10 bg-black/40"
          style={{ transformOrigin: 'center center' }}
        >
          {/* Cardinal labels */}
          {['N', 'E', 'S', 'W'].map((dir, i) => {
            const angle = i * 90;
            const rad = toRad(angle - 90);
            const r = 84;
            const cx = 104 + r * Math.cos(rad);
            const cy = 104 + r * Math.sin(rad);
            return (
              <span
                key={dir}
                className={`absolute text-[11px] font-black ${dir === 'N' ? 'text-red-400' : 'text-gray-500'}`}
                style={{ left: cx - 5, top: cy - 6 }}
              >
                {dir}
              </span>
            );
          })}

          {/* Degree tick marks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const rad = toRad(angle - 90);
            const isMajor = angle % 90 === 0;
            const r1 = isMajor ? 70 : 74;
            const r2 = 80;
            const x1 = 104 + r1 * Math.cos(rad);
            const y1 = 104 + r1 * Math.sin(rad);
            const x2 = 104 + r2 * Math.cos(rad);
            const y2 = 104 + r2 * Math.sin(rad);
            return (
              <svg key={i} className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isMajor ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}
                  strokeWidth={isMajor ? 1.5 : 0.8}
                />
              </svg>
            );
          })}
        </motion.div>

        {/* Qibla needle — always points to Mecca regardless of device rotation */}
        <motion.div
          animate={{ rotate: needleAngle }}
          transition={{ type: 'spring', stiffness: 40, damping: 12 }}
          className="absolute inset-0 flex flex-col items-center"
          style={{ transformOrigin: 'center center' }}
        >
          {/* Needle up half (toward Mecca) */}
          <div className="flex flex-col items-center pt-4">
            <div
              className={`w-1.5 h-16 rounded-full transition-colors duration-500 ${
                isAligned ? 'bg-gradient-to-b from-emerald-400 to-emerald-600' : 'bg-gradient-to-b from-islamic-gold to-amber-600'
              }`}
            />
            <span className="text-xl -mt-1">🕋</span>
          </div>
          {/* Needle down half (opposite) */}
          <div className="absolute bottom-4 flex flex-col items-center">
            <div className="w-1 h-10 rounded-full bg-gradient-to-t from-white/10 to-transparent" />
          </div>
        </motion.div>

        {/* Center dot */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-10 transition-colors duration-500 ${
          isAligned ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]' : 'bg-islamic-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]'
        }`} />
      </div>

      {/* Bearing readout */}
      <div className="text-center mb-4">
        <p className={`text-2xl font-bold tabular-nums ${isAligned ? 'text-emerald-400' : 'text-islamic-gold'}`}>
          {Math.round(qiblaBearing ?? 0)}°
        </p>
        <p className="text-[10px] text-gray-500">from True North</p>
      </div>

      {/* Status / instruction */}
      <AnimatePresence mode="wait">
        {isAligned ? (
          <motion.div
            key="aligned"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 text-emerald-400 text-[11px] font-bold"
          >
            <span className="text-base">✅</span> Facing Mecca — Perfect Alignment!
          </motion.div>
        ) : (
          <motion.p
            key="instruction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[11px] text-gray-400 text-center max-w-[220px]"
          >
            {deviceHeading !== null
              ? 'Rotate your device until the 🕋 needle points straight up'
              : needsPermission
              ? 'Tap the button below to enable the compass sensor'
              : 'Waiting for device compass sensor…'}
          </motion.p>
        )}
      </AnimatePresence>

      {/* iOS permission button */}
      {needsPermission && (
        <button
          onClick={requestPermission}
          className="mt-4 px-5 py-2 bg-islamic-gold/10 hover:bg-islamic-gold/20 border border-islamic-gold/30 text-islamic-gold text-[11px] font-semibold rounded-full transition-all"
        >
          Enable Compass Sensor
        </button>
      )}
    </motion.div>
  );
}
