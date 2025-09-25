<!-- Sync Impact Report -->
<!-- Version change: 1.0.0 → 1.1.0 -->
<!-- Modified principles: Type Safety & API-First (enhanced with fetcher pattern) -->
<!-- Added sections: API Development Standards, Type Generation Workflow -->
<!-- Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md -->
<!-- Follow-up TODOs: None -->

# 3D 블로그 프로젝트 Constitution

## Core Principles

### I. Feature-Sliced Design (FSD) Architecture (NON-NEGOTIABLE)
모든 코드는 FSD 아키텍처 원칙을 따라야 합니다. 레이어 간 단방향 의존성을 유지하고, 각 슬라이스는 명확한 책임을 가져야 합니다. `src/` 디렉토리 내에서 `app/`, `views/`, `widgets/`, `features/`, `entities/`, `shared/` 레이어 구조를 엄격히 준수해야 합니다.

### II. 3D-First Development
React Three Fiber를 활용한 3D 요소는 프로젝트의 핵심 차별화 요소입니다. 모든 새로운 기능은 3D 요소와의 통합 가능성을 고려해야 하며, 60fps 성능을 유지해야 합니다. 3D 컴포넌트는 `src/shared/ui/` 내에서 재사용 가능하게 설계해야 합니다.

### III. Type Safety & API-First (NON-NEGOTIABLE)
모든 API는 OpenAPI 명세로 정의하고, `openapi-typescript`를 통해 타입을 자동 생성해야 합니다. API 호출은 반드시 `fetcher.ts`의 유틸리티 함수를 사용하며, `types.ts`의 `ApiRequest`, `ApiResponse`, `ApiRequestParams` 타입을 활용해야 합니다. TypeScript의 strict 모드를 사용하며, `any` 타입 사용을 금지합니다. API 변경 시 반드시 스키마를 먼저 업데이트하고 `pnpm run generate-types`로 타입을 재생성해야 합니다.

### IV. Test-Driven Development (TDD)
모든 새로운 기능은 테스트를 먼저 작성해야 합니다. Contract 테스트, 통합 테스트, 단위 테스트를 단계적으로 구현하며, 테스트 커버리지 80% 이상을 유지해야 합니다. 테스트는 실패하는 상태에서 시작하여 구현을 통해 통과시켜야 합니다.

### V. Performance & Accessibility
초기 로딩 시간 3초 이내, 3D 렌더링 60fps 유지, 메모리 사용량 100MB 이하를 준수해야 합니다. WCAG 2.1 AA 수준의 접근성을 보장하며, 키보드 네비게이션과 스크린 리더를 지원해야 합니다.

## FSD Architecture Standards

### Layer Dependencies
- `shared` → 의존성 없음 (최하위 레이어)
- `entities` → `shared`만 의존 가능
- `features` → `entities`, `shared` 의존 가능
- `widgets` → `features`, `entities`, `shared` 의존 가능
- `views` → `widgets`, `features`, `entities`, `shared` 의존 가능
- `app` → 모든 레이어 의존 가능

### File Naming Conventions
- 컴포넌트: PascalCase (Button.tsx)
- 훅: camelCase with 'use' prefix (useAuth.ts)
- 유틸리티: camelCase (formatDate.ts)
- 타입: PascalCase (User.ts)
- 상수: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)
- **클라이언트 API**: `*-api.ts` (post-api.ts)
- **서버 API**: `*-service.ts` (post-service.ts)

## 3D Development Standards

### Performance Requirements
- 3D 씬은 60fps 유지
- 메모리 사용량 100MB 이하
- 모바일에서도 부드러운 렌더링
- LOD(Level of Detail) 적용

### Component Structure
- 3D 컴포넌트는 `src/shared/ui/` 내에 위치
- `useRef`로 mesh/group 참조 관리
- `useFrame`으로 애니메이션 업데이트
- cleanup 함수에서 리소스 정리

### Animation Standards
- 애니메이션은 `AnimationMixer` 사용
- `LoopOnce` vs `LoopRepeat` 적절히 선택
- 이벤트 리스너로 애니메이션 완료 감지
- 성능을 위해 불필요한 re-render 방지

## API Development Standards

### Core API Files
- **Fetcher 함수**: `src/shared/api/fetcher.ts` - 타입 안전한 API 호출 유틸리티
- **API 타입 정의**: `src/shared/api/types.ts` - ApiRequest, ApiResponse, ApiRequestParams 타입
- **API 인덱스**: `src/shared/api/index.ts` - 모든 API 유틸리티 export
- **OpenAPI 타입**: `src/shared/api/openapi-types.ts` - 자동 생성된 OpenAPI 타입

### Type Generation Workflow
- API 스키마 변경 시 `pnpm run generate-types` 실행 필수
- 생성된 `openapi-types.ts` 파일은 자동 커밋하지 않음
- `src/shared/api/types.ts`의 유틸리티 타입만 사용
- `fetcher.ts`의 `FetcherParams` 타입을 통한 타입 안전한 API 호출

