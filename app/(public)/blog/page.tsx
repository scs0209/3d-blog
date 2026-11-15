import { BlogIndexContent } from '@/widgets/post/ui/BlogIndexContent';
import { BlogLandingShell } from '@/widgets/post/ui/BlogLandingShell';

/** 블로그 첫 화면: 칩 안의 도시에 최근 글이 카드로 꽂혀 있고, 아래로 이전 글이 이어진다 */
export default function BlogPage() {
  return (
    <BlogLandingShell>
      <BlogIndexContent />
    </BlogLandingShell>
  );
}
