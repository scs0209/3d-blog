import { createQueryKeys } from '@lukemorales/query-key-factory';

export const LIKE_QUERY_KEY = createQueryKeys('like', {
  all: null,
  list: (id: number) => [id],
});
