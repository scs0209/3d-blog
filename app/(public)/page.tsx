import type { Metadata } from 'next';
import { baseUrl } from '@/shared/consts/baseUrl';
import { PortfolioView } from '@/views/portfolio';
import { aboutMeData } from '@/widgets/portfolio/consts';

const DESCRIPTION = '프론트엔드 개발자 AYAAN에 대한 AI 메모리. 칩 안으로 들어가 기억을 하나씩 불러와 보는 포트폴리오';

export const metadata: Metadata = {
  title: 'AYAAN',
  description: DESCRIPTION,
  alternates: { canonical: baseUrl },
  openGraph: { title: 'AYAAN', description: DESCRIPTION, url: baseUrl, type: 'profile' },
};

/** 검색엔진용 인물 정보. 값은 모두 포트폴리오 데이터 파일에서 가져온다 (메일 주소는 넣지 않는다) */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: aboutMeData.name,
  jobTitle: aboutMeData.title,
  description: DESCRIPTION,
  url: baseUrl,
  sameAs: aboutMeData.socials.map((social) => social.url).filter((url) => url.startsWith('https://')),
};

/** 첫 화면: 칩 포트폴리오. 이 사이트의 포트폴리오 주소는 여기 하나다 */
export default function HomePage() {
  return (
    <div className='h-dvh overflow-hidden bg-[#050608]'>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 서버에서 만든 고정 JSON이며 '<'는 이스케이프한다
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />
      <PortfolioView />
    </div>
  );
}
