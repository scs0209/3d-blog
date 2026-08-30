import { LoginForm, SignupForm } from '@/features/auth';
import { AuthLayout } from '@/widgets/login/ui/AuthLayout';

type AuthPageProps = {
  type: 'login' | 'signup';
};

const AuthPage = ({ type }: AuthPageProps) => {
  const isLogin = type === 'login';

  return (
    <AuthLayout
      title={isLogin ? '로그인' : '회원가입'}
      subtitle={isLogin ? '계정으로 접속해 블로그를 이용하세요' : '새 계정을 만들어 시작하세요'}
    >
      {isLogin ? <LoginForm /> : <SignupForm />}
    </AuthLayout>
  );
};

export default AuthPage;
