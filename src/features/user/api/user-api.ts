import prisma from '@/shared/lib/db';
import { fetcher } from '@/shared/api';
import type { Role } from '@prisma/client';

export const getUserCount = async () => {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    console.error('Failed to get user count:', error);
    return 0;
  }
};

export const getUsersOnServer = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
};

export const getUsers = () => fetcher({ url: '/api/users', method: 'get' });

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error(`Failed to get user with id ${id}:`, error);
    return null;
  }
};

export const updateUser = async (id: number, data: { name?: string; email?: string; role?: Role }) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return user;
  } catch (error) {
    console.error(`Failed to update user with id ${id}:`, error);
    return null;
  }
};
