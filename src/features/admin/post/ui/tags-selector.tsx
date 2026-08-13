'use client';

import { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { useTags } from '@/features/tag/model';
import { Tag as TagIcon } from 'lucide-react';
import { Tag, type ColorToken } from '@/shared/ui/Tag';
import { cn } from '@/shadcn-ui/lib/utils';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

export interface TagsSelectorRef {
  getSelectedTagIds: () => string[];
  setSelectedTagIds: (tagIds: string[]) => void;
}

interface TagsSelectorProps {
  initialTagIds?: string[];
}

const TAG_COLORS: ColorToken[] = ['orange', 'cyan', 'amber', 'rose', 'violet', 'emerald', 'sky'];

const hashTagColor = (name: string): ColorToken => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length] ?? 'orange';
};

export const TagsSelector = forwardRef<TagsSelectorRef, TagsSelectorProps>(({ initialTagIds = [] }, ref) => {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  const { data: tags } = useTags();

  useEffect(() => {
    setSelectedTagIds(initialTagIds);
  }, [initialTagIds]);

  useImperativeHandle(ref, () => ({
    getSelectedTagIds: () => selectedTagIds,
    setSelectedTagIds: (tagIds: string[]) => setSelectedTagIds(tagIds),
  }));

  const handleTagToggle = (tagId: string) => {
    const newTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    setSelectedTagIds(newTagIds);
  };

  return (
    <div className='space-y-2'>
      <span className={`flex h-4 items-center gap-1.5 ${adminTheme.sectionLabel}`}>
        <TagIcon className='h-3 w-3' />
        태그
        {tags && tags.length > 0 && (
          <span className={`ml-1 normal-case tracking-normal ${adminTheme.textMuted}`}>({selectedTagIds.length})</span>
        )}
      </span>
      <div className={adminTheme.fieldBox}>
        {!tags || tags.length === 0 ? (
          <p className={`shrink-0 text-xs ${adminTheme.textMuted}`}>등록된 태그 없음</p>
        ) : (
          tags.map((tag) => {
            if (tag.id == null) return null;
            const id = String(tag.id);
            const selected = selectedTagIds.includes(id);

            return (
              <button
                key={tag.id}
                type='button'
                onClick={() => handleTagToggle(id)}
                aria-pressed={selected}
                aria-label={`${tag.name} 태그 ${selected ? '해제' : '선택'}`}
                className={cn(
                  'shrink-0 rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/40 dark:focus-visible:ring-[#3de8ff]/40',
                  selected ? 'scale-[1.02]' : 'opacity-70 hover:opacity-100',
                )}
              >
                <Tag
                  color={hashTagColor(tag.name ?? '')}
                  size='sm'
                  type={selected ? 'solid' : 'glass'}
                  spacing='tight'
                  className='mb-0 cursor-pointer'
                >
                  {tag.name}
                </Tag>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
});

TagsSelector.displayName = 'TagsSelector';
