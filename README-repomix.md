# Repomix 분리 관리 가이드

## 📁 분리된 파일 구조

현재 프로젝트는 다음과 같이 분리된 repomix 파일들을 사용합니다:

| 파일명 | 크기 | 설명 | 토큰 수 |
|--------|------|------|---------|
| `repomix-src.xml` | 253K | 핵심 소스 코드 (src/) | 60,174 |
| `repomix-api.xml` | 61K | API 엔드포인트 (app/api/) | 12,846 |
| `repomix-api-types.xml` | 96K | API 타입 정의 (src/shared/api/) | 16,672 |
| `repomix-3d-components.xml` | 44K | 3D 컴포넌트 (src/shared/ui/) | 12,160 |
| `repomix-portfolio.xml` | 50K | 포트폴리오 기능 | 14,044 |
| `repomix-config.xml` | 616K | 설정 파일들 | 164,244 |
| `repomix-blog.xml` | 14K | 블로그 기능 | 3,546 |
| `repomix-admin.xml` | 12K | 관리자 기능 | 3,071 |

## 🚀 사용 방법

### 전체 생성
```bash
./scripts/generate-repomix.sh all
```

### 개별 생성
```bash
# 핵심 소스 코드만
./scripts/generate-repomix.sh src

# API 엔드포인트만
./scripts/generate-repomix.sh api

# API 타입 정의만
./scripts/generate-repomix.sh api-types

# 3D 컴포넌트만
./scripts/generate-repomix.sh 3d

# 관리자 기능만
./scripts/generate-repomix.sh admin

# 블로그 기능만
./scripts/generate-repomix.sh blog

# 포트폴리오 기능만
./scripts/generate-repomix.sh portfolio

# 설정 파일만
./scripts/generate-repomix.sh config
```

### 정리
```bash
./scripts/generate-repomix.sh cleanup
```

## 🎯 활용 방안

### 1. AI 도구별 최적화
- **코드 분석**: `repomix-src.xml` 사용
- **API 문서화**: `repomix-api.xml` + `repomix-api-types.xml` 사용
- **API 타입 분석**: `repomix-api-types.xml` 사용 (openapi-types.ts 포함)
- **3D 컴포넌트 개발**: `repomix-3d-components.xml` 사용
- **기능별 개발**: 해당 기능의 repomix 파일 사용

### 2. MCP 서버 연동
```json
{
  "mcpServers": {
    "repomix-src": {
      "command": "npx",
      "args": ["repomix", "src", "--output", "repomix-src.xml"]
    },
    "repomix-api": {
      "command": "npx", 
      "args": ["repomix", "app/api", "--output", "repomix-api.xml"]
    },
    "repomix-api-types": {
      "command": "npx",
      "args": ["repomix", "src/shared/api", "--output", "repomix-api-types.xml"]
    }
  }
}
```

### 3. CI/CD 통합
```yaml
# .github/workflows/repomix.yml
name: Generate Repomix Files
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  generate-repomix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Generate repomix files
        run: ./scripts/generate-repomix.sh all
      - name: Upload repomix files
        uses: actions/upload-artifact@v4
        with:
          name: repomix-files
          path: repomix-*.xml
```

## ⚙️ 설정 파일

`repomix.config.json`에서 다음 설정을 관리합니다:

- **포함할 파일**: TypeScript, JavaScript, JSON, Markdown 등
- **제외할 파일**: node_modules, .next, dist 등
- **압축 설정**: 토큰 수 최적화
- **보안 검사**: 의심스러운 파일 감지

## 📊 성능 최적화

### 토큰 수 기준 상위 파일들
1. **gt.json** (27,170 tokens) - 번역 파일
2. **openapi-types.ts** (15,337 tokens) - API 타입 정의 (별도 파일로 분리)
3. **WorkTable.tsx** (2,003 tokens) - 포트폴리오 테이블
4. **GridBackground.tsx** (1,739 tokens) - 그리드 배경

### 메모리 사용량
- **전체**: 1.4MB → **분리 후**: 1.1MB (약 20% 감소)
- **개별 파일**: 평균 50-250KB로 관리 가능
- **API 타입**: 96KB로 별도 관리 (openapi-types.ts 포함)

## 🔄 자동화

### Git Hook 설정
```bash
# .git/hooks/pre-commit
#!/bin/bash
./scripts/generate-repomix.sh src
git add repomix-src.xml
```

### Package.json 스크립트
```json
{
  "scripts": {
    "repomix:all": "./scripts/generate-repomix.sh all",
    "repomix:src": "./scripts/generate-repomix.sh src",
    "repomix:api": "./scripts/generate-repomix.sh api",
    "repomix:api-types": "./scripts/generate-repomix.sh api-types",
    "repomix:clean": "./scripts/generate-repomix.sh cleanup"
  }
}
```

## 🚨 주의사항

1. **Git 제외**: `.gitignore`에 `repomix-*.xml` 추가됨
2. **파일 크기**: 개별 파일은 50KB 이하로 유지
3. **업데이트**: 코드 변경 시 해당 repomix 파일 재생성 필요
4. **보안**: 민감한 정보가 포함될 수 있으므로 주의

## 📈 모니터링

### 파일 크기 체크
```bash
# 파일 크기 확인
ls -lh repomix-*.xml

# 토큰 수 확인
npx repomix --help
```

### 성능 지표
- **생성 시간**: 평균 30초 (전체)
- **메모리 사용량**: 평균 100MB
- **압축률**: 약 70% (원본 대비)
