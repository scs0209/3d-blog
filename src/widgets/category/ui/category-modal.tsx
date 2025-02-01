'use client';

import { useState } from 'react';
import CategoryForm from '@/features/category/ui/category-form';
import { Button } from '@/shadcn-ui/components/ui/button';
import Modal from '@/shared/ui/modal';
import {
  createCategory,
  updateCategory,
} from '@/features/category/api/category-api';
import { Category } from '@/entities/category/model';
import { CategoryFormSchema } from '@/features/category/model/category-schema';

type CategoryModalProps = {
  category?: Category;
};

export const CategoryModal = ({ category }: CategoryModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: CategoryFormSchema) => {
    try {
      if (category) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }
      setOpen(false);
      alert('성공');
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  return (
    <Modal
      trigger={
        <Button variant={category ? 'outline' : 'default'}>
          {category ? '수정' : '새 카테고리'}
        </Button>
      }
      title={category ? '카테고리 수정' : '새 카테고리 생성'}
      description={
        category
          ? '카테고리 정보를 수정하세요.'
          : '새 카테고리의 정보를 입력하세요.'
      }
      open={open}
      onOpenChange={setOpen}
    >
      <CategoryForm onSubmit={handleSubmit} initialData={category} />
    </Modal>
  );
};
