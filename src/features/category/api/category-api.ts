import type { Category } from '@/entities/category/model';
import { fetcher } from '@/shared/api';
import type { CategoryFormSchema } from '../model/category-schema';

// 카테고리 목록 조회
export const getCategories = () =>
  fetcher({ url: '/api/category/all', method: 'get', query: { includePostCount: false } });

// 새 카테고리 생성
export const createCategory = async ({ name, description, parentId }: CategoryFormSchema) => {
  const response = await fetch('/api/category/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      parentId: parentId ?? null,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create category');
  }

  return response.json();
};

export const getCategoryPosts = (slug: string, page = 1, limit = 10) =>
  fetcher({
    url: '/api/category/{slug}',
    path: { slug },
    method: 'get',
    query: { page, limit },
  });

type CategoryInput = {
  name: string;
  description?: string;
  parentId?: number | null;
};

// Update category
export async function updateCategory(id: string, data: CategoryInput): Promise<Category> {
  const response = await fetch(`/api/category/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      parentId: data.parentId ?? null,
    }),
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
