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
 * 파일 확장자로 언어 감지
 */
function detectLanguage(filename) {
  const ext = path.extname(filename).toLowerCase();
  const languageMap = {
    '.js': 'JavaScript',
    '.jsx': 'JavaScript',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript',
  };
  return languageMap[ext] || 'Unknown';
}

/**
 * 우선순위 점수 계산
 */
function calculatePriorityScore(changedLines, fileSize) {
  return changedLines * 10 + fileSize;
}

/**
 * 변경된 파일 분석 및 우선순위 설정
 */
export function analyzeChangedFiles(baseSha, headSha) {
  console.log('변경된 파일 분석 시작...');

  try {
    // 모든 변경된 파일 찾기
    const changedFiles = execSync(`git diff --name-only ${baseSha} ${headSha}`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);

    console.log('변경된 파일 목록:', changedFiles);

    // 코드 파일만 필터링
    const codeFiles = changedFiles.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.js', '.jsx', '.ts', '.tsx'].includes(ext);
    });

    if (codeFiles.length === 0) {
      console.log('리뷰할 코드 파일이 없습니다.');
      return {
        totalFiles: 0,
        processedFiles: 0,
        skippedFiles: 0,
        reviewMode: 'none',
        files: [],
      };
    }

    const fileAnalysis = [];

    // 파일별 분석
    for (const file of codeFiles) {
      if (!fs.existsSync(file)) {
        fileAnalysis.push({
          file,
          type: 'deleted',
          size: 0,
          changedLines: 0,
          priorityScore: 1,
          language: detectLanguage(file),
        });
        continue;
      }

      const fileSize = Math.round(fs.statSync(file).size / 1024); // KB

      // 변경 라인 수 계산
      let changedLines = 0;
      try {
        const diffStats = execSync(`git diff --numstat ${baseSha} ${headSha} -- "${file}"`, { encoding: 'utf8' });
        const stats = diffStats.trim().split('\t');
        if (stats.length >= 3) {
          changedLines = Number.parseInt(stats[0]) + Number.parseInt(stats[1]);
        }
      } catch (error) {
        changedLines = 0;
      }

      const priorityScore = calculatePriorityScore(changedLines, fileSize);

      fileAnalysis.push({
        file,
        type: 'modified',
        size: fileSize,
        changedLines,
        priorityScore,
        language: detectLanguage(file),
      });
    }

    // 우선순위별 정렬
    fileAnalysis.sort((a, b) => b.priorityScore - a.priorityScore);

    // 리뷰 모드 결정
    let reviewMode;
    let maxFiles;
    if (fileAnalysis.length <= 5) {
      reviewMode = 'detailed';
      maxFiles = fileAnalysis.length;
    } else if (fileAnalysis.length <= 15) {
      reviewMode = 'mixed';
      maxFiles = fileAnalysis.length;
    } else {
      reviewMode = 'priority';
      maxFiles = 15;
    }

    const processedFiles = fileAnalysis.slice(0, maxFiles);
    const skippedFiles = fileAnalysis.length - maxFiles;

    console.log(`리뷰 모드: ${reviewMode} (${processedFiles.length}/${fileAnalysis.length} 파일)`);

    return {
      totalFiles: fileAnalysis.length,
      processedFiles: processedFiles.length,
      skippedFiles,
      reviewMode,
      files: processedFiles,
    };
  } catch (error) {
    console.error('파일 분석 실패:', error.message);
    return null;
  }
}

/**
 * 개별 파일 리뷰 생성
 */
