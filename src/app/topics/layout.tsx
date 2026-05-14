import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Surahs by Topic',
  description:
    'Discover Quranic Surahs organized by theme: Prayer, Patience, Prophets, Jannah, Tawhid, Forgiveness, Family, Creation, The Hereafter, and more. A thematic guide to the Holy Quran.',
  alternates: { canonical: 'https://al-quran-interactive.com/topics' },
  keywords: [
    'Quran topics',
    'Surahs about prayer',
    'Surahs about Jannah',
    'Quran themes',
    'Surahs about prophets',
    'Quran by topic',
    'thematic Quran guide',
  ],
  openGraph: {
    title: 'Browse Surahs by Topic — Al-Quran Interactive',
    description:
      'Find Surahs by theme — Prayer, Patience, Prophets, Jannah, Forgiveness, and 8 more topics. A thematic guide to the Holy Quran.',
    url: 'https://al-quran-interactive.com/topics',
    type: 'website',
    images: [{ url: 'https://al-quran-interactive.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Surahs by Topic — Al-Quran Interactive',
    description: 'Find Surahs by theme: Prayer, Prophets, Jannah, Forgiveness, and more.',
  },
};

export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
