import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Academy',
  description:
    'Watch guided Quran lectures from elite Islamic scholars including Dr. Israr Ahmed (Bayan-ul-Quran), Mufti Tariq Masood, Mufti Menk, and Nouman Ali Khan. Over 270+ video episodes.',
  alternates: { canonical: 'https://al-quran-interactive.com/academy' },
  openGraph: {
    title: 'Video Academy — Al-Quran Interactive',
    description:
      'Master the Quran with 270+ guided lectures from world-renowned scholars. Watch Tafseer, Stories of Prophets, and linguistic analysis.',
    url: 'https://al-quran-interactive.com/academy',
    type: 'website',
    images: [{ url: 'https://al-quran-interactive.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Academy — Al-Quran Interactive',
    description: 'Master the Quran with 270+ guided lectures from world-renowned scholars.',
  },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
