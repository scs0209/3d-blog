'use server';

import { revalidatePath } from 'next/cache';
import { updateUser } from '@/features/user/api/user-api';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const userSchema = z
  .object({
    id: z.coerce.number(),
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Invalid email address.'),
    role: z.nativeEnum(Role),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((data) => !data.password || data.password.length >= 6, {
    message: 'Password must be at least 6 characters long.',
    path: ['password'],
  });

export async function updateUserAction(prevState: { success: boolean; message: string }, formData: FormData) {
  const validatedFields = userSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, name, email, role, password } = validatedFields.data;
  const updateData: { name: string; email: string; role: Role; password?: string } = { name, email, role };

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
  }

  try {
    await updateUser(id, updateData);
    revalidatePath('/admin');
    revalidatePath(`/admin/users/${id}/edit`);
    return { success: true, message: 'User updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: `Failed to update user: ${errorMessage}` };
  }
}
