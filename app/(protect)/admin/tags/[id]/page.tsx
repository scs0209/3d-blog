'use client';

import { deleteTag, getTagDetail, updateTag } from '@/features/tag/api/tag-api';
import { toast } from '@/shared/ui/toast/useToast';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const { id: tagId } = await params;
        const id = Number.parseInt(tagId, 10);
        if (!Number.isInteger(id) || id <= 0) {
          setLoadError('잘못된 태그 주소입니다.');
          return;
        }
        const data = await getTagDetail(id);
        setTag(data);
        setName(data.name);
      } catch {
        setLoadError('태그를 불러오지 못했습니다.');
      }
    };

    void fetchTag();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag) return;

    try {
      const updatedTag = await updateTag(tag.id, { name });
      setTag((prevTag) => ({ ...prevTag!, ...updatedTag }));
      setIsEditing(false);
      toast.success('태그를 수정했습니다');
    } catch {
      toast.error('태그 수정에 실패했습니다');
    }
  };

  const handleDelete = async () => {
    if (!tag) return;

    try {
      await deleteTag(tag.id);
      toast.success('태그를 삭제했습니다');
      router.push('/admin');
    } catch {
      toast.error('태그 삭제에 실패했습니다');
    }
  };

  if (loadError) {
    return (
      <div className={`p-6 ${adminTheme.card}`}>
        <p className='text-red-300'>{loadError}</p>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className={`p-6 ${adminTheme.card}`}>
        <p className={adminTheme.textMuted}>불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-3xl space-y-4 p-2'>
      <div className={`relative p-6 ${adminTheme.card}`}>
        <span className={adminTheme.cardTopGlow} aria-hidden />
        <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
          <h2 className={`text-2xl font-bold ${adminTheme.headerTitle}`}>태그 상세</h2>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => setIsEditing(!isEditing)}
              className={`rounded-lg px-3 py-2 text-sm ${adminTheme.navIdle} border border-[#ff9a3c]/25 dark:border-[#3de8ff]/20`}
            >
              {isEditing ? '취소' : '수정'}
            </button>
            <button
              type='button'
              onClick={() => setIsDeleteModalOpen(true)}
              className='rounded-lg border border-red-400/40 bg-red-500/15 px-3 py-2 text-sm text-red-200 hover:bg-red-500/25'
            >
              삭제
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='name' className={`mb-1 block text-sm font-medium ${adminTheme.textMuted}`}>
                태그 이름
              </label>
              <input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-lg border border-[#ff9a3c]/30 bg-[#2a1545]/60 px-3 py-2 ${adminTheme.textPrimary} outline-none focus:ring-2 focus:ring-[#ff9a3c]/35 dark:border-[#3de8ff]/25 dark:bg-[#070414]/70 dark:focus:ring-[#3de8ff]/35`}
                required
              />
            </div>
            <button type='submit' className={`rounded-lg px-4 py-2 text-sm font-medium ${adminTheme.navCta}`}>
              저장
            </button>
          </form>
        ) : (
          <div className='space-y-4'>
            <div>
              <h3 className={`mb-1 text-sm ${adminTheme.sectionLabel}`}>이름</h3>
              <p className={adminTheme.textPrimary}>{tag.name}</p>
            </div>
            <div>
              <h3 className={`mb-1 text-sm ${adminTheme.sectionLabel}`}>생성일</h3>
              <p className={adminTheme.textMuted}>{new Date(tag.createdAt).toLocaleDateString('ko-KR')}</p>
            </div>
            <div>
              <h3 className={`mb-1 text-sm ${adminTheme.sectionLabel}`}>연결된 글</h3>
              <p className={adminTheme.textPrimary}>{tag._count.posts}</p>
            </div>
            {tag.posts.length > 0 && (
              <div>
                <h3 className={`mb-2 text-sm ${adminTheme.sectionLabel}`}>관련 포스트</h3>
                <ul className={`list-disc space-y-1 pl-5 ${adminTheme.textMuted}`}>
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
          <div className={`w-full max-w-md p-6 ${adminTheme.card}`} role='dialog' aria-modal='true' aria-label='태그 삭제 확인'>
            <span className={adminTheme.cardTopGlow} aria-hidden />
            <h2 className={`mb-3 text-xl font-bold ${adminTheme.headerTitle}`}>태그 삭제</h2>
            <p className={`mb-6 ${adminTheme.textMuted}`}>이 태그를 삭제할까요? 이 작업은 되돌릴 수 없습니다.</p>
            <div className='flex justify-end gap-2'>
              <button
                type='button'
                onClick={() => setIsDeleteModalOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${adminTheme.navIdle} border border-[#ff9a3c]/25 dark:border-[#3de8ff]/20`}
              >
                취소
              </button>
              <button
                type='button'
                onClick={handleDelete}
                className='rounded-lg border border-red-400/40 bg-red-500/20 px-3 py-2 text-sm text-red-100 hover:bg-red-500/30'
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
