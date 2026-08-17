type PaginationLike =
  | {
      currentPage?: number;
      page?: number;
      hasNextPage?: boolean;
      totalPages?: number;
    }
  | null
  | undefined;

/** OpenAPI(nested) / legacy(flat meta) / category(pagination) 모두 지원 */
export const getNextPageParamFromMeta = (
  source: { meta?: { pagination?: PaginationLike } & PaginationLike; pagination?: PaginationLike } | null | undefined,
): number | undefined => {
  if (!source) return undefined;

  const pagination = source.meta?.pagination ?? source.meta ?? source.pagination;
  if (!pagination) return undefined;

  const currentPage = pagination.currentPage ?? pagination.page;
  if (!currentPage) return undefined;

  if (typeof pagination.hasNextPage === 'boolean') {
    return pagination.hasNextPage ? currentPage + 1 : undefined;
  }

  if (typeof pagination.totalPages === 'number') {
    return currentPage < pagination.totalPages ? currentPage + 1 : undefined;
  }

  return undefined;
};
