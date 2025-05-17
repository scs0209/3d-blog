import type React from 'react';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className='public'>{children}</main>;
};

export default PublicLayout;
