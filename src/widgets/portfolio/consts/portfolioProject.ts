import type { PortfolioProject } from '@/entities/portfolio/model';

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: '3D Blog & Portfolio',
    subtitle: '개인 블로그 / 포트폴리오 (2025.01 - 진행중)',
    description:
      'FSD 아키텍처로 설계한 Next.js 기반 블로그·포트폴리오입니다. React Three Fiber 3D 씬, OpenRouter AI 본문 요약, OpenAPI 타입 자동화까지 제품과 DX를 함께 실험하고 있습니다.',
    image: '/assets/images/portfolio.png',
    sourceUrl: 'https://github.com/scs0209/3d-blog',
  },
  {
    id: 2,
    title: 'FashionBiz',
    subtitle: '패션 비즈니스 사이트 (인턴, 2024.02 - 2024.05)',
    description:
      'Next.js App Router로 전체 페이지를 구현하고, Apollo Client로 GraphQL 연동과 상태 관리를 담당했습니다. Google 번역 API 다국어 지원과 Metatag·서버 컴포넌트 기반 SEO 최적화를 적용했습니다.',
    image: '/assets/images/project2.jpg',
    liveUrl: 'https://fashionbiz.co.kr/',
  },
];
