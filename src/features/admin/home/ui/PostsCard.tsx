import { getStats } from '../api/stats-api';
import { Card, CardHeader, CardTitle, CardAction, CardFooter, CardDescription } from '@/shadcn-ui/components/ui/card';
import { Tag } from '@/shared/ui/Tag';
import { TrendingUp, TrendingDown } from 'lucide-react';

export async function PostsCard() {
  const stats = await getStats();
  const { total, thisMonth, lastMonth } = stats.posts;

  // 증감률 계산
  const growthRate = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
  const isPositive = growthRate >= 0;

  return (
    <Card className='aspect-video glass-card-float-shimmer shadow-glass'>
      <CardHeader>
        <CardDescription>Total Posts</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
          {total.toLocaleString()}
        </CardTitle>
        <CardAction>
          <Tag color={isPositive ? 'green' : 'red'} size='sm' type='glass' className='flex items-center gap-2'>
            {isPositive ? <TrendingUp /> : <TrendingDown />}
            {Math.abs(growthRate).toFixed(1)}%
          </Tag>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>This month: {thisMonth} posts</div>
        <div className='text-muted-foreground'>Last month: {lastMonth} posts</div>
      </CardFooter>
    </Card>
  );
}
