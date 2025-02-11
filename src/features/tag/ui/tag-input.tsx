'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTag } from '../api/tag-api';
import { TagSchema, tagSchema } from '../model/tag-schema';
import { Tag } from '@/entities/tag/model';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shadcn-ui/components/ui/form';
import { Input } from '@/shadcn-ui/components/ui/input';
import { Button } from '@/shadcn-ui/components/ui/button';

type TagInputProps = {
  onTagsChange?: (tags: Tag[]) => void;
};

export function TagInput({ onTagsChange }: TagInputProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TagSchema>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleCreateTag = async (data: TagSchema) => {
    setIsLoading(true);
    try {
      const newTag = await createTag(data.name);
      setTags([...tags, newTag]);
      form.reset();
    } catch (error) {
      console.error('Failed to create tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateTag)}
          className="flex space-x-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input placeholder="새 태그 입력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '추가 중...' : '추가'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
