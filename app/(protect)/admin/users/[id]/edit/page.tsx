import { getUserById } from '@/features/user/api/user-api';
import { UserEditForm } from './UserEditForm';

interface UserEditPageProps {
  params: {
    id: string;
  };
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const id = Number(params.id);
  const user = await getUserById(id);

  if (!user) {
    return <div>User not found.</div>;
  }

  return <UserEditForm user={user} />;
}