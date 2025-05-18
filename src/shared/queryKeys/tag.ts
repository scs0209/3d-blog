import { createQueryKeys } from '@lukemorales/query-key-factory';

export const TAG_QUERY_KEY = createQueryKeys('tag', {
  all: null,
  detail: (id: string) => [id],
});
