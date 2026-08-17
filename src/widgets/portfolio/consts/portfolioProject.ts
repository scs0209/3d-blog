import type { PortfolioProject } from '@/entities/portfolio/model';

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: '3D Blog & Portfolio',
    subtitle: '개인 블로그 / 포트폴리오 (2025.01 - 진행중)',
    description:
      'Next.js와 React Three Fiber로 만든 개인 블로그·포트폴리오입니다. 홈 3D 씬과 글 페이지 번들을 나눠 블로그 Lighthouse를 52→80으로 올렸고, OpenRouter로 본문 요약을 붙였습니다.',
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
