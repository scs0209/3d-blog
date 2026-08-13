import type { MetadataRoute } from 'next';
import { baseUrl } from '@/shared/consts/baseUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/blog/all', '/blog/category/*', '/blog/category/*/post/*', '/portfolio', '/feed.xml'],
        disallow: ['/admin', '/admin/*', '/api/*', '/login', '/sign-up', '/swagger', '/swagger/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
