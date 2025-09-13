import prisma from '@/shared/lib/db';

export const getUserCount = async () => {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    console.error('Failed to get user count:', error);
    return 0;
  }
};

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
};

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
