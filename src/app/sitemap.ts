import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { platforms } from '@/lib/platforms';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Fix pages (높은 우선순위)
  const fixPages = Object.keys(platforms).map((platform) => ({
    url: `${baseUrl}/fix/${platform}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Guide pages (중간 우선순위)
  const guidePages = Object.keys(platforms).map((platform) => ({
    url: `${baseUrl}/guide/${platform}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    // 홈페이지
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Fix 페이지
    ...fixPages,
    // Guide 페이지
    ...guidePages,
    // 정적 페이지
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
