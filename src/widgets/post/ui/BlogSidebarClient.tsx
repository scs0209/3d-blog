'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';

export default function BlogSidebarClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return <Sidebar selectedCategory={selectedCategory} />;
}
