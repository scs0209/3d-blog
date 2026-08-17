export interface AboutMeSection {
  key: string;
  label: string;
  kicker: string;
  paragraphs: string[];
  showProfile?: boolean;
}

export const aboutMeData = {
  name: 'AYAAN',
  title: 'FRONTEND DEVELOPER',
  sections: [
    {
      key: 'quick-bio',
      label: 'QUICK BIO',
      kicker: 'BIO',
      showProfile: true,
      paragraphs: [
        '안녕하세요, 프론트엔드 개발자 성창수(Ayaan)입니다. 협업과 커뮤니케이션을 중요하게 생각하며, 문제를 함께 해결해 나가는 개발 문화를 지향합니다.',
        '개발 과정의 불편함과 사용자가 체감하는 로딩·렌더링 비용을 같이 보는 편이며, 병목을 재고 원인을 나눠 개선하는 일을 좋아합니다.',
        'React와 TypeScript를 중심으로 제품 안정화, 웹 성능 최적화, 기술 부채 해소에 집중하고 있습니다.',
      ],
    },
    {
      key: 'background',
      label: 'BACKGROUND',
      kicker: 'BACKGROUND',
      paragraphs: [
        '현재 샤플앤컴퍼니 프론트엔드 챕터에서 비즈니스 기능 개발과 웹 성능 최적화를 담당하고 있습니다.',
        '대용량 테이블 렌더링, OpenAPI 타입 자동화, Compound Pattern 기반 공통 컴포넌트, Canvas 전자계약 모듈 등을 통해 제품과 DX를 함께 개선해 왔습니다.',
        '이전에는 패션비즈에서 Next.js App Router 기반 프론트엔드와 GraphQL 연동, 다국어·SEO 작업을 경험했습니다.',
      ],
    },
    {
      key: 'focus',
      label: 'CURRENT FOCUS',
      kicker: 'FOCUS',
      paragraphs: [
        '대규모 데이터 렌더링 성능, 디자인 시스템 자동화, AI를 활용한 문서/배포 워크플로 개선에 집중하고 있습니다.',
        'Figma 아이콘 플러그인, changeset 배포 Skill, Cursor Rule 기반 문서 자동화처럼 수동 절차를 줄이는 도구를 직접 만들고 있습니다.',
        '개인 블로그/포트폴리오에서는 React Three Fiber 홈·책상 OS와 글 페이지 성능 분리, OpenRouter 본문 요약을 실험하며 제품 감각을 다듬고 있습니다.',
      ],
    },
    {
      key: 'hobbies',
      label: 'HOBBIES',
      kicker: 'HOBBIES',
      paragraphs: [
        '새로운 프론트엔드 패턴과 도구를 사이드 프로젝트에 바로 적용해 보는 것을 즐깁니다.',
        '좋은 UI·모션 레퍼런스를 찾아보고, 배운 내용은 블로그나 작은 데모로 남겨 다음에 연결합니다.',
        '협업 과정에서 나온 불편함을 기록해 두고, 재사용 가능한 컴포넌트나 자동화로 푸는 일을 좋아합니다.',
      ],
    },
  ] as AboutMeSection[],
  profileImage: '/profile.png',
  socials: [
    { type: 'github', url: 'https://github.com/scs0209' },
    { type: 'linkedin', url: 'https://www.linkedin.com/in/창수-성-7663b9275' },
    { type: 'email', url: 'mailto:tjdckdtn2463@naver.com' },
  ],
};
