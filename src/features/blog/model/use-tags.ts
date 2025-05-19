import { useQuery } from '@tanstack/react-query';
import { TAG_QUERY_KEY } from '@/shared/queryKeys/tag';
import { getAllTag } from '@/features/tag/api/tag-api';
import type { TagResponse } from '@/entities/tag/model';

const getAllTags = async () => {
  const result = await getAllTag;
  return result;
};

export const useTags = <T extends TagResponse>() => {
  const { data, isLoading, error } = useQuery<T>({
    queryKey: TAG_QUERY_KEY.all.queryKey,
    queryFn: getAllTags,
  });

  return { data, isLoading, error };
};
