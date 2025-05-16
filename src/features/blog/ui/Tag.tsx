import { motion } from 'framer-motion';
import Link from 'next/link';

export const TagCloud = ({ tags }: { tags: { id: string; name: string; count: number }[] }) => {
  // 태그의 크기를 count에 따라 계산
  const getTagSize = (count: number) => {
    const min = Math.min(...tags.map((t) => t.count));
    const max = Math.max(...tags.map((t) => t.count));
    const range = max - min;
    const percent = range === 0 ? 1 : (count - min) / range;
    return 0.8 + percent * 0.7; // 0.8x - 1.5x 범위 내에서 크기 조정
  };

  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag) => {
        const size = getTagSize(tag.count);

        return (
          <motion.div
            key={tag.id}
            whileHover={{
              scale: 1.1,
              backgroundColor: 'rgba(236, 72, 153, 0.3)',
              color: '#f3e8ff',
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className='relative'
          >
            <Link
              href={`/tag/${tag.name}`}
              className='inline-block px-3 py-1 bg-purple-800/30 back drop-blur-sm rounded-full text-purple-200 text-xs font-medium'
              style={{
                fontSize: `${size}rem`,
              }}
            >
              #{tag.name}
              <motion.span
                className='absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {tag.count}
              </motion.span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};
