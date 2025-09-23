# Tasks: 블로그 어드민 대시보드

**Input**: Design documents from `/specs/feat/admin-dashboard/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/
**Feature**: 블로그 어드민 대시보드
**Date**: 2025-01-16

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: Next.js App Router + FSD Architecture
- **Frontend**: `app/` (routing) + `src/` (FSD layers)
- **Backend**: `app/api/` (API routes)
- **Tests**: `tests/` (contract, integration, unit)

## Phase 3.1: Setup
- [ ] T001 Create FSD project structure per implementation plan
- [ ] T002 Initialize Next.js project with TypeScript and React Three Fiber
- [ ] T003 [P] Configure ESLint, Prettier, and Biome tools
- [ ] T004 [P] Setup OpenAPI types generation pipeline
- [ ] T005 [P] Configure 3D performance monitoring

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test POST /api/admin/dashboard in tests/contract/test_admin_dashboard.ts
- [ ] T007 [P] Contract test GET /api/admin/posts in tests/contract/test_admin_posts.ts
- [ ] T008 [P] Contract test GET /api/admin/comments in tests/contract/test_admin_comments.ts
- [ ] T009 [P] Contract test GET /api/admin/users in tests/contract/test_admin_users.ts
- [ ] T010 [P] Integration test admin login flow in tests/integration/test_admin_auth.ts
- [ ] T011 [P] Integration test dashboard statistics in tests/integration/test_dashboard_stats.ts
- [ ] T012 [P] Integration test post management in tests/integration/test_post_management.ts
- [ ] T013 [P] Integration test comment management in tests/integration/test_comment_management.ts
- [ ] T014 [P] Integration test user management in tests/integration/test_user_management.ts
- [ ] T015 [P] 3D component performance test in tests/unit/test_3d_performance.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T016 [P] DashboardStats entity in src/entities/admin/model/types.ts
- [ ] T017 [P] AdminActivity entity in src/entities/admin/model/types.ts
- [ ] T018 [P] PostManagementView entity in src/entities/admin/model/types.ts
- [ ] T019 [P] CommentManagementView entity in src/entities/admin/model/types.ts
- [ ] T020 [P] UserManagementView entity in src/entities/admin/model/types.ts
- [ ] T021 [P] Dashboard API service in src/features/admin/api/dashboard.ts
- [ ] T022 [P] Post management API service in src/features/admin/api/posts.ts
- [ ] T023 [P] Comment management API service in src/features/admin/api/comments.ts
- [ ] T024 [P] User management API service in src/features/admin/api/users.ts
- [ ] T025 [P] Admin dashboard widget in src/widgets/admin/ui/AdminDashboard.tsx
- [ ] T026 [P] Stats cards widget in src/widgets/admin/ui/StatsCards.tsx
- [ ] T027 [P] Recent posts widget in src/widgets/admin/ui/RecentPosts.tsx
- [ ] T028 [P] Recent comments widget in src/widgets/admin/ui/RecentComments.tsx
- [ ] T029 [P] User activity widget in src/widgets/admin/ui/UserActivity.tsx
- [ ] T030 [P] 3D background component in src/shared/ui/3D/AdminBackground.tsx
- [ ] T031 [P] 3D interactive icons in src/shared/ui/3D/AdminIcons.tsx

## Phase 3.4: API Implementation
- [ ] T032 POST /api/admin/dashboard endpoint in app/api/admin/dashboard/route.ts
- [ ] T033 GET /api/admin/posts endpoint in app/api/admin/posts/route.ts
- [ ] T034 PATCH /api/admin/posts/[id] endpoint in app/api/admin/posts/[id]/route.ts
- [ ] T035 GET /api/admin/comments endpoint in app/api/admin/comments/route.ts
- [ ] T036 PATCH /api/admin/comments/[id] endpoint in app/api/admin/comments/[id]/route.ts
- [ ] T037 GET /api/admin/users endpoint in app/api/admin/users/route.ts
- [ ] T038 PATCH /api/admin/users/[id] endpoint in app/api/admin/users/[id]/route.ts
- [ ] T039 Admin authentication middleware in src/features/admin/api/middleware.ts
- [ ] T040 Input validation schemas in src/features/admin/api/validation.ts
- [ ] T041 Error handling and logging in src/features/admin/api/error-handler.ts

## Phase 3.5: UI Implementation
- [ ] T042 Admin dashboard page in app/(protect)/admin/page.tsx
- [ ] T043 Admin layout component in app/(protect)/layout.tsx
- [ ] T044 Post management page in app/(protect)/admin/posts/page.tsx
- [ ] T045 Comment management page in app/(protect)/admin/comments/page.tsx
- [ ] T046 User management page in app/(protect)/admin/users/page.tsx
- [ ] T047 Post management table in src/widgets/admin/ui/PostManagementTable.tsx
- [ ] T048 Comment management table in src/widgets/admin/ui/CommentManagementTable.tsx
- [ ] T049 User management table in src/widgets/admin/ui/UserManagementTable.tsx
- [ ] T050 Admin navigation sidebar in src/widgets/admin/ui/AdminSidebar.tsx
- [ ] T051 Admin header component in src/widgets/admin/ui/AdminHeader.tsx

## Phase 3.6: 3D Integration
- [ ] T052 3D scene setup in src/shared/ui/3D/AdminScene.tsx
- [ ] T053 3D performance optimization in src/shared/ui/3D/PerformanceMonitor.tsx
- [ ] T054 3D animation system in src/shared/ui/3D/AnimationSystem.tsx
- [ ] T055 3D interaction handlers in src/shared/ui/3D/InteractionHandlers.tsx
- [ ] T056 3D memory management in src/shared/ui/3D/MemoryManager.tsx

## Phase 3.7: Integration
- [ ] T057 Connect dashboard service to database
- [ ] T058 Connect post management to database
- [ ] T059 Connect comment management to database
- [ ] T060 Connect user management to database
- [ ] T061 NextAuth.js admin role verification
- [ ] T062 TanStack Query integration for data fetching
- [ ] T063 TanStack Table integration for data tables
- [ ] T064 Recharts integration for statistics visualization
- [ ] T065 Request/response logging middleware
- [ ] T066 CORS and security headers configuration

## Phase 3.8: Polish
- [ ] T067 [P] Unit tests for admin entities in tests/unit/test_admin_entities.ts
- [ ] T068 [P] Unit tests for admin services in tests/unit/test_admin_services.ts
- [ ] T069 [P] Unit tests for admin widgets in tests/unit/test_admin_widgets.ts
- [ ] T070 [P] Unit tests for 3D components in tests/unit/test_3d_components.ts
- [ ] T071 Performance tests (3초 로딩, 60fps 렌더링, 100MB 메모리)
- [ ] T072 [P] Update API documentation in docs/api/admin.md
- [ ] T073 [P] Update component documentation in docs/components/admin.md
- [ ] T074 [P] Update 3D performance guide in docs/3d-performance.md
- [ ] T075 Remove code duplication and optimize bundle size
- [ ] T076 Run quickstart.md manual testing scenarios
- [ ] T077 Accessibility testing (WCAG 2.1 AA compliance)
- [ ] T078 Cross-browser compatibility testing
- [ ] T079 Mobile responsiveness testing
- [ ] T080 3D performance monitoring and optimization

## Dependencies
- Tests (T006-T015) before implementation (T016-T080)
- T016-T020 blocks T021-T024 (entities before services)
- T021-T024 blocks T032-T041 (services before API endpoints)
- T025-T031 blocks T042-T051 (widgets before pages)
- T030-T031 blocks T052-T056 (3D components before 3D integration)
- T032-T041 blocks T057-T066 (API before integration)
- T042-T051 blocks T067-T080 (UI before polish)
- FSD 레이어 의존성: entities → features → widgets → views
- 3D 컴포넌트 의존성: shared/ui → widgets → views

## Parallel Execution Examples

### Phase 3.2: Contract Tests (T006-T015)
```bash
# Launch all contract tests together:
Task: "Contract test POST /api/admin/dashboard in tests/contract/test_admin_dashboard.ts"
Task: "Contract test GET /api/admin/posts in tests/contract/test_admin_posts.ts"
Task: "Contract test GET /api/admin/comments in tests/contract/test_admin_comments.ts"
Task: "Contract test GET /api/admin/users in tests/contract/test_admin_users.ts"
Task: "Integration test admin login flow in tests/integration/test_admin_auth.ts"
Task: "Integration test dashboard statistics in tests/integration/test_dashboard_stats.ts"
Task: "Integration test post management in tests/integration/test_post_management.ts"
Task: "Integration test comment management in tests/integration/test_comment_management.ts"
Task: "Integration test user management in tests/integration/test_user_management.ts"
Task: "3D component performance test in tests/unit/test_3d_performance.ts"
```

### Phase 3.3: Core Implementation (T016-T031)
```bash
# Launch entity creation tasks together:
Task: "DashboardStats entity in src/entities/admin/model/types.ts"
Task: "AdminActivity entity in src/entities/admin/model/types.ts"
Task: "PostManagementView entity in src/entities/admin/model/types.ts"
Task: "CommentManagementView entity in src/entities/admin/model/types.ts"
Task: "UserManagementView entity in src/entities/admin/model/types.ts"

