import { Suspense } from 'react';
import { getUserById } from '@/features/user/api/user-api';
import { UserEditForm } from '@/features/user/ui';
import { Skeleton } from '@/shadcn-ui/components/ui/skeleton';
import { adminFormTheme } from '@/widgets/admin/ui/admin-form-theme';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function UserEditFormSkeleton() {
  return (
    <div className='container mx-auto p-4'>
      <div className={`p-6 ${adminTheme.card}`}>
        <span className={adminTheme.cardTopGlow} aria-hidden />
        <Skeleton className={`mb-6 h-8 w-1/4 ${adminFormTheme.skeletonPulse}`} />
        <div className='space-y-6'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='space-y-2'>
              <Skeleton className={`h-4 w-16 ${adminFormTheme.skeletonPulse}`} />
              <Skeleton className={`h-10 w-full ${adminFormTheme.skeletonPulse}`} />
            </div>
          ))}
          <Skeleton className={`h-10 w-28 ${adminFormTheme.skeletonPulse}`} />
        </div>
      </div>
    </div>
  );
}

async function UserEditPageContent({ params }: PageProps) {
  const { id } = await params;
  const user = await getUserById(Number(id));

  if (!user) {
    return <div>User not found.</div>;
  }

  return <UserEditForm user={user} />;
}

export default function UserEditPage({ params }: PageProps) {
  return (
    <Suspense fallback={<UserEditFormSkeleton />}>
      <UserEditPageContent params={params} />
    </Suspense>
  );
}
