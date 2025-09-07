'use client';

import type { Category } from '@/entities/category/model';
import { Button } from '@/shadcn-ui/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn-ui/components/ui/form';
import { Input } from '@/shadcn-ui/components/ui/input';
import { Textarea } from '@/shadcn-ui/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type CategoryFormSchema, categoryFormSchema } from '../model/category-schema';

type CategoryFormProps = {
  onSubmit: (data: CategoryFormSchema) => Promise<void>;
  initialData?: Category;
};

const CategoryForm = ({ onSubmit, initialData }: CategoryFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
    },
  });

  const handleFormSubmit = async (data: CategoryFormSchema) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
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
        <Button type='submit' disabled={isLoading}>
          {getButtonText(isLoading, initialData)}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
