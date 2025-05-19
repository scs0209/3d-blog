import type { ApiResponse } from '@/shared/api';

export type GetPostListResponse = Promise<ApiResponse<'/api/posts', 'get'>>;
