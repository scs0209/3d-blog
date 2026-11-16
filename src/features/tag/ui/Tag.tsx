import Link from 'next/link';
import { getBlogIndexHref } from '@/widgets/post/lib/blog-index-path';

const getTagHref = (name: string) => getBlogIndexHref({ tags: name });

type TagProps = {
  tag: { id?: number; name?: string };
  count: number;
  variant?: 'default' | 'sidebar';
};

/** 태그: 고정폭 글씨의 작은 이름표와 글 수 */
export const Tag = ({ tag, count }: TagProps) => {
  return (
    <Link
      href={getTagHref(tag.name ?? '')}
      aria-label={`${tag.name ?? ''}, ${count}개의 글`}
      className='inline-flex items-center gap-2 rounded-md bg-white/[0.045] px-2.5 py-1 text-[13px] text-[#c3ccd4] transition-colors hover:bg-white/[0.09] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4de3ff]'
    >
      <span className='max-w-[9rem] truncate'>{tag.name}</span>
      <span className='text-[#8d98a3]' aria-hidden>
        {count}
      </span>
    </Link>
  );
};
