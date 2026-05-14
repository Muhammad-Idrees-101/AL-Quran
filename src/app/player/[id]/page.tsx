import React from 'react';
import type { Metadata } from 'next';
import { SURAHS } from '@/lib/mockData';
import { Ayah } from '@/types/quran';
import { QuranPlayerContent } from './content';

const BASE_URL = 'https://al-quran-interactive.com';

// SSG: Generate static params for all 114 Surahs
export function generateStaticParams() {
  return SURAHS.map((surah) => ({ id: surah.id.toString() }));
}

// Dynamic per-Surah SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const surahId = parseInt(params.id);
  const surah = SURAHS.find((s) => s.id === surahId);

  if (!surah) {
    return {
      title: 'Surah Not Found',
      description: 'The requested Surah could not be found.',
    };
  }

  const title = `Surah ${surah.name_english} (${surah.name_arabic}) \u2014 Read & Listen Online`;
  const description = `Read Surah ${surah.name_english} (#${surah.id}) online with English & Urdu translation, Tafseer, and audio recitation. ${surah.ayah_count} Ayahs \u2014 ${surah.revelation_type} revelation.`;
  const canonicalUrl = `${BASE_URL}/player/${surah.id}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Al-Quran Interactive',
      type: 'article',
      locale: 'en_US',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `Surah ${surah.name_english} \u2014 Al-Quran Interactive`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

import fs from 'fs';
import path from 'path';

function generateAyahs(surahId: number): Ayah[] {
  try {
    const uthmaniPath = path.join(process.cwd(), 'src', 'data', 'quran_uthmani.json');
    const indopakPath = path.join(process.cwd(), 'src', 'data', 'quran_indopak.json');
    const enPath = path.join(process.cwd(), 'src', 'data', 'quran_en.json');
    const urPath = path.join(process.cwd(), 'src', 'data', 'quran_ur.json');
    const tafseerEnPath = path.join(process.cwd(), 'src', 'data', 'tafseer_en.json');
    const tafseerUrPath = path.join(process.cwd(), 'src', 'data', 'tafseer_ur.json');
    
    if (!fs.existsSync(uthmaniPath) || !fs.existsSync(enPath) || !fs.existsSync(urPath)) {
      throw new Error('Quran data files not found');
    }

    const uthmaniData = JSON.parse(fs.readFileSync(uthmaniPath, 'utf8'));
    const indopakData = fs.existsSync(indopakPath) ? JSON.parse(fs.readFileSync(indopakPath, 'utf8')) : null;
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const urData = JSON.parse(fs.readFileSync(urPath, 'utf8'));
    
    // Optional tafseers
    const tafseerEnData = fs.existsSync(tafseerEnPath) ? JSON.parse(fs.readFileSync(tafseerEnPath, 'utf8')) : null;
    const tafseerUrData = fs.existsSync(tafseerUrPath) ? JSON.parse(fs.readFileSync(tafseerUrPath, 'utf8')) : null;

    const uthmaniSurah = uthmaniData.data.surahs[surahId - 1];
    const indopakSurah = indopakData ? indopakData.data.surahs[surahId - 1] : null;
    const enSurah = enData.data.surahs[surahId - 1];
    const urSurah = urData.data.surahs[surahId - 1];
    const tafseerEnSurah = tafseerEnData?.data.surahs[surahId - 1];
    const tafseerUrSurah = tafseerUrData?.data.surahs[surahId - 1];

    return uthmaniSurah.ayahs.map((ayah: any, i: number) => ({
      id: surahId * 1000 + ayah.numberInSurah,
      surah_id: surahId,
      ayah_number: ayah.numberInSurah,
      text_uthmani: ayah.text,
      text_indopak: indopakSurah ? indopakSurah.ayahs[i].text : ayah.text, // Fallback if missing
      translation_en: enSurah.ayahs[i].text,
      translation_ur: urSurah.ayahs[i].text,
      tafseer_en: tafseerEnSurah ? tafseerEnSurah.ayahs[i].text : 'Tafseer unavailable.',
      tafseer_ur: tafseerUrSurah ? tafseerUrSurah.ayahs[i].text : 'Tafseer unavailable.',
    }));
  } catch (error) {
    console.error('Error generating ayahs:', error);
    return [];
  }
}

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function QuranPlayerPage({ params, searchParams }: PageProps) {
  const surahId = parseInt(params.id);
  const surah = SURAHS.find((s) => s.id === surahId);

  if (!surah) {
    return (
      <div className="px-4 md:px-8 py-20 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-white mb-2">Surah Not Found</h1>
        <p className="text-gray-400">The requested Surah does not exist.</p>
      </div>
    );
  }

  const ayahs = generateAyahs(surah.id);
  const ayahParam = typeof searchParams.ayah === 'string' ? parseInt(searchParams.ayah) : 1;

  return <QuranPlayerContent surah={surah} ayahs={ayahs} initialAyah={ayahParam || 1} />;
}
