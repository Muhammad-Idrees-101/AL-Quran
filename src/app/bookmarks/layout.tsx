import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Bookmarks',
  description: 'Your saved Ayahs from the Holy Quran. Quickly return to bookmarked verses and continue your reading journey.',
  alternates: { canonical: 'https://al-quran-interactive.com/bookmarks' },
  robots: {
    // Personal page — no need to index
    index: false,
    follow: false,
  },
};

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
