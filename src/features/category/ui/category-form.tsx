'use client';

import type { Category } from '@/entities/category/model';
import {
  buildCategoryTree,
  collectDescendantIds,
  flattenCategoryTree,
} from '@/entities/category/lib/build-category-tree';
import { useCategories } from '@/features/category/model';
import { Button } from '@/shadcn-ui/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn-ui/components/ui/form';
import { Input } from '@/shadcn-ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-ui/components/ui/select';
import { Textarea } from '@/shadcn-ui/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type CategoryFormSchema, categoryFormSchema } from '../model/category-schema';

type CategoryFormProps = {
  onSubmit: (data: CategoryFormSchema) => Promise<void>;
  initialData?: Category;
};

const ROOT_PARENT_VALUE = '__root__';

const CategoryForm = ({ onSubmit, initialData }: CategoryFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: categories } = useCategories();

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      parentId: initialData?.parentId ?? null,
    },
  });

  const parentOptions = useMemo(() => {
    const list = (categories ?? []).map((category) => ({
      id: category.id,
      parentId: category.parentId ?? null,
      name: category.name,
    }));

    const currentId = initialData?.id ? Number(initialData.id) : null;
    const blocked = currentId != null ? collectDescendantIds(list, currentId) : new Set<number>();
    const tree = buildCategoryTree(list.filter((category) => !blocked.has(category.id)));
    return flattenCategoryTree(tree);
  }, [categories, initialData?.id]);

  const handleFormSubmit = async (data: CategoryFormSchema) => {
    setIsLoading(true);
    try {
      await onSubmit({
        ...data,
        parentId: data.parentId ?? null,
      });
    } catch (error) {
      console.error('Failed to submit category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = (loading: boolean, initData?: Category): string => {
    if (loading) {
      return '처리 중...';
    }
    if (initData) {
      return '수정';
    }
    return '생성';
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>카테고리 이름</FormLabel>
              <FormControl>
                <Input placeholder='카테고리 이름' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명 (선택사항)</FormLabel>
              <FormControl>
                <Textarea placeholder='카테고리에 대한 간단한 설명을 입력하세요.' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='parentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>부모 카테고리</FormLabel>
              <Select
                value={field.value == null ? ROOT_PARENT_VALUE : String(field.value)}
                onValueChange={(value) => {
                  field.onChange(value === ROOT_PARENT_VALUE ? null : Number(value));
                }}
              >
                <FormControl>
                  <SelectTrigger className='w-full border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/15'>
                    <SelectValue placeholder='루트 카테고리' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  className='z-[100] overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-white/20 via-[#1b2133]/85 to-[#151a28]/90 text-white shadow-[0_0_30px_rgba(255,255,255,0.18)] backdrop-blur-2xl'
                >
                  <SelectItem
                    value={ROOT_PARENT_VALUE}
                    className='rounded-md focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white'
                  >
                    없음 (루트)
                  </SelectItem>
                  {parentOptions.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={String(category.id)}
                      className='rounded-md focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white'
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
        <Button type='submit' disabled={isLoading}>
          {getButtonText(isLoading, initialData)}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
