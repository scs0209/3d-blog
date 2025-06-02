import type { ApiResponse } from '@/shared/api';

export type GetPostListResponse = ApiResponse<'/api/posts', 'get'>;

export type GetPostBySlugResponse = ApiResponse<'/api/posts/{slug}', 'get'>;
