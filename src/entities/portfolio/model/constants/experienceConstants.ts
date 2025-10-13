import type { Experience } from '../types';

export const experiences: Experience[] = [
  {
    id: 'XP_03',
    company: 'EZ TELECOM',
    role: 'FRONT-END DEVELOPER',
    period: '2023.08 - 2024.12',
    location: 'Seoul, South Korea',
    description: [
      '통신사 앱(kt, lg, sk) 개발 및 유지보수를 담당하며, React Native와 TypeScript를 활용한 크로스 플랫폼 모바일 애플리케이션 개발 경험을 쌓았습니다.',
      '사용자 중심의 UI/UX 설계와 성능 최적화에 집중하여, 앱의 반응성과 사용자 만족도를 크게 향상시켰습니다.',
      'Firebase를 통한 실시간 데이터 동기화 및 푸시 알림 시스템을 구축하여, 사용자 참여도를 증대시켰습니다.',
    ],
    skills: ['React Native', 'TypeScript', 'Redux', 'Firebase', 'REST API', 'Git'],
  },
  {
    id: 'XP_02',
    company: 'FREELANCE',
    role: 'FULL-STACK DEVELOPER',
    period: '2022.03 - 2023.07',
    location: 'Remote',
    description: [
      '다양한 클라이언트를 위한 웹 애플리케이션 개발 프로젝트를 수행하며, 프론트엔드부터 백엔드까지 전반적인 개발 역량을 강화했습니다.',
      'Next.js와 React를 활용한 SEO 최적화된 웹사이트 구축 경험을 쌓았으며, TailwindCSS를 통한 반응형 디자인 구현에 능숙합니다.',
      'Node.js와 MongoDB를 이용한 RESTful API 서버 개발 및 배포 경험을 보유하고 있습니다.',
    ],
    skills: ['Next.js', 'React', 'Node.js', 'MongoDB', 'TailwindCSS', 'Vercel'],
  },
  {
    id: 'XP_01',
    company: 'STARTUP',
    role: 'MOBILE DEVELOPER',
    period: '2021.01 - 2022.02',
    location: 'Busan, South Korea',
    description: [
      '스타트업 환경에서 빠른 제품 출시를 위한 애자일 개발 방법론을 경험했습니다.',
      'React Native를 활용한 iOS/Android 앱 동시 개발을 통해 개발 효율성을 극대화했습니다.',
      'Firebase를 이용한 백엔드 인프라 구축 및 실시간 데이터베이스 설계 경험을 보유하고 있습니다.',
    ],
    skills: ['React Native', 'Firebase', 'Redux', 'Node.js', 'MongoDB'],
  },
];

export const EXPERIENCE_ANIMATION_DURATION = {
  slide: 0.5,
  drop: 0.7,
  card: 0.3,
} as const;
