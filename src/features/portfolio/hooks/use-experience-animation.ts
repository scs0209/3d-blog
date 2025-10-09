import { useReducer, useEffect, useCallback } from 'react';
import type { AnimationPhase } from '@/entities/portfolio/model/types';
import { experiences } from '@/entities/portfolio/model/constants';

type AnimationState = {
  phase: AnimationPhase;
  currentCardIndex: number;
};

type Action =
  | { type: 'START_ENTER' }
  | { type: 'NEXT_CARD' }
  | { type: 'CARDS_COMPLETE' }
  | { type: 'CONTENT_SHOWN' }
  | { type: 'START_EXIT' }
  | { type: 'CONTENT_CLOSED' }
  | { type: 'PREV_CARD' }
  | { type: 'CARDS_CLOSED' };

const animationReducer = (state: AnimationState, action: Action): AnimationState => {
  switch (action.type) {
    case 'START_ENTER':
      return { phase: 'cards-entering', currentCardIndex: 0 };
    case 'NEXT_CARD':
      return { ...state, currentCardIndex: state.currentCardIndex + 1 };
    case 'CARDS_COMPLETE':
      return { ...state, phase: 'cards-entered' };
    case 'CONTENT_SHOWN':
      return { ...state, phase: 'active' };
    case 'START_EXIT':
      return { ...state, phase: 'content-exiting' };
    case 'CONTENT_CLOSED':
      return { phase: 'cards-exiting', currentCardIndex: experiences.length - 2 };
    case 'PREV_CARD':
      return { ...state, currentCardIndex: state.currentCardIndex - 1 };
    case 'CARDS_CLOSED':
      return { ...state, phase: 'exited' };
    default:
      return state;
  }
};

export const useExperienceAnimation = (isClosing: boolean, onClose?: () => void) => {
  const [animState, dispatch] = useReducer(animationReducer, { phase: 'idle', currentCardIndex: -1 });

  // 초기화 및 닫기 처리
  useEffect(() => {
    if (isClosing) {
      dispatch({ type: 'START_EXIT' });
    } else {
      dispatch({ type: 'START_ENTER' });
    }
  }, [isClosing]);

  // exited 상태가 되면 onClose 호출
  useEffect(() => {
    if (animState.phase === 'exited' && onClose) {
      onClose();
    }
  }, [animState.phase, onClose]);

  // 카드 애니메이션 완료 핸들러
  const handleCardAnimationComplete = useCallback(
    (index: number) => {
      switch (animState.phase) {
        case 'cards-entering':
          if (index === animState.currentCardIndex) {
            if (index < experiences.length - 1) {
              dispatch({ type: 'NEXT_CARD' });
            } else {
              dispatch({ type: 'CARDS_COMPLETE' });
            }
          }
          break;

        case 'cards-exiting':
          if (index === animState.currentCardIndex + 1) {
            if (animState.currentCardIndex >= 0) {
              dispatch({ type: 'PREV_CARD' });
            } else {
              dispatch({ type: 'CARDS_CLOSED' });
            }
          }
          break;

        default:
          break;
      }
    },
    [animState.phase, animState.currentCardIndex],
  );

  // 상단 라인 애니메이션 완료
  const handleTopLineComplete = useCallback(() => {
    dispatch({ type: 'CONTENT_SHOWN' });
  }, []);

  // 콘텐츠 닫기 완료
  const handleContentExitComplete = useCallback(() => {
    dispatch({ type: 'CONTENT_CLOSED' });
  }, []);

  return {
    animState,
    handleCardAnimationComplete,
    handleTopLineComplete,
    handleContentExitComplete,
  };
};
