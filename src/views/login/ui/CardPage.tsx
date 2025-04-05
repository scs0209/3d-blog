import SpacePortal from '@/widgets/login/ui/SpacePortal';
import { LoginForm } from '@/features/auth';

const CardPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-black">
      <div style={{ width: '400px' }}>
        <SpacePortal />
        <LoginForm />
      </div>
    </div>
  );
};

export default CardPage;
