'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteTag, getTagDetail, updateTag } from '@/features/tag/api/tag-api';

interface TagDetail {
  id: number;
  name: string;
  createdAt: string;
  _count: {
    posts: number;
  };
  posts: Array<{
    id: number;
    title: string;
  }>;
}

export default function TagDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [tag, setTag] = useState<TagDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const { id: tagId } = await params;
        const id = Number.parseInt(tagId);
        const data = await getTagDetail(id);
        setTag(data);
        setName(data.name);
      } catch (err) {
        setError('Failed to load tag');
      }
    };

    fetchTag();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag) {
      return;
    }
    try {
      const updatedTag = await updateTag(tag.id, { name });
      setTag((prevTag) => ({ ...prevTag!, ...updatedTag }));
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update tag');
    }
  };

  const handleDelete = async () => {
    if (!tag) {
      return;
    }
    try {
      await deleteTag(tag.id);
      router.push('/');
    } catch (err) {
      setError('Failed to delete tag');
    }
  };

  if (error) {
    return (
      <div className='p-4'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className='p-4'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='p-4 max-w-3xl mx-auto'>
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Tag Details</h1>
          <div className='space-x-2'>
            <button
              type='button'
              onClick={() => setIsEditing(!isEditing)}
              className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              type='button'
              onClick={() => setIsDeleteModalOpen(true)}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
            >
              Delete
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='name' className='block font-medium mb-1'>
                Tag Name
              </label>
              <input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
              Save Changes
            </button>
          </form>
        ) : (
          <div className='space-y-4'>
            <div>
              <h3 className='font-medium mb-1'>Tag Name</h3>
              <p>{tag.name}</p>
            </div>
            <div>
              <h3 className='font-medium mb-1'>Created At</h3>
              <p>{new Date(tag.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className='font-medium mb-1'>Post Count</h3>
              <p>{tag._count.posts}</p>
            </div>
            {tag.posts.length > 0 && (
              <div>
                <h3 className='font-medium mb-2'>Related Posts</h3>
                <ul className='list-disc pl-5 space-y-1'>
                  {tag.posts.map((post) => (
                    <li key={post.id}>{post.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h2 className='text-xl font-bold mb-4'>Delete Tag</h2>
            <p className='mb-6'>Are you sure you want to delete this tag? This action cannot be undone.</p>
            <div className='flex justify-end space-x-2'>
              <button
                type='button'
                onClick={() => setIsDeleteModalOpen(false)}
                className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleDelete}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
