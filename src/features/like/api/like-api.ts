import { fetcher } from '@/shared/api';

export const toggleLike = (id: number, userId: number, type: 'LIKE' | 'DISLIKE') =>
  fetcher({ url: '/api/comments/like/{id}', path: { id }, method: 'post', body: { userId, type } });

export const getLike = (id: number) => fetcher({ url: '/api/comments/like/{id}', path: { id }, method: 'get' });
