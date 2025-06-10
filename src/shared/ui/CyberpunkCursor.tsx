'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CursorPosition = {
  x: number;
  y: number;
};

type CyberpunkCursorProps = {
  className?: string;
};

export function CyberpunkCursor({ className = '' }: CyberpunkCursorProps) {
  const [mousePosition, setMousePosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTextHovering, setIsTextHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trailPoints, setTrailPoints] = useState<CursorPosition[]>([]);
  const animationRef = useRef<number>(0);

  // 마우스 위치 추적
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);

      // 트레일 효과를 위한 포인트 추가
      setTrailPoints((prev) => {
        const newTrail = [newPosition, ...prev.slice(0, 12)]; // 최대 13개 포인트로 증가
        return newTrail;
      });

      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };
    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // 호버 가능한 요소들 감지 - 더 정교한 감지
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.matches(
        'button, a, input, textarea, select, [role="button"], [onclick], .cursor-pointer',
      );
      const isText = target.matches('p, span, h1, h2, h3, h4, h5, h6, div, article, section');

      setIsHovering(isInteractive);
      setIsTextHovering(isText && !isInteractive);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  // 트레일 애니메이션 업데이트
  useEffect(() => {
    const animate = () => {
      setTrailPoints((prev) =>
        prev.map((point, index) => ({
          ...point,
          opacity: (prev.length - index) / prev.length,
        })),
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 pointer-events-none z-[9999] ${className}`}>
      {/* 강화된 트레일 효과 */}
      <AnimatePresence>
        {trailPoints.map((point, index) => (
          <motion.div
            key={`trail-${Date.now()}-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: (trailPoints.length - index) * 0.08,
              scale: 1 - index * 0.06,
            }}
            exit={{ opacity: 0, scale: 0 }}
            className='absolute w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300'
            style={{
              left: point.x - 6,
              top: point.y - 6,
              filter: 'blur(1px)',
              boxShadow: '0 0 6px rgba(0, 255, 208, 0.4)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* 메인 커서 */}
      <motion.div
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isClicking ? 0.7 : isHovering ? 1.8 : isTextHovering ? 1.3 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 30,
          mass: 0.4,
        }}
        className='absolute w-8 h-8'
      >
        {/* 외부 헥사곤 링 */}
        <motion.div
          animate={{
            scale: isHovering ? 2.2 : isTextHovering ? 1.5 : 1,
            rotate: isClicking ? 90 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className='absolute inset-0'
        >
          <div className='w-full h-full relative'>
            {/* 헥사곤 모양의 외곽선 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              className='absolute inset-1 border-2 border-cyan-400/70 rounded-full'
              style={{
                clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                boxShadow: `
                  0 0 15px rgba(0, 255, 208, 0.7),
                  0 0 30px rgba(0, 255, 208, 0.5),
                  0 0 45px rgba(0, 255, 208, 0.3),
                  inset 0 0 15px rgba(0, 255, 208, 0.1)
                `,
              }}
            />
          </div>
        </motion.div>

        {/* 내부 코어 */}
        <motion.div
          animate={{
            scale: isClicking ? 2.5 : isHovering ? 0.3 : isTextHovering ? 0.6 : 1,
            opacity: isClicking ? 0.9 : 1,
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className='absolute inset-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300'
          style={{
            boxShadow: `
              0 0 10px rgba(0, 255, 208, 0.9),
              0 0 20px rgba(0, 255, 208, 0.6),
              0 0 30px rgba(0, 255, 208, 0.3)
            `,
          }}
        />

        {/* 클릭 충격파 효과 */}
        <AnimatePresence>
          {isClicking && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ scale: 4, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className='absolute inset-0 rounded-full border-2 border-cyan-300'
                style={{
                  boxShadow: '0 0 25px rgba(0, 255, 208, 0.8)',
                }}
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 6, opacity: 0 }}
                exit={{ scale: 6, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                className='absolute inset-0 rounded-full border border-cyan-200'
                style={{
                  boxShadow: '0 0 35px rgba(0, 255, 208, 0.5)',
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* 호버 펄스 효과 - 더 복잡한 애니메이션 */}
        <AnimatePresence>
          {(isHovering || isTextHovering) && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0, 0.6, 0],
                }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
                className='absolute inset-0 rounded-full border-2 border-cyan-300/60'
                style={{
                  boxShadow: '0 0 40px rgba(0, 255, 208, 0.4)',
                }}
              />
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: [1, 3.2, 1],
                  opacity: [0, 0.3, 0],
                }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
                className='absolute inset-0 rounded-full border border-cyan-200/40'
                style={{
                  boxShadow: '0 0 50px rgba(0, 255, 208, 0.2)',
                }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 강화된 십자선 효과 */}
      <AnimatePresence>
        {(isHovering || isTextHovering) && (
          <>
            {/* 수평선 */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.8, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              className='absolute'
              style={{
                left: mousePosition.x - 30,
                top: mousePosition.y - 1,
              }}
            >
              <motion.div
                animate={{
                  scaleX: [0.8, 1.2, 0.8],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
                className='w-16 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent'
                style={{
                  filter: 'blur(0.5px)',
                  boxShadow: '0 0 8px rgba(0, 255, 208, 0.8), 0 0 16px rgba(0, 255, 208, 0.4)',
                }}
              />
            </motion.div>

            {/* 수직선 */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.8, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              className='absolute'
              style={{
                left: mousePosition.x - 1,
                top: mousePosition.y - 30,
              }}
            >
              <motion.div
                animate={{
                  scaleY: [0.8, 1.2, 0.8],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
                className='w-1 h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent'
                style={{
                  filter: 'blur(0.5px)',
                  boxShadow: '0 0 8px rgba(0, 255, 208, 0.8), 0 0 16px rgba(0, 255, 208, 0.4)',
                }}
              />
            </motion.div>

            {/* 대각선 강조 효과 */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className='absolute'
              style={{
                left: mousePosition.x - 15,
                top: mousePosition.y - 15,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
                className='w-8 h-8 border border-cyan-300/30 rounded-full'
                style={{
                  filter: 'blur(1px)',
                  boxShadow: '0 0 12px rgba(0, 255, 208, 0.3)',
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 텍스트 호버 시 특별한 효과 */}
      <AnimatePresence>
        {isTextHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className='absolute'
            style={{
              left: mousePosition.x - 2,
              top: mousePosition.y - 2,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
              className='w-1 h-1 bg-cyan-300 rounded-full'
              style={{
                boxShadow: '0 0 8px rgba(0, 255, 208, 0.9)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
