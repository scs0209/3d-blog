/**
 * 요약이 유효한지 확인
 */
export const isValidSummary = (summary: string | null | undefined): summary is string => {
  return Boolean(summary && summary.length > 10 && !summary.includes('요약을 생성할 수 없습니다'));
};

/** 인라인 `code` 마크만 가볍게 HTML로 변환 */
export const formatSummaryText = (summary: string) => {
  const escaped = summary
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
};
