'use client';

import { useState, useEffect, useActionState, useOptimistic } from 'react';
import { motion } from 'framer-motion';
import { deletePost, getPostDetail, updatePost } from '@/features/post/api/post-api';
import { formatDateToYMD } from '@/shared/utils';
import type { PostResponse } from '@/entities/post/model/post';
import NovelEditor from '@/shared/ui/TextEditor/novel-editor';
import { Button } from '@/shadcn-ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import { Tag as TagComponent, useToast } from '@/shared/ui';
import { Save, Trash2, Calendar, User, Tag, Loader2 } from 'lucide-react';

export default function PostUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const toast = useToast();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  // React 19: useOptimistic for optimistic UI updates
  const [optimisticPost, setOptimisticPost] = useOptimistic(post, (_currentPost, newPost: PostResponse) => newPost);

  // React 19: useActionState for update action
  const [updateError, updateAction, isUpdatePending] = useActionState(
    async (_previousState: string | null, _formData: FormData) => {
      if (!post) return 'Post not found';

      try {
        const resolvedParams = await params;
        const updatedPost = await updatePost(Number(resolvedParams.id), {
          title: post.title ?? '',
          content: content,
          categoryId: post.category?.id ?? 0,
        });
        setPost(updatedPost);
        toast.success('Post updated successfully');
        return null; // Success
      } catch (error) {
        console.error('Failed to update post:', error);
        toast.error('Failed to update post');
        return 'Failed to update post';
      }
    },
    null,
  );

  // React 19: useActionState for delete action
  const [deleteError, deleteAction, isDeletePending] = useActionState(async (_previousState: string | null) => {
    try {
      const resolvedParams = await params;
      await deletePost(Number(resolvedParams.id));
      setPost(null);
      return null; // Success
    } catch (error) {
      console.error('Failed to delete post:', error);
      return 'Failed to delete post';
    }
  }, null);

  // React 19: Enhanced data fetching with better error handling
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const resolvedParams = await params;
        const data = await getPostDetail(Number(resolvedParams.id));
        setPost(data);
        setContent(data.content ?? '');
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  // React 19: Optimistic update helper
  const handleOptimisticUpdate = () => {
    if (!post) return;

    // Set optimistic state immediately
    const optimisticUpdate = {
      ...post,
      content: content,
      updatedAt: new Date().toISOString(),
    };
    setOptimisticPost(optimisticUpdate);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='glass-card-float-shimmer p-8'>
          <div className='flex items-center gap-3'>
            <Loader2 className='h-6 w-6 animate-spin text-blue-400' />
            <span className='text-blue-200 font-medium'>포스트를 불러오는 중...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='glass-card-float-shimmer p-8'>
          <div className='text-center'>
            <h2 className='text-xl font-semibold text-red-300 mb-2'>포스트를 찾을 수 없습니다</h2>
            <p className='text-slate-400'>요청하신 포스트가 존재하지 않거나 삭제되었습니다.</p>
          </div>
        </Card>
      </div>
    );
  }

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='flex flex-wrap items-center gap-4 text-sm text-blue-200'
        >
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

      {/* React 19: Form Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='flex gap-4 justify-end'
      >
        {/* Update Form with Action */}
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

        {/* Delete Form with Action */}
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

      {/* Error Messages */}
      {updateError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300'
        >
          <p className='text-sm font-medium'>업데이트 오류: {updateError}</p>
        </motion.div>
      )}

      {deleteError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300'
        >
          <p className='text-sm font-medium'>삭제 오류: {deleteError}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
