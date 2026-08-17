type TagWithCount = {
  count?: number | { posts?: number };
};

/** /api/tags 응답: count는 number, OpenAPI 타입은 { posts } 형태일 수 있음 */
export const getTagPostCount = (tag: TagWithCount) => {
  if (typeof tag.count === 'number') return tag.count;
  return tag.count?.posts ?? 0;
};
