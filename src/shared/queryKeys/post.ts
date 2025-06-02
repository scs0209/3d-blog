import { createQueryKeys } from '@lukemorales/query-key-factory';

export const POST_QUERY_KEY = createQueryKeys('post', {
  all: null,
  detail: (id: string) => [id],
});
