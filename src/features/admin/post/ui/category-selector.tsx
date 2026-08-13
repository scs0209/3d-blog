'use client';

import { useEffect, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-ui/components/ui/select';
import { useCategories } from '@/features/category/model';
import { buildCategoryTree, flattenCategoryTree } from '@/entities/category/lib/build-category-tree';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

export interface CategorySelectorRef {
  getSelectedCategoryId: () => string;
  setSelectedCategoryId: (categoryId: string) => void;
}

interface CategorySelectorProps {
  initialCategoryId?: string;
}

export const CategorySelector = forwardRef<CategorySelectorRef, CategorySelectorProps>(
  ({ initialCategoryId = '' }, ref) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
    const { data: categories } = useCategories();

    const flatOptions = useMemo(() => {
      const list = (categories ?? []).map((category) => ({
        id: category.id,
        parentId: category.parentId ?? null,
        name: category.name,
      }));
      return flattenCategoryTree(buildCategoryTree(list));
    }, [categories]);

    useEffect(() => {
      setSelectedCategoryId(initialCategoryId);
    }, [initialCategoryId]);

    useImperativeHandle(ref, () => ({
      getSelectedCategoryId: () => selectedCategoryId,
      setSelectedCategoryId: (categoryId: string) => setSelectedCategoryId(categoryId),
    }));

    const handleCategoryChange = (categoryId: string) => {
      setSelectedCategoryId(categoryId);
    };

    return (
      <div className='space-y-2'>
        <span className={`flex h-4 items-center gap-1.5 ${adminTheme.sectionLabel}`}>
          <span className='h-1.5 w-1.5 rounded-full bg-[#ff9a3c] dark:bg-[#3de8ff]' aria-hidden />
          카테고리
        </span>
        <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
          <SelectTrigger className={adminTheme.selectTrigger}>
            <SelectValue placeholder='카테고리 선택' />
          </SelectTrigger>
          <SelectContent className={adminTheme.selectContent}>
            {flatOptions.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
                className='rounded-md text-sm focus:bg-[#ff9a3c]/15 focus:text-[#ffe8d0] data-[highlighted]:bg-[#ff9a3c]/15 data-[highlighted]:text-[#ffe8d0] dark:focus:bg-[#3de8ff]/12 dark:focus:text-[#c8e8ff] dark:data-[highlighted]:bg-[#3de8ff]/12 dark:data-[highlighted]:text-[#c8e8ff]'
              >
                {`${'—'.repeat(category.depth)}${category.depth > 0 ? ' ' : ''}${category.name}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

CategorySelector.displayName = 'CategorySelector';
