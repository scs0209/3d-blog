'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shadcn-ui/components/ui/card';
import { getPostList } from '@/features/post/api/post-api';
import { GetPostListResponse } from '@/features/post/model/post-types';

export function BlogMain() {
  const [posts, setPosts] = useState<GetPostListResponse>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPostList();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <main className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Latest Blog Posts
          </h1>
          <div className="space-y-8">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">{post.content}</p>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-500 hover:underline mt-4 inline-block"
                  >
                    Read more
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <aside className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Welcome to TechBlog, where we explore the latest in technology
                and programming.
              </p>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/category/web-development"
                    className="text-blue-500 hover:underline"
                  >
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/mobile-apps"
                    className="text-blue-500 hover:underline"
                  >
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/ai-ml"
                    className="text-blue-500 hover:underline"
                  >
                    AI & Machine Learning
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/devops"
                    className="text-blue-500 hover:underline"
                  >
                    DevOps
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
