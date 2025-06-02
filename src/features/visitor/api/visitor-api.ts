import { fetcher } from '@/shared/api';

export const getVisitor = () => fetcher({ url: '/api/visitor', method: 'get' });

export const plusVisitor = (path: string) =>
  fetcher({
    url: '/api/visitor',
    method: 'post',
    body: { path },
  });
