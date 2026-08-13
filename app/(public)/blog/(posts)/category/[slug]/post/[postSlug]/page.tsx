import { getPostBySlug } from '@/features/post/api/post-api';
import { formatDateToYMD } from '@/shared/utils';
import dynamic from 'next/dynamic';
import { CommentSection } from '@/features/comment/ui';
import { PostSummary } from '@/shared/ui/PostSummary';
import type { Metadata } from 'next';
import type { PostResponse } from '@/entities/post/model/post';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { PostBackButton } from '@/widgets/post/ui/PostBackButton';
import { PostViewTracker } from '@/widgets/post/ui/PostViewTracker';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const NovelViewer = dynamic(() => import('@/shared/ui/NovelViewer'));

// HTML 태그 제거 및 description 추출 함수
const extractDescription = (content: string, maxLength = 160) => {
  const plainText = content
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/\s+/g, ' ') // 연속 공백을 단일 공백으로
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }
  return `${plainText.substring(0, maxLength).replace(/\s+\S*$/, '')}...`;
};

export async function generateMetadata({ params }: { params: Promise<{ postSlug: string }> }): Promise<Metadata> {
  const { postSlug } = await params;
  const decodedSlug = decodeURIComponent(postSlug);

  try {
    const post = await getPostBySlug(decodedSlug);
    const description = extractDescription(post.content ?? '');
  const publishedDate = post.createdAt ? new Date(post.createdAt).toISOString() : '';
  const modifiedDate = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedDate;
  const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/category/${post.category?.slug || 'uncategorized'}/post/${postSlug}`;
  const imageUrl = '/logo.png';

  return {
    title: post.title,
    description,
    keywords: post.tags?.map((tag) => tag.name).join(', ') || '',
    authors: post.author?.name ? [{ name: post.author.name }] : [],
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: post.author?.name ? [post.author.name] : [],
      tags: post.tags?.map((tag) => tag.name).filter((name): name is string => name !== undefined) || [],
      images: [
        {
          url: imageUrl, // 기본 이미지 또는 포스트 대표 이미지
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: '3D Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: ['/logo.png'], // 기본 이미지 또는 포스트 대표 이미지
      creator: post.author?.name || '@3dblog',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: postUrl,
    },
  };
  } catch {
    return {
      title: 'Post not found',
    };
  }
}

// JSON-LD 구조화 데이터 컴포넌트
const PostStructuredData = ({
  post,
}: {
  post: PostResponse;
}) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: extractDescription(post.content ?? ''),
    image: '/logo.png', // 기본 이미지 또는 포스트 대표 이미지
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Unknown Author',
    },
    publisher: {
      '@type': 'Organization',
      name: '3D Blog',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : '',
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/category/${post.category?.slug || 'uncategorized'}/post/${post.slug}`,
    },
    ...(post.tags &&
      post.tags.length > 0 && {
        keywords: post.tags.map((tag) => tag.name).join(', '),
      }),
  };

  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) {
  const { slug, postSlug } = await params;
  const decodedSlug = decodeURIComponent(postSlug);
  const categorySlug = decodeURIComponent(slug);

  let post: PostResponse;
  try {
    post = await getPostBySlug(decodedSlug);
  } catch {
    notFound();
  }

  if (!post?.title || !post?.content) {
    notFound();
  }

  if (post.category?.slug && post.category.slug !== categorySlug) {
    notFound();
  }

  const backHref = `/blog/category/${post.category?.slug ?? categorySlug}`;

  return (
    <>
      {/* SEO를 위한 구조화 데이터 */}
      <PostStructuredData post={post} />
      <Suspense fallback={null}>
        <PostViewTracker
          postId={post.id ?? post.slug ?? 'unknown'}
          slug={post.slug ?? decodedSlug}
          categorySlug={post.category?.slug}
        />
      </Suspense>

      <div className='mx-4 max-w-4xl lg:mx-auto'>
        <PostBackButton href={backHref} />

        {/* 본문 영역 꾸밈 */}
        <section
          className={`relative mb-12 mt-0 px-4 py-8 sm:px-6 md:rounded-2xl md:px-8 md:overflow-hidden ${blogTheme.postSection}`}
        >
          <div className='pointer-events-none absolute inset-0 z-0 hidden md:block'>
            <div className='h-full w-full bg-gradient-to-tr from-[#8a4a68]/15 via-[#1c0e38]/20 to-[#ffc090]/10 blur-[2px] dark:from-cyan-900/20 dark:via-fuchsia-900/10 dark:to-cyan-800/10' />
          </div>
          <h1
            className={`relative z-10 mb-4 text-3xl font-extrabold md:drop-shadow-sm dark:md:drop-shadow-[0_2px_8px_#7dd3fc55] ${blogTheme.textPrimary}`}
          >
            {post.title}
          </h1>
          <div className={`relative z-10 mb-6 flex items-center gap-3 text-xs ${blogTheme.textMuted}`}>
            <span className='font-mono'>{post.author?.name || 'Unknown Author'}</span>
            <span className='opacity-60'>|</span>
            <span>{formatDateToYMD(post?.createdAt ?? '')}</span>
            {post.category && (
              <>
                <span className='opacity-60'>|</span>
                <span className={blogTheme.textAccent}>{post.category.name}</span>
              </>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className='relative z-10 mb-6 flex flex-wrap gap-2'>
              {post.tags.map((tag) => (
                <span key={tag.id} className={blogTheme.tagPill}>
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* AI 요약 표시 */}
          <div className='relative z-10 p-2'>
            <PostSummary
              post={{
                id: post.id ?? post.slug ?? 'unknown',
                title: post.title ?? '',
                content: post.content ?? null,
                updatedAt: post.updatedAt ?? null,
              }}
            />
          </div>

          <div className='relative z-10'>
            <NovelViewer content={post.content ?? ''} />
          </div>
        </section>

        <CommentSection postId={post.id ?? 0} />
      </div>
    </>
  );
}
