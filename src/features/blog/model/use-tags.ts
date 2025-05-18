import { useQuery } from '@tanstack/react-query';
import { TAG_QUERY_KEY } from '@/shared/queryKeys/tag';
import { getAllTag } from '@/features/tag/api/tag-api';

const getAllTags = async () => {
  const result = await getAllTag;
  return result;
};

export const useTags = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: TAG_QUERY_KEY.all.queryKey,
    queryFn: getAllTags,
  });

  return { data, isLoading, error };
};
