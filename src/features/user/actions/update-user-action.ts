'use server';

import { revalidatePath } from 'next/cache';
import { updateUser } from '@/features/user/api/user-api';
import type { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function updateUserAction(prevState: { success: boolean; message: string }, formData: FormData) {
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as Role;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const updateData: { name: string; email: string; role: Role; password?: string } = { name, email, role };

  if (password) {
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
  }

  try {
    await updateUser(id, updateData);
    revalidatePath('/admin');
    return { success: true, message: 'User updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: `Failed to update user: ${errorMessage}` };
  }
}