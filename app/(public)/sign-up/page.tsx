import { AuthPage } from '@/views/login';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign Up',
};

const RegisterPage = () => {
  return <AuthPage type='signup' />;
};

export default RegisterPage;
