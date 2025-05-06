import { signIn } from 'next-auth/react';
import type { LoginSchema, SignupSchema } from '../model/auth-schema';

// 회원가입 API 호출
export const signup = async (data: SignupSchema) => {
  const { name, email, password } = data;

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Registration failed');
  }

  return result;
};

// 로그인 API 호출
export const login = async (data: LoginSchema) => {
  const { email, password } = data;

  const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
  });

  if (!result || result.error) {
    throw new Error(result?.error || 'Login failed');
  }

  return result;
};
