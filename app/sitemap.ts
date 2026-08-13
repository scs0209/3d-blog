import type { MetadataRoute } from 'next';
import prisma from '@/shared/lib/db';
import { baseUrl } from '@/shared/consts/baseUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.4,
    },
  ];

  try {
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        createdAt: true,
      },
    });

    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: category.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const posts = await prisma.post.findMany({
      select: {
        slug: true,
        category: {
          select: {
            slug: true,
          },
        },
        updatedAt: true,
      },
    });

    const postPages = posts.map((post) => ({
      url: `${baseUrl}/blog/category/${post.category?.slug || 'uncategorized'}/post/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    const tags = await prisma.tag.findMany({
      select: {
        name: true,
        createdAt: true,
      },
    });

    const tagPages = tags.map((tag) => ({
      url: `${baseUrl}/blog/all?tags=${encodeURIComponent(tag.name)}`,
      lastModified: tag.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [...staticPages, ...categoryPages, ...postPages, ...tagPages];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return staticPages;
  }
}
