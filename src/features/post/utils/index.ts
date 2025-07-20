/**
 * 요약이 유효한지 확인
 */
export function isValidSummary(summary: string): boolean {
  return Boolean(summary && summary.length > 10 && !summary.includes('요약을 생성할 수 없습니다'));
}
