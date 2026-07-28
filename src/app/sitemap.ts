import { MetadataRoute } from 'next';
import { mockDesa } from '@/data/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://desacantik.subulussalamkota.bps.go.id';

  const staticPages = [
    '',
    '/tentang',
    '/daftar-desa',
    '/peta',
    '/dashboard',
    '/publikasi',
    '/kontak',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const desaPages = mockDesa.map((desa) => ({
    url: `${baseUrl}/desa/${desa.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...desaPages];
}
