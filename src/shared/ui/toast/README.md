# 🍞 Toast System

react-toastify와 유사한 토스트 메시지 시스템입니다. 스택처럼 쌓이는 구조로 설계되었으며, 디자인 시스템 라이브러리 규칙을 준수합니다.

## ✨ 주요 기능

- **4가지 토스트 타입**: success, error, warning, info
- **6가지 위치**: top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
- **스택 구조**: 새로운 토스트가 위에 쌓임
- **자동 제거**: 설정된 시간 후 자동으로 사라짐
- **지속 토스트**: 사용자가 수동으로 닫을 때까지 유지
- **애니메이션**: framer-motion을 사용한 부드러운 애니메이션
- **접근성**: ARIA 속성 및 키보드 네비게이션 지원
- **반응형**: 모바일과 데스크톱 모두 지원

## 🚀 설치 및 설정

### 1. ToastProvider 설정

앱의 최상위 레벨에 `ToastProvider`를 추가합니다:

```tsx
// app/layout.tsx 또는 최상위 컴포넌트
import { ToastProvider } from '@/shared/ui/toast';

export default function RootLayout({ children }) {
  return (
    <ToastProvider maxToasts={5}>
      {children}
    </ToastProvider>
  );
}
```

### 2. ToastContainer 추가

원하는 위치에 `ToastContainer`를 추가합니다:

```tsx
// app/layout.tsx 또는 페이지 컴포넌트
import { ToastContainer } from '@/shared/ui/toast';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ToastContainer position="top-right" maxToasts={5} />
    </>
  );
}
```

## 📖 사용법

### 기본 사용법

```tsx
import { useToast } from '@/shared/ui/toast';

export function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('성공적으로 처리되었습니다!');
  };

  const handleError = () => {
    toast.error('오류가 발생했습니다.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>성공 토스트</button>
      <button onClick={handleError}>에러 토스트</button>
    </div>
  );
}
```

### 고급 사용법

```tsx
const toast = useToast();

// 커스텀 토스트
toast.toast({
  type: 'info',
  title: '업데이트 알림',
  message: '새로운 기능이 추가되었습니다.',
  duration: 8000,
  position: 'bottom-right',
  onClose: () => console.log('토스트가 닫혔습니다'),
});

// 지속 토스트 (자동으로 사라지지 않음)
toast.persistent('중요한 알림입니다.', {
  title: '주의',
  duration: 0,
});

// 특정 토스트 제거
const toastId = toast.success('메시지');
toast.remove(toastId);

// 모든 토스트 제거
toast.clear();
```

## 🎨 토스트 타입별 스타일

| 타입 | 색상 | 아이콘 | 용도 |
|------|------|--------|------|
| `success` | 초록색 | ✓ | 성공 메시지 |
| `error` | 빨간색 | ✗ | 에러 메시지 |
| `warning` | 노란색 | ⚠ | 경고 메시지 |
| `info` | 파란색 | ℹ | 정보 메시지 |

## 📍 위치 옵션

```tsx
// 6가지 위치 지원
<ToastContainer position="top-right" />      // 우측 상단 (기본값)
<ToastContainer position="top-left" />       // 좌측 상단
<ToastContainer position="top-center" />     // 상단 중앙
<ToastContainer position="bottom-right" />   // 우측 하단
<ToastContainer position="bottom-left" />    // 좌측 하단
<ToastContainer position="bottom-center" />  // 하단 중앙
```

## ⚙️ 설정 옵션

### ToastProvider Props

```tsx
<ToastProvider maxToasts={5}>
  {children}
</ToastProvider>
```

- `maxToasts`: 최대 토스트 개수 (기본값: 5)

### ToastContainer Props

```tsx
<ToastContainer 
  position="top-right"
  maxToasts={5}
  className="custom-class"
/>
```

- `position`: 토스트 위치 (기본값: 'top-right')
- `maxToasts`: 해당 위치의 최대 토스트 개수 (기본값: 5)
- `className`: 추가 CSS 클래스

### ToastOptions

```tsx
interface ToastOptions {
  id?: string;           // 고유 식별자 (자동 생성)
  type?: ToastType;      // 토스트 타입
  title?: string;        // 제목 (선택사항)
  message: string;       // 메시지 (필수)
  duration?: number;     // 표시 시간 (ms, 기본값: 5000)
  position?: ToastPosition; // 위치 (기본값: 'top-right')
  onClose?: () => void;  // 닫힐 때 콜백
  persistent?: boolean;  // 자동 제거 여부 (기본값: false)
}
```

## 🔧 커스터마이징

### 스타일 커스터마이징

`Toast.tsx`에서 `toastConfig` 객체를 수정하여 색상과 스타일을 변경할 수 있습니다:

```tsx
const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-400/40',
    textColor: 'text-green-200',
    iconColor: 'text-green-400',
  },
  // ... 다른 타입들
};
```

### 애니메이션 커스터마이징

`Toast.tsx`와 `ToastContainer.tsx`에서 framer-motion 설정을 수정할 수 있습니다:

```tsx
// 진입 애니메이션
initial={{ opacity: 0, x: 300, scale: 0.8 }}
animate={{ opacity: 1, x: 0, scale: 1 }}
transition={{
  type: 'spring',
  stiffness: 300,
  damping: 30,
  delay: index * 0.1,
}}
```

## ♿ 접근성

- `role="alert"`: 스크린 리더에게 알림 역할 전달
- `aria-live="polite"`: 비동기 콘텐츠 변경 알림
- `aria-atomic="true"`: 전체 토스트 내용을 하나의 단위로 처리
- `aria-label`: 닫기 버튼에 적절한 라벨 제공

## 🎯 성능 최적화

- **React.memo**: 불필요한 리렌더링 방지
- **useCallback**: 함수 메모이제이션
- **자동 정리**: 토스트 제거 시 메모리 누수 방지
- **최대 개수 제한**: DOM 노드 수 제한

## 🔄 상태 관리

- **React Context**: 전역 상태 관리
- **useReducer**: 복잡한 상태 로직 처리
- **자동 ID 생성**: 고유 식별자 자동 생성
- **타이머 관리**: 자동 제거 타이머 관리

## 📱 반응형 디자인

- **모바일 최적화**: 작은 화면에서 적절한 크기
- **터치 친화적**: 모바일에서 사용하기 편한 크기
- **유연한 레이아웃**: 다양한 화면 크기 대응

## 🧪 테스트

```tsx
// 테스트 예시
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '@/shared/ui/toast';

function TestComponent() {
  const toast = useToast();
  return <button onClick={() => toast.success('테스트')}>토스트 표시</button>;
}

test('토스트가 표시되어야 한다', () => {
  render(
    <ToastProvider>
      <TestComponent />
    </ToastProvider>
  );
  
  fireEvent.click(screen.getByText('토스트 표시'));
  expect(screen.getByText('테스트')).toBeInTheDocument();
});
```

## 🚨 문제 해결

### 토스트가 표시되지 않는 경우

1. `ToastProvider`가 올바르게 설정되었는지 확인
2. `ToastContainer`가 렌더링되었는지 확인
3. z-index 충돌이 없는지 확인

### 애니메이션이 작동하지 않는 경우

1. framer-motion이 설치되었는지 확인
2. CSS 클래스가 올바르게 적용되었는지 확인

### 성능 문제

1. `maxToasts` 값을 적절히 설정
2. 불필요한 토스트 생성을 피함
3. `persistent: true` 사용을 최소화

## 📚 추가 자료

- [Framer Motion 문서](https://www.framer.com/motion/)
- [React Context API](https://react.dev/reference/react/createContext)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)

