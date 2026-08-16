import type { ReactNode } from 'react';

const PortfolioLayout = ({ children }: { children: ReactNode }) => {
  return <div className='min-h-screen overflow-hidden bg-[#02010a]'>{children}</div>;
};

export default PortfolioLayout;
