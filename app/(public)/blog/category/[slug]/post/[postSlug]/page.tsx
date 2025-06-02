import { getPostBySlug } from '@/features/post/api/post-api';
import { formatDateToYMD } from '@/shared/utils';
import dynamic from 'next/dynamic';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const NovelViewer = dynamic(() => import('@/shared/ui/NovelViewer'));

export default async function PostPage({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) {
  const { postSlug } = await params;
  const decodedSlug = decodeURIComponent(postSlug);
  const post = await getPostBySlug(decodedSlug);

  return (
    <div>
      {/* 본문 영역 꾸밈 */}
      <section className='relative bg-gradient-to-br from-[#181c2a]/90 via-[#232946]/90 to-[#232946]/80 border border-blue-400/30 rounded-2xl shadow-[0_0_24px_4px_#7dd3fc22] px-4 sm:px-6 md:px-8 py-8 mb-12 mt-4 max-w-3xl mx-auto overflow-hidden'>
        <div className='absolute inset-0 pointer-events-none z-0'>
          <div className='w-full h-full bg-gradient-to-tr from-blue-900/20 via-fuchsia-900/10 to-blue-800/10 blur-[2px]' />
        </div>
        <h1 className='relative z-10 text-3xl font-extrabold text-blue-100 mb-4 drop-shadow-[0_2px_8px_#7dd3fc55]'>
          {post.title}
        </h1>
        <div className='relative z-10 flex items-center gap-3 mb-6 text-xs text-blue-200'>
          <span className='font-mono'>{post.author?.name}</span>
          <span className='opacity-60'>|</span>
          <span>{formatDateToYMD(post?.createdAt ?? '')}</span>
        </div>
        <div className='relative z-10'>
          <NovelViewer content={post.content ?? ''} />
        </div>
      </section>
      {/* 댓글 */}
      <section className='mt-10 relative bg-gradient-to-br from-[#181c2a]/90 via-[#232946]/90 to-[#232946]/80 border border-blue-400/30 rounded-2xl shadow-[0_0_24px_4px_#7dd3fc22] px-4 sm:px-6 md:px-8 py-8 max-w-3xl mx-auto overflow-hidden'>
        <div className='absolute inset-0 pointer-events-none z-0'>
          <div className='w-full h-full bg-gradient-to-tr from-blue-900/20 via-fuchsia-900/10 to-blue-800/10 blur-[2px]' />
        </div>
        <div className='relative z-10'>
          <h2 className='text-lg font-bold text-blue-200 mb-4'>댓글</h2>
          <div className='relative flex items-start gap-2 mb-6'>
            <div className='relative flex-1'>
              <label htmlFor='comment-input' className='sr-only'>
                댓글 입력
              </label>
              <textarea
                id='comment-input'
                className='w-full bg-[#232946] border border-blue-400/40 rounded-lg p-3 pr-16 text-slate-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/60 shadow-[0_0_8px_#7dd3fc33]'
                rows={3}
                placeholder='댓글을 입력하세요...'
                aria-label='댓글 입력'
                disabled
              />
              <button
                type='button'
                className='absolute bottom-2.5 right-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-[0_0_8px_#7dd3fc55] transition disabled:opacity-60 text-xs'
                style={{ fontSize: '0.85rem', marginBottom: '6px', marginRight: '6px' }}
                aria-label='댓글 등록'
                disabled
              >
                등록
              </button>
            </div>
          </div>
          {/* 대댓글 */}
          <ul className='space-y-6'>
            <li>
              <article className='bg-[#181c2a]/80 border border-blue-400/20 rounded-xl p-4 shadow-[0_0_8px_#7dd3fc22] relative'>
                <header className='flex items-center gap-2 mb-1'>
                  <address className='not-italic font-bold text-blue-200'>user1</address>
                  <time className='text-xs text-blue-300' dateTime='2024-06-01'>
                    2024-06-01
                  </time>
                </header>
                <p className='text-slate-100 mb-2'>이 글 정말 유익하네요! 감사합니다.</p>
                <div className='flex gap-2 items-center justify-between mt-2'>
                  <div className='flex gap-2 items-center'>
                    <button
                      type='button'
                      aria-label='답글 입력창 열기'
                      aria-expanded='false'
                      aria-controls='reply-1'
                      className='text-xs text-blue-400 hover:underline flex items-center gap-1'
                    >
                      <span>답글</span>
                      <span aria-hidden>▼</span>
                    </button>
                    <button className='text-xs text-fuchsia-400 hover:underline' type='button' aria-label='댓글 삭제'>
                      삭제
                    </button>
                  </div>
                  <div className='flex items-center gap-1'>
                    <button
                      type='button'
                      aria-label='좋아요'
                      className='text-blue-300 hover:text-blue-400 transition p-1 rounded-full hover:bg-blue-900/30'
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <span className='text-blue-300 text-xs'>3</span>
                    <button
                      type='button'
                      aria-label='싫어요'
                      className='text-fuchsia-300 hover:text-fuchsia-400 transition p-1 rounded-full hover:bg-fuchsia-900/30'
                    >
                      <ThumbsDown size={16} />
                    </button>
                    <span className='text-blue-300 text-xs'>0</span>
                  </div>
                </div>
                <ul className='mt-4 space-y-3 pl-4 border-l-2 border-blue-900/40'>
                  <li>
                    <article className='bg-[#232946]/80 border border-fuchsia-400/20 rounded-lg p-3 relative'>
                      <header className='flex items-center gap-2 mb-1'>
                        <address className='not-italic font-bold text-fuchsia-200'>user2</address>
                        <time className='text-xs text-fuchsia-300' dateTime='2024-06-01'>
                          2024-06-01
                        </time>
                      </header>
                      <p className='text-slate-100 mb-2'>저도 동의합니다!</p>
                      <div className='flex gap-2 items-center justify-between mt-2'>
                        <div className='flex gap-2 items-center'>
                          <button
                            className='text-xs text-fuchsia-400 hover:underline'
                            type='button'
                            aria-label='대댓글 삭제'
                          >
                            삭제
                          </button>
                        </div>
                        <div className='flex items-center gap-1'>
                          <button
                            type='button'
                            aria-label='좋아요'
                            className='text-blue-300 hover:text-blue-400 transition p-1 rounded-full hover:bg-blue-900/30'
                          >
                            <ThumbsUp size={15} />
                          </button>
                          <span className='text-fuchsia-300 text-xs'>1</span>
                          <button
                            type='button'
                            aria-label='싫어요'
                            className='text-fuchsia-300 hover:text-fuchsia-400 transition p-1 rounded-full hover:bg-fuchsia-900/30'
                          >
                            <ThumbsDown size={15} />
                          </button>
                          <span className='text-fuchsia-300 text-xs'>0</span>
                        </div>
                      </div>
                    </article>
                  </li>
                  <li className='mt-2'>
                    <div className='relative flex-1'>
                      <label htmlFor='reply-input-1' className='sr-only'>
                        대댓글 입력
                      </label>
                      <textarea
                        id='reply-input-1'
                        className='w-full bg-[#232946] border border-blue-400/40 rounded-lg p-2 pr-16 text-slate-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/60'
                        rows={2}
                        placeholder='대댓글을 입력하세요...'
                        aria-label='대댓글 입력'
                        disabled
                      />
                      <button
                        type='button'
                        className='absolute bottom-2.5 right-2.5 bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-bold px-2.5 py-1 rounded-lg shadow-[0_0_8px_#f472b655] transition disabled:opacity-60 text-xs'
                        style={{ fontSize: '0.8rem', marginBottom: '6px', marginRight: '6px' }}
                        aria-label='대댓글 등록'
                        disabled
                      >
                        등록
                      </button>
                    </div>
                  </li>
                </ul>
              </article>
            </li>
            <li>
              <article className='bg-[#181c2a]/80 border border-blue-400/20 rounded-xl p-4 shadow-[0_0_8px_#7dd3fc22] relative'>
                <header className='flex items-center gap-2 mb-1'>
                  <address className='not-italic font-bold text-blue-200'>user3</address>
                  <time className='text-xs text-blue-300' dateTime='2024-06-02'>
                    2024-06-02
                  </time>
                </header>
                <p className='text-slate-100 mb-2'>좋은 정보 감사합니다.</p>
                <div className='flex gap-2 items-center justify-between mt-2'>
                  <div className='flex gap-2 items-center'>
                    <button
                      type='button'
                      aria-label='답글 입력창 열기'
                      aria-expanded='false'
                      aria-controls='reply-2'
                      className='text-xs text-blue-400 hover:underline flex items-center gap-1'
                    >
                      <span>답글</span>
                      <span aria-hidden>▼</span>
                    </button>
                    <button className='text-xs text-fuchsia-400 hover:underline' type='button' aria-label='댓글 삭제'>
                      삭제
                    </button>
                  </div>
                  <div className='flex items-center gap-1'>
                    <button
                      type='button'
                      aria-label='좋아요'
                      className='text-blue-300 hover:text-blue-400 transition p-1 rounded-full hover:bg-blue-900/30'
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <span className='text-blue-300 text-xs'>2</span>
                    <button
                      type='button'
                      aria-label='싫어요'
                      className='text-fuchsia-300 hover:text-fuchsia-400 transition p-1 rounded-full hover:bg-fuchsia-900/30'
                    >
                      <ThumbsDown size={16} />
                    </button>
                    <span className='text-blue-300 text-xs'>1</span>
                  </div>
                </div>
              </article>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
