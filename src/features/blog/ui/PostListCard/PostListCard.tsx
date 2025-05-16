import { Tag } from '@/shared/ui';
import { motion } from 'framer-motion';

type Post = {
  id: number;
  title: string;
  category: string;
  date: string;
  summary: string;
  author: string;
};

export const PostListCard = ({ post }: { post: Post }) => {
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
    >
      <Tag color='neon' spacing='tight'>
        #{post.category}
      </Tag>
      <h2 className='text-lg font-extrabold text-blue-100 mt-1'>{post.title}</h2>
      <p className='text-sm text-blue-100'>{post.summary}</p>
      <div className='flex items-center justify-between mt-2 text-xs text-blue-200'>
        <span>{post.author ? post.author : '관리자'}</span>
        <span>{post.date}</span>
      </div>
      <hr className='my-6 border-blue-900/40' />
    </motion.div>
  );
};
