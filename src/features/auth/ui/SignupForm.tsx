'use client';

import { Button } from '@/shadcn-ui/components/ui/button';
import { Meteors } from '@/shared/ui/Meteors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signup } from '../api/auth-api';
import { type SignupSchema, signupSchema } from '../model/auth-schema';

const SignupForm = () => {
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: SignupSchema) => {
    try {
      await signup(data);
      router.push('/login');
    } catch (err: any) {
      return setError('root', {
        message: '로그인에 실패했습니다!',
      });
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className='w-full relative'>
      <div className='relative shadow-xl bg-gray-900 border-2 border-solid px-4 py-8 h-full overflow-hidden rounded-md flex flex-col justify-end items-start animate-gradient-border'>
        <h1 className='w-full text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 tracking-[0.2em] drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]'>
          회원가입
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <div className='mb-4'>
            <label htmlFor='name' className='block mb-1 text-sm font-medium text-slate-300'>
              이름
            </label>
            <input
              type='text'
              id='name'
              {...register('name')}
              className='w-full px-4 py-2 border rounded bg-slate-900/50 text-slate-300 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent backdrop-blur-sm placeholder-slate-500'
            />
            {errors.name && <p className='mt-1 text-sm text-red-400'>{errors.name.message}</p>}
          </div>
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
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                {...register('password')}
                className='w-full px-4 py-2 border rounded bg-slate-900/50 text-slate-300 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent backdrop-blur-sm placeholder-slate-500'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5 text-slate-400' />
                ) : (
                  <Eye className='h-5 w-5 text-slate-400' />
                )}
              </Button>
            </div>
            {errors.password && <p className='mt-1 text-sm text-red-400'>{errors.password.message}</p>}
          </div>
          <div className='mb-4'>
            <label htmlFor='confirmPassword' className='block mb-1 text-sm font-medium text-slate-300'>
              비밀번호 확인
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                {...register('confirmPassword')}
                className='w-full px-4 py-2 border rounded bg-slate-900/50 text-slate-300 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent backdrop-blur-sm placeholder-slate-500'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5 text-slate-400' />
                ) : (
                  <Eye className='h-5 w-5 text-slate-400' />
                )}
              </Button>
            </div>
            {errors.confirmPassword && <p className='mt-1 text-sm text-red-400'>{errors.confirmPassword.message}</p>}
          </div>
          {errors.root && <p className='mb-4 text-sm text-red-400 text-center'>{errors.root.message}</p>}
          <button
            type='submit'
            className='w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/80 via-blue-500/80 to-cyan-500/80 text-white border-0 transition-all duration-300 hover:from-purple-600/90 hover:via-blue-600/90 hover:to-cyan-600/90 hover:scale-[1.02] shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]'
          >
            회원가입
          </button>
        </form>

        <div className='w-full mt-4 text-center'>
          <span className='text-sm text-slate-400'>
            이미 계정이 있으신가요?{' '}
            <button
              type='button'
              onClick={handleLoginClick}
              className='text-cyan-300 hover:text-cyan-100 hover:underline underline-offset-2 transition-colors duration-200'
            >
              로그인
            </button>
          </span>
        </div>

        <Meteors number={20} />
      </div>
    </div>
  );
};

export default SignupForm;
