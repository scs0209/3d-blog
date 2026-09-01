'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  buildCategoryTree,
  type CategoryTreeNode,
  collectAncestorIds,
} from '@/entities/category/lib/build-category-tree';
import type { CategoryListItem } from '@/entities/category/model';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { sidebarLayout, TREE_INDENT_PX } from '@/widgets/post/ui/sidebar-layout';

type CategoryTreeProps = {
  categories: CategoryListItem[];
  currentCategorySlug: string | null;
  onSelect: (slug: string) => void;
};

const getActiveClassName = (isActive: boolean) => (isActive ? blogTheme.navActive : blogTheme.navIdle);

type CategoryTreeItemProps = {
  node: CategoryTreeNode<CategoryListItem>;
  depth: number;
  currentCategorySlug: string | null;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  onSelect: (slug: string) => void;
};

const CategoryTreeItem = ({
  node,
  depth,
  currentCategorySlug,
  expandedIds,
  onToggle,
  onSelect,
}: CategoryTreeItemProps) => {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isActive = currentCategorySlug === node.slug;

  return (
    <div className='flex flex-col gap-1'>
      <div className={sidebarLayout.navRow} style={{ paddingLeft: depth * TREE_INDENT_PX }}>
        {hasChildren ? (
          <button
            type='button'
            className={`${sidebarLayout.navToggle} rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/40 dark:focus-visible:ring-[#3de8ff]/50 ${blogTheme.textMuted} hover:text-[#ff9a3c] dark:hover:text-[#3de8ff]`}
            aria-label={isExpanded ? `${node.name} 접기` : `${node.name} 펼치기`}
            aria-expanded={isExpanded}
            onClick={() => onToggle(node.id)}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className={sidebarLayout.navToggle} aria-hidden />
        )}
        <motion.button
          type='button'
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`${sidebarLayout.navButton} ${getActiveClassName(isActive)}`}
          onClick={() => onSelect(node.slug)}
        >
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen size={15} className='shrink-0 opacity-80' aria-hidden />
            ) : (
              <Folder size={15} className='shrink-0 opacity-80' aria-hidden />
            )
          ) : (
            <FileText size={15} className='shrink-0 opacity-80' aria-hidden />
          )}
          <span className='truncate'>{node.name}</span>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            key={`children-${node.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='flex flex-col gap-1 overflow-hidden'
          >
            {node.children.map((child) => (
              <CategoryTreeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                currentCategorySlug={currentCategorySlug}
                expandedIds={expandedIds}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CategoryTree = ({ categories, currentCategorySlug, onSelect }: CategoryTreeProps) => {
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === currentCategorySlug) ?? null,
    [categories, currentCategorySlug],
  );
  const ancestorIds = useMemo(
    () => collectAncestorIds(categories, activeCategory?.id ?? null),
    [categories, activeCategory],
  );

  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set(ancestorIds));

  useEffect(() => {
    if (ancestorIds.size === 0) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      for (const id of ancestorIds) {
        next.add(id);
      }
      return next;
    });
  }, [ancestorIds]);

  const handleToggle = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className='flex flex-col gap-1'>
      {tree.map((node) => (
        <CategoryTreeItem
          key={node.id}
          node={node}
          depth={0}
          currentCategorySlug={currentCategorySlug}
          expandedIds={expandedIds}
          onToggle={handleToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
