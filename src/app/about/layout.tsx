import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Al-Quran Interactive — a premium Islamic platform built to bridge traditional scholarship and modern digital design, making the Quran accessible to the global Ummah.',
  alternates: { canonical: 'https://al-quran-interactive.com/about' },
  openGraph: {
    title: 'About Al-Quran Interactive',
    description:
      'A premium Islamic platform bridging traditional scholarship and modern design for the global Ummah.',
    url: 'https://al-quran-interactive.com/about',
    type: 'website',
    images: [{ url: 'https://al-quran-interactive.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Al-Quran Interactive',
    description: 'Premium Islamic platform bridging traditional scholarship and modern design for the global Ummah.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
