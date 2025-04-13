import { Category } from '@/entities/category/model';
import { baseUrl } from '@/shared/consts/baseUrl';
import { CategoryFormSchema } from '../model/category-schema';

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
export const getCategories = async ({ includePostCount = false, page = 1, limit = 10 }: FetchCategoriesParams = {}) => {
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
export const createCategory = async ({ name, description }: CategoryFormSchema) => {
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
  const res = await fetch(`${baseUrl}/api/category/${slug}?page=${page}&limit=${limit}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch category posts');
  }

  return res.json();
};

interface CategoryInput {
  name: string;
  description?: string;
}

// Update category
export async function updateCategory(id: string, data: CategoryInput): Promise<Category> {
  const response = await fetch(`/api/category/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update category');
  }

  return response.json();
}

// Delete category
export async function deleteCategory(id: string): Promise<boolean> {
  const response = await fetch(`/api/category/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete category');
  }

  const { success } = await response.json();
  return success;
}
