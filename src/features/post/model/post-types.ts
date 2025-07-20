import type { ApiRequest, ApiResponse } from '@/shared/api';

export type GetPostListResponse = ApiResponse<'/api/posts', 'get'>;

export type GetPostBySlugResponse = ApiResponse<'/api/posts/{slug}', 'get'>;

export type GetPostSummaryResponse = ApiResponse<'/api/summarize', 'post'>;

export type GetPostSummaryRequest = ApiRequest<'/api/summarize', 'post'>;
