import type { CategoryListItem, CategoryResponse } from '../model';

type CategoryApiItem = CategoryResponse extends Array<infer Item> ? Item : never;

/** OpenAPI Category 응답을 사이드바/관리자용 CategoryListItem으로 정규화 */
export const toCategoryListItem = (category: CategoryApiItem): CategoryListItem => ({
  id: category.id,
  name: category.name,
  slug: category.slug ?? '',
  description: category.description ?? null,
  parentId: category.parentId ?? null,
  createdAt: category.createdAt,
  _count: category._count,
});

export const toCategoryListItems = (categories: CategoryResponse | undefined | null): CategoryListItem[] =>
  (categories ?? []).map(toCategoryListItem);
