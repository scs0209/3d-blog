import 'vitest-canvas-mock';
import { vi } from 'vitest';

// ResizeObserver mock (vitest-canvas-mock에 포함되어 있을 수 있으나, 명시적 선언)
if (typeof window !== 'undefined') {
  global.ResizeObserver = require('resize-observer-polyfill');

  // window.matchMedia mock (일부 UI 라이브러리 또는 훅에서 필요할 수 있음)
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  };
}

// @react-three/test-renderer 사용 시 @react-three/fiber의 많은 부분을 mock할 필요가 줄어듭니다.
// Canvas, useThree, useFrame 등은 test-renderer가 내부적으로 처리하거나 테스트용 버전을 제공합니다.
// 하지만, useGLTF 같이 파일 시스템/네트워크 접근이 있는 훅은 여전히 mock하는 것이 좋습니다.

vi.mock('@react-three/drei', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // useGLTF만 mock하고, 다른 Drei 컴포넌트/훅은 test-renderer가 처리하도록 둡니다.
    // Cube.test.tsx에서 useGLTF를 직접 mock 하므로, 여기서는 전역 mock을 제거하거나 최소화합니다.
    // 만약 다른 Drei 요소에 대한 전역 mock이 필요하다면 여기에 추가합니다.
    // useGLTF: vi.fn().mockReturnValue({ nodes: {}, materials: {} }), // Cube.test.tsx에서 구체적으로 mock
  };
});


// next/router 및 next/navigation mock (라우팅 관련 기능 테스트 시)
// 이 부분은 R3F 테스트와 직접적인 관련은 없으므로 그대로 둡니다.
vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    push: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn().mockResolvedValue(undefined),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// next/link mock
// https://github.com/vercel/next.js/issues/48987#issuecomment-1508989426
// next/link를 사용하는 컴포넌트 테스트 시 Link가 실제 anchor 태그처럼 동작하도록 mock.
vi.mock('next/link', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef(function NextLink(props, ref) {
      const { href, children, ...rest } = props;
      return React.createElement('a', { ...rest, href, ref }, children);
    }),
  };
});

// window.URL.createObjectURL mock (파일 업로드 등에서 사용될 수 있음)
if (typeof window !== 'undefined' && typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: vi.fn(), writable: true });
  Object.defineProperty(window.URL, 'revokeObjectURL', { value: vi.fn(), writable: true });
}

// IntersectionObserver mock (무한 스크롤 등에서 사용될 수 있음)
if (typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined') {
  global.IntersectionObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(() => []),
  }));
}

// 필요한 경우 다른 전역 API mock (localStorage, fetch 등) 추가
// 예: global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
// msw를 사용하고 있다면 fetch는 msw가 처리하므로 명시적 mock이 불필요할 수 있음.

// console.error, console.warn을 mock하여 테스트 중 불필요한 로그를 숨기거나 특정 경고를 확인할 수 있음
// beforeEach(() => {
//   vi.spyOn(console, 'error').mockImplementation(() => {});
//   vi.spyOn(console, 'warn').mockImplementation(() => {});
// });
// afterEach(() => {
//   vi.restoreAllMocks();
// });
