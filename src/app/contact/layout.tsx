import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Al-Quran Interactive team. We welcome your feedback, suggestions, and questions about our Quran learning platform.',
  alternates: { canonical: 'https://al-quran-interactive.com/contact' },
  openGraph: {
    title: 'Contact Us — Al-Quran Interactive',
    description: 'Reach out to the Al-Quran Interactive team with questions, feedback, or suggestions.',
    url: 'https://al-quran-interactive.com/contact',
    type: 'website',
    images: [{ url: 'https://al-quran-interactive.com/og-image.png', width: 1200, height: 630 }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
