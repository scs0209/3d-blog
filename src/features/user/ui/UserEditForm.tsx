'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Role, User } from '@prisma/client';

import { Button } from '@/shadcn-ui/components/ui/button';
import { Input } from '@/shadcn-ui/components/ui/input';
import { Label } from '@/shadcn-ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-ui/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import { userEditAction } from '@/features/user/actions/user-edit-action';
import { deleteUserAction } from '@/features/user/actions/delete-user-action';
import { toast } from '@/shared/ui/toast/useToast';

interface UserEditFormProps {
  user: User;
}

export function UserEditForm({ user }: UserEditFormProps) {
  const router = useRouter();

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [role, setRole] = useState<Role>(user.role);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [state, formAction] = useActionState(userEditAction, { success: false, message: '' });
  const [deleteState, deleteAction] = useActionState(deleteUserAction, { success: false, message: '' });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push('/admin');
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  useEffect(() => {
    if (deleteState.success) {
      toast.success(deleteState.message);
      router.push('/admin');
    } else if (deleteState.message) {
      toast.error(deleteState.message);
    }
  }, [deleteState, router]);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 유저를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      const formData = new FormData();
      formData.append('id', user.id.toString());
      deleteAction(formData);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <Card className='glass-card-static'>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <input type='hidden' name='id' value={user.id} />
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='bg-glass-subtle'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-glass-subtle'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>New Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-glass-subtle'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm New Password</Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='bg-glass-subtle'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='role'>Role</Label>
              <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                <SelectTrigger className='bg-glass-subtle'>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent className='glass-card'>
                  <SelectItem value='USER'>USER</SelectItem>
                  <SelectItem value='ADMIN'>ADMIN</SelectItem>
                </SelectContent>
              </Select>
              <input type='hidden' name='role' value={role} />
            </div>
            {state.message && !state.success && <p className='text-red-400 text-sm mt-2'>{state.message}</p>}
          </CardContent>
          <CardFooter className='w-full gap-2 flex justify-end'>
            <Button
              type='button'
              onClick={handleDelete}
              variant='glass-danger'
              className='text-red-400 hover:text-red-300'
            >
              Delete User
            </Button>
            <Button type='submit' name='intent' value='update' variant='glass-primary' className='hover:text-blue-300'>
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
