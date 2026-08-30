import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { PostResponse } from '@/entities/post/model/post';
import { CommentSection } from '@/features/comment/ui';
import { getPostBySlugOnServer } from '@/features/post/api/get-post-by-slug.server';
import { extractDescription, getPostPath, getPostUrl, toAbsoluteUrl } from '@/shared/consts/baseUrl';
import { decodePathSegment } from '@/shared/lib/decode-path-segment';
import { PostContentViewer } from '@/shared/ui/PostContentViewer';
import { formatDateToYMD } from '@/shared/utils';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { PostBackButton } from '@/widgets/post/ui/PostBackButton';
import { PostViewTracker } from '@/widgets/post/ui/PostViewTracker';

const PostSummary = dynamic(() => import('@/shared/ui/PostSummary').then((mod) => mod.PostSummary), {
  loading: () => <div className='mb-6 min-h-[88px]' aria-hidden />,
});

export async function generateMetadata({ params }: { params: Promise<{ postSlug: string }> }): Promise<Metadata> {
  const { postSlug } = await params;
  const decodedSlug = decodePathSegment(postSlug);

  try {
    const post = await getPostBySlugOnServer(decodedSlug);
    if (!post) {
      return {
        title: '포스트를 찾을 수 없습니다',
      };
    }
    const description = extractDescription(post.content ?? '');
    const publishedDate = post.createdAt ? new Date(post.createdAt).toISOString() : undefined;
    const modifiedDate = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedDate;
    const postUrl = getPostUrl(post.category?.slug, postSlug);
    const keywords =
      post.tags
        ?.map((tag) => tag.name)
        .filter((name): name is string => Boolean(name))
        .join(', ') || undefined;

    return {
      title: post.title,
      description,
      keywords,
      authors: post.author?.name ? [{ name: post.author.name }] : [],
      openGraph: {
        title: post.title ?? undefined,
        description,
        type: 'article',
        url: postUrl,
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        authors: post.author?.name ? [post.author.name] : [],
        tags: post.tags?.map((tag) => tag.name).filter((name): name is string => Boolean(name)) || [],
        siteName: '3D Blog',
        locale: 'ko_KR',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title ?? undefined,
        description,
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
      title: '포스트를 찾을 수 없습니다',
    };
  }
}

const PostStructuredData = ({ post }: { post: PostResponse }) => {
  const postUrl = getPostUrl(post.category?.slug, post.slug ?? '');
  const imageUrl = toAbsoluteUrl(
    `/blog/category/${post.category?.slug || 'uncategorized'}/post/${encodeURIComponent(post.slug ?? '')}/opengraph-image`,
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: extractDescription(post.content ?? ''),
    image: [imageUrl],
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Unknown Author',
    },
    publisher: {
      '@type': 'Organization',
      name: '3D Blog',
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl('/opengraph-image'),
      },
    },
    datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    ...(post.tags &&
      post.tags.length > 0 && {
        keywords: post.tags.map((tag) => tag.name).join(', '),
      }),
  };

  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
};

export default async function PostPage({ params }: { params: Promise<{ slug: string; postSlug: string }> }) {
  const { slug, postSlug } = await params;
  const decodedSlug = decodePathSegment(postSlug);
  const categorySlug = decodePathSegment(slug);

  const post = await getPostBySlugOnServer(decodedSlug);

  if (!post?.title || !post?.content) {
    notFound();
  }

  if (post.category?.slug && post.category.slug !== categorySlug) {
    redirect(getPostPath(post.category.slug, decodedSlug));
  }

  const backHref = `/blog/category/${post.category?.slug ?? categorySlug}`;

  return (
    <>
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

        <section
          className={`relative mb-12 mt-0 px-4 py-8 sm:px-6 md:rounded-2xl md:px-8 md:overflow-hidden ${blogTheme.postSection}`}
        >
          <h1
            className={`mb-4 font-[family-name:var(--font-syne),sans-serif] text-3xl font-bold tracking-tight md:text-4xl ${blogTheme.textPrimary}`}
          >
            {post.title}
          </h1>
          <div className={`mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${blogTheme.textMuted}`}>
            <span>{post.author?.name || 'Unknown Author'}</span>
            <span className='opacity-50' aria-hidden>
              |
            </span>
            <span>{formatDateToYMD(post?.createdAt ?? '')}</span>
            {post.category && (
              <>
                <span className='opacity-50' aria-hidden>
                  |
                </span>
                <span className={blogTheme.textAccent}>{post.category.name}</span>
              </>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className='mb-6 flex flex-wrap gap-2'>
              {post.tags.map((tag) => (
                <span key={tag.id} className={blogTheme.tagPill}>
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className='mb-2 min-h-[88px]'>
            <PostSummary
              post={{
                id: post.id ?? post.slug ?? 'unknown',
                title: post.title ?? '',
                content: post.content ?? null,
                updatedAt: post.updatedAt ?? null,
              }}
            />
          </div>

          <div>
            <PostContentViewer content={post.content ?? ''} />
          </div>
        </section>

        <CommentSection postId={post.id ?? 0} />
      </div>
    </>
  );
}
