#!/bin/bash

# Repomix 분리 생성 스크립트
# 사용법: ./scripts/generate-repomix.sh [옵션]

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Repomix 분리 생성 스크립트${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 기존 파일 정리
cleanup_old_files() {
    print_warning "기존 repomix 파일들을 정리합니다..."
    rm -f repomix-*.xml
    print_success "기존 파일 정리 완료"
}

# 핵심 소스 코드 생성
generate_src() {
    print_warning "핵심 소스 코드 (src/) 생성 중..."
    npx repomix src --output repomix-src.xml
    print_success "src/ 디렉토리 패키징 완료"
}

# API 엔드포인트 생성
generate_api() {
    print_warning "API 엔드포인트 (app/api/) 생성 중..."
    npx repomix app/api --output repomix-api.xml
    print_success "API 엔드포인트 패키징 완료"
}

# API 타입 정의 생성
generate_api_types() {
    print_warning "API 타입 정의 (src/shared/api/) 생성 중..."
    npx repomix src/shared/api --output repomix-api-types.xml
    print_success "API 타입 정의 패키징 완료"
}

# 3D 컴포넌트 생성
generate_3d_components() {
    print_warning "3D 컴포넌트 (src/shared/ui/) 생성 중..."
    npx repomix src/shared/ui --output repomix-3d-components.xml
    print_success "3D 컴포넌트 패키징 완료"
}

# 관리자 기능 생성
generate_admin() {
    print_warning "관리자 기능 생성 중..."
    npx repomix "app/(protect)" "src/features/admin" "src/widgets/admin" --output repomix-admin.xml
    print_success "관리자 기능 패키징 완료"
}

# 블로그 기능 생성
generate_blog() {
    print_warning "블로그 기능 생성 중..."
    npx repomix "app/(public)/blog" "src/features/blog" "src/widgets/post" --output repomix-blog.xml
    print_success "블로그 기능 패키징 완료"
}

# 포트폴리오 기능 생성
generate_portfolio() {
    print_warning "포트폴리오 기능 생성 중..."
    npx repomix "app/(public)/portfolio" "src/features/portfolio" "src/widgets/portfolio" --output repomix-portfolio.xml
    print_success "포트폴리오 기능 패키징 완료"
}

# 설정 파일 생성
generate_config() {
    print_warning "설정 파일 생성 중..."
    npx repomix . --include "*.json,*.ts,*.js,*.md,*.yml,*.yaml" --output repomix-config.xml
    print_success "설정 파일 패키징 완료"
}

# 전체 생성
generate_all() {
    print_warning "전체 프로젝트 생성 중..."
    npx repomix . --output repomix-full.xml
    print_success "전체 프로젝트 패키징 완료"
}

# 파일 크기 표시
show_file_sizes() {
    echo -e "\n${BLUE}생성된 파일 크기:${NC}"
    ls -lh repomix-*.xml | awk '{print "  " $5 " " $9}'
}

# 메인 실행
main() {
    print_header
    
    # 옵션 처리
    case "${1:-all}" in
        "cleanup")
            cleanup_old_files
            ;;
        "src")
            generate_src
            ;;
        "api")
            generate_api
            ;;
        "api-types")
            generate_api_types
            ;;
        "3d")
            generate_3d_components
            ;;
        "admin")
            generate_admin
            ;;
        "blog")
            generate_blog
            ;;
        "portfolio")
            generate_portfolio
            ;;
        "config")
            generate_config
            ;;
        "full")
            generate_all
            ;;
        "all")
            cleanup_old_files
            generate_src
            generate_api
            generate_api_types
            generate_3d_components
            generate_admin
            generate_blog
            generate_portfolio
            generate_config
            ;;
        *)
            echo "사용법: $0 [cleanup|src|api|api-types|3d|admin|blog|portfolio|config|full|all]"
            echo ""
            echo "옵션:"
            echo "  cleanup     - 기존 repomix 파일들 정리"
            echo "  src         - 핵심 소스 코드만 생성"
            echo "  api         - API 엔드포인트만 생성"
            echo "  api-types   - API 타입 정의만 생성"
            echo "  3d          - 3D 컴포넌트만 생성"
            echo "  admin       - 관리자 기능만 생성"
            echo "  blog        - 블로그 기능만 생성"
            echo "  portfolio   - 포트폴리오 기능만 생성"
            echo "  config      - 설정 파일만 생성"
            echo "  full        - 전체 프로젝트 생성"
            echo "  all         - 모든 분리된 파일 생성 (기본값)"
            exit 1
            ;;
    esac
    
    show_file_sizes
    print_success "Repomix 분리 생성 완료!"
}

# 스크립트 실행
main "$@"
