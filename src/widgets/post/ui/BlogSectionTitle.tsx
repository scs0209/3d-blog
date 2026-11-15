type BlogSectionTitleProps = {
  children: React.ReactNode;
  subtitle?: string;
};

/** 구획 제목: 선 없이 글씨 크기와 여백으로만 구분한다 */
export const BlogSectionTitle = ({ children, subtitle }: BlogSectionTitleProps) => {
  return (
    <div className='mb-4 flex items-baseline gap-3'>
      <h2 className='font-[family-name:var(--font-syne),sans-serif] text-[22px] font-semibold text-[#e9edf1]'>
        {children}
      </h2>
      {subtitle ? <p className='min-w-0 truncate text-[14px] text-[#8d98a3]'>{subtitle}</p> : null}
    </div>
  );
};
