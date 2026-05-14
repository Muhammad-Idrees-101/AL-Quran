'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

interface PrayerData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  city: string;
  country: string;
  date: string; // YYYY-MM-DD — used to detect day change
}

// Strip timezone suffix e.g. "15:45 (+05)" → "15:45"
function cleanTime(t: string) {
  return t.split(' ')[0];
}

function to12h(t: string) {
  const [h, m] = cleanTime(t).split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function parseToDate(t: string): Date {
  const [h, m] = cleanTime(t).split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getNextPrayer(prayers: PrayerTime[]): { name: string; time: string; minutesLeft: number } | null {
  const now = new Date();
  for (const p of prayers) {
    const t = parseToDate(p.time);
    if (t > now) {
      return {
        name: p.name,
        time: to12h(p.time),
        minutesLeft: Math.round((t.getTime() - now.getTime()) / 60000),
      };
    }
  }
  // All prayers done today — next is Fajr tomorrow
  const fajr = prayers[0];
  const tomorrow = parseToDate(fajr.time);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    name: 'Fajr',
    time: to12h(fajr.time),
    minutesLeft: Math.round((tomorrow.getTime() - now.getTime()) / 60000),
  };
}

async function fetchPrayerTimes(): Promise<PrayerData> {
  let lat = 21.3891;
  let lng = 39.8579;
  let city = 'Mecca';
  let country = 'Saudi Arabia';

  // 1. GPS
  try {
    if (navigator?.geolocation) {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000, maximumAge: 300000 })
      );
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      city = 'Your Location';
      country = '';

      // Reverse geocode for real city name
      try {
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const geoData = await geo.json();
        city =
          geoData?.address?.city ||
          geoData?.address?.town ||
          geoData?.address?.village ||
          geoData?.address?.county ||
          'Your Location';
        country = geoData?.address?.country || '';
      } catch {
        // keep "Your Location"
      }
    }
  } catch {
    // 2. IP-based fallback
    try {
      const ipRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const ipData = await ipRes.json();
      if (ipData.latitude && ipData.longitude) {
        lat = parseFloat(ipData.latitude);
        lng = parseFloat(ipData.longitude);
        city = ipData.city || ipData.country || 'Your Location';
        country = ipData.country || '';
      }
    } catch {
      // keep Mecca fallback
    }
  }

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // method=2: ISNA, method=1: Karachi, method=4: Umm al-Qura (Mecca)
  // We auto-detect method by letting Aladhan choose based on location
  const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=2&school=0`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('API error');
  const json = await res.json();
  const t = json?.data?.timings;
  if (!t) throw new Error('No timings data');

  return {
    Fajr: t.Fajr,
    Sunrise: t.Sunrise,
    Dhuhr: t.Dhuhr,
    Asr: t.Asr,
    Maghrib: t.Maghrib,
    Isha: t.Isha,
    city,
    country,
    date: todayStr(),
  };
}

export function PrayerTimesWidget() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0); // re-render every minute for countdown

  // Load prayer times — refresh if day changes
  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(false);
      try {
        const result = await fetchPrayerTimes();
        if (mounted) setData(result);
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    // Check every minute if day has changed → reload
    const interval = setInterval(() => {
      setTick((n) => n + 1);
      if (data && data.date !== todayStr()) {
        load();
      }
    }, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prayers: PrayerTime[] = data
    ? [
        { name: 'Fajr', time: data.Fajr, icon: '🌙' },
        { name: 'Dhuhr', time: data.Dhuhr, icon: '☀️' },
        { name: 'Asr', time: data.Asr, icon: '🌤️' },
        { name: 'Maghrib', time: data.Maghrib, icon: '🌅' },
        { name: 'Isha', time: data.Isha, icon: '🌃' },
      ]
    : [];

  const next = prayers.length > 0 ? getNextPrayer(prayers) : null;

  if (loading) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-4 w-6 bg-white/10 rounded" />
          <div className="h-4 w-28 bg-white/10 rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/10 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 text-center py-8">
        <p className="text-2xl mb-2">🕌</p>
        <p className="text-sm text-gray-400 font-medium">Prayer times unavailable</p>
        <p className="text-[11px] text-gray-600 mt-1">Please check your internet connection</p>
      </div>
    );
  }

  const locationLabel = data.country ? `${data.city}, ${data.country}` : data.city;
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-950/50 to-blue-950/30 border border-indigo-500/20 rounded-2xl p-5"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-5 gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">🕌 Prayer Times</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            📍 {locationLabel} &nbsp;•&nbsp; {dateLabel}
          </p>
        </div>

        {/* Next Prayer Countdown */}
        {next && (
          <motion.div
            key={next.name + tick}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-islamic-gold/10 border border-islamic-gold/25 rounded-xl px-4 py-2.5 self-start flex items-center gap-3"
          >
            <div>
              <p className="text-[9px] text-islamic-gold uppercase tracking-widest font-bold">Next Prayer</p>
              <p className="text-sm font-bold text-white">{next.name}</p>
              <p className="text-[10px] text-gray-400">{next.time}</p>
            </div>
            <div className="h-10 w-px bg-islamic-gold/20" />
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest">Starts In</p>
              <p className="text-sm font-bold text-islamic-gold tabular-nums">
                {next.minutesLeft >= 60
                  ? `${Math.floor(next.minutesLeft / 60)}h ${next.minutesLeft % 60}m`
                  : `${next.minutesLeft}m`}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Prayer Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
        {prayers.map((p, i) => {
          const isNext = next?.name === p.name;
          const isPast = !isNext && parseToDate(p.time) < new Date();
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex flex-col items-center justify-center rounded-xl py-3 px-2 transition-all relative ${
                isNext
                  ? 'bg-islamic-gold/20 border border-islamic-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : isPast
                  ? 'bg-white/[0.02] border border-white/[0.04] opacity-50'
                  : 'bg-white/[0.04] border border-white/[0.08]'
              }`}
            >
              {isNext && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] bg-islamic-gold text-dark-slate font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Next
                </span>
              )}
              <span className="text-xl mb-1">{p.icon}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isNext ? 'text-islamic-gold' : 'text-gray-300'}`}>
                {p.name}
              </span>
              <span className={`text-xs tabular-nums font-semibold ${isNext ? 'text-white' : 'text-gray-400'}`}>
                {to12h(p.time)}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Sunrise info */}
      <p className="text-[10px] text-gray-600 mt-3 text-center">
        🌅 Sunrise {to12h(data.Sunrise)} &nbsp;|&nbsp; Times update daily based on your location
      </p>
    </motion.div>
  );
}
