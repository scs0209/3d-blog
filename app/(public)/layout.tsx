import type React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home',
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className='public'>{children}</main>;
};

export default PublicLayout;
