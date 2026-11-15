/** 글 상세·댓글의 표면. 선과 테두리 대신 옅은 면과 여백으로 구분한다 */
const surface = 'rounded-lg bg-white/[0.045]';
const action =
  'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4de3ff] disabled:cursor-not-allowed disabled:opacity-50';

export const blogPostSurface = {
  postSection: 'relative',
  summaryBox: `${surface} p-5`,
  commentSection: 'relative mt-20 max-w-3xl',
  commentCard: `relative ${surface} p-4`,
  commentReplyThread: 'ml-4 mt-3 space-y-2.5',
  commentReplyCard: 'relative rounded-lg bg-white/[0.03] px-3 py-2.5',
  commentInput: `w-full resize-none ${surface} p-3 text-sm leading-relaxed text-[#e9edf1] placeholder:text-[#8d98a3] focus:bg-white/[0.07] focus:outline-none`,
  commentInputShell: `overflow-hidden ${surface} focus-within:bg-white/[0.07]`,
  commentInputField:
    'block w-full resize-none border-0 bg-transparent px-3 pt-3 pb-1 text-sm leading-relaxed text-[#e9edf1] placeholder:text-[#8d98a3] focus:outline-none focus:ring-0',
  commentSubmit: `${action} shrink-0 bg-white text-[#050608] hover:bg-[#4de3ff]`,
  commentFormActions: 'flex justify-end px-3 pb-3 pt-0.5',
  commentActionPrimary: `${action} bg-white text-[#050608] hover:bg-[#4de3ff]`,
  commentActionGhost: `${action} bg-white/[0.06] text-[#c3ccd4] hover:bg-white/[0.1] hover:text-white`,
  commentDanger: 'text-xs text-[#8d98a3] transition-colors hover:text-[#ff8a8a] hover:underline',
} as const;
