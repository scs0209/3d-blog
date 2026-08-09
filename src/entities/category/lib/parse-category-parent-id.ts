/** parentId 본문 값을 양의 정수로 파싱. 유효하지 않으면 null */
export const parseCategoryParentId = (parentId: unknown): number | null => {
  const parsed =
    typeof parentId === 'number' || typeof parentId === 'string' ? Number(parentId) : Number.NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};
