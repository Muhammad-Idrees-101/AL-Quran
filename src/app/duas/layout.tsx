import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Islamic Duas Collection',
  description:
    'Browse authentic Islamic supplications (Duas) from the Quran and Sunnah. Morning & evening adhkar, Salah duas, travel, food, sleep, forgiveness, and anxiety — with Arabic, transliteration, and Urdu translation.',
  alternates: { canonical: 'https://al-quran-interactive.com/duas' },
  keywords: [
    'Islamic duas',
    'morning duas',
    'evening adhkar',
    'dua before sleeping',
    'dua for parents',
    'Sayyid al-Istighfar',
    'authentic duas',
    'duas from Quran',
    'duas from Sunnah',
  ],
  openGraph: {
    title: 'Islamic Duas Collection — Al-Quran Interactive',
    description:
      'Authentic supplications from the Quran & Sunnah — morning adhkar, Salah, travel, forgiveness, and more with Arabic, transliteration, and Urdu translation.',
    url: 'https://al-quran-interactive.com/duas',
    type: 'website',
    images: [{ url: 'https://al-quran-interactive.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Islamic Duas Collection — Al-Quran Interactive',
    description: 'Authentic supplications from Quran & Sunnah with Arabic, transliteration, and translation.',
  },
};

export default function DuasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
