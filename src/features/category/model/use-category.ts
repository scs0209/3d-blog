import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/category-api';
import { queryKeys } from '@/shared/queryKeys';
import type { CategoryResponse } from '@/entities/category/model';

const getAllCategories = async () => {
  const result = await getCategories;
  return result;
};

export const useCategories = <T extends CategoryResponse>() => {
  const { data, isLoading, error } = useQuery<T>({
    queryKey: queryKeys.category.all.queryKey,
    queryFn: getAllCategories,
  });

  return { data, isLoading, error };
};
