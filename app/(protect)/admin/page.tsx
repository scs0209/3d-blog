import { getCategories } from '@/features/category/api/category-api';
import { CategoryModal } from '@/widgets/category';

export default async function PostPage() {
  const data = await getCategories();

  return (
    <div className='container py-8 mx-auto'>
      <h1 className='mb-4 text-2xl font-bold'>새 카테고리 생성</h1>
      <CategoryModal />
    </div>
  );
}
