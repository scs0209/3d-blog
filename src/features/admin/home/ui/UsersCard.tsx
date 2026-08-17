import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import { Tag } from '@/shared/ui/Tag';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';
import { Users } from 'lucide-react';

type UsersCardProps = {
  userCount: number;
};

export function UsersCard({ userCount }: UsersCardProps) {
  return (
    <Card className={adminTheme.card}>
      <span className={adminTheme.cardTopGlow} aria-hidden />
      <CardHeader className='pb-0'>
        <CardDescription className={adminTheme.sectionLabel}>사용자</CardDescription>
        <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${adminTheme.textPrimary}`}>
          {userCount.toLocaleString()}
        </CardTitle>
        <CardAction>
          <Tag color='cyan' size='sm' type='glass' className='flex items-center gap-1.5 border-white/20'>
            <Users className='h-3.5 w-3.5' />
            계정
          </Tag>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 pt-2 text-sm'>
        <div className={`font-medium ${adminTheme.textPrimary}`}>전체 등록 계정</div>
        <div className={adminTheme.textMuted}>누적</div>
      </CardFooter>
    </Card>
  );
}
