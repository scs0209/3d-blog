import type { GetPostListParams } from '@/features/post/model';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const POST_QUERY_KEY = createQueryKeys('post', {
  all: (params: GetPostListParams) => [params],
  detail: (id: string) => [id],
  summary: (postId: string, revisedAt: string) => [postId, revisedAt],
});
