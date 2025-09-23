# [FEATURE] 블로그 어드민 대시보드

## 📋 개요
블로그 관리자를 위한 통합 대시보드를 구현하여 포스트, 댓글, 사용자, 통계 등을 한 곳에서 관리할 수 있도록 합니다. 기존의 개별 관리 페이지들을 통합하고 직관적인 UI/UX를 제공합니다.

## Clarifications

### Session 2025-01-16
- Q: 관리자 역할 정의 → A: 단일 관리자 역할 (모든 권한)
- Q: 데이터 엔티티 및 관계 → A: 기존 데이터베이스 스키마 그대로 사용
- Q: 사용자 여정 및 핵심 시나리오 → A: 대시보드 홈 → 통계 확인 → 개별 관리 페이지 이동 + 모달/사이드패널 조합
- Q: 오류 처리 및 예외 상황 → A: 기본적인 오류 메시지 표시만
- Q: 완료 기준 및 측정 지표 → A: 정성+정량 혼합 (사용성 + 성능 지표)

## 🎯 목표
- 포스트, 댓글, 사용자, 카테고리, 태그를 통합 관리할 수 있는 대시보드 구현
- 실시간 통계 및 분석 데이터 시각화
- 직관적이고 반응형인 관리자 인터페이스 제공
- 3D 요소를 활용한 사이버펑크 테마 적용

## 📊 데이터 모델
기존 Prisma 스키마의 다음 엔티티들을 활용합니다:
- **User**: 사용자 정보 (id, name, email, isAdmin, createdAt)
- **Post**: 블로그 포스트 (id, title, content, published, authorId, categoryId, createdAt)
- **Comment**: 댓글 (id, content, postId, authorId, approved, createdAt)
- **Category**: 카테고리 (id, name, slug, description)
- **Tag**: 태그 (id, name, slug)
- **PostTag**: 포스트-태그 다대다 관계

## 🚶‍♂️ 사용자 여정
### 주요 시나리오
1. **대시보드 홈 접근**: 로그인 후 통합 대시보드 메인 페이지 진입
2. **통계 확인**: 포스트, 댓글, 사용자 수 등 핵심 지표 한눈에 파악
3. **관리 작업 수행**: 
   - 간단한 작업: 모달/사이드패널에서 즉시 처리 (댓글 승인, 포스트 상태 변경)
   - 복잡한 작업: 개별 관리 페이지로 이동 (포스트 편집, 사용자 관리)
4. **실시간 모니터링**: 대시보드에서 지속적으로 활동 피드 확인

## 🔧 기술 스펙
- **프레임워크**: Next.js 15, React 19
- **UI 라이브러리**: Shadcn UI, Tailwind CSS
- **상태 관리**: React Query (TanStack Query)
- **인증**: NextAuth.js (관리자 권한 검증)
- **데이터베이스**: Prisma + PostgreSQL
- **3D 렌더링**: React Three Fiber
- **차트 라이브러리**: Recharts
- **테이블 라이브러리**: React Table (TanStack Table)
- **아이콘**: Lucide React

## 🔌 API 개발 표준
Constitution v1.1.0에 따라 다음 API 개발 표준을 준수해야 합니다:

### Type Safety & API-First 원칙
- **OpenAPI 명세**: 모든 API 엔드포인트는 OpenAPI 명세로 정의
- **자동 타입 생성**: `pnpm run generate-types` 명령어로 타입 자동 생성
- **Fetcher 패턴**: 모든 API 호출은 `fetcher.ts` 유틸리티 함수 사용 필수
- **타입 활용**: `types.ts`의 `ApiRequest`, `ApiResponse`, `ApiRequestParams` 타입 활용

### API 구현 패턴
- **API 함수 위치**: `src/features/admin/api/` 디렉토리에 위치
- **일관된 호출 패턴**: `fetcher` 함수를 사용한 통일된 API 호출
- **Path Parameter**: `{paramName}` 형식으로 URL에 포함
- **타입 안전성**: 컴파일 타임 타입 검증 필수

### 타입 생성 워크플로우
- **스키마 우선**: API 변경 시 스키마를 먼저 업데이트
- **자동 생성**: `pnpm run generate-types`로 타입 재생성
- **파일 관리**: 생성된 `openapi-types.ts` 파일은 자동 커밋하지 않음
- **유틸리티 타입**: `src/shared/api/types.ts`의 유틸리티 타입만 사용

