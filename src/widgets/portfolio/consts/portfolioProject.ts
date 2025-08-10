interface PortfolioProject {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  liveUrl: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: 'Portfolio',
    subtitle: '포트폴리오 겸 블로그 프로젝트',
    description:
      'Next.js 15, Shadcn UI, Tailwind CSS, TypeScript, Framer Motion, React Three Fiber, Three.js, Tailwind CSS, TypeScript, Framer Motion, React Three Fiber, Three.js를 사용해서 만든 포트폴리오 겸 블로그 프로젝트입니다.',
    image: '/assets/images/portfolio.png',
    liveUrl: 'https://github.com/scs0209/3d-blog',
  },
  {
    id: 2,
    title: "MERCHIANE BALI'S PORTFOLIO V1",
    subtitle: 'Personal portfolio website',
    description:
      'The first version of my portfolio website, showcasing my skills, projects, and experience as a developer. It features a 3D design and smooth navigation, emphasizing responsiveness across devices.',
    image: '/assets/images/project2.jpg',
    liveUrl: 'https://example.com',
  },
  {
    id: 3,
    title: "ZIME FUMUDOH'S PORTFOLIO",
    subtitle: 'Creative personal website',
    description:
      "A remake of Fumudoh's personal website, inspired by an award-winning Squarespace template. Built using standard web technologies, it features engaging animations created with GSAP and WebGL, enhancing the site's visual appeal and interactivity.",
    image: '/assets/images/project3.jpg',
    liveUrl: 'https://example.com',
  },
];
