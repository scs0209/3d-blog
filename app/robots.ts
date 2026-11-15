import type { MetadataRoute } from 'next';
import { baseUrl } from '@/shared/consts/baseUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/blog/category/*', '/blog/category/*/post/*', '/feed.xml'],
        disallow: ['/admin', '/admin/*', '/api/*', '/login', '/sign-up', '/swagger', '/swagger/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
