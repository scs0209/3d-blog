# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

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
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create FSD project structure per implementation plan
- [ ] T002 Initialize Next.js project with TypeScript and React Three Fiber
- [ ] T003 [P] Configure ESLint, Prettier, and Biome tools
- [ ] T004 [P] Setup OpenAPI types generation pipeline
- [ ] T005 [P] Configure 3D performance monitoring

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test POST /api/users in tests/contract/test_users_post.ts
- [ ] T007 [P] Contract test GET /api/users/{id} in tests/contract/test_users_get.ts
- [ ] T008 [P] Integration test user registration in tests/integration/test_registration.ts
- [ ] T009 [P] Integration test auth flow in tests/integration/test_auth.ts
- [ ] T010 [P] 3D component performance test in tests/unit/test_3d_performance.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T011 [P] User entity in src/entities/user/model/types.ts
- [ ] T012 [P] UserService CRUD in src/features/user/api/userService.ts
- [ ] T013 [P] User feature components in src/features/user/ui/
- [ ] T014 POST /api/users endpoint in app/api/users/route.ts
- [ ] T015 GET /api/users/{id} endpoint in app/api/users/[id]/route.ts
- [ ] T016 [P] 3D components in src/shared/ui/3D/
- [ ] T017 Input validation with Zod schemas
- [ ] T018 Error handling and logging

## Phase 3.4: Integration
- [ ] T019 Connect UserService to Prisma DB
- [ ] T020 NextAuth.js middleware setup
- [ ] T021 Request/response logging with structured logs
- [ ] T022 CORS and security headers
- [ ] T023 [P] 3D scene integration in views
- [ ] T024 Performance monitoring setup

## Phase 3.5: Polish
- [ ] T025 [P] Unit tests for validation in tests/unit/test_validation.ts
- [ ] T026 Performance tests (3초 이내 로딩, 60fps 3D)
- [ ] T027 [P] Update OpenAPI documentation
- [ ] T028 [P] Accessibility testing (WCAG 2.1 AA)
- [ ] T029 Remove code duplication
- [ ] T030 Run manual testing checklist

## Dependencies
- Tests (T006-T010) before implementation (T011-T018)
- T011 blocks T012, T019
- T016 blocks T023
- Implementation before polish (T025-T030)
- FSD 레이어 의존성: entities → features → widgets → views

## Parallel Example
```
# Launch T006-T010 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.ts"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.ts"
Task: "Integration test registration in tests/integration/test_registration.ts"
Task: "Integration test auth in tests/integration/test_auth.ts"
Task: "3D component performance test in tests/unit/test_3d_performance.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Follow FSD architecture principles
- Ensure 3D performance requirements (60fps, <100MB)
- Use TypeScript strict mode
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task