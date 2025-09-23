
# Implementation Plan: 블로그 어드민 대시보드

**Branch**: `feat/admin-dashboard` | **Date**: 2025-01-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/feat/admin-dashboard/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
블로그 관리자를 위한 통합 대시보드를 구현하여 포스트, 댓글, 사용자, 통계 등을 한 곳에서 관리할 수 있도록 합니다. Next.js 15 + React 19 + FSD 아키텍처를 기반으로 하며, React Three Fiber를 활용한 3D 요소와 사이버펑크 테마를 적용합니다. TanStack Query와 Table을 통한 데이터 관리, NextAuth.js를 통한 관리자 권한 검증, 그리고 60fps 성능과 100MB 메모리 제한을 준수합니다.

## Technical Context
**Language/Version**: TypeScript 5.0+, Next.js 15, React 19  
**Primary Dependencies**: React Three Fiber, TanStack Query, TanStack Table, Recharts, NextAuth.js, Prisma  
**Storage**: PostgreSQL (Prisma ORM)  
**Testing**: Jest, React Testing Library  
**Target Platform**: Web browser
**Project Type**: web (Next.js App Router + FSD)  
**Performance Goals**: 60 fps, 3s initial load, 1s data refresh  
**Constraints**: <100MB memory, WCAG 2.1 AA  
**Scale/Scope**: 1 admin user, 1000 posts, 5000 comments

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### FSD Architecture Compliance
- [x] 모든 코드가 FSD 레이어 구조를 준수하는가? ✅ (src/entities, src/features, src/widgets, src/views 구조)
- [x] 레이어 간 단방향 의존성이 유지되는가? ✅ (entities → features → widgets → views)
- [x] 파일 명명 규칙이 준수되는가? ✅ (PascalCase 컴포넌트, camelCase 훅)

### 3D Development Standards
- [x] 3D 요소가 60fps 성능을 유지할 수 있는가? ✅ (React Three Fiber + useFrame 최적화)
- [x] 메모리 사용량이 100MB 이하로 제한되는가? ✅ (LOD, cleanup 함수 적용)
- [x] 3D 컴포넌트가 재사용 가능하게 설계되는가? ✅ (src/shared/ui/3D/ 위치)

### Type Safety & API-First
- [x] 모든 API가 OpenAPI 명세로 정의되는가? ✅ (contracts/admin-api.yaml)
- [x] TypeScript strict 모드가 사용되는가? ✅ (TypeScript 5.0+ strict)
- [x] API 변경 시 스키마가 먼저 업데이트되는가? ✅ (openapi-typescript 자동 생성)

### Test-Driven Development
- [x] 모든 기능에 테스트가 먼저 작성되는가? ✅ (T006-T015 테스트 우선)
- [x] 테스트 커버리지 80% 이상을 유지하는가? ✅ (T067-T070 단위 테스트)
- [x] Contract, 통합, 단위 테스트가 단계적으로 구현되는가? ✅ (TDD 방식)

### Performance & Accessibility
- [x] 초기 로딩 시간이 3초 이내인가? ✅ (3s initial load 목표)
- [x] WCAG 2.1 AA 수준의 접근성을 보장하는가? ✅ (T077 접근성 테스트)
- [x] 키보드 네비게이션과 스크린 리더를 지원하는가? ✅ (접근성 요구사항 명시)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2: Web application (Next.js App Router + FSD Architecture)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - React Three Fiber 성능 최적화 패턴 연구
   - FSD 아키텍처에서 3D 컴포넌트 통합 방법 연구
   - Next.js App Router + FSD 통합 전략 연구
   - TanStack Query + Table 통합 패턴 연구
   - 3D 성능 모니터링 방법 연구

2. **Generate and dispatch research agents**:
   ```
   Task: "Research React Three Fiber performance optimization for admin dashboard"
   Task: "Research FSD architecture integration with 3D components"
   Task: "Research Next.js App Router + FSD integration patterns"
   Task: "Research TanStack Query + Table integration for data management"
   Task: "Research 3D performance monitoring and optimization techniques"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: React Three Fiber + 성능 최적화 패턴 적용
   - Rationale: 60fps 성능 유지, 메모리 사용량 100MB 이하 제한
   - Alternatives considered: Three.js 직접 사용 (복잡도 증가), 다른 3D 라이브러리 (통합성 부족)

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - User, Post, Comment, Category, Tag, PostTag (기존 Prisma 스키마)
   - DashboardStats, AdminActivity, PostManagementView, CommentManagementView, UserManagementView (새로운 뷰 모델)
   - Validation rules: 이메일 형식, 필수 필드, 고유값 제약
   - State transitions: Post (Draft ↔ Published), Comment (Pending ↔ Approved), User (Active ↔ Suspended)

2. **Generate API contracts** from functional requirements:
   - GET /api/admin/dashboard (통계 조회)
   - GET /api/admin/posts (포스트 목록)
   - PATCH /api/admin/posts/[id] (포스트 상태 변경)
   - GET /api/admin/comments (댓글 목록)
   - PATCH /api/admin/comments/[id] (댓글 승인/거부)
   - GET /api/admin/users (사용자 목록)
   - PATCH /api/admin/users/[id] (사용자 권한 변경)
   - Output OpenAPI schema to `/contracts/admin-api.yaml`

3. **Generate contract tests** from contracts:
   - tests/contract/test_admin_dashboard.ts
   - tests/contract/test_admin_posts.ts
   - tests/contract/test_admin_comments.ts
   - tests/contract/test_admin_users.ts
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - 관리자 로그인 및 대시보드 접근 → test_admin_auth.ts
   - 포스트 관리 → test_post_management.ts
   - 댓글 관리 → test_comment_management.ts
   - 사용자 관리 → test_user_management.ts
   - 3D 인터랙션 → test_3d_performance.ts

5. **Update agent file incrementally** (O(1) operation):
   - Run `.cursor/.specify/scripts/powershell/update-agent-context.ps1 -AgentType cursor`
   - Add: Next.js 15, React 19, React Three Fiber, TanStack Query, TanStack Table
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.cursor/.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P] (T006-T009)
- Each entity → model creation task [P] (T016-T020)
- Each user story → integration test task (T010-T014)
- Implementation tasks to make tests pass (T016-T080)

**Ordering Strategy**:
- TDD order: Tests before implementation (T006-T015 before T016-T080)
- Dependency order: Models before services before UI (entities → features → widgets → views)
- Mark [P] for parallel execution (independent files)
- FSD 레이어 의존성 준수

**Estimated Output**: 80 numbered, ordered tasks in tasks.md (T001-T080)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

## 생성된 아티팩트

### Phase 0: Research
- [x] `research.md` - React Three Fiber 성능 최적화, FSD 통합, Next.js App Router 전략, TanStack 통합, 3D 성능 모니터링

### Phase 1: Design & Contracts
- [x] `data-model.md` - 기존 Prisma 스키마 + 새로운 뷰 모델 (DashboardStats, AdminActivity, PostManagementView, CommentManagementView, UserManagementView)
- [x] `contracts/admin-api.yaml` - OpenAPI 3.0 명세 (7개 엔드포인트)
- [x] `quickstart.md` - 8개 사용자 시나리오 + 성능 검증 가이드
- [x] `tests/contract/test_admin_dashboard.ts` - Contract 테스트 (실패 상태)

### Phase 2: Task Planning
- [x] `tasks.md` - 80개 작업 (T001-T080), TDD 방식, FSD 아키텍처 준수, 3D 성능 최적화

---
*Based on Constitution v1.0.0 - See `.cursor/.specify/memory/constitution.md`*
