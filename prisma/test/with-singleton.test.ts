import { Role } from '@prisma/client';
import { expect, test } from 'vitest';
import { prismaMock } from '../singleton';
import { createUser, updateUsername } from '../context';

test('should create a new user', async () => {
  const user = {
    id: 1,
    name: 'Rich',
    email: 'hello@prisma.io',
    password: 'securepassword',
    createdAt: new Date(),
    role: Role.USER,
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(createUser(user)).resolves.toMatchObject({
    id: 1,
    name: 'Rich',
    email: 'hello@prisma.io',
    password: 'securepassword',
  });
});

test("should update a user's name", async () => {
  const user = {
    id: 1,
    name: 'Rich Haines',
    email: 'hello@prisma.io',
    password: 'securepassword',
    createdAt: new Date(),
    role: Role.USER,
  };

  prismaMock.user.update.mockResolvedValue(user);

  await expect(updateUsername(user)).resolves.toMatchObject({
    id: 1,
    name: 'Rich Haines',
    email: 'hello@prisma.io',
    password: 'securepassword',
  });
});

test('should throw an error if required fields for update are missing', async () => {
  const user = {
    id: 1,
  };

  await expect(updateUsername(user)).rejects.toThrowError(
    'At least one field (name, email, or password) must be provided for update!',
  );
});

test('should throw an error if user ID is missing for update', async () => {
  const user = {
    id: 1,
    name: 'Rich Haines',
    email: 'hello@prisma.io',
    password: 'securepassword',
    createdAt: new Date(),
    role: Role.USER,
  };

  await expect(updateUsername(user)).rejects.toThrowError('User ID is required for update!');
});
