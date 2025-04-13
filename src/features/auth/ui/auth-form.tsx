'use client';

import { Button } from '@/shadcn-ui/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn-ui/components/ui/form';
import { Input } from '@/shadcn-ui/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type LoginSchema, type SignupSchema, loginSchema, signupSchema } from '../model/auth-schema';

interface AuthFormProps {
  onSubmit: (data: LoginSchema | SignupSchema) => Promise<void>;
  buttonText: string;
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  isSignup?: boolean;
}

export function AuthForm({
  onSubmit,
  buttonText,
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkHref,
  isSignup = false,
}: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = isSignup ? signupSchema : loginSchema;
  const form = useForm<LoginSchema | SignupSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      ...(isSignup && { confirmPassword: '' }),
    },
  });

  const handleFormSubmit = async (data: LoginSchema | SignupSchema) => {
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder='your@email.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input type={showPassword ? 'text' : 'password'} {...field} />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-2 top-1/2 -translate-y-1/2'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isSignup && (
              <>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder='이름을 입력하세요' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호 확인</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input type={showConfirmPassword ? 'text' : 'password'} {...field} />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='absolute right-2 top-1/2 -translate-y-1/2'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {error && (
              <div className='flex items-center space-x-2 text-red-600'>
                <AlertCircle size={20} />
                <p className='text-sm'>{error}</p>
              </div>
            )}
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? '처리 중...' : buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <p className='text-sm text-gray-600'>
          {footerText}{' '}
          <a href={footerLinkHref} className='text-blue-600 hover:underline'>
            {footerLinkText}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
