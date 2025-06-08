'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'cyberpunk' | 'glass';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const variantClasses = {
  default: 'bg-white border border-gray-200 text-gray-900',
  cyberpunk: 'bg-black/80 backdrop-blur-xl border border-cyan-500/40 text-white',
  glass: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white',
};

const variantGlowStyles = {
  default: {},
  cyberpunk: { boxShadow: '0 0 40px rgba(0, 255, 208, 0.3)' },
  glass: { boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)' },
};

export function BaseModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  variant = 'cyberpunk',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.dialog
          variants={backdropVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          open={isOpen}
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm'
          onClick={handleBackdropClick}
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          <motion.div
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={(e) => e.stopPropagation()}
            className={`
              ${sizeClasses[size]} 
              ${variantClasses[variant]} 
              mx-4 p-6 rounded-2xl relative
              ${className}
            `}
            style={variantGlowStyles[variant]}
          >
            {/* 헤더 */}
            {(title || showCloseButton) && (
              <div className='flex items-center justify-between mb-4'>
                {title && (
                  <h2 id='modal-title' className='text-xl font-bold'>
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className={`
                      p-1 rounded-full transition-colors duration-200
                      ${
                        variant === 'cyberpunk'
                          ? 'hover:bg-cyan-500/20 text-cyan-400'
                          : variant === 'glass'
                            ? 'hover:bg-white/20 text-white'
                            : 'hover:bg-gray-100 text-gray-600'
                      }
                    `}
                    aria-label='모달 닫기'
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </div>
            )}

            {/* 컨텐츠 */}
            <div>{children}</div>
          </motion.div>
        </motion.dialog>
      )}
    </AnimatePresence>,
    document.body,
  );
}
