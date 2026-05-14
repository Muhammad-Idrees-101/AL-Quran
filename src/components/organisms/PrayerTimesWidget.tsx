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
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  city?: string;
}

// The Aladhan API returns times like "15:45 (+05)" or "05:12 (AST)"
function cleanTimeStr(timeStr: string): string {
  return timeStr.split(' ')[0]; // Extract just the "HH:MM" part
}

function parseTime(timeStr: string): Date {
  const time = cleanTimeStr(timeStr);
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function formatTimeTo12Hour(timeStr: string): string {
  const time = cleanTimeStr(timeStr);
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const mPad = minutes.toString().padStart(2, '0');
  return `${h12}:${mPad} ${period}`;
}

function getNextPrayer(prayers: PrayerTime[]): { name: string; minutesLeft: number } | null {
  const now = new Date();
  for (const p of prayers) {
    const t = parseTime(p.time);
    if (t > now) {
      const diff = Math.round((t.getTime() - now.getTime()) / 60000);
      return { name: p.name, minutesLeft: diff };
    }
  }
  // If all prayers today are done, Fajr is next (tomorrow)
  // For a simple fix, return null or we could calculate until midnight + Fajr
  return null;
}

export function PrayerTimesWidget() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        let lat = 21.3891; // Mecca fallback
        let lng = 39.8579;
        let city = 'Mecca';

        // 1. Try Browser Geolocation
        let geoSuccess = false;
        try {
          if (typeof navigator !== 'undefined' && navigator.geolocation) {
            const pos = await new Promise<GeolocationPosition>((res, rej) =>
              navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
            );
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            city = 'Your Location';
            geoSuccess = true;
          }
        } catch {}

        // 2. Fallback to IP-based Geolocation if browser fails (e.g. denied or not HTTPS)
        if (!geoSuccess) {
          try {
            const ipRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
            const ipData = await ipRes.json();
            if (ipData.latitude && ipData.longitude) {
              lat = parseFloat(ipData.latitude);
              lng = parseFloat(ipData.longitude);
              city = ipData.city || ipData.country || 'Your Location';
            }
          } catch (err) {
            // keep Mecca fallback
            console.warn('IP Geolocation failed', err);
          }
        }

        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        // Omit the 'method' parameter so Aladhan API auto-detects, or specify it. 
        // Adding school=1 for Hanafi Asr time (which is later than the standard Shafi time)
        // Adding method=1 (University of Islamic Sciences, Karachi) which is standard for South Asia.
        // Adding tune parameter to offset Dhuhr by +90 minutes to match local Jamaat (congregation) times.
        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&school=1&method=1&tune=0,0,0,90,0,0,0,0,0`
        );
        const json = await res.json();
        const t = json?.data?.timings;
        if (!t) throw new Error('No data');

        setPrayerData({
          Fajr: t.Fajr,
          Dhuhr: t.Dhuhr,
          Asr: t.Asr,
          Maghrib: t.Maghrib,
          Isha: t.Isha,
          city,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const prayers: PrayerTime[] = prayerData
    ? [
        { name: 'Fajr', time: prayerData.Fajr, icon: '🌙' },
        { name: 'Dhuhr', time: prayerData.Dhuhr, icon: '☀️' },
        { name: 'Asr', time: prayerData.Asr, icon: '🌤️' },
        { name: 'Maghrib', time: prayerData.Maghrib, icon: '🌅' },
        { name: 'Isha', time: prayerData.Isha, icon: '🌃' },
      ]
    : [];

  const next = prayers.length > 0 ? getNextPrayer(prayers) : null;

  if (loading) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white/10 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error || !prayerData) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 text-center">
        <p className="text-xs text-gray-500">🕌 Prayer times unavailable</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-950/50 to-blue-950/30 border border-indigo-500/20 rounded-2xl p-5"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">🕌 Prayer Times</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">{prayerData.city} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        {next && (
          <div className="bg-islamic-gold/10 border border-islamic-gold/20 rounded-lg px-3 py-1.5 self-start md:self-auto text-right md:text-left flex items-center gap-3">
            <div>
              <p className="text-[9px] text-islamic-gold uppercase tracking-widest font-bold">Next Prayer</p>
              <p className="text-sm font-bold text-white">{next.name}</p>
            </div>
            <div className="h-6 w-px bg-islamic-gold/20"></div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest">Starts In</p>
              <p className="text-sm font-bold text-islamic-gold">
                {Math.floor(next.minutesLeft / 60)}h {next.minutesLeft % 60}m
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
        {prayers.map((p, i) => {
          const isNext = next?.name === p.name;
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`flex flex-col items-center justify-center rounded-xl py-3 px-2 transition-all ${
                isNext
                  ? 'bg-islamic-gold/20 border border-islamic-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                  : 'bg-white/[0.04] border border-white/[0.08]'
              }`}
            >
              <span className="text-lg md:text-xl mb-1">{p.icon}</span>
              <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isNext ? 'text-islamic-gold' : 'text-gray-300'}`}>{p.name}</span>
              <span className={`text-xs tabular-nums ${isNext ? 'text-white font-bold' : 'text-gray-400'}`}>
                {formatTimeTo12Hour(p.time)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
