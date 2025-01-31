'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shadcn-ui/components/ui/button';
import { Input } from '@/shadcn-ui/components/ui/input';
import { Textarea } from '@/shadcn-ui/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn-ui/components/ui/form';
import {
  categoryFormSchema,
  CategoryFormSchema,
} from '../model/category-schema';
import { createCategory } from '../api/category-api';

export function CategoryForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  const handleCreateCategory = async (data: CategoryFormSchema) => {
    try {
      await createCategory(data);
      alert('성공');
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleFormSubmit = async (data: CategoryFormSchema) => {
    setIsLoading(true);
    try {
      await handleCreateCategory(data);
      form.reset();
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>카테고리 이름</FormLabel>
              <FormControl>
                <Input placeholder="카테고리 이름" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>슬러그</FormLabel>
              <FormControl>
                <Input placeholder="category-slug" {...field} />
              </FormControl>
              <FormDescription>
                URL에 사용될 고유 식별자입니다. 소문자, 숫자, 하이픈(-)만 사용
                가능합니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명 (선택사항)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="카테고리에 대한 간단한 설명을 입력하세요."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '생성 중...' : '카테고리 생성'}
        </Button>
      </form>
    </Form>
  );
}
