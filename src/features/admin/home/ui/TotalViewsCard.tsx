import { getStats } from '../api/stats-api';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import { Tag } from '@/shared/ui/Tag';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';
import { TrendingUp } from 'lucide-react';

export async function TotalViewsCard() {
  const stats = await getStats();
  const { total, thisMonth, lastMonth } = stats.views;

  return (
    <Card className={adminTheme.card}>
      <span className={adminTheme.cardTopGlow} aria-hidden />
      <CardHeader className='pb-0'>
        <CardDescription className={adminTheme.sectionLabel}>조회수</CardDescription>
        <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${adminTheme.textPrimary}`}>
          {total.toLocaleString()}
        </CardTitle>
        <CardAction>
          <Tag color='amber' size='sm' type='glass' className='flex items-center gap-1.5 border-white/20'>
            <TrendingUp className='h-3.5 w-3.5' />+{thisMonth}
          </Tag>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 pt-2 text-sm'>
        <div className={`font-medium ${adminTheme.textPrimary}`}>이번 달 {thisMonth}</div>
        <div className={adminTheme.textMuted}>지난달 {lastMonth}</div>
      </CardFooter>
    </Card>
  );
}
