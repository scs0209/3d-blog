import { Category } from '@/entities/category/model';
import { CategoryFormSchema } from '../model/category-schema';
import { baseUrl } from '@/shared/consts/baseUrl';

interface FetchCategoriesParams {
  includePostCount?: boolean;
  page?: number;
  limit?: number;
}

interface CategoryResponse {
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CategoryWithPosts extends Category {
  posts: Array<{
    id: number;
    title: string;
    author: {
      id: number;
      name: string;
    };
    _count: {
      comments: number;
      likes: number;
    };
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 카테고리 목록 조회
export const fetchCategories = async ({
  includePostCount = false,
  page = 1,
  limit = 10,
}: FetchCategoriesParams = {}) => {
  const params = new URLSearchParams({
    includePostCount: String(includePostCount),
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`${baseUrl}/api/category/all?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json() as Promise<CategoryResponse>;
};

// 새 카테고리 생성
export const createCategory = async ({
  name,
  description,
}: CategoryFormSchema) => {
  const response = await fetch('/api/category/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create category');
  }

  return response.json();
};

export const getCategoryPosts = async (
  slug: string,
  page: number = 1,
  limit: number = 10,
): Promise<CategoryWithPosts> => {
  const res = await fetch(
    `${baseUrl}/api/category/${slug}?page=${page}&limit=${limit}`,
    {
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch category posts');
  }

  return res.json();
};
