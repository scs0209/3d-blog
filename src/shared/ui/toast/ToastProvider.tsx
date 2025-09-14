'use client';

import { createContext, useContext, useReducer, useCallback, type ReactNode, useMemo, useEffect } from 'react';
import type { Toast, ToastOptions, ToastContextType, ToastPosition } from './types';
import { ToastContainer } from './ToastContainer';
import { toastEmitter } from './useToast';

// 토스트 액션 타입
type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'UPDATE_TOAST'; payload: { id: string; updates: Partial<Toast> } }
  | { type: 'CLEAR_TOASTS' }
  | { type: 'SET_VISIBLE'; payload: { id: string; visible: boolean } };

// 토스트 상태
interface ToastState {
  toasts: Toast[];
  maxToasts: number;
}

// 초기 상태
const initialState: ToastState = {
  toasts: [],
  maxToasts: 5,
};

// 토스트 리듀서
function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST': {
      const newToasts = [...state.toasts, action.payload];
      // 최대 개수 제한
      if (newToasts.length > state.maxToasts) {
        newToasts.shift(); // 가장 오래된 토스트 제거
      }
      return { ...state, toasts: newToasts };
    }
    case 'REMOVE_TOAST': {
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    }
    case 'UPDATE_TOAST': {
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.payload.id ? { ...toast, ...action.payload.updates } : toast,
        ),
      };
    }
    case 'CLEAR_TOASTS': {
      return { ...state, toasts: [] };
    }
    case 'SET_VISIBLE': {
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.payload.id ? { ...toast, visible: action.payload.visible } : toast,
        ),
      };
    }
    default:
      return state;
  }
}

// 토스트 컨텍스트 생성
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 기본 토스트 옵션
const defaultToastOptions = {
  type: 'info' as const,
  title: '',
  duration: 5000,
  position: 'top-right' as const,
  onClose: () => void 0,
  persistent: false,
};

// 토스트 제공자 컴포넌트
interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, { ...initialState, maxToasts });

  // 토스트 추가
  const addToast = useCallback((options: ToastOptions): string => {
    const id = options.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const toast: Toast = {
      ...defaultToastOptions,
      ...options,
      id,
      createdAt: Date.now(),
      visible: true,
    };

    dispatch({ type: 'ADD_TOAST', payload: toast });

    // 자동 제거 (persistent가 false인 경우)
    if (!toast.persistent && toast.duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'SET_VISIBLE', payload: { id, visible: false } });
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST', payload: id });
        }, 300); // 애니메이션 완료 후 제거
      }, toast.duration);
    }

    return id;
  }, []);

  // 토스트 제거
  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  // 토스트 업데이트
  const updateToast = useCallback((id: string, updates: Partial<ToastOptions>) => {
    dispatch({ type: 'UPDATE_TOAST', payload: { id, updates } });
  }, []);

  // 모든 토스트 제거
  const clearToasts = useCallback(() => {
    dispatch({ type: 'CLEAR_TOASTS' });
  }, []);

  // toastEmitter 구독
  useEffect(() => {
    const unsubscribeAdd = toastEmitter.subscribe('add', addToast);
    const unsubscribeRemove = toastEmitter.subscribe('remove', removeToast);
    const unsubscribeUpdate = toastEmitter.subscribe('update', updateToast);
    const unsubscribeClear = toastEmitter.subscribe('clear', clearToasts);

    return () => {
      unsubscribeAdd();
      unsubscribeRemove();
      unsubscribeUpdate();
      unsubscribeClear();
    };
  }, [addToast, removeToast, updateToast, clearToasts]);

  const toastsByPosition = state.toasts.reduce(
    (acc, toast) => {
      const { position = 'top-right' } = toast;
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(toast);
      return acc;
    },
    {} as Record<Toast['position'], Toast[]>,
  );

  const contextValue: ToastContextType = useMemo(
    () => ({
      toasts: state.toasts,
      addToast,
      removeToast,
      updateToast,
      clearToasts,
    }),
    [state.toasts, addToast, removeToast, updateToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* 모든 position을 자동으로 지원하는 ToastContainer들 */}
      {Object.entries(toastsByPosition).map(([position, toasts]) => (
        <ToastContainer key={position} position={position as ToastPosition} maxToasts={maxToasts} />
      ))}
    </ToastContext.Provider>
  );
}

// 토스트 컨텍스트 사용 훅
export function useToastContext(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
