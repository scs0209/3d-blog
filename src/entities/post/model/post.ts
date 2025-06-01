import type { ApiResponse } from '@/shared/api';

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type PostResponse = ApiResponse<'/api/posts/{slug}', 'get'>;
