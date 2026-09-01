# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router), React 19, TypeScript, Prisma, PostgreSQL, Tailwind CSS, React Three Fiber, TanStack Query, NextAuth. FSD(Feature-Sliced Design) 아키텍처. 배포: Vercel(README 기준).

## Users

- **주요 방문자:** 채용 담당자와 동료 개발자(혼합).
- **채용 담당자:** 포트폴리오·기술 역량·프로젝트 경험을 빠르게 파악.
- **동료 개발자:** Next.js, Three.js, FSD 등 웹 개발 실험·학습 기록을 읽음.
- **운영자(본인):** 블로그 글 작성·편집, 카테고리/태그 관리, 사용자·콘텐츠 관리.

## Product Purpose

개인 블로그이자 포트폴리오 사이트. 웹 개발 학습·실험 기록을 남기고, 3D 인터랙티브 홈으로 첫인상과 몰입감을 전달하며, 채용·기술 공유 목적을 동시에 충족한다. 성공 기준: 방문자가 기술 역량과 프로젝트를 이해하고, 블로그 콘텐츠를 읽기 쉽게 소비할 수 있는 것.

## Positioning

**3D 인터랙티브 홈이 핵심 차별점.** React Three Fiber 기반 3D 씬(아바타, 행성, 큐브 인터랙션 등)으로 일반 정적 포트폴리오와 구분되는 첫 경험을 제공한다. 블로그·관리자·AI 요약은 그 경험을 뒷받침하는 콘텐츠·운영 레이어.

## Operating Context

- **공개 영역:** 홈(3D), 블로그 목록·상세·카테고리, 포트폴리오, 로그인/회원가입.
- **관리자 영역:** 게시물·카테고리·태그·사용자 CRUD, 대시보드.
- **콘텐츠 작성:** 마크다운/위지윅 에디터, AI 본문 요약(OpenRouter).
- **개발·배포:** `pnpm dev` 로컬 실행, Prisma 마이그레이션, OpenAPI 타입 자동 생성.
- **언어:** UI·메타·README 주로 한국어.

## Capabilities and Constraints

**확인된 기능**

- 블로그 CRUD, 카테고리·태그, 댓글·좋아요, 사용자 인증(NextAuth).
- 3D 홈 씬(테마 전환, 아바타 애니메이션, 행성/큐브 인터랙션).
- 포트폴리오 프로젝트 소개(정적 데이터: `src/widgets/portfolio/consts/portfolioProject.ts`).
- 관리자 대시보드 및 콘텐츠·사용자 관리.
- AI 포스트 요약(OpenRouter free model auto-router).
- React Query 영속 캐시, 정적 에셋 캐시(진행 중 변경 포함).

**미구현·예정**

- 게시물 검색(README: 지원 예정).

**기술·구조 제약**

- FSD 단방향 의존성 준수.
- Server/Client Component 경계 규칙(`ARCHITECTURE.md`, `.cursor/rules`).
- 3D 홈은 Client-only(`dynamic` + `ssr: false`).

## Brand Commitments

- **이름:** 3D Blog.
- **설명(메타):** "웹 개발 기록을 남기는 블로그이자, Three.js 기반 3D 홈·포트폴리오."
- **저장소:** `https://github.com/scs0209/3d-blog`.
- **톤:** 개인 학습·포트폴리오 프로젝트; 실험적 시도를 포함할 수 있음(README 명시).
- **라이선스:** MIT.

## Evidence on Hand

- **포트폴리오 이미지·설명:** `public/assets/images/portfolio.png`, `portfolioProject.ts` 내 프로젝트 기록(3D Blog, FashionBiz 인턴).
- **블로그 콘텐츠:** DB 기반 실제 게시물(관리자 통해 작성).
- **없는 것(허구 금지):** 고객 후기, 사용자 수·벤치마크, 공식 고객사 로고, 검증되지 않은 배포 URL(README clone URL은 placeholder).

## Product Principles

1. **3D 첫인상 우선** — 홈 3D 경험이 방문자의 첫 판단을 이끈다; 블로그·포트폴리오는 그 다음 레이어.
2. **기술 기록의 정직성** — 학습·실험 과정을 과장하지 않고, 코드·아키텍처로 역량을 보여준다.
3. **읽기와 운영의 분리** — 공개면은 Experience/Read, 관리자는 Operate; 각각의 목적에 맞게 설계.
4. **확장 가능한 구조** — FSD·타입 안전 API로 기능 추가 시 경계를 유지.
5. **성능 의식** — 3D와 블로그 번들 분리 등 실측 기반 최적화(Lighthouse 52→80 등 포트폴리오 기록).

## Accessibility & Inclusion

- eslint-plugin-jsx-a11y 사용.
- 3D 로딩 fallback에 `aria-hidden` 적용(홈).
- 제품별 WCAG 준수 수준은 아직 명시되지 않음(미결정).
