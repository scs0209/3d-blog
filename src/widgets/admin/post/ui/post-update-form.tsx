'use client';

import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Loader2, Save, Tag as TagIcon, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useOptimistic, useRef, useState } from 'react';
import type { PostResponse } from '@/entities/post/model/post';
import { deletePostAction, updatePostAction } from '@/features/admin/post/api';
import { CategorySelector, TagsSelector } from '@/features/admin/post/ui';
import type { CategorySelectorRef } from '@/features/admin/post/ui/category-selector';
import type { TagsSelectorRef } from '@/features/admin/post/ui/tags-selector';
import { Button } from '@/shadcn-ui/components/ui/button';
import { cn } from '@/shadcn-ui/lib/utils';
import { invalidateCatalogQueries } from '@/shared/lib/invalidate-catalog-queries';
import { useToast } from '@/shared/ui';
import NovelEditor from '@/shared/ui/TextEditor/novel-editor';
import { formatDateToYMD } from '@/shared/utils';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';
import { adminFormTheme } from '@/widgets/admin/ui/admin-form-theme';

interface PostUpdateClientProps {
  initialPost: PostResponse;
}

export function PostUpdateForm({ initialPost }: PostUpdateClientProps) {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [post, setPost] = useState<PostResponse>(initialPost);
  const [content, setContent] = useState(initialPost.content ?? '');

  const categoryRef = useRef<CategorySelectorRef>(null);
  const tagsRef = useRef<TagsSelectorRef>(null);

  const [, updateAction, isUpdatePending] = useActionState(async (_prevState: unknown, _formData: FormData) => {
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
      toast.success('포스트를 저장했습니다');
      void invalidateCatalogQueries(queryClient);
      void queryClient.invalidateQueries({
        queryKey: ['post', 'summary', String(initialPost.id)],
      });
    } else {
      toast.error(result.error || '포스트 저장에 실패했습니다');
    }

    return result;
  }, null);

  const [, deleteAction, isDeletePending] = useActionState(async (_prevState: unknown) => {
    const result = await deletePostAction(Number(initialPost.id));

    if (result.success) {
      toast.success('포스트를 삭제했습니다');
      await invalidateCatalogQueries(queryClient);
      router.push('/admin');
      router.refresh();
    } else {
      toast.error(result.error || '포스트 삭제에 실패했습니다');
    }

    return result;
  }, null);

  const [optimisticPost, setOptimisticPost] = useOptimistic(post, (_currentPost, newPost: PostResponse) => newPost);

  const handleOptimisticUpdate = () => {
    const optimisticUpdate = {
      ...post,
      content,
      updatedAt: new Date().toISOString(),
    };
    setOptimisticPost(optimisticUpdate);
  };

  const displayPost = optimisticPost || post;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className='mx-auto max-w-5xl space-y-5 pb-8'
    >
      <div className={`relative overflow-hidden p-5 sm:p-6 ${adminTheme.surface}`}>
        <span className={adminTheme.cardTopGlow} aria-hidden />

        <h2 className={`mb-4 text-2xl font-bold leading-tight lg:text-3xl ${adminTheme.textPrimary}`}>
          {displayPost.title}
        </h2>

        <div className={`mb-5 flex flex-wrap items-center gap-4 text-sm ${adminTheme.textMuted}`}>
          <div className='flex items-center gap-2'>
            <User className={`h-4 w-4 ${adminTheme.textAccent}`} />
            <span className={`font-medium ${adminTheme.textPrimary}`}>{displayPost.author?.name || '작성자 없음'}</span>
          </div>

          <div className='flex items-center gap-2'>
            <Calendar className={`h-4 w-4 ${adminTheme.textAccent}`} />
            <span>{formatDateToYMD(displayPost?.createdAt ?? '')}</span>
          </div>

          {displayPost.category && (
            <div className='flex items-center gap-2'>
              <TagIcon className={`h-4 w-4 ${adminTheme.textAccent}`} />
              <span className={adminTheme.pill}>{displayPost.category.name}</span>
            </div>
          )}

          {optimisticPost !== post && (
            <div className='flex items-center gap-2'>
              <Loader2 className={`h-3 w-3 animate-spin ${adminTheme.textAccent}`} />
              <span className={`text-xs ${adminTheme.textAccent}`}>업데이트 중...</span>
            </div>
          )}
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <CategorySelector ref={categoryRef} initialCategoryId={initialPost.category?.id?.toString() ?? ''} />
          <TagsSelector
            ref={tagsRef}
            initialTagIds={
              initialPost.tags?.map((tag) => tag.id?.toString()).filter((id): id is string => Boolean(id)) ?? []
            }
          />
        </div>
      </div>

      <div className='space-y-2'>
        <p className={adminTheme.sectionLabel}>본문</p>
        <NovelEditor value={content} onChange={setContent} />
      </div>

      <div className={`flex flex-wrap justify-end gap-3 ${adminFormTheme.divider}`}>
        <form action={updateAction} className='contents'>
          <Button
            type='submit'
            size='lg'
            disabled={isUpdatePending}
            className={cn('flex items-center gap-2', adminTheme.primaryBtn)}
            onClick={handleOptimisticUpdate}
          >
            {isUpdatePending ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
            {isUpdatePending ? '저장 중...' : '포스트 저장'}
          </Button>
        </form>

        <form action={deleteAction} className='contents'>
          <Button
            type='submit'
            variant='destructive'
            size='lg'
            disabled={isDeletePending}
            className='border border-red-400/30 bg-red-500/20 text-red-300 backdrop-blur-md transition-all duration-300 hover:bg-red-500/30 hover:text-red-200'
          >
            {isDeletePending ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='h-4 w-4' />}
            {isDeletePending ? '삭제 중...' : '포스트 삭제'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
