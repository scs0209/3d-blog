import type { MetadataRoute } from 'next';
import { baseUrl } from '@/shared/consts/baseUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/blog/category/*', '/blog/category/*/post/*', '/blog/tags/*', '/portfolio'],
        disallow: [
          '/admin/*',
          '/api/*',
          '/login',
          '/sign-up',
          '/(protect)/*',
          '/swagger/*',
          '/_next/*',
          '/favicon.ico',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
