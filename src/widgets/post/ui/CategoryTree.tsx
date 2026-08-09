'use client';

import {
  buildCategoryTree,
  collectAncestorIds,
  type CategoryTreeNode,
} from '@/entities/category/lib/build-category-tree';
import type { CategoryListItem } from '@/entities/category/model';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type CategoryTreeProps = {
  categories: CategoryListItem[];
  currentCategorySlug: string | null;
  onSelect: (slug: string) => void;
};

const getActiveClassName = (isActive: boolean) =>
  isActive
    ? 'bg-blue-100 text-[#232946] border border-blue-300 shadow-[0_0_12px_#7dd3fc,0_0_24px_#7dd3fc55]'
    : 'bg-transparent hover:bg-blue-900/40 text-blue-100 border-0';

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
      <div className='flex items-center gap-1' style={{ paddingLeft: depth * 12 }}>
        {hasChildren ? (
          <button
            type='button'
            className='shrink-0 p-0.5 rounded text-blue-200 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400'
            aria-label={isExpanded ? `${node.name} 접기` : `${node.name} 펼치기`}
            aria-expanded={isExpanded}
            onClick={() => onToggle(node.id)}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className='inline-block w-5 shrink-0' aria-hidden />
        )}
        <motion.button
          type='button'
          animate={{
            boxShadow: isActive ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : 'none',
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: isActive ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : '0 0 8px #7dd3fc55',
          }}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 flex items-center gap-2 text-left px-2 py-1 rounded-lg font-mono transition relative ${getActiveClassName(isActive)}`}
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
            className='overflow-hidden flex flex-col gap-1'
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
