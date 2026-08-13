import type { MetadataRoute } from 'next';
import prisma from '@/shared/lib/db';
import { baseUrl } from '@/shared/consts/baseUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/all`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  try {
    // 카테고리 목록 가져오기
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        createdAt: true,
      },
    });

    // 카테고리별 포스트 목록 페이지 URL 생성
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: category.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // 모든 포스트 가져오기
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

    // 개별 포스트 페이지 URL 생성
    const postPages = posts.map((post) => ({
      url: `${baseUrl}/blog/category/${post.category?.slug || 'uncategorized'}/post/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // 태그 목록 가져오기
    const tags = await prisma.tag.findMany({
      select: {
        name: true,
        createdAt: true,
      },
    });

    // 태그 검색 페이지 URL 생성 (/blog/all?tags=name)
    const tagPages = tags.map((tag) => ({
      url: `${baseUrl}/blog/all?tags=${encodeURIComponent(tag.name)}`,
      lastModified: tag.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    // 모든 sitemap 항목 합치기
    return [...staticPages, ...categoryPages, ...postPages, ...tagPages];
  } catch (error) {
    console.error('Sitemap generation error:', error);

    // 에러 발생 시 정적 페이지만 반환
    return staticPages;
  }
}
