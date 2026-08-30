import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import { Tag } from '@/shared/ui/Tag';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';
import type { AdminStats } from '../api/stats-api';
import { getGrowthDisplay } from './get-growth-display';

type UsersCardProps = {
  users: AdminStats['users'];
};

export function UsersCard({ users }: UsersCardProps) {
  const { total, thisMonth, lastMonth } = users;
  const { label, isPositive } = getGrowthDisplay(thisMonth, lastMonth);

  return (
    <Card className={adminTheme.card}>
      <span className={adminTheme.cardTopGlow} aria-hidden />
      <CardHeader className='pb-0'>
        <CardDescription className={adminTheme.sectionLabel}>사용자</CardDescription>
        <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${adminTheme.textPrimary}`}>
          {total.toLocaleString()}
        </CardTitle>
        <CardAction>
          <Tag
            color={isPositive ? 'green' : 'red'}
            size='sm'
            type='glass'
            className='flex items-center gap-1.5 border-white/20'
          >
            {isPositive ? <TrendingUp className='h-3.5 w-3.5' /> : <TrendingDown className='h-3.5 w-3.5' />}
            {label}
          </Tag>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 pt-2 text-sm'>
        <div className={`font-medium ${adminTheme.textPrimary}`}>이번 달 {thisMonth}명</div>
        <div className={adminTheme.textMuted}>지난달 {lastMonth}명</div>
      </CardFooter>
    </Card>
  );
}
