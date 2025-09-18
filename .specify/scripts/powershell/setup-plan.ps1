param(
    [Parameter(Mandatory=$true)]
    [string]$Json
)

try {
    $data = $Json | ConvertFrom-Json
    $featureName = $data.feature
    $description = $data.description
    $techStack = $data.tech_stack
    
    # 파일 경로 설정
    $featureSpec = ".specify/specs/admin-dashboard-spec.md"
    $implPlan = ".specify/plans/admin-dashboard-plan.md"
    $specsDir = ".specify/specs"
    $branch = "feat/admin-dashboard"
    
    # 디렉토리 생성
    $planDir = Split-Path $implPlan -Parent
    if (!(Test-Path $planDir)) {
        New-Item -ItemType Directory -Path $planDir -Force
    }
    
    # JSON 결과 반환
    $result = @{
        FEATURE_SPEC = $featureSpec
        IMPL_PLAN = $implPlan
        SPECS_DIR = $specsDir
        BRANCH = $branch
        FEATURE_NAME = $featureName
        DESCRIPTION = $description
        TECH_STACK = $techStack
    }
    
    $result | ConvertTo-Json -Compress
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}
