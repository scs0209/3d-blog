import type { ApiResponse } from '@/shared/api';

export type LikeResponse = ApiResponse<'/api/comments/like/{id}', 'get'>;
