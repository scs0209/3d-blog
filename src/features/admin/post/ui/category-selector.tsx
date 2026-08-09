'use client';

import { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-ui/components/ui/select';
import { useCategories } from '@/features/category/model';
import { buildCategoryTree, flattenCategoryTree } from '@/entities/category/lib/build-category-tree';

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

    // 초기값이 변경되면 내부 상태도 업데이트
    useEffect(() => {
      setSelectedCategoryId(initialCategoryId);
    }, [initialCategoryId]);

    // ref를 통해 외부에서 접근할 수 있는 메서드들
    useImperativeHandle(ref, () => ({
      getSelectedCategoryId: () => selectedCategoryId,
      setSelectedCategoryId: (categoryId: string) => setSelectedCategoryId(categoryId),
    }));

    const handleCategoryChange = (categoryId: string) => {
      setSelectedCategoryId(categoryId);
    };

    return (
      <div className='space-y-2'>
        <span className='text-xs font-medium text-muted-foreground flex items-center gap-1'>
          <span className='w-1.5 h-1.5 bg-blue-400 rounded-full' />
          카테고리
        </span>
        <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
          <SelectTrigger className='h-9 w-full border-white/30 bg-white/10 text-foreground backdrop-blur-md hover:bg-white/15 transition-colors text-sm'>
            <SelectValue placeholder='카테고리 선택' />
          </SelectTrigger>
          <SelectContent className='z-[100] overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-white/20 via-[#1b2133]/85 to-[#151a28]/90 text-white shadow-[0_0_30px_rgba(255,255,255,0.18)] backdrop-blur-2xl'>
            {flatOptions.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
                className='rounded-md text-sm focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white'
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
