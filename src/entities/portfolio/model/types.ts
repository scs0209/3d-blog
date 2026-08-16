export type PortfolioProject = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  /** 배포된 사이트 URL. 없으면 VIEW LIVE 미노출 */
  liveUrl?: string;
  /** GitHub 등 소스 저장소 URL. 없으면 SOURCE 미노출 */
  sourceUrl?: string;
};

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  skills: string[];
};
