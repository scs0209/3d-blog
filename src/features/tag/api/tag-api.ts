import { fetcher } from '@/shared/api';

export const getAllTag = fetcher({ url: '/api/tags', method: 'get' });

export const createTag = (name: string) =>
  fetcher({
    url: '/api/tags',
    method: 'post',
    body: { name },
  });
