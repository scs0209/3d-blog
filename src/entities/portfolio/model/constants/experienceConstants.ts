import type { Experience } from '../types';

export const experiences: Experience[] = [
  {
    id: 'XP_02',
    company: 'SHOPL & COMPANY',
    role: 'FRONTEND DEVELOPER',
    period: '2024.07 - Present',
    location: 'Seoul, South Korea',
    description: [
      '프론트엔드 챕터에서 비즈니스 기능 개발과 웹 성능 최적화를 담당하며, 기술 부채 해소와 제품 안정화를 위한 개선을 진행하고 있습니다.',
      '대용량 데이터(3,000rows × 255cols) 렌더링 시 발생하던 브라우저 프리징을 tanstack/react-virtualizer 기반 윈도잉으로 해결해 스크롤 성능을 확보했습니다.',
      'openapi-typescript로 OpenAPI → TS 타입 자동 생성 파이프라인을 구축하고, Compound Pattern 공통 Table 컴포넌트 문서화로 DX를 개선했습니다.',
      'Canvas API 기반 전자계약 모듈(서명/도장 그리기, 에셋 추출, 예약 발송)을 구현하고, LLM Skill·Figma 플러그인·Git 브랜치 전략·문서 자동화로 배포/디자인 시스템 프로세스를 개선했습니다.',
    ],
    skills: [
      'React',
      'TypeScript',
      'Emotion',
      'TanStack Query',
      'TanStack Table',
      'React Hook Form',
      'Vite',
      'Sentry',
    ],
  },
  {
    id: 'XP_01',
    company: 'FASHIONBIZ',
    role: 'FRONTEND INTERN',
    period: '2024.02 - 2024.05',
    location: 'Seoul, South Korea',
    description: [
      'Next.js App Router로 패션 비즈니스 사이트 전반 페이지를 개발하고, 반응형 디자인을 적용했습니다.',
      'Apollo Client로 GraphQL API 통신과 상태 관리를 구현하고, Google 번역 API로 해외 사용자를 위한 다국어 지원을 추가했습니다.',
      'Metatag와 서버 컴포넌트를 활용해 SEO를 최적화했습니다.',
    ],
    skills: [
      'Next.js',
      'TypeScript',
      'Styled Components',
      'React Hook Form',
      'GraphQL',
      'Apollo Client',
    ],
  },
];

export const EXPERIENCE_ANIMATION_DURATION = {
  slide: 0.5,
  drop: 0.7,
  card: 0.3,
} as const;
