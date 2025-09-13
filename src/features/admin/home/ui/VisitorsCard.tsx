import { getVisitor } from '@/features/visitor/api';
import { Card, CardHeader, CardTitle, CardAction, CardFooter, CardDescription } from '@/shadcn-ui/components/ui/card';
import { Tag } from '@/shared/ui/Tag';
import { TrendingUp } from 'lucide-react';

export async function VisitorsCard() {
  const visitor = await getVisitor();

  return (
    <Card className='aspect-video glass-card-float-shimmer shadow-glass'>
      <CardHeader>
        <CardDescription>Total Visitors</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{visitor.total}</CardTitle>
        <CardAction>
          <Tag color='blue' size='sm' type='glass' className='flex items-center gap-2 border-white/30'>
            <TrendingUp />+{visitor.today}
          </Tag>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>Trending up this month</div>
        <div className='text-muted-foreground flex items-center gap-2'>
          {visitor.today} <TrendingUp className='size-4' />
        </div>
      </CardFooter>
    </Card>
  );
}
