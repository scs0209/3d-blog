'use client';

import { Button } from '@/shadcn-ui/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn-ui/components/ui/form';
import { Input } from '@/shadcn-ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-ui/components/ui/select';
import NovelEditor from '@/shared/ui/TextEditor/novel-editor';
import { Tag as TagIcon, Loader2, Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type PostFormSchema, postFormSchema } from '../model/post-form-schema';
import { useCategories } from '@/features/category/model';
import { useTags } from '@/features/tag/model';
import { buildCategoryTree, flattenCategoryTree } from '@/entities/category/lib/build-category-tree';
import { Tag, type ColorToken } from '@/shared/ui/Tag';
import { cn } from '@/shadcn-ui/lib/utils';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';
import { adminFormTheme } from '@/widgets/admin/ui/admin-form-theme';

type PostFormProps = {
  onSubmit: (data: PostFormSchema) => Promise<void>;
};

const TAG_COLORS: ColorToken[] = ['orange', 'cyan', 'amber', 'rose', 'violet', 'emerald', 'sky'];

const hashTagColor = (name: string): ColorToken => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length] ?? 'orange';
};

const PostForm = ({ onSubmit }: PostFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const flatOptions = useMemo(() => {
    const list = (categories ?? []).map((category) => ({
      id: category.id,
      parentId: category.parentId ?? null,
      name: category.name,
    }));
    return flattenCategoryTree(buildCategoryTree(list));
  }, [categories]);

  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: '',
      categoryName: '',
      tagIds: [],
    },
  });

  const selectedTagIds = form.watch('tagIds') ?? [];

  const handleFormSubmit = async (data: PostFormSchema) => {
    setIsLoading(true);

    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Failed to create blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    form.setValue('tagIds', next, { shouldDirty: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-6'>
        <div className={`relative overflow-hidden p-5 sm:p-6 ${adminTheme.surface}`}>
          <span className={adminTheme.cardTopGlow} aria-hidden />

          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='space-y-2'>
                <FormLabel className={adminTheme.sectionLabel}>제목</FormLabel>
                <FormControl>
                  <Input
                    placeholder='어떤 이야기를 쓸까요?'
                    className={adminTheme.titleInput}
                    aria-label='포스트 제목'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='mt-6 grid gap-5 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <FormLabel className={`flex h-4 items-center gap-1.5 ${adminTheme.sectionLabel}`}>
                    <span className={adminFormTheme.accentDot} aria-hidden />
                    카테고리
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const category = flatOptions.find((c) => c.id.toString() === value);
                      form.setValue('categoryName', category?.name ?? '');
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className={adminTheme.selectTrigger}>
                        <SelectValue placeholder='카테고리 선택' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={adminTheme.selectContent}>
                      {flatOptions.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                          className={adminFormTheme.selectItem}
                        >
                          {`${'—'.repeat(category.depth)}${category.depth > 0 ? ' ' : ''}${category.name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tagIds'
              render={() => (
                <FormItem className='space-y-2'>
                  <FormLabel className={`flex h-4 items-center gap-1.5 ${adminTheme.sectionLabel}`}>
                    <TagIcon className='h-3 w-3' />
                    태그
                    <span className={`ml-1 normal-case tracking-normal ${adminTheme.textMuted}`}>
                      ({selectedTagIds.length})
                    </span>
                  </FormLabel>
                  <div className={adminTheme.fieldBox}>
                    {!tags || tags.length === 0 ? (
                      <p className={`shrink-0 text-xs ${adminTheme.textMuted}`}>등록된 태그가 없습니다</p>
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
                              `shrink-0 rounded-md transition ${adminFormTheme.focusRing}`,
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
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className={adminTheme.sectionLabel}>본문</FormLabel>
              <FormControl>
                <NovelEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={`flex items-center justify-end gap-3 ${adminFormTheme.divider}`}>
          <p className={`mr-auto hidden text-xs sm:block ${adminTheme.textMuted}`}>
            카테고리는 필수, 태그는 선택입니다
          </p>
          <Button type='submit' disabled={isLoading} className={cn('min-w-[132px]', adminTheme.primaryBtn)}>
            {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Send className='mr-2 h-4 w-4' />}
            {isLoading ? '게시 중...' : '게시하기'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
