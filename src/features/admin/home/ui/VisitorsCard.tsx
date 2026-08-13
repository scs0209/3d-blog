import { getVisitor } from '@/features/visitor/api';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import { Tag } from '@/shared/ui/Tag';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';
import { TrendingUp } from 'lucide-react';

export async function VisitorsCard() {
  const visitor = await getVisitor();

  return (
    <Card className={adminTheme.card}>
      <span className={adminTheme.cardTopGlow} aria-hidden />
      <CardHeader className='pb-0'>
        <CardDescription className={adminTheme.sectionLabel}>방문자</CardDescription>
        <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${adminTheme.textPrimary}`}>
          {visitor.total.toLocaleString()}
        </CardTitle>
        <CardAction>
          <Tag color='orange' size='sm' type='glass' className='flex items-center gap-1.5 border-white/20'>
            <TrendingUp className='h-3.5 w-3.5' />+{visitor.today}
          </Tag>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 pt-2 text-sm'>
        <div className={`font-medium ${adminTheme.textPrimary}`}>오늘 순방문자</div>
        <div className={`flex items-center gap-2 ${adminTheme.textMuted}`}>
          {visitor.today} <TrendingUp className='size-4' />
        </div>
      </CardFooter>
    </Card>
  );
}
