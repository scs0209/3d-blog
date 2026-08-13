import type { Metadata } from 'next';
import { baseUrl } from '@/shared/consts/baseUrl';

export const metadata: Metadata = {
  title: 'Blog',
  description: '웹 개발 기록, Next.js·Three.js 실험과 학습 노트.',
  alternates: {
    canonical: `${baseUrl}/blog`,
    types: {
      'application/rss+xml': `${baseUrl}/feed.xml`,
    },
  },
  openGraph: {
    title: 'Blog | 3D Blog',
    description: '웹 개발 기록, Next.js·Three.js 실험과 학습 노트.',
    url: `${baseUrl}/blog`,
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
