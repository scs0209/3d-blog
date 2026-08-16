'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { CINEMA_CREAM } from '@/entities/portfolio/model/cinematic-transition';

type PortalEnterTransitionProps = {
  active: boolean;
  onComplete: () => void;
};

export const PortalEnterTransition = ({ active, onComplete }: PortalEnterTransitionProps) => {
  const completedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      completedRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      if (completedRef.current) {
        return;
      }
      completedRef.current = true;
      onComplete();
    }, 1450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className='pointer-events-none fixed inset-0 z-[80]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          aria-hidden
        >
          <motion.div
            className='absolute inset-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.72, 0.2] }}
            transition={{ duration: 0.9, times: [0, 0.45, 1] }}
            style={{
              background: `radial-gradient(circle at 50% 48%, ${CINEMA_CREAM} 0%, rgba(229,214,196,0.35) 28%, transparent 62%)`,
            }}
          />
          <motion.div
            className='absolute inset-0 bg-black'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
