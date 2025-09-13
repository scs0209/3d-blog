import { getUserCount } from '@/features/user/api/user-api';
import { Card, CardHeader, CardTitle, CardFooter, CardDescription } from '@/shadcn-ui/components/ui/card';

export async function UsersCard() {
  const userCount = await getUserCount();

  return (
    <Card className='aspect-video glass-card-float-shimmer shadow-glass'>
      <CardHeader>
        <CardDescription>Total Users</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>{userCount}</CardTitle>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>Total registered users</div>
        <div className='text-muted-foreground'>All time</div>
      </CardFooter>
    </Card>
  );
}
