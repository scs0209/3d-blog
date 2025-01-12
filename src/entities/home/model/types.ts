import { ApiRequest, ApiResponse } from '@/shared/api/types';

export type PostsResponse = ApiResponse<'/api/posts', 'get'>;
export type CreatePostReq = ApiRequest<'/api/posts', 'post'>;