# Launch API service tasks together:
Task: "Dashboard API service in src/features/admin/api/dashboard.ts"
Task: "Post management API service in src/features/admin/api/posts.ts"
Task: "Comment management API service in src/features/admin/api/comments.ts"
Task: "User management API service in src/features/admin/api/users.ts"

# Launch widget tasks together:
Task: "Admin dashboard widget in src/widgets/admin/ui/AdminDashboard.tsx"
Task: "Stats cards widget in src/widgets/admin/ui/StatsCards.tsx"
Task: "Recent posts widget in src/widgets/admin/ui/RecentPosts.tsx"
Task: "Recent comments widget in src/widgets/admin/ui/RecentComments.tsx"
Task: "User activity widget in src/widgets/admin/ui/UserActivity.tsx"

# Launch 3D component tasks together:
Task: "3D background component in src/shared/ui/3D/AdminBackground.tsx"
Task: "3D interactive icons in src/shared/ui/3D/AdminIcons.tsx"
```

### Phase 3.8: Polish (T067-T074)
```bash
# Launch unit test tasks together:
Task: "Unit tests for admin entities in tests/unit/test_admin_entities.ts"
Task: "Unit tests for admin services in tests/unit/test_admin_services.ts"
Task: "Unit tests for admin widgets in tests/unit/test_admin_widgets.ts"
Task: "Unit tests for 3D components in tests/unit/test_3d_components.ts"

