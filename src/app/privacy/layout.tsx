import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the Al-Quran Interactive Privacy Policy. We are privacy-first: no accounts required, all reading progress and bookmarks are stored locally on your device.',
  alternates: { canonical: 'https://al-quran-interactive.com/privacy' },
  openGraph: {
    title: 'Privacy Policy — Al-Quran Interactive',
    description:
      'Privacy-first Quran platform. No accounts, no tracking — all your data stays on your device.',
    url: 'https://al-quran-interactive.com/privacy',
    type: 'website',
    images: [{ url: 'https://al-quran-interactive.com/og-image.png', width: 1200, height: 630 }],
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
