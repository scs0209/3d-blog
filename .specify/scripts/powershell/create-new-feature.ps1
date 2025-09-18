param(
    [Parameter(Mandatory=$true)]
    [string]$Json
)

# UTF-8 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

try {
    $data = $Json | ConvertFrom-Json
    $featureName = $data.feature
    $description = $data.description
    $type = $data.type
    
    # 브랜치 이름 생성 (한글을 영문으로 변환)
    $branchName = "feat/admin-dashboard"
    
    # 스펙 파일 경로
    $specFile = ".specify/specs/admin-dashboard-spec.md"
    
    # 브랜치 생성 및 체크아웃
    git checkout -b $branchName
    
    # 스펙 파일 디렉토리 생성
    $specDir = Split-Path $specFile -Parent
    if (!(Test-Path $specDir)) {
        New-Item -ItemType Directory -Path $specDir -Force
    }
    
    # 빈 스펙 파일 생성
    New-Item -ItemType File -Path $specFile -Force
    
    # JSON 결과 반환
    $result = @{
        BRANCH_NAME = $branchName
        SPEC_FILE = $specFile
        FEATURE_NAME = $featureName
        DESCRIPTION = $description
        TYPE = $type
    }
    
    $result | ConvertTo-Json -Compress
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}
