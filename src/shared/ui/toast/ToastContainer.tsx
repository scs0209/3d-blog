'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastContext } from './ToastProvider';
import { Toast } from './Toast';
import type { ToastContainerProps, ToastPosition } from './types';

// 개선 후
const STACK_Y_OFFSET = 6;
const STACK_SCALE_STEP = 0.03;
const MIN_SCALE = 0.95;

// 위치별 스타일 클래스
const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

// 위치별 애니메이션 방향
const positionAnimations: Record<ToastPosition, { x: number; y: number }> = {
  'top-right': { x: 300, y: 0 },
  'top-left': { x: -300, y: 0 },
  'top-center': { x: 0, y: -50 },
  'bottom-right': { x: 300, y: 0 },
  'bottom-left': { x: -300, y: 0 },
  'bottom-center': { x: 0, y: 50 },
};

export const ToastContainer = memo(function ToastContainer({
  position = 'top-right',
  maxToasts = 5,
  className = '',
}: ToastContainerProps) {
  const { toasts, removeToast } = useToastContext();

  // 해당 위치의 토스트만 필터링
  const positionToasts = toasts.filter((toast) => toast.position === position);

  // 최대 개수 제한 (최신 토스트부터)
  const displayToasts = positionToasts.slice(-maxToasts);

  if (displayToasts.length === 0) {
    return null;
  }

  // top 위치인지 bottom 위치인지 확인
  const isTopPosition = position.startsWith('top');

  return (
    <div
      className={`
        fixed z-50 pointer-events-none
        ${positionClasses[position]}
        ${className}
      `}
      style={{ maxWidth: '24rem' }}
    >
      <div className='relative' style={{ minHeight: '4rem' }}>
        <AnimatePresence>
          {displayToasts.map((toast, index) => {
            // sonner 스타일: 최신 토스트가 맨 앞에, 나머지는 뒤로 쌓임
            const stackIndex = displayToasts.length - 1 - index;
            const scale = Math.max(MIN_SCALE, 1 - stackIndex * STACK_SCALE_STEP);

            // position에 따른 스택 방향 설정
            let yOffset: number;
            let xOffset: number;

            if (isTopPosition) {
              yOffset = stackIndex * STACK_Y_OFFSET;
            } else {
              yOffset = stackIndex * -STACK_Y_OFFSET;
            }

            // 위치별 스택 오프셋 (오른쪽은 왼쪽으로, 왼쪽은 오른쪽으로, 센터는 그대로)
            if (position.includes('right')) {
              xOffset = stackIndex * -STACK_Y_OFFSET;
            } else if (position.includes('left')) {
              xOffset = stackIndex * STACK_Y_OFFSET;
            } else {
              xOffset = 0; // center
            }

            const opacity = stackIndex === 0 ? 1 : Math.max(0.7, 1 - stackIndex * 0.15);

            const initialAnimation = positionAnimations[position];
            const exitAnimation = positionAnimations[position];

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  x: initialAnimation.x,
                  y: initialAnimation.y,
                }}
                animate={{
                  opacity,
                  scale,
                  x: xOffset,
                  y: yOffset,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  x: exitAnimation.x,
                  y: exitAnimation.y,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  mass: 0.8,
                }}
                className={`pointer-events-auto ${stackIndex === 0 ? 'relative' : 'absolute inset-0'}`}
                style={{
                  zIndex: 100 - stackIndex,
                  transformOrigin: position.includes('right')
                    ? 'top right'
                    : position.includes('left')
                      ? 'top left'
                      : isTopPosition
                        ? 'top center'
                        : 'bottom center',
                }}
              >
                <Toast toast={toast} onRemove={removeToast} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
});
