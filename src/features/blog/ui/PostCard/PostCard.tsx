import type { PostResponse } from '@/entities/post/model/post';
import { formatDateToYMD } from '@/shared/utils';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

type PostCardProps = {
  post: PostResponse;
  /** 목록에서의 순번. 부품 번호처럼 찍는다 */
  index?: number;
};

/** 최근 글 한 칸. 부품 외곽선처럼 가는 테두리에 번호·분류·제목·날짜만 둔다 */
export const PostCard = ({ post, index = 0 }: PostCardProps) => {
  return (
    <article
      className={`flex h-full min-h-[11rem] flex-col p-5 transition-colors ${blogTheme.card} group-hover/card:bg-white/[0.08] group-focus-visible/card:bg-white/[0.08]`}
    >
      <div className='flex items-center justify-between text-[13px]'>
        <span className='text-[#8d98a3]'>{String(index + 1).padStart(2, '0')}</span>
        {post.category?.name ? <span className='truncate pl-3 text-[#4de3ff]'>{post.category.name}</span> : null}
      </div>
      <h3 className='mt-5 line-clamp-3 break-keep font-[family-name:var(--font-syne),sans-serif] text-[17px] font-semibold leading-snug text-[#e9edf1]'>
        {post.title}
      </h3>
      <time className='mt-auto pt-5 text-[13px] tabular-nums text-[#8d98a3]'>
        {formatDateToYMD(post.createdAt ?? '')}
      </time>
    </article>
  );
};
