import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryPosts } from '../api/category-api';
import { queryKeys } from '@/shared/queryKeys';
import type { CategoryResponse, CategoryWithPosts } from '@/entities/category/model';

const getAllCategories = () => getCategories();

export const useCategories = <T extends CategoryResponse>() => {
  const { data, isLoading, error } = useQuery<T>({
    queryKey: queryKeys.category.all.queryKey,
    queryFn: getAllCategories,
  });

  return { data, isLoading, error };
};

export const useCategoryPosts = (slug: string, page = 1, limit = 10) => {
  const { data, isLoading, error } = useQuery<CategoryWithPosts>({
    queryKey: queryKeys.category.posts(slug, page, limit).queryKey,
    queryFn: () => getCategoryPosts(slug, page, limit),
  });

  return { data, isLoading, error };
};
