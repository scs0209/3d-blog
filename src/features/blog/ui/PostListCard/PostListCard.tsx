import type { PostResponse } from '@/entities/post/model/post';
import { Tag } from '@/shared/ui';
import { formatDateToYMD } from '@/shared/utils';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

type PostListCardProps = {
  post: PostResponse;
};

export const PostListCard = ({ post }: PostListCardProps) => {
  const router = useRouter();

  return (
    <motion.div
      key={`${post.id}-list`}
      whileHover={{
        scale: 1.015,
        boxShadow: '0 0 16px #7dd3fc, 0 0 32px #7dd3fc55',
        backgroundColor: '#232946cc',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className='rounded-lg px-4 py-3 transition cursor-pointer'
      onClick={() => router.push(`/blog/category/${post.category?.slug}/post/${post?.slug}`)}
    >
      <div className='flex items-center justify-between'>
        <Tag color='neon' spacing='tight'>
          #{post.category?.name}
        </Tag>
        <span className='flex items-center justify-center gap-1 text-blue-300 text-xs'>
          <Eye size={15} className='inline-block' />
          {post?.views ?? 0}
        </span>
      </div>
      <h2 className='text-lg font-extrabold text-blue-100 mt-1'>{post?.title}</h2>
      <div className='flex items-center justify-between mt-2 text-xs text-blue-200'>
        <span>{post?.author ? post?.author?.name : '관리자'}</span>
        <span>{formatDateToYMD(post?.updatedAt ?? '')}</span>
      </div>
      <hr className='my-6 border-blue-900/40' />
    </motion.div>
  );
};