## 📁 관련 파일
- `app/(protect)/admin/page.tsx` - 메인 대시보드 페이지
- `src/widgets/admin/ui/AdminDashboard.tsx` - 대시보드 메인 컴포넌트
- `src/widgets/admin/ui/StatsCards.tsx` - 통계 카드 컴포넌트
- `src/widgets/admin/ui/RecentPosts.tsx` - 최근 포스트 위젯
- `src/widgets/admin/ui/RecentComments.tsx` - 최근 댓글 위젯
- `src/widgets/admin/ui/UserActivity.tsx` - 사용자 활동 위젯
- `src/features/admin/api/dashboard.ts` - 대시보드 API 함수 (fetcher 패턴 사용)
- `src/features/admin/api/stats.ts` - 통계 API 함수 (fetcher 패턴 사용)
- `src/features/admin/api/posts.ts` - 포스트 관리 API 함수 (fetcher 패턴 사용)
- `src/features/admin/api/comments.ts` - 댓글 관리 API 함수 (fetcher 패턴 사용)
- `src/features/admin/api/users.ts` - 사용자 관리 API 함수 (fetcher 패턴 사용)
- `src/entities/admin/model/types.ts` - 대시보드 타입 정의
- `src/shared/api/fetcher.ts` - API 호출 유틸리티 함수
- `src/shared/api/types.ts` - API 타입 유틸리티
- `src/shared/api/openapi-types.ts` - 자동 생성된 OpenAPI 타입

## 📦 Repomix 파일 구조
프로젝트는 AI 도구 최적화를 위해 다음과 같이 분리된 repomix 파일들을 사용합니다:

| 파일명 | 크기 | 설명 | 토큰 수 | 용도 |
|--------|------|------|---------|------|
| `repomix-src.xml` | 253K | 핵심 소스 코드 (src/) | 60,174 | 전체 코드베이스 분석 |
| `repomix-api.xml` | 61K | API 엔드포인트 (app/api/) | 12,846 | API 개발 및 문서화 |
| `repomix-api-types.xml` | 96K | API 타입 정의 (src/shared/api/) | 16,672 | 타입 시스템 분석 |
| `repomix-3d-components.xml` | 44K | 3D 컴포넌트 (src/shared/ui/) | 12,160 | 3D 개발 및 최적화 |
| `repomix-admin.xml` | 12K | 관리자 기능 | 3,071 | **관리자 대시보드 개발** |
| `repomix-blog.xml` | 14K | 블로그 기능 | 3,546 | 블로그 관련 기능 |
| `repomix-portfolio.xml` | 50K | 포트폴리오 기능 | 14,044 | 포트폴리오 관리 |

### Repomix 설정
- **설정 파일**: `repomix.config.json`
- **생성 스크립트**: `scripts/generate-repomix.sh`
- **문서화**: `README-repomix.md`
- **포함 파일**: TypeScript, JavaScript, JSON, Markdown, YAML
- **제외 파일**: node_modules, .next, dist, build, 로그 파일
- **압축**: 토큰 수 최적화를 위한 압축 적용

## 🚀 구현 계획

### Phase 1: 기본 구조 및 레이아웃
- [ ] 대시보드 메인 레이아웃 컴포넌트 구현
- [ ] 사이드바 네비게이션 메뉴 구성
- [ ] 반응형 그리드 레이아웃 시스템 구축
- [ ] 관리자 권한 검증 로직 구현
- [ ] API 타입 생성 워크플로우 설정 (`pnpm run generate-types`)
- [ ] Fetcher 패턴을 사용한 API 함수 구조 설계

### Phase 2: 통계 및 데이터 시각화
- [ ] 포스트, 댓글, 사용자 통계 카드 구현
- [ ] 차트 컴포넌트 (Recharts) 통합
- [ ] 실시간 데이터 업데이트 기능
- [ ] 날짜별 필터링 및 검색 기능
- [ ] `src/features/admin/api/stats.ts` - 통계 API 함수 구현 (fetcher 패턴)
- [ ] `src/features/admin/api/dashboard.ts` - 대시보드 API 함수 구현 (fetcher 패턴)

### Phase 3: 위젯 및 고급 기능
- [ ] 최근 포스트 목록 위젯
- [ ] 최근 댓글 목록 위젯
- [ ] 사용자 활동 피드 위젯
- [ ] 빠른 액션 버튼 (포스트 작성, 사용자 관리 등)
- [ ] `src/features/admin/api/posts.ts` - 포스트 관리 API 함수 구현 (fetcher 패턴)
- [ ] `src/features/admin/api/comments.ts` - 댓글 관리 API 함수 구현 (fetcher 패턴)
- [ ] `src/features/admin/api/users.ts` - 사용자 관리 API 함수 구현 (fetcher 패턴)

### Phase 4: 3D 요소 및 테마
- [ ] 3D 배경 요소 추가 (사이버펑크 테마)
- [ ] 인터랙티브 3D 아이콘 구현
- [ ] 다크/라이트 모드 지원
- [ ] 애니메이션 효과 추가

### Phase 5: Repomix 통합 및 최적화
- [ ] 관리자 기능 repomix 파일 업데이트 (`repomix-admin.xml`)
- [ ] API 타입 정의 최적화 (`repomix-api-types.xml`)
- [ ] 3D 컴포넌트 통합 (`repomix-3d-components.xml`)
- [ ] AI 도구별 최적화된 컨텍스트 제공

