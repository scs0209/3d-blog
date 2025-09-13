import { getStats } from '../api/stats-api';
import { Card, CardHeader, CardTitle, CardAction, CardFooter, CardDescription } from '@/shadcn-ui/components/ui/card';
import { Tag } from '@/shared/ui/Tag';
import { TrendingUp } from 'lucide-react';

export async function TotalViewsCard() {
  const stats = await getStats();
  const { total, thisMonth, lastMonth } = stats.views;

  return (
    <Card className='aspect-video glass-card-float-shimmer shadow-glass'>
      <CardHeader>
        <CardDescription>Total Views</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{total}</CardTitle>
        <CardAction>
          <Tag color='green' size='sm' type='glass' className='flex items-center gap-2'>
            <TrendingUp />+{thisMonth}
          </Tag>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>This month: {thisMonth} views</div>
        <div className='text-muted-foreground'>Last month: {lastMonth} views</div>
      </CardFooter>
    </Card>
  );
}
