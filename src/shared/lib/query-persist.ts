import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { del, get, set } from 'idb-keyval';

export const QUERY_PERSIST_MAX_AGE = 1000 * 60 * 60 * 24;
export const CATALOG_STALE_TIME = 1000 * 60 * 30;
export const POST_LIST_STALE_TIME = 1000 * 60 * 5;
export const QUERY_PERSIST_GC_TIME = QUERY_PERSIST_MAX_AGE;
export const QUERY_PERSIST_STORAGE_KEY = '3d-blog-query-cache';
export const QUERY_PERSIST_BUSTER = 'v1';

type PersistableQuery = {
  queryKey: readonly unknown[];
  state: { status: string };
};

/** 사이드바·카테고리·태그·글 목록만 남긴다. 좋아요/댓글/유저/AI 요약은 제외 */
export const shouldPersistQuery = (query: PersistableQuery) => {
  if (query.state.status !== 'success') {
    return false;
  }

  const root = query.queryKey[0];
  const operation = query.queryKey[1];

  if (root === 'sidebar') {
    return true;
  }

  if (root === 'category' || root === 'tag') {
    return true;
  }

  return root === 'post' && operation === 'all';
};

export const createQueryPersister = () =>
  createAsyncStoragePersister({
    storage:
      typeof window === 'undefined'
        ? undefined
        : {
            getItem: async (key) => (await get<string>(key)) ?? null,
            setItem: async (key, value) => {
              await set(key, value);
            },
            removeItem: async (key) => {
              await del(key);
            },
          },
    key: QUERY_PERSIST_STORAGE_KEY,
  });

export const getQueryPersistOptions = (persister: ReturnType<typeof createQueryPersister>) => ({
  persister,
  maxAge: QUERY_PERSIST_MAX_AGE,
  buster: QUERY_PERSIST_BUSTER,
  dehydrateOptions: {
    shouldDehydrateQuery: shouldPersistQuery,
  },
});
