import { ApiRequest, fetcher } from '@/shared/api';

export const getAllTag = fetcher({ url: '/api/tags', method: 'get' });

export const createTag = (name: string) =>
  fetcher({
    url: '/api/tags',
    method: 'post',
    body: { name },
  });

export const getTagDetail = (id: number) =>
  fetcher({
    url: '/api/tags/{id}',
    path: { id },
    method: 'get',
  });

export const updateTag = (
  id: number,
  body: ApiRequest<'/api/tags/{id}', 'put'>,
) =>
  fetcher({
    url: '/api/tags/{id}',
    method: 'put',
    path: { id },
    body,
  });

export const deleteTag = (id: number) =>
  fetcher({
    url: '/api/tags/{id}',
    path: { id },
    method: 'delete',
  });
