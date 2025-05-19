import type { ApiResponse } from '@/shared/api';

export type Tag = {
  id: string;
  name: string;
};

export type TagResponse = ApiResponse<'/api/tags', 'get'>;
