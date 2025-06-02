'use client';
import { plusVisitor } from '@/features/visitor/api';
import { useEffect } from 'react';

const VisitorLogger = () => {
  useEffect(() => {
    plusVisitor(window.location.pathname);
  }, []);
  return null;
};

export default VisitorLogger;
