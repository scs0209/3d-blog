import prisma from './db';

interface CreateUser {
  name: string;
  email: string;
  password: string; // 비밀번호 필드 추가
}

export async function createUser(user: CreateUser) {
  // Prisma 모델에 맞는 데이터로 사용자 생성
  return await prisma.user.create({
    data: user,
  });
}

interface UpdateUser {
  id: number;
  name?: string;
  email?: string;
  password?: string; // 비밀번호도 업데이트 가능하도록 추가
}

export async function updateUsername(user: UpdateUser) {
  if (!user.id) {
    throw new Error('User ID is required for update!');
  }

  // 업데이트할 필드가 있는지 확인
  const { name, email, password } = user;
  if (!name && !email && !password) {
    throw new Error(
      'At least one field (name, email, or password) must be provided for update!',
    );
  }

  return await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name || undefined,
      email: email || undefined,
      password: password || undefined,
    },
  });
}