### API Implementation Pattern
- **클라이언트 API 함수**: `src/features/*/api/` 디렉토리에 위치, `fetcher` 사용
- **서버 API 함수**: `src/features/*/api/` 디렉토리에 위치, Prisma 클라이언트 직접 사용
- `ApiRequest`, `ApiResponse`, `ApiRequestParams` 타입 활용
- Path parameter는 `{paramName}` 형식으로 URL에 포함

### Server-Side API Guidelines
- **클라이언트 API 호출**: `fetcher` 함수 사용 필수 (타입 안전성 보장)
- **서버 컴포넌트**: Prisma 클라이언트를 통한 직접 데이터베이스 조작
- **서버 API 라우트**: `app/api/` 디렉토리의 Next.js API Routes 사용
- **API 라우트 내부**: Prisma 클라이언트 사용, `fetcher` 사용 금지
- **외부 API 호출**: 서버에서는 `fetch` 또는 `axios` 직접 사용

### API Utility Functions
```typescript
// src/shared/api/fetcher.ts
export const fetcher = async <P extends Path, M extends Method<P>>({
  url, method, config, ...restParams
}: FetcherParams<P, M>) => { ... }

// src/shared/api/types.ts
export type ApiResponse<T extends keyof paths, M extends keyof paths[T]> = ...
export type ApiRequest<T extends keyof paths, M extends keyof paths[T]> = ...
export type ApiRequestParams<T extends keyof paths, M extends keyof paths[T]> = ...
```

### API Usage Patterns
```typescript
// ✅ 클라이언트 컴포넌트 (fetcher 사용)
// src/features/post/api/post-api.ts
export const getPosts = async (params: GetPostsParams) => {
  return fetcher({
    url: '/api/posts',
    method: 'get',
    query: params
  });
};

// ✅ 서버 컴포넌트 (Prisma 직접 사용)
// src/features/post/api/post-service.ts
export const getPostsServer = async (params: GetPostsParams) => {
  return prisma.post.findMany({
    where: { published: true },
    include: { author: true, category: true }
  });
};

// ✅ 서버 컴포넌트에서 사용
// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await getPostsServer({ page: 1, limit: 10 });
  return <PostsList posts={posts} />;
}

// ✅ 서버 API 라우트 (Prisma 클라이언트 사용)
// app/api/posts/route.ts
export async function GET() {
  const posts = await prisma.post.findMany();
  return Response.json(posts);
}

// ✅ 외부 API 호출 (서버에서는 fetch 직접 사용)
const response = await fetch('https://api.external.com/data');
const externalData = await response.json();
```

### Type Safety Enforcement
- API 호출 시 컴파일 타임 타입 검증 필수
- 런타임 에러 방지를 위한 타입 가드 사용
- API 응답 타입을 명시적으로 지정
- Query parameter와 Path parameter 구분

## Quality Standards

### Code Quality
- ESLint와 Prettier 설정 준수
- Biome을 통한 코드 품질 검사
- 모든 함수와 컴포넌트에 JSDoc 주석
- 복잡도가 높은 함수는 분리

### Security Requirements
- NextAuth.js를 통한 인증 시스템
- CSRF 보호 및 XSS 방지
- API 엔드포인트 권한 검증
- 사용자 입력 데이터 sanitization

### Performance Monitoring
- Web Vitals 지표 모니터링
- 3D 렌더링 성능 추적
- 메모리 사용량 모니터링
- 번들 크기 최적화

## Development Workflow

### Git Workflow
- Feature branch 기반 개발
- 커밋 메시지는 한국어로 작성
- PR 생성 시 자동 AI 리뷰 활용
- 메인 브랜치 병합 전 코드 리뷰 필수

### Testing Strategy
- Contract 테스트: API 스키마 검증
- 통합 테스트: 사용자 시나리오 검증
- 단위 테스트: 개별 함수/컴포넌트 검증
- E2E 테스트: 전체 사용자 플로우 검증

### Documentation Requirements
- README.md는 한국어로 작성
- API 문서는 OpenAPI 명세 기반
- 아키텍처 문서는 FSD 구조 반영
- 코드 주석은 한국어로 작성

## Governance

### Constitution Authority
이 Constitution은 프로젝트의 모든 개발 활동을 지배하는 최상위 규칙입니다. Constitution과 다른 문서 간 충돌 시 Constitution이 우선합니다.

### Amendment Process
- Constitution 수정은 별도의 이슈로 제기
- 변경 사항은 문서화하고 승인 필요
- 마이그레이션 계획과 함께 제시
- 버전 관리: MAJOR.MINOR.PATCH 형식

### Compliance Review
- 모든 PR은 Constitution 준수 여부 검토
- 복잡성 증가 시 정당성 입증 필요
- 성능 기준 미달 시 개선 방안 제시
- 아키텍처 위반 시 리팩토링 요구

**Version**: 1.1.0 | **Ratified**: 2025-01-16 | **Last Amended**: 2025-01-16