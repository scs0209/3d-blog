'use client';

import { useState, useOptimistic, useActionState, useRef } from 'react';
import { motion } from 'framer-motion';
import { formatDateToYMD } from '@/shared/utils';
import type { PostResponse } from '@/entities/post/model/post';
import NovelEditor from '@/shared/ui/TextEditor/novel-editor';
import { Button } from '@/shadcn-ui/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import { Tag as TagComponent, useToast } from '@/shared/ui';
import { Save, Trash2, Calendar, User, Tag, Loader2 } from 'lucide-react';
import { updatePostAction, deletePostAction } from '@/features/admin/post/api';
import { CategorySelector, TagsSelector } from '@/features/admin/post/ui';
import type { CategorySelectorRef } from '@/features/admin/post/ui/category-selector';
import type { TagsSelectorRef } from '@/features/admin/post/ui/tags-selector';

interface PostUpdateClientProps {
  initialPost: PostResponse;
}

export function PostUpdateForm({ initialPost }: PostUpdateClientProps) {
  const toast = useToast();
  const [post, setPost] = useState<PostResponse>(initialPost);
  const [content, setContent] = useState(initialPost.content ?? '');

  // refs for child components
  const categoryRef = useRef<CategorySelectorRef>(null);
  const tagsRef = useRef<TagsSelectorRef>(null);

  // React 19: useActionState for update action
  const [, updateAction, isUpdatePending] = useActionState(async (prevState: any, formData: FormData) => {
    const categoryId = categoryRef.current?.getSelectedCategoryId() ?? '';
    const tagIds = tagsRef.current?.getSelectedTagIds() ?? [];

    const result = await updatePostAction(Number(initialPost.id), {
      title: post.title ?? '',
      content,
      categoryId: Number(categoryId),
      tagIds: tagIds.map((id) => Number(id)),
    });

    if (result.success && result.post) {
      setPost(result.post);
      toast.success('Post updated successfully');
    } else {
      toast.error(result.error || 'Failed to update post');
    }

    return result;
  }, null);

  // React 19: useActionState for delete action
  const [, deleteAction, isDeletePending] = useActionState(async (prevState: any) => {
    const result = await deletePostAction(Number(initialPost.id));

    if (result.success) {
      setPost(null as any);
      toast.success('Post deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete post');
    }

    return result;
  }, null);

  // React 19: useOptimistic for optimistic UI updates
  const [optimisticPost, setOptimisticPost] = useOptimistic(post, (_currentPost, newPost: PostResponse) => newPost);

  // React 19: Optimistic update helper
  const handleOptimisticUpdate = () => {
    const optimisticUpdate = {
      ...post,
      content: content,
      updatedAt: new Date().toISOString(),
    };
    setOptimisticPost(optimisticUpdate);
  };

  // Use optimistic post for display, fallback to actual post
  const displayPost = optimisticPost || post;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen p-4 lg:p-6 space-y-6'
    >
      {/* Header Card */}
      <CardHeader className='pb-4'>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <CardTitle className='text-2xl lg:text-3xl font-bold text-blue-100 mb-4 leading-tight'>
            {displayPost.title}
          </CardTitle>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className='space-y-4'>
          {/* Meta Info */}
          <div className='flex flex-wrap items-center gap-4 text-sm text-blue-200'>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4 text-blue-400' />
              <span className='font-medium'>{displayPost.author?.name || 'Unknown Author'}</span>
            </div>

            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-blue-400' />
              <span>{formatDateToYMD(displayPost?.createdAt ?? '')}</span>
            </div>

            {displayPost.category && (
              <div className='flex items-center gap-2'>
                <Tag className='h-4 w-4 text-blue-400' />
                <TagComponent color='blue' type='solid' className='bg-blue-500/20 text-blue-300 border-blue-400/30'>
                  {displayPost.category.name}
                </TagComponent>
              </div>
            )}

            {/* Show if optimistic update is happening */}
            {optimisticPost !== post && (
              <div className='flex items-center gap-2'>
                <Loader2 className='h-3 w-3 animate-spin text-amber-400' />
                <span className='text-xs text-amber-300'>업데이트 중...</span>
              </div>
            )}
          </div>

          {/* Category and Tags - Inline */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <CategorySelector ref={categoryRef} initialCategoryId={initialPost.category?.id?.toString() ?? ''} />
            </div>
            <div className='flex-1'>
              <TagsSelector
                ref={tagsRef}
                initialTagIds={
                  initialPost.tags?.map((tag) => tag.id?.toString()).filter((id): id is string => Boolean(id)) ?? []
                }
              />
            </div>
          </div>
        </motion.div>
      </CardHeader>

      {/* Editor Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <CardContent className='p-6 w-full justify-center flex'>
          <div className='prose prose-invert max-w-none'>
            <NovelEditor value={content} onChange={setContent} />
          </div>
        </CardContent>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='flex gap-4 justify-end'
      >
        <form action={updateAction} className='contents'>
          <Button
            type='submit'
            variant='glass'
            size='lg'
            disabled={isUpdatePending}
            className='flex items-center gap-2'
            onClick={handleOptimisticUpdate}
          >
            {isUpdatePending ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
            {isUpdatePending ? '업데이트 중...' : '포스트 저장'}
          </Button>
        </form>

        <form action={deleteAction} className='contents'>
          <Button
            type='submit'
            variant='destructive'
            size='lg'
            disabled={isDeletePending}
            className='bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 hover:text-red-200 backdrop-blur-md transition-all duration-300'
          >
            {isDeletePending ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='h-4 w-4' />}
            {isDeletePending ? '삭제 중...' : '포스트 삭제'}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
