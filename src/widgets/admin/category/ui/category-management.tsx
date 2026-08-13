'use client';

import { useQueryClient } from '@tanstack/react-query';
import { FileText, Folder, FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import {
  buildCategoryTree,
  type CategoryTreeNode,
  flattenCategoryTree,
  toCategoryListItems,
} from '@/entities/category';
import type { Category, CategoryListItem } from '@/entities/category/model';
import { createCategory, deleteCategory, updateCategory } from '@/features/category/api/category-api';
import { useCategories } from '@/features/category/model';
import type { CategoryFormSchema } from '@/features/category/model/category-schema';
import CategoryForm from '@/features/category/ui/category-form';
import { Button } from '@/shadcn-ui/components/ui/button';
import { queryKeys } from '@/shared/queryKeys';
import Modal from '@/shared/ui/modal';
import { toast } from '@/shared/ui/toast/useToast';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

const toCategoryFormData = (category: CategoryListItem): Category => ({
  id: String(category.id),
  name: category.name,
  slug: category.slug,
  description: category.description ?? undefined,
  parentId: category.parentId ?? null,
});

type CategoryRowProps = {
  node: CategoryTreeNode<CategoryListItem>;
  depth: number;
  onEdit: (category: CategoryListItem, trigger: HTMLButtonElement) => void;
  onDelete: (category: CategoryListItem) => void;
};

const CategoryRow = ({ node, depth, onEdit, onDelete }: CategoryRowProps) => {
  const hasChildren = (node._count?.children ?? node.children.length) > 0;

  return (
    <div className='flex flex-col gap-2'>
      <div
        className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${adminTheme.surface}`}
        style={{ marginLeft: depth * 16 }}
      >
        <div className={`flex min-w-0 items-center gap-2 ${adminTheme.textPrimary}`}>
          {hasChildren ? (
            <FolderOpen size={16} className={`shrink-0 ${adminTheme.textAccent}`} aria-hidden />
          ) : depth > 0 ? (
            <FileText size={16} className={`shrink-0 ${adminTheme.textMuted}`} aria-hidden />
          ) : (
            <Folder size={16} className={`shrink-0 ${adminTheme.textAccent}`} aria-hidden />
          )}
          <div className='min-w-0'>
            <p className='truncate font-medium'>{node.name}</p>
            <p className='truncate text-xs text-white/50'>
              /{node.slug}
              {hasChildren ? ` · 하위 ${node._count?.children ?? node.children.length}` : ''}
            </p>
          </div>
        </div>
        <div className='flex shrink-0 items-center gap-2'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={(event) => onEdit(node, event.currentTarget)}
            aria-label={`${node.name} 수정`}
          >
            <Pencil size={14} />
            수정
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-red-300 hover:text-red-200'
            onClick={() => onDelete(node)}
            disabled={hasChildren}
            aria-label={hasChildren ? `${node.name} 삭제 불가 (하위 카테고리 있음)` : `${node.name} 삭제`}
            title={hasChildren ? '하위 카테고리를 먼저 삭제하세요' : undefined}
          >
            <Trash2 size={14} />
            삭제
          </Button>
        </div>
      </div>
      {node.children.map((child) => (
        <CategoryRow key={child.id} node={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export const CategoryManagement = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCategories();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryListItem | null>(null);
  const editTriggerRef = useRef<HTMLButtonElement | null>(null);

  const categories = useMemo(() => toCategoryListItems(data), [data]);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const flatCount = useMemo(() => flattenCategoryTree(tree).length, [tree]);

  const invalidateCategories = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.category.all.queryKey });
  };

  const handleCreate = async (formData: CategoryFormSchema) => {
    await createCategory(formData);
    await invalidateCategories();
    setCreateOpen(false);
  };

  const handleUpdate = async (formData: CategoryFormSchema) => {
    if (!editingCategory) return;
    await updateCategory(String(editingCategory.id), formData);
    await invalidateCategories();
    setEditingCategory(null);
  };

  const handleEdit = (category: CategoryListItem, trigger: HTMLButtonElement) => {
    editTriggerRef.current = trigger;
    setEditingCategory(category);
  };

  const handleEditModalCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    editTriggerRef.current?.focus();
  };

  const handleDelete = async (category: CategoryListItem) => {
    const confirmed = window.confirm(`"${category.name}" 카테고리를 삭제할까요?`);
    if (!confirmed) return;

    try {
      await deleteCategory(String(category.id));
      await invalidateCategories();
      toast.success(`"${category.name}" 카테고리를 삭제했습니다.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '카테고리 삭제에 실패했습니다.');
    }
  };

  return (
    <div className='flex flex-1 flex-col gap-4 px-4 py-4 md:px-6 md:py-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-bold text-white/95'>Categories</h1>
          <p className='text-sm text-white/60'>부모 카테고리를 지정해 트리로 그룹핑할 수 있습니다.</p>
        </div>
        <Modal
          open={createOpen}
          onOpenChange={setCreateOpen}
          title='새 카테고리 생성'
          description='부모를 고르면 사이드바 트리의 자식으로 표시됩니다.'
          trigger={
            <Button type='button' className='gap-2'>
              <Plus size={16} />새 카테고리
            </Button>
          }
        >
          <CategoryForm onSubmit={handleCreate} />
        </Modal>
      </div>

      <div className={`rounded-2xl p-4 ${adminTheme.surface}`}>
        <div className={`mb-4 flex items-center justify-between text-sm ${adminTheme.textMuted}`}>
          <span>총 {flatCount}개</span>
          <span>수정에서 부모 카테고리를 바꾸면 트리 위치가 변경됩니다.</span>
        </div>

        {isLoading ? (
          <p className={adminTheme.textMuted}>불러오는 중...</p>
        ) : tree.length === 0 ? (
          <p className={adminTheme.textMuted}>카테고리가 없습니다. 새 카테고리를 만들어 주세요.</p>
        ) : (
          <div className='flex flex-col gap-2'>
            {tree.map((node) => (
              <CategoryRow key={node.id} node={node} depth={0} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={!!editingCategory}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
        title='카테고리 수정'
        description='부모 카테고리를 변경해 자식으로 옮길 수 있습니다.'
        onCloseAutoFocus={handleEditModalCloseAutoFocus}
      >
        {editingCategory && (
          <CategoryForm
            key={editingCategory.id}
            onSubmit={handleUpdate}
            initialData={toCategoryFormData(editingCategory)}
          />
        )}
      </Modal>
    </div>
  );
};