export async function generateCodeReview(file, diffContent, language, reviewMode) {
  try {
    const isDetailed =
      reviewMode === 'detailed' || (reviewMode === 'mixed' && file.size < 50 && file.changedLines < 500);

    let prompt;
    if (isDetailed) {
      prompt = `다음 ${language} 코드 변경사항을 상세히 분석하고 한국어로 리뷰해주세요:

${diffContent}

다음 형식으로 답변해주세요:
🚨 위험도: [낮음/보통/높음/긴급]

🔍 주요 발견사항:
- (구체적인 이슈들 나열)

🔒 보안 및 안정성:
- (보안 관련 체크사항)

⚡ 성능 영향:
- (성능 관련 분석)

💡 권장사항:
- (개선 제안사항)

📝 개선 코드 예시:
만약 문제가 있는 부분이 있다면, 구체적인 개선 코드 예시를 제공해주세요:

\`\`\`${language.toLowerCase()}
// 개선 전 (문제가 있는 코드)
[기존 코드 일부]

// 개선 후 (권장 코드)
[개선된 코드]
\`\`\`

개선 이유: (왜 이렇게 개선해야 하는지 설명)

핵심적이고 실용적인 내용으로 답변해주세요.`;
    } else {
      prompt = `다음 ${language} 코드 변경사항을 간결하게 한국어로 리뷰해주세요:

${diffContent}

다음 형식으로 답변해주세요:
🚨 위험도: [낮음/보통/높음/긴급]
🔍 주요 이슈: (핵심 이슈 1-2개)
💡 권장사항: (주요 개선사항 1-2개)

📝 핵심 개선 예시:
가장 중요한 개선사항이 있다면 간단한 코드 예시 포함:
\`\`\`${language.toLowerCase()}
// 개선 전 → 개선 후
[간단한 before/after 코드]
\`\`\`

간결하고 핵심적인 내용만 포함해주세요.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error(`리뷰 생성 실패 (${file.file}):`, error.message);
    return `⚠️ 리뷰 생성 실패: ${error.message}`;
  }
}

/**
 * 코드 예시 품질 평가
 */
export function evaluateCodeQuality(reviewContent) {
  let qualityScore = 0;
  const evaluation = {
    beforeAfterComparison: false,
    improvementExplanation: false,
    languageSpecific: false,
    totalScore: 0,
  };

  // 개선 전/후 비교 확인
  if (reviewContent.includes('개선 전') && reviewContent.includes('개선 후')) {
    qualityScore += 30;
    evaluation.beforeAfterComparison = true;
  }

  // 개선 설명 확인
  if (reviewContent.includes('개선 이유') || reviewContent.includes('설명')) {
    qualityScore += 20;
    evaluation.improvementExplanation = true;
  }

  // 언어별 코드 블록 확인
  const codeBlocks = reviewContent.match(/```[a-zA-Z]*/g) || [];
  if (codeBlocks.length > 0) {
    qualityScore += 10;
    evaluation.languageSpecific = true;
  }

  evaluation.totalScore = qualityScore;
  return evaluation;
}

/**
 * 위험도 추출
 */
export function extractRiskLevel(reviewContent) {
  const riskMatches = reviewContent.match(/🚨\s*위험도[^:]*:\s*\[?([^\]]+)\]?/gi) || [];
  let highestRisk = '낮음';
  const riskCounts = { 긴급: 0, 높음: 0, 보통: 0, 낮음: 0 };

  for (const match of riskMatches) {
    const risk = match.match(/\[?([^\]]+)\]?$/)[1].trim();
    if (risk.includes('긴급')) {
      riskCounts.긴급++;
      highestRisk = '긴급';
    } else if (risk.includes('높음') && !highestRisk.includes('긴급')) {
      riskCounts.높음++;
      highestRisk = '높음';
    } else if (risk.includes('보통') && !['긴급', '높음'].includes(highestRisk)) {
      riskCounts.보통++;
      highestRisk = '보통';
    } else if (risk.includes('낮음') && highestRisk === '낮음') {
      riskCounts.낮음++;
    }
  }

  return { highestRisk, riskCounts };
}

/**
 * 적응형 코드 리뷰 실행
 */
