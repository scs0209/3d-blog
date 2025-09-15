'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserById, updateUser } from '@/features/user/api/user-api';

// Shadcn UI components
import { Button } from '@/shadcn-ui/components/ui/button';
import { Input } from '@/shadcn-ui/components/ui/input';
import { Label } from '@/shadcn-ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-ui/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import type { Role } from '@prisma/client';

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('USER');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(id);
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setRole(user.role);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(id, { name, email, role });
    router.push('/admin'); // Or wherever you want to redirect after update
  };

  return (
    <div className='container mx-auto p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input id='name' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor='role'>Role</Label>
              <Select value={role} onValueChange={(value: string) => setRole(value as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='USER'>USER</SelectItem>
                  <SelectItem value='ADMIN'>ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type='submit'>Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
