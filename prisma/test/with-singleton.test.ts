import { createUser, updateUsername } from '../context';
import { prismaMock } from '../singleton';

test('should create a new user', async () => {
  const user = {
    id: 1,
    name: 'Rich',
    email: 'hello@prisma.io',
    password: 'securepassword',
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(createUser(user)).resolves.toEqual({
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
  };

  prismaMock.user.update.mockResolvedValue(user);

  await expect(updateUsername(user)).resolves.toEqual({
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
    name: 'Rich Haines',
    email: 'hello@prisma.io',
  };

  await expect(updateUsername(user)).rejects.toThrowError('User ID is required for update!');
});
