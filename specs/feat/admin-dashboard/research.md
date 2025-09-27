# Research: 블로그 어드민 대시보드

**Feature**: 블로그 어드민 대시보드  
**Date**: 2025-01-16  
**Status**: Complete

## Research Areas

### 1. React Three Fiber 성능 최적화

**Decision**: React Three Fiber + 성능 최적화 패턴 적용
**Rationale**: 
- 60fps 성능 유지를 위해 `useFrame` 최적화 필수
- `useRef`로 mesh 참조 관리하여 불필요한 re-render 방지
- LOD(Level of Detail) 적용으로 메모리 사용량 100MB 이하 유지
- cleanup 함수로 리소스 정리하여 메모리 누수 방지

**Alternatives considered**:
- Three.js 직접 사용: React 생태계와의 통합 복잡도 증가
- 다른 3D 라이브러리: React Three Fiber가 React와 가장 잘 통합됨

### 2. FSD 아키텍처에서 3D 컴포넌트 통합

**Decision**: `src/shared/ui/3D/` 디렉토리에 3D 컴포넌트 배치
**Rationale**:
- FSD의 shared 레이어는 모든 레이어에서 사용 가능
- 3D 컴포넌트는 재사용성을 위해 shared에 위치
- entities, features, widgets에서 3D 컴포넌트 활용 가능
- 단방향 의존성 원칙 준수

**Alternatives considered**:
- widgets에 배치: 재사용성 제한
- features에 배치: 비즈니스 로직과 UI 로직 혼재

### 3. Next.js App Router + FSD 통합

**Decision**: App Router의 `app/` 디렉토리와 FSD의 `src/` 디렉토리 분리
**Rationale**:
- App Router: 라우팅, 페이지 컴포넌트, API 라우트 담당
- FSD: 비즈니스 로직, UI 컴포넌트, 상태 관리 담당
- `app/(protect)/admin/page.tsx`에서 `src/views/admin/` 컴포넌트 사용
- 명확한 책임 분리로 유지보수성 향상

**Alternatives considered**:
- 모든 것을 App Router에 통합: FSD 아키텍처 원칙 위반
- 모든 것을 FSD에 통합: Next.js App Router 기능 활용 제한

### 4. TanStack Query + Table 통합 패턴

**Decision**: TanStack Query로 서버 상태 관리, TanStack Table로 클라이언트 테이블 관리
**Rationale**:
- TanStack Query: 서버 상태 캐싱, 동기화, 에러 처리 자동화
- TanStack Table: 정렬, 필터링, 페이지네이션, 가상화 지원
- 두 라이브러리 간 자연스러운 통합 가능
- TypeScript 지원으로 타입 안전성 보장

**Alternatives considered**:
- SWR + React Table: TanStack 생태계의 일관성 부족
- Apollo Client + GraphQL: REST API 구조와 불일치

### 5. 3D 성능 모니터링

**Decision**: Chrome DevTools Performance 탭 + React DevTools Profiler 활용
**Rationale**:
- Chrome DevTools: FPS, 메모리 사용량, 렌더링 성능 측정
- React DevTools Profiler: 컴포넌트별 렌더링 성능 분석
- Web Vitals API: Core Web Vitals 지표 모니터링
- 실시간 성능 추적으로 60fps 유지 보장

**Alternatives considered**:
- 별도 성능 모니터링 도구: 추가 복잡도와 비용
- 수동 성능 측정: 정확성과 일관성 부족

## 기술 스택 통합 전략

### 3D + FSD 통합
- 3D 컴포넌트를 `src/shared/ui/3D/`에 배치
- FSD 레이어별로 3D 컴포넌트 활용
- 성능 최적화를 위한 LOD 및 cleanup 패턴 적용

### Next.js + FSD 통합
- App Router: 라우팅 및 API 담당
- FSD: 비즈니스 로직 및 UI 컴포넌트 담당
- 명확한 경계와 의존성 관리

### 상태 관리 통합
- TanStack Query: 서버 상태 (API 데이터)
- React Context: 클라이언트 상태 (UI 상태)
- FSD features 레이어에서 상태 관리 로직 캡슐화

## 성능 최적화 전략

### 3D 렌더링 최적화
- `useFrame`에서 불필요한 계산 최소화
- `useMemo`로 3D 객체 메모이제이션
- `dispose={null}`로 자동 정리 비활성화 후 수동 정리

### 메모리 관리
- 3D 씬 언마운트 시 cleanup 함수 실행
- 텍스처와 지오메트리 수동 해제
- 메모리 사용량 100MB 이하 유지

### 번들 최적화
- 3D 라이브러리 동적 import
- Tree shaking으로 불필요한 코드 제거
- 이미지 및 3D 모델 최적화

## 결론

모든 연구 영역에서 명확한 기술적 결정이 내려졌으며, Constitution의 원칙들과 일치하는 방향으로 설계되었습니다. FSD 아키텍처, 3D 성능 최적화, Next.js App Router 통합이 핵심 성공 요소입니다.