export async function generateAdaptiveReview(baseSha, headSha) {
  console.log('=== AI 코드 리뷰 시작 ===');

  // 1. 변경된 파일 분석
  const analysis = analyzeChangedFiles(baseSha, headSha);
  if (!analysis) {
    throw new Error('파일 분석에 실패했습니다.');
  }

  if (analysis.totalFiles === 0) {
    return {
      review:
        '## 📝 리뷰 결과\n\n이번 Pull Request에서는 리뷰할 코드 파일 변경사항이 없습니다.\n\n검토 대상 파일 형식: Python, JavaScript, TypeScript, Java, C/C++, PHP, Ruby, Go, Rust, Kotlin, Swift, Dart, Scala',
      analysis: {
        totalFiles: 0,
        processedFiles: 0,
        skippedFiles: 0,
        reviewMode: 'none',
        highestRisk: '낮음',
        riskCounts: {},
        qualityScore: 0,
        duration: 0,
      },
    };
  }

  console.log(`분석 결과: ${analysis.processedFiles}/${analysis.totalFiles} 파일 처리`);

  // 2. 파일별 리뷰 실행
  const startTime = Date.now();
  const allReviews = [];
  let timeLimitReached = false;

  for (let i = 0; i < analysis.files.length; i++) {
    const file = analysis.files[i];
    const elapsed = (Date.now() - startTime) / 1000;

    // 11분 30초 제한 (여유시간 확보)
    if (elapsed > 690) {
      console.log(`⚠️ 시간 제한 도달 - 리뷰 중단 (${i}/${analysis.processedFiles})`);
      timeLimitReached = true;
      break;
    }

    console.log(`=== 파일 ${i + 1}/${analysis.processedFiles}: ${file.file} 처리 중 ===`);

    // 변경 내용 추출
    let diffContent;
    try {
      if (file.size > 50 || file.changedLines > 500) {
        // 대용량 파일: 핵심만
        diffContent = execSync(`git diff ${baseSha} ${headSha} -- "${file.file}" | head -80`, { encoding: 'utf8' });
      } else {
        // 일반 파일: 상세 분석
        diffContent = execSync(`git diff ${baseSha} ${headSha} -- "${file.file}" | head -150`, { encoding: 'utf8' });
      }
    } catch (error) {
      diffContent = '변경사항 추출 실패';
    }

    if (diffContent?.trim()) {
      const review = await generateCodeReview(file, diffContent, file.language, analysis.reviewMode);

      allReviews.push({
        file: file.file,
        review: review,
        type: file.type,
        size: file.size,
        changedLines: file.changedLines,
      });
    } else {
      allReviews.push({
        file: file.file,
        review: '변경 내용이 감지되지 않았습니다.',
        type: file.type,
        size: file.size,
        changedLines: file.changedLines,
      });
    }
  }

  // 3. 리뷰 결과 조합
  const reviewText = allReviews
    .map((item) => {
      return `=== ${item.file} 리뷰 ===\n\n${item.review}\n\n---\n`;
    })
    .join('\n');

  // 4. 품질 평가
  const qualityEvaluation = evaluateCodeQuality(reviewText);
  const riskAnalysis = extractRiskLevel(reviewText);

  const duration = Math.round((Date.now() - startTime) / 1000);

  return {
    review: reviewText,
    analysis: {
      totalFiles: analysis.totalFiles,
      processedFiles: analysis.processedFiles,
      skippedFiles: analysis.skippedFiles,
      reviewMode: analysis.reviewMode,
      highestRisk: riskAnalysis.highestRisk,
      riskCounts: riskAnalysis.riskCounts,
      qualityScore: qualityEvaluation.totalScore,
      duration,
      timeLimitReached,
      actualProcessed: allReviews.length,
    },
  };
}

/**
 * 전체 코드 리뷰 워크플로우
 */
export async function generateCodeReviewWorkflow(baseSha, headSha) {
  console.log('=== AI 코드 리뷰 워크플로우 시작 ===');

  const result = await generateAdaptiveReview(baseSha, headSha);

  console.log('\n=== 리뷰 완료 ===');
  console.log('처리된 파일:', result.analysis.actualProcessed);
  console.log('최고 위험도:', result.analysis.highestRisk);
  console.log('품질 점수:', result.analysis.qualityScore);
  console.log('소요 시간:', result.analysis.duration, '초');

  return result;
}

// CLI 실행용
console.log('=== AI 코드 리뷰 스크립트 시작 ===');
console.log('인자:', process.argv);

const baseSha = process.argv[2];
const headSha = process.argv[3];

if (!baseSha || !headSha) {
  console.error('사용법: node code-review.mjs <base-sha> <head-sha>');
  console.error('예시: node code-review.mjs HEAD~2 HEAD');
  process.exit(1);
}

console.log(`Base SHA: ${baseSha}`);
console.log(`Head SHA: ${headSha}`);

generateCodeReviewWorkflow(baseSha, headSha)
  .then((result) => {
    console.log('\n=== 생성 결과 ===');
    console.log('분석:', result.analysis);

    // 결과를 파일로 저장
    fs.writeFileSync('review.txt', result.review);
    fs.writeFileSync('review_analysis.json', JSON.stringify(result.analysis, null, 2));

    console.log('결과가 파일로 저장되었습니다.');
  })
  .catch((error) => {
    console.error('코드 리뷰 생성 실패:', error.message);
    console.error('스택 트레이스:', error.stack);
    process.exit(1);
  });