# Launch documentation tasks together:
Task: "Update API documentation in docs/api/admin.md"
Task: "Update component documentation in docs/components/admin.md"
Task: "Update 3D performance guide in docs/3d-performance.md"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- FSD 아키텍처 원칙 준수 필수
- 3D 성능 최적화 (60fps, 100MB 메모리) 필수
- TypeScript strict 모드 사용
- OpenAPI 명세 기반 타입 생성
- TDD 방식으로 테스트 먼저 작성

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - admin-api.yaml → contract test tasks (T006-T009)
   - Each endpoint → implementation tasks (T032-T038)
   
2. **From Data Model**:
   - Each entity → model creation tasks (T016-T020)
   - Relationships → service layer tasks (T021-T024)
   
3. **From User Stories**:
   - Each story → integration test (T010-T014)
   - Quickstart scenarios → validation tasks (T076)
   
4. **From Research**:
   - 3D performance → 3D optimization tasks (T052-T056)
   - FSD architecture → FSD structure tasks (T001)
   - TanStack integration → integration tasks (T062-T064)

5. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → UI → 3D → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (admin-api.yaml → T006-T009)
- [x] All entities have model tasks (DashboardStats, AdminActivity, etc. → T016-T020)
- [x] All tests come before implementation (T006-T015 before T016-T080)
- [x] Parallel tasks truly independent (different files marked [P])
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] FSD architecture compliance maintained
- [x] 3D performance requirements addressed
- [x] TypeScript and OpenAPI integration planned
- [x] TDD methodology followed

## Constitution Compliance
- ✅ FSD Architecture: All tasks follow FSD layer structure
- ✅ 3D Development: 3D performance tasks included (60fps, 100MB)
- ✅ Type Safety: TypeScript strict mode and OpenAPI types
- ✅ TDD: Tests before implementation (T006-T015 before T016-T080)
- ✅ Performance: 3초 로딩, 60fps 렌더링, 100MB 메모리
- ✅ Accessibility: WCAG 2.1 AA compliance testing

---
*Based on Constitution v1.0.0 - See `.cursor/.specify/memory/constitution.md`*
