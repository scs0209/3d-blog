import { blogTheme } from '@/widgets/post/ui/blog-theme';

type BlogSectionTitleProps = {
  children: React.ReactNode;
  subtitle?: string;
};

export const BlogSectionTitle = ({ children, subtitle }: BlogSectionTitleProps) => {
  return (
    <div className='mb-6'>
      <div className='flex items-center gap-4'>
        <span className={blogTheme.sectionLine} aria-hidden />
        <h2 className={blogTheme.sectionTitle} style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
          {children}
        </h2>
        <span className={blogTheme.sectionLineReverse} aria-hidden />
      </div>
      {subtitle && <p className={`mt-2 text-center text-xs ${blogTheme.textMuted}`}>{subtitle}</p>}
    </div>
  );
};
