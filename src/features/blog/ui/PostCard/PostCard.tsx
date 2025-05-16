import { motion, useMotionValue } from 'framer-motion';
import { CardPattern } from './CardPattern';

type Post = {
  id: number;
  title: string;
  category: string;
  date: string;
  summary: string;
};

export const PostCard = ({ post }: { post: Post }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      key={`${post.id}-card`}
      whileHover={{ scale: 1.04, boxShadow: '0 0 16px #7dd3fc, 0 0 32px #7dd3fc55' }}
      className='relative aspect-square  bg-transparent rounded-xl border border-blue-300 shadow-[0_0_12px_#7dd3fc55] flex flex-col items-center justify-between p-4 overflow-hidden transition'
    >
      <div
        key={`${post.id}-card`}
        onMouseMove={onMouseMove}
        className='group/card rounded-3xl w-full relative flex flex-col items-center justify-between overflow-hidden bg-transparent  h-full'
      >
        <CardPattern mouseX={mouseX} mouseY={mouseY} />
        {/* {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title} className='w-full h-1/2 object-cover rounded-md mb-2' />
        )} */}
        <span className='text-xs font-bold text-blue-200 mb-1'>{post.category}</span>
        <h2 className='text-base font-extrabold text-blue-100 text-center line-clamp-2 mb-1'>{post.title}</h2>
        <span className='text-xs text-blue-300 mt-auto'>{post.date}</span>
      </div>
    </motion.div>
  );
};
