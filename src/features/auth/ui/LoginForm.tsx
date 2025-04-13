'use client';

import { Meteors } from '@/shared/ui/Meteors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../api/auth-api';
import { type LoginSchema, loginSchema } from '../model/auth-schema';

const LoginForm = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data);
      router.push('/');
    } catch (err: any) {
      return setError('root', {
        message: '로그인에 실패했습니다!',
      });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className='w-full relative'>
      <div className='relative shadow-xl bg-gray-900 border-2 border-solid px-4 py-8 h-full overflow-hidden rounded-md flex flex-col justify-end items-start animate-gradient-border'>
        <h1 className='w-full text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 tracking-[0.2em] drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]'>
          로그인
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <div className='mb-4'>
            <label htmlFor='email' className='block mb-1 text-sm font-medium text-slate-300'>
              이메일
            </label>
            <input
              type='email'
              id='email'
              {...register('email')}
              className='w-full px-4 py-2 border rounded bg-slate-900/50 text-slate-300 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent backdrop-blur-sm placeholder-slate-500'
            />
            {errors.email && <p className='mt-1 text-sm text-red-400'>{errors.email.message}</p>}
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block mb-1 text-sm font-medium text-slate-300'>
              비밀번호
            </label>
            <input
              type='password'
              id='password'
              {...register('password')}
              className='w-full px-4 py-2 border rounded bg-slate-900/50 text-slate-300 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent backdrop-blur-sm placeholder-slate-500'
            />
            {errors.password && <p className='mt-1 text-sm text-red-400'>{errors.password.message}</p>}
          </div>
          {errors.root && <p className='mb-4 text-sm text-red-400 text-center'>{errors.root.message}</p>}
          <button
            type='submit'
            className='w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/80 via-blue-500/80 to-cyan-500/80 text-white border-0 transition-all duration-300 hover:from-purple-600/90 hover:via-blue-600/90 hover:to-cyan-600/90 hover:scale-[1.02] shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]'
          >
            로그인
          </button>
        </form>

        <Meteors number={20} />
      </div>
    </div>
  );
};

export default LoginForm;
