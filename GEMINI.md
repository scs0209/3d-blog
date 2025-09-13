## 2025-09-13: 사용자 정보 API 추가

### 요약

관리자 대시보드에서 사용자 정보를 활용하기 위해 새로운 API 엔드포인트를 추가했습니다. 사용자 수, 전체 사용자 목록, 특정 사용자 정보를 조회하는 기능을 제공합니다.

### 변경 사항

1.  **사용자 API 함수 추가 (`src/features/user/api/user-api.ts`)**
    - `getUserCount()`: 전체 사용자 수를 반환합니다.
    - `getUsers()`: 모든 사용자 목록을 반환합니다.
    - `getUserById(id)`: 특정 ID를 가진 사용자를 반환합니다.

2.  **API 라우트 생성**
    - `GET /api/users/count`: 전체 사용자 수를 반환하는 API
    - `GET /api/users`: 모든 사용자 목록을 반환하는 API
    - `GET /api/users/{id}`: 특정 사용자를 조회하는 API

3.  **Swagger 문서 추가**
    - 생성된 모든 API에 대해 Swagger/OpenAPI 주석을 추가하여 API 명세를 명확히 했습니다.

4.  **`UsersCard` 컴포넌트 업데이트 (`src/features/admin/home/ui/UsersCard.tsx`)**
    - 기존의 정적 데이터를 `getUserCount` 함수를 직접 호출하여 동적으로 전체 사용자 수를 표시하도록 수정했습니다.
    - 서버 컴포넌트 내에서 직접 데이터 페칭을 수행하여 클라이언트-서버 간 불필요한 요청을 제거하고 성능을 최적화했습니다.
