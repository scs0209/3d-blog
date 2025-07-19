import { GoogleGenAI } from '@google/genai';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// 환경 변수에서 API 키 가져오기
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
  console.error('GitHub Actions에서는 GITHUB_TOKEN과 함께 GEMINI_API_KEY를 설정해주세요.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Git 변경사항 분석
 */
export function analyzeChanges(baseSha, headSha) {
  console.log('변경사항 분석 시작...');

  try {
    // 모든 변경된 파일 찾기
    const changedFiles = execSync(`git diff --name-only ${baseSha} ${headSha}`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);

    console.log('변경된 파일 목록:', changedFiles);

    const analysis = {
      totalFiles: changedFiles.length,
      codeFiles: [],
      configFiles: [],
      docFiles: [],
      otherFiles: [],
      changes: [],
    };

    // 파일별 변경사항 분석
    for (const file of changedFiles) {
      if (!fs.existsSync(file)) {
        analysis.changes.push({ file, type: 'deleted', content: '삭제된 파일' });
        continue;
      }

      const fileExt = path.extname(file).toLowerCase();
      const fileSize = fs.statSync(file).size;

      // 파일 타입 분류
      let fileType = 'other';
      if (['.js', '.ts', '.jsx', '.tsx'].includes(fileExt)) {
        fileType = 'code';
        analysis.codeFiles.push(file);
      } else if (['.json', '.yml', '.yaml', '.xml', '.sh'].includes(fileExt)) {
        fileType = 'config';
        analysis.configFiles.push(file);
      } else if (['.md', '.txt', '.rst'].includes(fileExt)) {
        fileType = 'doc';
        analysis.docFiles.push(file);
      } else {
        analysis.otherFiles.push(file);
      }

      // 변경사항 추출
      let diffContent;
      try {
        if (fileSize > 50000) {
          // 50KB 이상은 핵심만
          diffContent = execSync(`git diff ${baseSha} ${headSha} -- "${file}" | head -50`, { encoding: 'utf8' });
        } else {
          diffContent = execSync(`git diff ${baseSha} ${headSha} -- "${file}"`, { encoding: 'utf8' });
        }
      } catch (error) {
        diffContent = '변경사항 추출 실패';
      }

      analysis.changes.push({
        file,
        type: fileType,
        content: diffContent,
        size: fileSize,
      });
    }

    return analysis;
  } catch (error) {
    console.error('변경사항 분석 실패:', error.message);
    return null;
  }
}

/**
 * AI를 사용한 PR 제목 생성
 */
export async function generatePRTitle(changes) {
  try {
    const changesText = changes.map((c) => `=== ${c.file} ===\n${c.content}`).join('\n\n');

    const prompt = `다음 코드 변경사항을 분석하여 간결한 PR 제목을 한국어로 생성해주세요.

변경사항:
${changesText}

다음 형식 중 하나를 선택하여 간결하고 명확한 제목을 만들어주세요:
- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 스타일 변경
- refactor: 코드 리팩토링
- test: 테스트 추가/수정
- chore: 빌드 관련 변경사항

간결한 제목만 응답해주세요 (50자 이내):`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    const title = response.text.trim();
    console.log('생성된 제목:', title);
    return title || '코드 변경사항 업데이트';
  } catch (error) {
    console.error('PR 제목 생성 실패:', error.message);
    return '코드 변경사항 업데이트';
  }
}

/**
 * AI를 사용한 PR 본문 생성
 */
export async function generatePRBody(changes) {
  try {
    const changesText = changes.map((c) => `=== ${c.file} ===\n${c.content}`).join('\n\n');

    const prompt = `다음 코드 변경사항을 분석하여 간단한 PR 설명을 한국어로 작성해주세요.

변경사항:
${changesText}

다음 형식으로 간단히 작성해주세요:

## 📝 작업 내용
- 이번 PR에서 수행한 주요 작업들

## 🔄 주요 변경사항
- 추가된 기능이나 수정된 내용

## 🧪 테스트 방법
- 변경사항 확인 방법

간결하고 실용적인 내용으로 작성해주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    const body = response.text.trim();
    console.log('PR 본문 생성 완료');
    return (
      body ||
      `## 📝 작업 내용
이번 PR에서는 다음과 같은 변경사항이 있습니다.

## 🔄 주요 변경사항
변경된 파일들을 검토하여 세부사항을 확인해주세요.

## 🧪 테스트 방법
변경사항에 대한 적절한 테스트를 수행해주세요.`
    );
  } catch (error) {
    console.error('PR 본문 생성 실패:', error.message);
    return `## 📝 작업 내용
이번 PR에서는 다음과 같은 변경사항이 있습니다.

## 🔄 주요 변경사항
변경된 파일들을 검토하여 세부사항을 확인해주세요.

## 🧪 테스트 방법
변경사항에 대한 적절한 테스트를 수행해주세요.`;
  }
}

/**
 * 변경사항 요약 생성
 */
export async function generateChangeSummary(changes) {
  try {
    const changesText = changes.map((c) => `=== ${c.file} ===\n${c.content}`).join('\n\n');

    const prompt = `다음 변경사항을 간단히 요약해주세요 (1-2줄로):

변경사항:
${changesText}

핵심 변경사항만 간결하게 한국어로 설명해주세요:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    const summary = response.text.trim();
    console.log('생성된 요약:', summary);
    return summary || '코드 변경사항 업데이트';
  } catch (error) {
    console.error('변경사항 요약 생성 실패:', error.message);
    return '코드 변경사항 업데이트';
  }
}

/**
 * 전체 PR 생성 워크플로우
 */
export async function generatePR(baseSha, headSha) {
  console.log('=== AI PR 자동 작성 시작 ===');

  // 1. 변경사항 분석
  const analysis = analyzeChanges(baseSha, headSha);
  if (!analysis) {
    throw new Error('변경사항 분석에 실패했습니다.');
  }

  console.log('분석 결과:', {
    totalFiles: analysis.totalFiles,
    codeFiles: analysis.codeFiles.length,
    configFiles: analysis.configFiles.length,
    docFiles: analysis.docFiles.length,
  });

  // 2. AI로 PR 내용 생성
  const [title, body, summary] = await Promise.all([
    generatePRTitle(analysis.changes),
    generatePRBody(analysis.changes),
    generateChangeSummary(analysis.changes),
  ]);

  // 3. 결과 반환
  return {
    title,
    body,
    summary,
    analysis: {
      totalFiles: analysis.totalFiles,
      codeFiles: analysis.codeFiles.length,
      configFiles: analysis.configFiles.length,
      docFiles: analysis.docFiles.length,
    },
  };
}

// CLI 실행용
console.log('=== AI PR 스크립트 시작 ===');
console.log('인자:', process.argv);

const baseSha = process.argv[2];
const headSha = process.argv[3];

if (!baseSha || !headSha) {
  console.error('사용법: node ai-pr.mjs <base-sha> <head-sha>');
  console.error('예시: node ai-pr.mjs HEAD~2 HEAD');
  process.exit(1);
}

console.log(`Base SHA: ${baseSha}`);
console.log(`Head SHA: ${headSha}`);

generatePR(baseSha, headSha)
  .then((result) => {
    console.log('\n=== 생성 결과 ===');
    console.log('제목:', result.title);
    console.log('요약:', result.summary);
    console.log('분석:', result.analysis);

    // 결과를 파일로 저장
    fs.writeFileSync('pr_title.txt', result.title);
    fs.writeFileSync('pr_body.txt', result.body);
    fs.writeFileSync('change_summary.txt', result.summary);

    console.log('결과가 파일로 저장되었습니다.');
  })
  .catch((error) => {
    console.error('PR 생성 실패:', error.message);
    console.error('스택 트레이스:', error.stack);
    process.exit(1);
  });
