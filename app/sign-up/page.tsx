'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/features/auth/ui/auth-form';
import { SignupSchema } from '@/features/auth/model/auth-schema';
import { signup } from '@/features/auth/api/auth-api';

const RegisterPage = () => {
  const router = useRouter();

  const handleSignup = async (data: SignupSchema) => {
    try {
      await signup(data); // 회원가입 API 호출
      router.push('/login'); // 성공 시 로그인 페이지로 이동
    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm
        onSubmit={handleSignup}
        buttonText="회원가입"
        title="블로그 회원가입"
        description="새 계정을 만들어 블로그를 시작하세요."
        footerText="이미 계정이 있으신가요?"
        footerLinkText="로그인"
        footerLinkHref="/login"
        isSignup
      />
    </div>
  );
};

export default RegisterPage;
