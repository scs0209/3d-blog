'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-ui/components/ui/select';
import { useCategories } from '@/features/category/model';

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
        <label className='text-xs font-medium text-muted-foreground flex items-center gap-1'>
          <span className='w-1.5 h-1.5 bg-blue-400 rounded-full'></span>
          카테고리
        </label>
        <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
          <SelectTrigger className='h-9 bg-muted/10 border-muted-foreground/20 text-foreground hover:bg-muted/20 transition-colors text-sm'>
            <SelectValue placeholder='카테고리 선택' />
          </SelectTrigger>
          <SelectContent className='bg-muted/95 backdrop-blur-sm border-muted-foreground/20'>
            {categories?.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id.toString()}
                className='hover:bg-muted/50 focus:bg-muted/50 text-sm'
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);
