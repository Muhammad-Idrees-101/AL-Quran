import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tafseer Library',
  description:
    'Explore in-depth Quranic commentary (Tafseer) from Ibn Kathir, Jalalayn, Maariful Quran, and more. Read scholarly interpretations of all 114 Surahs in English and Urdu.',
  alternates: { canonical: 'https://al-quran-interactive.com/tafseer' },
  openGraph: {
    title: 'Tafseer Library — Al-Quran Interactive',
    description:
      'Deep academic study of the Quran. Read Tafseer Ibn Kathir, Maariful Quran, and classical commentary for all 114 Surahs.',
    url: 'https://al-quran-interactive.com/tafseer',
    type: 'website',
    images: [{ url: 'https://al-quran-interactive.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tafseer Library — Al-Quran Interactive',
    description: 'Deep Quranic commentary from Ibn Kathir and classical scholars for all 114 Surahs.',
  },
};

export default function TafseerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
