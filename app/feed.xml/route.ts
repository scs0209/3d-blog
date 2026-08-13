import { baseUrl, extractDescription, getPostUrl } from '@/shared/consts/baseUrl';
import prisma from '@/shared/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export async function GET() {
  const posts = await prisma.post.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    select: {
      title: true,
      slug: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { slug: true, name: true } },
      author: { select: { name: true } },
      tags: { select: { name: true } },
    },
  });

  const items = posts
    .map((post) => {
      const link = `${getPostUrl(post.category?.slug, post.slug)}?utm_source=rss&utm_medium=feed`;
      const description = extractDescription(post.content ?? '');
      const pubDate = (post.createdAt ?? new Date()).toUTCString();
      const categories = [
        post.category?.name ? `<category>${escapeXml(post.category.name)}</category>` : '',
        ...(post.tags ?? []).map((tag) => `<category>${escapeXml(tag.name)}</category>`),
      ]
        .filter(Boolean)
        .join('');

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${post.author?.name ? `<dc:creator>${escapeXml(post.author.name)}</dc:creator>` : ''}
      ${categories}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>3D Blog</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>웹 개발 기록과 Three.js 기반 3D 홈·포트폴리오</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${baseUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
