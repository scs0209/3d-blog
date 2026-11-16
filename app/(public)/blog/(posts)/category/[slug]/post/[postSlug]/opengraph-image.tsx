import { ImageResponse } from 'next/og';
import prisma from '@/shared/lib/db';

export const alt = '3D Blog Post';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = {
  params: Promise<{ slug: string; postSlug: string }>;
};

export default async function PostOpenGraphImage({ params }: Props) {
  const { postSlug } = await params;
  const decodedSlug = decodeURIComponent(postSlug);

  const post = await prisma.post.findUnique({
    where: { slug: decodedSlug },
    select: {
      title: true,
      category: { select: { name: true } },
    },
  });

  const title = post?.title ?? '3D Blog';
  const category = post?.category?.name ?? 'Article';
  const displayTitle = title.length > 80 ? `${title.slice(0, 77)}...` : title;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        background: '#050608',
        color: '#e9edf1',
      }}
    >
      <div style={{ display: 'flex', fontSize: 24, color: '#4de3ff' }}>{category}</div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
        {displayTitle}
      </div>
      <div style={{ display: 'flex', fontSize: 24, color: '#8d98a3' }}>3D Blog</div>
    </div>,
    { ...size },
  );
}
