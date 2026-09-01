import { motion } from 'framer-motion';
import Link from 'next/link';
import { getBlogIndexHref } from '@/widgets/post/lib/blog-index-path';

const getTagHref = (name: string) => getBlogIndexHref({ tags: name });

type TagProps = {
  tag: { id?: number; name?: string };
  count: number;
  variant?: 'default' | 'sidebar';
};

export const Tag = ({ tag, count, variant = 'default' }: TagProps) => {
  const isSidebar = variant === 'sidebar';

  if (isSidebar) {
    return (
      <motion.span whileHover={{ scale: 1.02 }} className='inline-flex'>
        <Link
          href={getTagHref(tag.name ?? '')}
          aria-label={`${tag.name ?? ''}, ${count}개의 글`}
          className='inline-flex min-h-8 items-center gap-2 rounded-full border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 py-1 pl-2.5 pr-1.5 text-xs font-semibold tracking-wide text-[#ffd4b0] transition hover:border-[#ff9a3c]/45 dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/10 dark:text-[#b8e4ff] dark:hover:border-[#3de8ff]/45'
        >
          <span className='max-w-[9rem] truncate'>{tag.name}</span>
          <span
            className='flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#ff9a3c]/25 px-1 text-xs font-semibold leading-none text-[#fff4e8] dark:bg-[#3de8ff]/25 dark:text-[#f4fbff]'
            aria-hidden
          >
            {count}
          </span>
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.span
      key={tag.id}
      whileHover={{ scale: 1.06 }}
      className='relative rounded-lg border border-[#ff9a3c]/25 bg-[#ff9a3c]/8 px-2 py-1 text-xs font-mono shadow-[0_0_10px_rgba(255,154,60,0.1)] transition dark:border-[#3de8ff]/25 dark:bg-[#3de8ff]/8 dark:shadow-[0_0_10px_rgba(61,232,255,0.1)]'
    >
      <Link
        href={getTagHref(tag.name ?? '')}
        className='inline-block px-3 py-1 text-xs font-mono text-[#ffc8a0] backdrop-blur-sm dark:text-[#3de8ff]'
      >
        {tag.name}
        <span className='ml-1.5 text-xs opacity-80'>({count})</span>
      </Link>
    </motion.span>
  );
};
