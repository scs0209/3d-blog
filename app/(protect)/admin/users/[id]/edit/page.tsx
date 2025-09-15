import { Suspense } from 'react';
import { getUserById } from '@/features/user/api/user-api';
import { UserEditForm } from './UserEditForm';
import { Skeleton } from '@/shadcn-ui/components/ui/skeleton';

interface PageProps {
  params: {
    id: string;
  };
}

function UserEditFormSkeleton() {
  return (
    <div className='container mx-auto p-4'>
      <div className="glass-card p-6">
        <Skeleton className="h-8 w-1/4 mb-6 bg-glass-subtle" />
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-glass-subtle" />
            <Skeleton className="h-10 w-full bg-glass-subtle" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-glass-subtle" />
            <Skeleton className="h-10 w-full bg-glass-subtle" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-glass-subtle" />
            <Skeleton className="h-10 w-full bg-glass-subtle" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 bg-glass-subtle" />
            <Skeleton className="h-10 w-full bg-glass-subtle" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12 bg-glass-subtle" />
            <Skeleton className="h-10 w-full bg-glass-subtle" />
          </div>
          <Skeleton className="h-10 w-full bg-glass-subtle" />
        </div>
      </div>
    </div>
  );
}

async function UserEditPageContent({ params }: PageProps) {
  const id = Number(params.id);
  const user = await getUserById(id);

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
