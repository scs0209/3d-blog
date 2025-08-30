import { getPostBySlug } from '@/features/post/api/post-api';
import { formatDateToYMD } from '@/shared/utils';
import dynamic from 'next/dynamic';
import { CommentSection } from '@/features/comment/ui';
import { PostSummary } from '@/shared/ui/PostSummary';
import type { Metadata } from 'next';
import type { PostResponse } from '@/entities/post/model/post';

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
  params: Promise<{ postSlug: string }>;
}) {
  const { postSlug } = await params;
  const decodedSlug = decodeURIComponent(postSlug);
  const post = await getPostBySlug(decodedSlug);

  if (!post || !post.title || !post.content) {
    return <div>Post not found</div>;
  }

  return (
    <>
      {/* SEO를 위한 구조화 데이터 */}
      <PostStructuredData post={post} />

      <div>
        {/* 본문 영역 꾸밈 */}
        <section className='relative md:bg-gradient-to-br md:from-[#181c2a]/90 md:via-[#232946]/90 md:to-[#232946]/80 md:border md:border-blue-400/30 md:rounded-2xl md:shadow-[0_0_24px_4px_#7dd3fc22] px-4 sm:px-6 md:px-8 py-8 mb-12 mt-4 max-w-4xl mx-4 md:overflow-hidden lg:mx-auto'>
          <div className='absolute inset-0 pointer-events-none z-0 hidden md:block'>
            <div className='w-full h-full bg-gradient-to-tr from-blue-900/20 via-fuchsia-900/10 to-blue-800/10 blur-[2px]' />
          </div>
          <h1 className='relative z-10 text-3xl font-extrabold text-blue-100 mb-4 md:drop-shadow-[0_2px_8px_#7dd3fc55]'>
            {post.title}
          </h1>
          <div className='relative z-10 flex items-center gap-3 mb-6 text-xs text-blue-200'>
            <span className='font-mono'>{post.author?.name || 'Unknown Author'}</span>
            <span className='opacity-60'>|</span>
            <span>{formatDateToYMD(post?.createdAt ?? '')}</span>
            {post.category && (
              <>
                <span className='opacity-60'>|</span>
                <span className='text-blue-300'>{post.category.name}</span>
              </>
            )}
          </div>

          {/* 태그 표시 */}
          {post.tags && post.tags.length > 0 && (
            <div className='relative z-10 flex flex-wrap gap-2 mb-6'>
              {post.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className='px-3 py-1 text-xs bg-blue-500/20 text-blue-200 rounded-full border border-blue-400/30'
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* AI 요약 표시 */}
          <div className='relative z-10 p-2'>
            <PostSummary post={post as any} />
          </div>

          <div className='relative z-10'>
            <NovelViewer content={post.content ?? ''} />
          </div>
        </section>

        {/* 댓글 섹션 */}
        <CommentSection postId={post.id ?? 0} />
      </div>
    </>
  );
}
