import type { Metadata } from 'next';
import { PortfolioClient } from '@/widgets/portfolio/ui/PortfolioClient';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: '3D 인터랙티브 포트폴리오 - 프로젝트, 스킬, 경력을 3D 환경에서 탐험하세요',
  openGraph: {
    title: 'Portfolio',
    description: '3D 인터랙티브 포트폴리오',
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
