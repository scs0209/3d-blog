import type { Category } from '@prisma/client';

export type CategoryTreeNode<
  T extends { id: number; parentId?: number | null } = Category & { parentId?: number | null },
> = T & {
  children: CategoryTreeNode<T>[];
};

type CategoryLike = {
  id: number;
  parentId?: number | null;
};

/** 플랫 카테고리 목록을 parentId 기준 트리로 변환 */
export const buildCategoryTree = <T extends CategoryLike>(categories: T[]): CategoryTreeNode<T>[] => {
  const nodes = new Map<number, CategoryTreeNode<T>>();

  for (const category of categories) {
    nodes.set(category.id, { ...category, children: [] });
  }

  const roots: CategoryTreeNode<T>[] = [];

  for (const category of categories) {
    const node = nodes.get(category.id);
    if (!node) continue;

    const parentId = category.parentId ?? null;
    if (parentId != null && nodes.has(parentId)) {
      nodes.get(parentId)?.children.push(node);
      continue;
    }

    roots.push(node);
  }

  return roots;
};

/** 선택 불가한 자기 자신 + 자손 id 집합 */
export const collectDescendantIds = <T extends CategoryLike>(categories: T[], rootId: number): Set<number> => {
  const childrenByParent = new Map<number, number[]>();

  for (const category of categories) {
    const parentId = category.parentId ?? null;
    if (parentId == null) continue;
    const list = childrenByParent.get(parentId) ?? [];
    list.push(category.id);
    childrenByParent.set(parentId, list);
  }

  const blocked = new Set<number>([rootId]);
  const stack = [rootId];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current == null) continue;
    for (const childId of childrenByParent.get(current) ?? []) {
      if (blocked.has(childId)) continue;
      blocked.add(childId);
      stack.push(childId);
    }
  }

  return blocked;
};

/** 활성 slug의 조상 id들을 열어두기 위해 수집 */
export const collectAncestorIds = <T extends CategoryLike>(categories: T[], activeId: number | null): Set<number> => {
  const ancestors = new Set<number>();
  if (activeId == null) return ancestors;

  const byId = new Map(categories.map((category) => [category.id, category]));
  let current = byId.get(activeId);

  while (current?.parentId != null) {
    ancestors.add(current.parentId);
    current = byId.get(current.parentId);
  }

  return ancestors;
};

/** Select 등에서 들여쓰기 라벨용 플랫 목록 */
export const flattenCategoryTree = <T extends CategoryLike>(
  tree: CategoryTreeNode<T>[],
  depth = 0,
): Array<T & { depth: number }> => {
  const result: Array<T & { depth: number }> = [];

  for (const node of tree) {
    const { children, ...rest } = node;
    result.push({ ...(rest as unknown as T), depth });
    if (children.length > 0) {
      result.push(...flattenCategoryTree(children, depth + 1));
    }
  }

  return result;
};
