import { AuthPage } from '@/views/login';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login',
};

const LoginPage = () => {
  return <AuthPage type='login' />;
};

export default LoginPage;