## 🎨 UI/UX 요구사항
- **사이버펑크 테마**: 네온 색상, 글리치 효과, 미래적 디자인
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **직관적 네비게이션**: 명확한 메뉴 구조와 아이콘 사용
- **데이터 시각화**: 차트와 그래프를 통한 직관적 정보 표시
- **빠른 액세스**: 자주 사용하는 기능에 대한 빠른 접근

## 🔒 보안 요구사항
- **관리자 권한 검증**: NextAuth.js 세션 기반 권한 확인 (단일 관리자 역할, 모든 권한)
- **API 보안**: 관리자 전용 엔드포인트 보호
- **CSRF 보호**: 폼 제출 시 CSRF 토큰 검증
- **XSS 방지**: 사용자 입력 데이터 sanitization

## ⚠️ 오류 처리
- **기본 오류 메시지**: 사용자에게 명확하고 간결한 오류 메시지 표시
- **권한 오류**: "관리자 권한이 필요합니다" 메시지
- **네트워크 오류**: "연결에 실패했습니다. 다시 시도해주세요" 메시지
- **데이터 오류**: "데이터를 불러올 수 없습니다" 메시지
- **오류 로깅**: 서버 측에서 상세한 오류 로그 기록

## 📊 성능 요구사항
- **초기 로딩 시간**: 3초 이내
- **데이터 새로고침**: 1초 이내
- **메모리 사용량**: 100MB 이하
- **3D 렌더링**: 60fps 유지
- **Repomix 파일 크기**: 관리자 관련 파일 15KB 이하 유지
- **AI 컨텍스트 최적화**: 토큰 수 5,000 이하로 관리

## 🧪 테스트 계획
- [ ] 단위 테스트: 각 컴포넌트별 테스트
- [ ] 통합 테스트: API 연동 테스트
- [ ] E2E 테스트: 사용자 시나리오 테스트
- [ ] 성능 테스트: 로딩 시간 및 메모리 사용량 테스트

## 📝 완료 기준

### 정량적 지표
- [ ] 초기 로딩 시간 ≤ 3초 (성능 측정 도구로 검증)
- [ ] 3D 렌더링 ≥ 60fps (브라우저 개발자 도구로 측정)
- [ ] 메모리 사용량 ≤ 100MB (Chrome DevTools로 모니터링)
- [ ] API 응답 시간 ≤ 1초 (네트워크 탭으로 측정)
- [ ] 테스트 커버리지 ≥ 80% (Jest/Testing Library로 측정)

### 정성적 기준
- [ ] 모든 통계 데이터가 정확하게 표시됨 (수동 검증)
- [ ] 반응형 디자인이 모든 디바이스에서 정상 작동 (크로스 브라우저 테스트)
- [ ] 3D 요소가 부드럽게 렌더링됨 (시각적 검증)
- [ ] 관리자 권한 검증이 올바르게 작동 (보안 테스트)
- [ ] 사용자 경험이 직관적이고 효율적임 (사용성 테스트)
- [ ] `repomix-admin.xml` 파일이 최신 상태로 유지됨 (자동화 검증)
- [ ] AI 도구에서 관리자 기능을 효율적으로 분석할 수 있음 (문서화 검증)

### API 개발 표준 준수
- [ ] 모든 API 호출이 `fetcher.ts` 패턴을 사용함 (코드 리뷰)
- [ ] `ApiRequest`, `ApiResponse`, `ApiRequestParams` 타입이 올바르게 활용됨 (타입 검사)
- [ ] `pnpm run generate-types` 명령어가 정상 작동함 (워크플로우 검증)
- [ ] OpenAPI 스키마와 생성된 타입이 동기화됨 (스키마 검증)
- [ ] API 함수들이 `src/features/admin/api/` 디렉토리에 올바르게 위치함 (구조 검증)

## 🔗 관련 이슈
- 기존 개별 관리 페이지들 통합
- 관리자 권한 시스템 개선
- 3D 테마 일관성 유지
- 성능 최적화 및 사용자 경험 향상

## 📋 추가 고려사항
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원
- **국제화**: 다국어 지원 준비
- **모니터링**: 에러 추적 및 성능 모니터링
- **백업**: 데이터 백업 및 복구 시스템
- **Repomix 자동화**: Git Hook을 통한 자동 repomix 파일 업데이트
- **AI 도구 최적화**: 각 AI 도구별 최적화된 컨텍스트 제공
- **코드 분석 효율성**: 분리된 repomix 파일을 통한 빠른 코드 분석
- **API 타입 관리**: OpenAPI 스키마 변경 시 자동 타입 재생성 워크플로우
- **Fetcher 패턴 일관성**: 모든 API 호출에서 동일한 패턴 사용
- **타입 안전성**: 컴파일 타임 타입 검증을 통한 런타임 에러 방지
