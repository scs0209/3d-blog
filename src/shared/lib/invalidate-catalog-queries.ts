import type { QueryClient } from '@tanstack/react-query';
import { SIDEBAR_QUERY_KEY } from '@/shared/queryKeys/sidebar';

/** 카탈로그 뮤테이션 후 IndexedDB에 남은 사이드바/목록이 관리자 변경을 가리지 않게 한다 */
export const invalidateCatalogQueries = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: SIDEBAR_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: ['category'] }),
    queryClient.invalidateQueries({ queryKey: ['tag'] }),
    queryClient.invalidateQueries({ queryKey: ['post', 'all'] }),
  ]);
