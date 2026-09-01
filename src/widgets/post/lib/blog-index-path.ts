/** 블로그 글 목록 인덱스 경로 */
export const isBlogIndexPath = (pathname: string | null) => pathname === '/blog/all';

/** 태그 필터 등 쿼리를 유지한 블로그 목록 URL */
export const getBlogIndexHref = (params?: { tags?: string; search?: string; category?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.tags) searchParams.set('tags', params.tags);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.category) searchParams.set('category', params.category);
  const query = searchParams.toString();
  return query ? `/blog/all?${query}` : '/blog/all';
};
