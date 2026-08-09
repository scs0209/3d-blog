---
description: 변경사항을 의미 단위로 나눠 커밋하고 푸시한 뒤 PR을 연다
---

현재 작업 트리(또는 $ARGUMENTS로 지정한 범위)의 변경사항을 의미 있는 커밋 단위로 나눈 뒤, 원격에 푸시하고 Pull Request를 생성한다.

## 절차

1. 병렬로 상태 파악
   - `git status`
   - `git diff` / `git diff --staged`
   - `git log --oneline -15` 및 `git log --oneline main..HEAD` (또는 기본 브랜치)
   - 현재 브랜치·upstream·`main`과의 관계 확인

2. 변경을 리뷰어가 이해하기 쉬운 **논리적 단위**로 분할
   - 예: 레이아웃/SSOT, UI 셸, 애니메이션, 콘텐츠, 테마 이동 등
   - 한 커밋에 서로 다른 관심사를 섞지 말 것
   - secrets(`.env` 등)는 커밋하지 말 것

3. 커밋 (요청 시에만, 이 커맨드 실행은 커밋 요청으로 간주)
   - 관련 파일만 `git add` (전체 `git add .` 금지)
   - 커밋 메시지는 **한국어**, 프로젝트 컨벤션 준수:
     - 형식: `<type>: <제목>` 또는 `<type>(scope): <제목>`
     - type: `feat` | `update` | `fix` | `style` | `refactor` | `chore` | `docs` | `perf`
     - 제목 50자 이내, 마침표 금지, 명령형
     - 본문은 `-` 불릿으로 왜(why) 중심
   - HEREDOC으로 메시지 전달

4. 푸시
   - `git push -u origin HEAD` (upstream 없으면 `-u`)

5. PR 생성 (`gh pr create`)
   - 제목: 한국어, 변경 핵심 요약
   - 본문 HEREDOC:

     ```markdown
     ## Summary
     - ...

     ## Test plan
     - [ ] ...
     ```

   - `gh` 미인증이면 git credential의 GitHub 토큰으로 `GH_TOKEN`을 설정해 재시도
   - 끝나면 **PR URL만** 짧게 보고 (장황한 재설명 금지)

## 출력

```text
PR: <url>

커밋:
1. <hash 또는 메시지>
2. ...
```

## 주의

- force push / hard reset / `--no-verify` 금지 (사용자가 명시하지 않으면)
- 이미 열린 PR이 있으면 새로 만들지 말고 기존 URL을 반환
- $ARGUMENTS가 있으면 브랜치명·PR 제목·범위 힌트로 활용
