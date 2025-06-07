'use client';
import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

type DropdownProps = {
  trigger: (props: { ref: React.RefObject<HTMLElement | null>; onClick: () => void }) => ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  offset?: number;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
};

export const Dropdown = ({
  trigger,
  children,
  className = '',
  contentClassName = '',
  placement = 'bottom-right',
  offset = 8,
  closeOnEscape = true,
  closeOnOutsideClick = true,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 });
  const triggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      setPosition({
        top: rect.bottom + scrollY + offset,
        left: rect.left + scrollX,
        right: window.innerWidth - (rect.right + scrollX),
      });
    }
  }, [offset]);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updatePosition();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updatePosition();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closeOnEscape) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      if (closeOnEscape) {
        window.addEventListener('keydown', handleEscape);
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, updatePosition]);

  const getPositionStyles = () => {
    const isDesktop = window.innerWidth >= 1024;

    switch (placement) {
      case 'bottom-right':
        return isDesktop ? { top: position.top, right: position.right } : { top: position.top, left: position.left };
      case 'bottom-left':
        return { top: position.top, left: position.left };
      case 'top-right':
        return isDesktop
          ? { bottom: window.innerHeight - (position.top - offset * 2), right: position.right }
          : { bottom: window.innerHeight - (position.top - offset * 2), left: position.left };
      case 'top-left':
        return { bottom: window.innerHeight - (position.top - offset * 2), left: position.left };
      default:
        return { top: position.top, left: position.left };
    }
  };

  return (
    <>
      <div className={className}>{trigger({ ref: triggerRef, onClick: handleToggle })}</div>

      {mounted &&
        typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* 배경 오버레이 */}
                {closeOnOutsideClick && (
                  <div
                    className='fixed inset-0 bg-transparent z-[9999998]'
                    onClick={handleClose}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        handleClose();
                      }
                    }}
                    role='button'
                    tabIndex={0}
                    aria-label='드롭다운 닫기'
                  />
                )}

                {/* 드롭다운 컨텐츠 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`fixed bg-black/90 backdrop-blur-md border border-blue-400/30 rounded-lg shadow-2xl p-2 z-[9999999] ${contentClassName}`}
                  style={getPositionStyles()}
                >
                  {children}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
