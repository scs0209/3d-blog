'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { EditorContent, EditorRoot } from 'novel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shadcn-ui/components/ui/card';
import { getPostList } from '@/features/post/api/post-api';
import { GetPostListResponse } from '@/features/post/model/post-types';
import NovelEditor from '@/shared/ui/TextEditor/novel-editor';
import NovelViewer from '@/shared/ui/NovelViewer';

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
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-8 md:flex-row">
        <main className="w-full md:w-2/3">
          <h1 className="mb-8 text-3xl font-bold text-gray-800">
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
                  <NovelViewer content={post.content} />

                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-block mt-4 text-blue-500 hover:underline"
                  >
                    Read more
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
