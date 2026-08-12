export type CosmosPortalId = 'blog' | 'portfolio' | 'about';

export type CosmosPortal = {
  id: CosmosPortalId;
  label: string;
  href: string;
  description: string;
  cta: string;
  /** 씬 월드 좌표 (xz 근접 감지) */
  position: [number, number, number];
  radius: number;
  accent: string;
  /** 다가가면 솟아오르는 프리뷰 모델 */
  revealModel: string;
  revealHeight: number;
};

/**
 * 중앙 통로(대략 |x| < 5)를 비우고
 * 좌 Blog / 우 Portfolio / 전방 About — 걷기 경로에 맞춰 삼각 배치
 */
export const COSMOS_PORTALS: readonly CosmosPortal[] = [
  {
    id: 'blog',
    label: 'Blog',
    href: '/blog',
    description: 'Posts, notes, and experiments.',
    cta: 'Explore',
    position: [-9.5, -0.12, -9],
    radius: 4.8,
    accent: '#3de8ff',
    revealModel: '/scifi_terminal.glb',
    revealHeight: 1.55,
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    href: '/portfolio',
    description: 'Selected projects and work.',
    cta: 'Enter',
    position: [9.5, -0.12, -9],
    radius: 4.8,
    accent: '#ff9a3c',
    revealModel: '/cosmos/books/book_encyclopedia_set_01_1k.gltf',
    revealHeight: 1.45,
  },
  {
    id: 'about',
    label: 'About',
    href: '/portfolio',
    description: 'A short intro about me.',
    cta: 'Enter',
    position: [0, -0.12, -23],
    radius: 5.2,
    accent: '#c070ff',
    revealModel: '/cute_astronaut.glb',
    revealHeight: 1.7,
  },
] as const;

export const COSMOS_PORTAL_HINT_KEY = 'cosmos-portal-hint-seen';

export const getCosmosPortal = (id: CosmosPortalId | null): CosmosPortal | null => {
  if (!id) {
    return null;
  }
  return COSMOS_PORTALS.find((portal) => portal.id === id) ?? null;
};
