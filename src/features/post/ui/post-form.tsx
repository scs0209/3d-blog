'use client';
import { Button } from '@/shadcn-ui/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn-ui/components/ui/form';
import { Input } from '@/shadcn-ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-ui/components/ui/select';
import NovelEditor from '@/shared/ui/TextEditor/novel-editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type PostFormSchema, postFormSchema } from '../model/post-form-schema';
import { useCategories } from '@/features/category/model';

type PostFormProps = {
  onSubmit: (data: PostFormSchema) => Promise<void>;
};

const PostForm = ({ onSubmit }: PostFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: categories } = useCategories();

  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: '',
      categoryName: '',
    },
  });

  const handleFormSubmit = async (data: PostFormSchema) => {
    setIsLoading(true);
    const serverData = {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
    };

    try {
      await onSubmit(serverData);
      form.reset();
    } catch (error) {
      console.error('Failed to create blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder='블로그 포스트 제목' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>내용</FormLabel>
              <FormControl>
                <NovelEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>블로그 내용을 작성하세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='categoryName'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const categoryId = categories?.find((c) => c.name === value)?.id;
                      form.setValue('categoryId', categoryId ? categoryId.toString() : '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='카테고리를 선택하세요' defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>최소 1개의 카테고리를 선택해야 합니다.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type='submit' disabled={isLoading}>
          {isLoading ? '게시 중...' : '게시하기'}
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
