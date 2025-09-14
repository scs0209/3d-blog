import type { ApiResponse } from '@/shared/api';

export type User = {
  id: string;
  email: string;
  name?: string;
};

export type UserResponse = ApiResponse<'/api/users', 'get'>;
