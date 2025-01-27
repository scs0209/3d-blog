'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/shadcn-ui/components/ui/button';

const SignoutButton = () => {
  return <Button onClick={() => signOut()}>SignoutButton</Button>;
};

export default SignoutButton;
