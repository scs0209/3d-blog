import { getCategoryPosts } from '@/features/category/api/category-api';
import { CategoryModal } from '@/widgets/category';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryPosts(slug);

  return <CategoryModal category={data} />;
}
