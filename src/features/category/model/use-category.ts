import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { CategoryResponse, CategoryWithPosts } from '@/entities/category/model';
import { getNextPageParamFromMeta } from '@/shared/lib/pagination';
import { CATALOG_STALE_TIME, POST_LIST_STALE_TIME } from '@/shared/lib/query-persist';
import { queryKeys } from '@/shared/queryKeys';
import { getCategories, getCategoryPosts } from '../api/category-api';

const getAllCategories = () => getCategories();

export const useCategories = <T extends CategoryResponse>() => {
  const { data, isLoading, error } = useQuery<T>({
    queryKey: queryKeys.category.all.queryKey,
    queryFn: getAllCategories,
    staleTime: CATALOG_STALE_TIME,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  return { data, isLoading, error };
};

export const useCategoryPosts = (slug: string, page = 1, limit = 10) => {
  const { data, isLoading, error } = useQuery<CategoryWithPosts>({
    queryKey: queryKeys.category.posts(slug, page, limit).queryKey,
    queryFn: () => getCategoryPosts(slug, page, limit),
    staleTime: POST_LIST_STALE_TIME,
  });

  return { data, isLoading, error };
};

export const useCategoryPostsInfinite = (slug: string, limit = 10) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery<CategoryWithPosts>({
      queryKey: [...queryKeys.category.posts(slug, 1, limit).queryKey, 'infinite'],
      queryFn: ({ pageParam = 1 }) => getCategoryPosts(slug, pageParam as number, limit),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => getNextPageParamFromMeta(lastPage),
      staleTime: POST_LIST_STALE_TIME,
      enabled: Boolean(slug),
    });

  const categoryInfo = data?.pages[0];
  const posts = data?.pages.flatMap((page) => page.posts ?? []) ?? [];

  return {
    categoryName: categoryInfo?.name,
    categorySlug: categoryInfo?.slug,
    posts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};
