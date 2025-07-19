/**
 * 블로그 포스트 내용을 AI로 요약 (API 라우트 사용)
 */
export async function summarizePost(content: string, title: string): Promise<string> {
  console.log('요약 시작:', content, title);
  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, title }),
    });

    if (!response.ok) {
      throw new Error('요약 요청에 실패했습니다.');
    }

    const data = await response.json();
    return data.summary || '요약을 생성할 수 없습니다.';
  } catch (error) {
    console.error('AI 요약 생성 실패:', error);
    return '요약을 생성할 수 없습니다.';
  }
}

/**
 * 요약이 유효한지 확인
 */
export function isValidSummary(summary: string): boolean {
  return Boolean(summary && summary.length > 10 && !summary.includes('요약을 생성할 수 없습니다'));
} 