'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authTheme } from '@/widgets/login/ui/auth-theme';
import { login } from '../api/auth-api';
import { type LoginSchema, loginSchema } from '../model/auth-schema';

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsSubmitting(true);
    try {
      await login(data);
      router.push('/');
    } catch {
      setError('root', { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <div>
          <label htmlFor='email' className={authTheme.label}>
            이메일
          </label>
          <input
            type='email'
            id='email'
            autoComplete='email'
            placeholder='you@example.com'
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
            className={authTheme.input}
          />
          {errors.email && (
            <p id='email-error' className={authTheme.error}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='password' className={authTheme.label}>
            비밀번호
          </label>
          <input
            type='password'
            id='password'
            autoComplete='current-password'
            placeholder='••••••••'
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
            className={authTheme.input}
          />
          {errors.password && (
            <p id='password-error' className={authTheme.error}>
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p role='alert' className={authTheme.rootError}>
            {errors.root.message}
          </p>
        )}

        <button type='submit' disabled={isSubmitting} className={authTheme.submitBtn}>
          {isSubmitting ? '로그인 중…' : '로그인'}
        </button>
      </form>

      <p className={`mt-6 ${authTheme.footer}`}>
        계정이 없으신가요?{' '}
        <Link href='/sign-up' className={authTheme.linkBtn}>
          회원가입
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
