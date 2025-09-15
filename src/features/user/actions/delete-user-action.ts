'use server';

import { revalidatePath } from 'next/cache';
import { deleteUser } from '@/features/user/api/user-api';

export async function deleteUserAction(prevState: { success: boolean; message: string }, formData: FormData) {
  const id = Number(formData.get('id'));

  try {
    await deleteUser(id);
    revalidatePath('/admin');
    return { success: true, message: '유저가 성공적으로 삭제되었습니다.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: `유저 삭제에 실패했습니다: ${errorMessage}` };
  }
}
