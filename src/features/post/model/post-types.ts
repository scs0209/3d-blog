import type { ApiResponse } from '@/shared/api';

export type GetPostListResponse = Promise<ApiResponse<'/api/posts', 'get'>>;

export type GetPostBySlugResponse = Promise<ApiResponse<'/api/posts/{slug}', 'get'>>;
