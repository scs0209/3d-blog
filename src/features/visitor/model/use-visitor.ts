import { useQuery } from '@tanstack/react-query';
import { VISITOR_QUERY_KEY } from '@/shared/queryKeys/visitor';
import { getVisitor } from '../api';
import type { VisitorResponse } from '@/entities/visitor/model/visitor';

export const useVisitor = <T extends VisitorResponse>() => {
  const { data, isLoading, error } = useQuery<T>({
    queryKey: VISITOR_QUERY_KEY.today.queryKey,
    queryFn: () => getVisitor(),
  });

  return { data, isLoading, error };
};
