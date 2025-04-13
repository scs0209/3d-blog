'use client';

import { Button } from '@/shadcn-ui/components/ui/button';
import { signOut } from 'next-auth/react';
import React from 'react';

const SignoutButton = () => {
  return <Button onClick={() => signOut()}>SignoutButton</Button>;
};

export default SignoutButton;
