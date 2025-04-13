import { LoginForm, SignupForm } from '@/features/auth';
import SpacePortal from '@/widgets/login/ui/SpacePortal';

type AuthPageProps = {
  type: 'login' | 'signup';
};

const AuthPage = ({ type }: AuthPageProps) => {
  return (
    <div className='w-full h-screen flex justify-center items-center bg-black'>
      <div style={{ width: '400px' }}>
        <SpacePortal />
        {type === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

export default AuthPage;
