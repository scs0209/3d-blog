'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/shadcn-ui/components/ui/button';
import { useTags } from '@/features/tag/model';
import { Tag, Plus } from 'lucide-react';

export interface TagsSelectorRef {
  getSelectedTagIds: () => string[];
  setSelectedTagIds: (tagIds: string[]) => void;
}

interface TagsSelectorProps {
  initialTagIds?: string[];
}

export const TagsSelector = forwardRef<TagsSelectorRef, TagsSelectorProps>(
  ({ initialTagIds = [] }, ref) => {
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
    const { data: tags } = useTags();

    // 초기값이 변경되면 내부 상태도 업데이트
    useEffect(() => {
      setSelectedTagIds(initialTagIds);
    }, [initialTagIds]);

    // ref를 통해 외부에서 접근할 수 있는 메서드들
    useImperativeHandle(ref, () => ({
      getSelectedTagIds: () => selectedTagIds,
      setSelectedTagIds: (tagIds: string[]) => setSelectedTagIds(tagIds),
    }));

    const handleTagToggle = (tagId: string) => {
      const newTagIds = selectedTagIds.includes(tagId) 
        ? selectedTagIds.filter(id => id !== tagId)
        : [...selectedTagIds, tagId];
      
      setSelectedTagIds(newTagIds);
    };

    if (!tags || tags.length === 0) {
      return (
        <div className='space-y-2'>
          <label className='text-xs font-medium text-muted-foreground flex items-center gap-1'>
            <Tag className='w-3 h-3 text-blue-400' />
            태그
          </label>
          <div className='flex items-center justify-center py-4 px-3 border border-dashed border-muted-foreground/20 rounded-md bg-muted/5'>
            <div className='text-center space-y-1'>
              <Tag className='w-4 h-4 text-muted-foreground/50 mx-auto' />
              <p className='text-xs text-muted-foreground'>태그 없음</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='space-y-2'>
        <label className='text-xs font-medium text-muted-foreground flex items-center gap-1'>
          <Tag className='w-3 h-3 text-blue-400' />
          태그
          <span className='text-xs text-muted-foreground ml-1'>
            ({selectedTagIds.length})
          </span>
        </label>
        <div className='flex flex-wrap gap-1.5 min-h-[40px] p-2 border border-muted-foreground/20 rounded-md bg-muted/5'>
          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant={selectedTagIds.includes(tag.id?.toString() ?? '') ? 'default' : 'outline'}
              size='sm'
              onClick={() => handleTagToggle(tag.id?.toString() ?? '')}
              className={`h-7 px-2 text-xs transition-all duration-200 ${
                selectedTagIds.includes(tag.id?.toString() ?? '')
                  ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 shadow-sm'
                  : 'bg-muted/20 border-muted-foreground/30 text-foreground hover:bg-muted/40 hover:border-muted-foreground/50'
              }`}
            >
              {selectedTagIds.includes(tag.id?.toString() ?? '') ? (
                <Plus className='w-2.5 h-2.5 mr-1 rotate-45' />
              ) : (
                <Plus className='w-2.5 h-2.5 mr-1' />
              )}
              {tag.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }
);
