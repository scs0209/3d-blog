import type { CategoryResponse } from '@/entities/category/model';
import type { TagResponse } from '@/entities/tag/model';

export type SidebarData = {
  categories: CategoryResponse;
  tags: TagResponse;
};

export const getSidebarData = async (): Promise<SidebarData> => {
  const response = await fetch('/api/sidebar');

  if (!response.ok) {
    throw new Error(`Sidebar fetch failed: ${response.status}`);
  }

  return response.json();
};
