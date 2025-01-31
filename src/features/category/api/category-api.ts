import { CategoryFormSchema } from '../model/category-schema';

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
