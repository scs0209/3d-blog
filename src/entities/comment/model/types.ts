import type { ApiResponse } from '@/shared/api';

export type Comment = ApiResponse<'/api/comments/{postId}', 'get'>[0];

export type ReplyType = NonNullable<ApiResponse<'/api/comments/{postId}', 'get'>[0]['replies']>[0];
