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

// @react-three/fiber mock
vi.mock('@react-three/fiber', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Canvas: ({ children, ...props }) => <div data-testid="mock-canvas" {...props}>{children}</div>,
    useThree: () => ({
      gl: {
        domElement: {
          getContext: () => ({
            getExtension: vi.fn(),
            getParameter: vi.fn(),
            createShader: vi.fn(),
            shaderSource: vi.fn(),
            compileShader: vi.fn(),
            createProgram: vi.fn(),
            attachShader: vi.fn(),
            linkProgram: vi.fn(),
            useProgram: vi.fn(),
            getShaderParameter: vi.fn(() => true), // Simulate successful shader compilation
            getProgramParameter: vi.fn(() => true), // Simulate successful program linking
            // Add other WebGLRenderingContext methods if needed by components
          }),
          // Mock other domElement properties if accessed
          width: 100,
          height: 100,
        }
      },
      scene: {
        add: vi.fn(),
        remove: vi.fn(),
        traverse: vi.fn(),
        // Mock other scene properties/methods if accessed
      },
      camera: {
        position: { set: vi.fn(), x: 0, y: 0, z: 5 },
        lookAt: vi.fn(),
        // Mock other camera properties/methods if accessed
      },
      size: { width: 100, height: 100 },
      viewport: { width: 100, height: 100, factor: 1 },
      // Mock other useThree return properties if accessed by components
    }),
    useFrame: (callback, renderPriority) => {
      // For most unit tests, useFrame logic might not need to be executed every frame.
      // If specific timing or sequence is important, this mock might need adjustment.
      // vi.fn(callback)(); // Example: call the callback once
    },
    // Mock other R3F exports if necessary
  };
});

// @react-three/drei mock (필요에 따라 확장)
vi.mock('@react-three/drei', async (importOriginal) => {
  const actual = await importOriginal();
  const MockComponent = ({ children, ...props }) => <div {...props}>{children}</div>;

  // 모든 named export를 MockComponent로 대체하거나, 개별적으로 mock
  const mockedDrei = Object.keys(actual).reduce((acc, key) => {
    // 특정 컴포넌트는 다르게 mock 할 수 있음
    // if (key === 'OrbitControls') acc[key] = () => <div data-testid="mock-orbit-controls" />;
    // else if (typeof actual[key] === 'function' || (actual[key] && typeof actual[key] === 'object' && 'render' in actual[key])) {
    //   // Heuristic for components
    //   acc[key] = ({ children, ...props }) => <div data-testid={`mock-${key.toLowerCase()}`} {...props}>{children}</div>;
    // } else {
    //   acc[key] = actual[key]; // Non-component exports (hooks, helpers) can be kept or mocked specifically
    // }
    if (typeof actual[key] === 'function') {
       // 간단화를 위해 모든 함수형 컴포넌트를 div로 mock. 실제 컴포넌트 동작과 유사하게 만들려면 더 정교한 mock 필요.
       // @ts-ignore
      acc[key] = (props) => <div data-testid={`mock-${key.toLowerCase()}`} {...props} />;
    } else {
      acc[key] = actual[key]; // 함수가 아닌 export는 그대로 유지 (예: constants)
    }
    return acc;
  }, {});

  return {
    ...mockedDrei,
    // 개별적으로 더 정교한 mock이 필요한 경우 여기에 명시
    // 예: Html: ({ children }) => <div data-testid="mock-html">{children}</div>,
  };
});

// next/router 및 next/navigation mock (라우팅 관련 기능 테스트 시)
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
