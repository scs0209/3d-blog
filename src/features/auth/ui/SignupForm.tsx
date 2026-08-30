'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authTheme } from '@/widgets/login/ui/auth-theme';
import { signup } from '../api/auth-api';
import { type SignupSchema, signupSchema } from '../model/auth-schema';

const SignupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    setIsSubmitting(true);
    try {
      await signup(data);
      router.push('/login');
    } catch {
      setError('root', { message: '회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label htmlFor='name' className={authTheme.label}>
            이름
          </label>
          <input
            type='text'
            id='name'
            autoComplete='name'
            placeholder='홍길동'
            {...register('name')}
            className={authTheme.input}
          />
          {errors.name && <p className={authTheme.error}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor='email' className={authTheme.label}>
            이메일
          </label>
          <input
            type='email'
            id='email'
            autoComplete='email'
            placeholder='you@example.com'
            {...register('email')}
            className={authTheme.input}
          />
          {errors.email && <p className={authTheme.error}>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor='password' className={authTheme.label}>
            비밀번호
          </label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              autoComplete='new-password'
              placeholder='••••••••'
              {...register('password')}
              className={`${authTheme.input} pr-11`}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-[#ffc8a0]/70 transition hover:text-[#ffe8d0] dark:text-[#3de8ff]/70 dark:hover:text-[#7ec8ff]'
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className={authTheme.error}>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor='confirmPassword' className={authTheme.label}>
            비밀번호 확인
          </label>
          <div className='relative'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id='confirmPassword'
              autoComplete='new-password'
              placeholder='••••••••'
              {...register('confirmPassword')}
              className={`${authTheme.input} pr-11`}
            />
            <button
              type='button'
              onClick={toggleConfirmPasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-[#ffc8a0]/70 transition hover:text-[#ffe8d0] dark:text-[#3de8ff]/70 dark:hover:text-[#7ec8ff]'
              aria-label={showConfirmPassword ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className={authTheme.error}>{errors.confirmPassword.message}</p>}
        </div>

        {errors.root && <p className={authTheme.rootError}>{errors.root.message}</p>}

        <button type='submit' disabled={isSubmitting} className={authTheme.submitBtn}>
          {isSubmitting ? '가입 중…' : '회원가입'}
        </button>
      </form>

      <p className={`mt-6 ${authTheme.footer}`}>
        이미 계정이 있으신가요?{' '}
        <button type='button' onClick={handleLoginClick} className={authTheme.linkBtn}>
          로그인
        </button>
      </p>
    </>
  );
};

export default SignupForm;
