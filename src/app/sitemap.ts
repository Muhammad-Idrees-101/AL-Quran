import type { MetadataRoute } from 'next';
import { SURAHS } from '@/lib/mockData';

const BASE_URL = 'https://al-quran-interactive.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/academy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tafseer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/duas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/topics`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // All 114 Surah pages — highest-value dynamic pages
  const surahRoutes: MetadataRoute.Sitemap = SURAHS.map((surah) => ({
    url: `${BASE_URL}/player/${surah.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: surah.id <= 10 ? 0.95 : surah.id <= 30 ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...surahRoutes];
}
