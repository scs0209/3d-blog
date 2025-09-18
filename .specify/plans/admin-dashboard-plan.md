# 블로그 어드민 대시보드 구현 계획

## 📋 프로젝트 개요
Next.js 15와 TanStack 라이브러리들을 활용하여 3D 요소가 포함된 블로그 관리자 대시보드를 구현합니다.

## 🎯 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **상태 관리**: TanStack React Query
- **데이터 테이블**: TanStack React Table
- **3D 렌더링**: React Three Fiber
- **UI 라이브러리**: Shadcn UI, Tailwind CSS
- **데이터베이스**: Prisma + PostgreSQL
- **인증**: NextAuth.js

## 🚀 구현 계획

### Phase 0: 연구 및 분석 ✅

#### 사용자 스토리
- **관리자로서** 포스트, 댓글, 사용자를 한 곳에서 관리하고 싶다
- **관리자로서** 실시간 통계를 확인하여 블로그 상태를 파악하고 싶다
- **관리자로서** 직관적인 UI로 빠르게 작업을 수행하고 싶다
- **관리자로서** 3D 요소가 포함된 미래적인 인터페이스를 경험하고 싶다

#### 기능적 요구사항
- 통합 대시보드 메인 페이지
- 포스트 관리 (CRUD, 상태 변경)
- 댓글 관리 (조회, 삭제, 승인)
- 사용자 관리 (조회, 권한 변경)
- 실시간 통계 및 차트
- 3D 인터랙티브 요소

#### 비기능적 요구사항
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 60fps 3D 렌더링 성능
- 3초 이내 초기 로딩
- 관리자 권한 검증
- 접근성 지원

### Phase 1: 데이터 모델 및 계약 ✅

#### Prisma 스키마 확장
```prisma
model AdminStats {
  id        String   @id @default(cuid())
  date      DateTime @unique
  posts     Int      @default(0)
  comments  Int      @default(0)
  users     Int      @default(0)
  views     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AdminActivity {
  id        String   @id @default(cuid())
  userId    String
  action    String
  target    String?
  metadata  Json?
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}
```

#### API 엔드포인트 설계
- `GET /api/admin/dashboard` - 대시보드 통계
- `GET /api/admin/posts` - 포스트 목록 (페이지네이션, 필터링)
- `GET /api/admin/comments` - 댓글 목록
- `GET /api/admin/users` - 사용자 목록
- `GET /api/admin/activity` - 활동 로그

#### TypeScript 타입 정의
```typescript
interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  totalViews: number;
  recentActivity: AdminActivity[];
  chartData: ChartDataPoint[];
}

interface ChartDataPoint {
  date: string;
  posts: number;
  comments: number;
  users: number;
}
```

### Phase 2: 작업 분해 ✅

#### Phase 1: 기본 구조 및 레이아웃
- [ ] **1.1** 대시보드 메인 레이아웃 컴포넌트 구현
  - `src/widgets/admin/ui/AdminDashboard.tsx`
  - 반응형 그리드 레이아웃
  - 사이드바 네비게이션

- [ ] **1.2** 관리자 권한 검증 로직 구현
  - `src/features/admin/api/auth.ts`
  - NextAuth.js 세션 기반 권한 확인
  - 미들웨어 통합

- [ ] **1.3** 기본 페이지 구조 설정
  - `app/(protect)/admin/page.tsx` 업데이트
  - 라우트 보호 설정

#### Phase 2: 통계 및 데이터 시각화
- [ ] **2.1** 통계 카드 컴포넌트 구현
  - `src/widgets/admin/ui/StatsCards.tsx`
  - 포스트, 댓글, 사용자, 조회수 통계
  - 실시간 업데이트

- [ ] **2.2** 차트 컴포넌트 구현
  - `src/widgets/admin/ui/Charts.tsx`
  - Recharts 라이브러리 통합
  - 시간별 통계 차트

- [ ] **2.3** API 연동 및 데이터 페칭
  - `src/features/admin/api/dashboard.ts`
  - TanStack React Query 설정
  - 캐싱 및 에러 처리

#### Phase 3: 데이터 테이블 및 관리 기능
- [ ] **3.1** 포스트 관리 테이블
  - `src/widgets/admin/ui/PostsTable.tsx`
  - TanStack React Table 통합
  - 정렬, 필터링, 페이지네이션

- [ ] **3.2** 댓글 관리 테이블
  - `src/widgets/admin/ui/CommentsTable.tsx`
  - 댓글 상태 관리 (승인/거부)
  - 대량 작업 기능

- [ ] **3.3** 사용자 관리 테이블
  - `src/widgets/admin/ui/UsersTable.tsx`
  - 사용자 권한 관리
  - 검색 및 필터링

#### Phase 4: 3D 요소 및 테마
- [ ] **4.1** 3D 배경 요소 구현
  - `src/widgets/admin/ui/Admin3DScene.tsx`
  - React Three Fiber 통합
  - 사이버펑크 테마 적용

- [ ] **4.2** 인터랙티브 3D 아이콘
  - `src/shared/ui/3D/InteractiveIcon.tsx`
  - 호버 애니메이션
  - 클릭 인터랙션

- [ ] **4.3** 테마 시스템 통합
  - 다크/라이트 모드 지원
  - 3D 요소 테마 연동
  - 애니메이션 효과

#### Phase 5: 고급 기능 및 최적화
- [ ] **5.1** 실시간 업데이트
  - WebSocket 또는 Server-Sent Events
  - 실시간 통계 업데이트
  - 활동 피드 실시간 반영

- [ ] **5.2** 성능 최적화
  - 3D 렌더링 최적화
  - 메모리 사용량 최적화
  - 로딩 성능 개선

- [ ] **5.3** 접근성 및 테스트
  - 키보드 네비게이션 지원
  - 스크린 리더 호환성
  - 단위 테스트 및 E2E 테스트

## 📊 마일스톤
- **Week 1**: Phase 1-2 완료 (기본 구조 및 통계)
- **Week 2**: Phase 3 완료 (데이터 테이블)
- **Week 3**: Phase 4 완료 (3D 요소)
- **Week 4**: Phase 5 완료 (최적화 및 테스트)

## ✅ 완료 기준
- [ ] 모든 통계 데이터가 정확하게 표시됨
- [ ] 반응형 디자인이 모든 디바이스에서 정상 작동
- [ ] 3D 요소가 부드럽게 렌더링됨 (60fps)
- [ ] 관리자 권한 검증이 올바르게 작동
- [ ] 사용자 경험이 직관적이고 효율적임
- [ ] 성능 요구사항 충족 (로딩 3초 이내)

## 🔗 의존성
- 기존 Prisma 스키마 확장
- NextAuth.js 설정 업데이트
- Shadcn UI 컴포넌트 확장
- React Three Fiber 통합
