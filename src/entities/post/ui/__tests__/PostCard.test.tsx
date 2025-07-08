import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
// 가상의 PostCard 컴포넌트 경로. 실제 경로에 맞게 수정 필요.
// import PostCard, { PostCardProps } from '../PostCard';

// ---- 가상 PostCard 컴포넌트 시작 ----
// 실제 파일이 없으므로 테스트 파일 내에 임시로 정의합니다.
// 실제로는 별도 파일에서 import 해야 합니다.
import React from 'react';
// import Link from 'next/link'; // setup.ts 에서 mock 된 Link를 사용

export type PostCardProps = {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  slug: string;
};

const PostCard: React.FC<PostCardProps> = ({ id, title, excerpt, authorName, slug }) => {
  // next/link가 mock되어 <a>로 렌더링된다고 가정
  // 실제 Link 컴포넌트를 사용한다면 import Link from 'next/link'; 필요
  const LinkComponent = 'a'; // Mock된 Link가 a 태그로 동작한다고 가정

  return (
    <article data-testid={`post-card-${id}`}>
      <h2 data-testid="post-title">{title}</h2>
      <p data-testid="post-excerpt">{excerpt}</p>
      <p data-testid="post-author">By: {authorName}</p>
      <LinkComponent href={`/blog/${slug}`} data-testid="post-link">
        Read more
      </LinkComponent>
    </article>
  );
};
// ---- 가상 PostCard 컴포넌트 끝 ----


// next/link 에 대한 mock이 setup.ts 에 정의되어 있다고 가정합니다.
// vi.mock('next/link', () => ({
//   default: ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>,
// }));


describe('PostCard (Entity Component)', () => {
  const mockPost: PostCardProps = {
    id: '1',
    title: 'Test Post Title',
    excerpt: 'This is a short excerpt for the test post.',
    authorName: 'John Doe',
    slug: 'test-post-title',
  };

  beforeEach(() => {
    // 필요시 mock 초기화
  });

  it('renders post data correctly', () => {
    render(<PostCard {...mockPost} />);

    expect(screen.getByTestId('post-title')).toHaveTextContent(mockPost.title);
    expect(screen.getByTestId('post-excerpt')).toHaveTextContent(mockPost.excerpt);
    expect(screen.getByTestId('post-author')).toHaveTextContent(`By: ${mockPost.authorName}`);
  });

  it('renders the "Read more" link with the correct href', () => {
    render(<PostCard {...mockPost} />);

    const linkElement = screen.getByTestId('post-link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/blog/${mockPost.slug}`);
    expect(linkElement).toHaveTextContent('Read more');
  });

  it('applies the main data-testid correctly', () => {
    render(<PostCard {...mockPost} />);
    expect(screen.getByTestId(`post-card-${mockPost.id}`)).toBeInTheDocument();
  });

  // 스냅샷 테스트 (선택 사항)
  it('matches snapshot', () => {
    const { container } = render(<PostCard {...mockPost} />);
    // data-testid가 동적이므로 스냅샷에서 id 부분을 고정하거나,
    // 스냅샷에서 article 태그 자체를 검사하는 것이 더 안정적일 수 있습니다.
    // expect(container.firstChild).toMatchSnapshot();
    // 또는
    const articleElement = screen.getByTestId(`post-card-${mockPost.id}`);
    expect(articleElement).toMatchSnapshot();
  });
});
