'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type CursorPosition = {
  x: number;
  y: number;
};

export function PlanetCursor() {
  const [mousePosition, setMousePosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
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

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // 텍스트 입력 요소 감지 - 더 포괄적으로
      const isTextElement =
        target.matches(
          'input:not([type]), input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], textarea, [contenteditable="true"]',
        ) ||
        target.closest(
          'input:not([type]), input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], textarea, [contenteditable="true"]',
        );

      // 일반 interactive 요소 감지
      const isInteractive = target.matches(
        'button, a, input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select, [role="button"], [onclick], .cursor-pointer, canvas',
      );

      setIsTextInput(!!isTextElement);
      setIsHovering(!!isInteractive && !isTextElement);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  // 텍스트 입력 요소에서는 I-beam 커서 렌더링
  if (isTextInput) {
    return (
      <div className='fixed top-0 left-0 pointer-events-none z-[9999]'>
        <motion.div
          animate={{
            x: mousePosition.x - 1,
            y: mousePosition.y - 8,
            scaleY: isClicking ? 0.8 : 1,
          }}
          transition={{
            x: { type: 'spring', stiffness: 400, damping: 30 },
            y: { type: 'spring', stiffness: 400, damping: 30 },
            scaleY: { duration: 0.1 },
          }}
          className='absolute w-0.5 h-4'
        >
          {/* 텍스트 커서 (I-beam) */}
          <motion.div
            animate={{
              opacity: [1, 0.3, 1],
            }}
            transition={{
              opacity: { duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
            }}
            className='w-full h-full bg-cyan-400 rounded-sm'
            style={{
              boxShadow: '0 0 6px rgba(0, 255, 208, 0.8), 0 0 12px rgba(0, 255, 208, 0.3)',
            }}
          />
          {/* 상단 캡 */}
          <div
            className='absolute -top-0.5 -left-0.5 w-1.5 h-0.5 bg-cyan-400 rounded-full'
            style={{ boxShadow: '0 0 3px rgba(0, 255, 208, 0.6)' }}
          />
          {/* 하단 캡 */}
          <div
            className='absolute -bottom-0.5 -left-0.5 w-1.5 h-0.5 bg-cyan-400 rounded-full'
            style={{ boxShadow: '0 0 3px rgba(0, 255, 208, 0.6)' }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className='fixed top-0 left-0 pointer-events-none z-[9999]'>
      {/* 은은한 기본 발광 효과 */}
      <motion.div
        animate={{
          x: mousePosition.x - 25,
          y: mousePosition.y - 25,
          scale: isClicking ? 0.7 : isHovering ? 1.4 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
          mass: 0.5,
        }}
        className='absolute w-12 h-12'
      >
        {/* 외부 은은한 발광 */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
          className='absolute inset-0 rounded-full'
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 208, 0.1) 0%, transparent 70%)',
            boxShadow: '0 0 30px rgba(0, 255, 208, 0.2)',
          }}
        />

        {/* 행성 커서 메인 */}
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          className='absolute inset-1 w-10 h-10'
        >
          {/* 궤도 링 - 은은한 페이드 효과 */}
          <motion.div
            animate={{
              rotate: 360,
              scale: isHovering ? 1.2 : 1,
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
              scale: { duration: 0.2 },
              opacity: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
            }}
            className='absolute inset-0 rounded-full border border-cyan-400/40'
            style={{
              boxShadow: '0 0 15px rgba(0, 255, 208, 0.3)',
            }}
          />

          {/* 내부 궤도 링 - 다른 리듬으로 반짝임 */}
          <motion.div
            animate={{
              rotate: -360,
              scale: isHovering ? 1.1 : 1,
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              rotate: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
              scale: { duration: 0.2 },
              opacity: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 1.5 },
            }}
            className='absolute inset-1 rounded-full border border-cyan-300/30'
            style={{
              boxShadow: '0 0 10px rgba(0, 255, 208, 0.2)',
            }}
          />

          {/* 행성 본체 - 호흡하는 발광 효과 */}
          <motion.div
            animate={{
              scale: isClicking ? 1.2 : isHovering ? 0.9 : [1, 1.05, 1],
              rotate: 360,
            }}
            transition={{
              rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
              scale:
                isClicking || isHovering
                  ? { duration: 0.1 }
                  : {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    },
            }}
            className='absolute inset-2 rounded-full'
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 10%, transparent 40%),
                radial-gradient(circle at 70% 70%, rgba(0, 255, 208, 0.8) 20%, rgba(0, 180, 150, 0.6) 80%)
              `,
            }}
          />

          {/* 행성 본체 발광 레이어 - 펄스 효과 */}
          <motion.div
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className='absolute inset-2 rounded-full'
            style={{
              boxShadow: `
                0 0 20px rgba(0, 255, 208, 0.6),
                0 0 40px rgba(0, 255, 208, 0.3),
                inset 0 0 10px rgba(255, 255, 255, 0.2)
              `,
            }}
          />

          {/* 행성 표면 디테일 - 더 부드러운 깜박임 */}
          <motion.div
            animate={{
              rotate: -360,
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              rotate: { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
              opacity: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 2 },
            }}
            className='absolute inset-3 rounded-full'
            style={{
              background: `
                radial-gradient(circle at 20% 50%, rgba(0, 255, 208, 0.3) 5%, transparent 20%),
                radial-gradient(circle at 80% 30%, rgba(0, 255, 208, 0.2) 8%, transparent 25%),
                radial-gradient(circle at 60% 80%, rgba(0, 255, 208, 0.15) 6%, transparent 18%)
              `,
            }}
          />

          {/* 호버 시 궤도 파티클 효과 - 3개로 대칭 배치 */}
          {isHovering && (
            <>
              {/* 첫 번째 파티클 - 12시 방향 */}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
                  scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
                  opacity: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
                }}
                className='absolute w-1 h-1 bg-cyan-300 rounded-full'
                style={{
                  left: '50%',
                  top: '10%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 6px rgba(0, 255, 208, 0.8)',
                }}
              />

              {/* 두 번째 파티클 - 4시 방향 (120도) */}
              <motion.div
                animate={{
                  rotate: -360,
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  rotate: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
                  scale: { duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
                  opacity: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
                }}
                className='absolute w-1 h-1 bg-cyan-200 rounded-full'
                style={{
                  left: '85%',
                  top: '75%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 4px rgba(0, 255, 208, 0.6)',
                }}
              />

              {/* 세 번째 파티클 - 8시 방향 (240도) */}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 0.95, 0.7],
                }}
                transition={{
                  rotate: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
                  scale: { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
                  opacity: { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 0.3 },
                }}
                className='absolute w-1 h-1 bg-cyan-400 rounded-full'
                style={{
                  left: '15%',
                  top: '75%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 5px rgba(0, 255, 208, 0.7)',
                }}
              />
            </>
          )}

          {/* 클릭 효과 */}
          {isClicking && (
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className='absolute inset-0 rounded-full border-2 border-cyan-300'
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 208, 0.8)',
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
