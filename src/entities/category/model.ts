import type { ApiRequest, ApiResponse } from '@/shared/api';

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type CategoryResponse = ApiResponse<'/api/category/all', 'get'>;

export type CategoryRequest = ApiRequest<'/api/category/all', 'get'>;

export type CategoryWithPosts = ApiResponse<'/api/category/{slug}', 'get'>;

export type CategoryWithPostsRequest = ApiRequest<'/api/category/{slug}', 'get'>;
