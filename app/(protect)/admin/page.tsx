import React from 'react';
import { CategoryForm } from '@/features/category/ui/category-form';

const PostPage = () => {
  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">새 카테고리 생성</h1>
      <CategoryForm />
    </div>
  );
};

export default PostPage;
