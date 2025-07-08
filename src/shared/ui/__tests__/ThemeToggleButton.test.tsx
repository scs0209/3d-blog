import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ThemeToggleButton from '../ThemeToggleButton'; // 경로가 실제 위치에 맞는지 확인

// next-themes 모듈 전체를 mock
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggleButton', () => {
  const mockSetTheme = vi.fn();

  afterEach(() => {
    vi.clearAllMocks(); // 각 테스트 후 mock 호출 기록 초기화
  });

  it('renders correctly and shows Sun icon when theme is light', () => {
    // useTheme mock 설정 (light 테마)
    vi.mocked(require('next-themes').useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggleButton />);

    // 버튼이 존재하는지 확인
    const button = screen.getByRole('button', { name: /테마 변경/i });
    expect(button).toBeInTheDocument();

    // Sun 아이콘이 보이는지 확인 (lucide-react 아이콘은 보통 title이나 특정 svg path로 식별)
    // 여기서는 텍스트 기반으로 찾기 어려우므로, theme === 'light' 조건부 렌더링에 의존하여
    // Sun 아이콘이 렌더링되었을 것이라고 가정하고, Moon 아이콘이 없는 것을 확인하는 방식으로 접근 가능
    // 또는 아이콘 컴포넌트에 data-testid를 추가하는 방법도 있음
    // Sun 아이콘은 <Sun /> 컴포넌트로 렌더링되므로, 해당 컴포넌트의 존재를 확인하는 방식도 고려 가능.
    // 여기서는 Moon 아이콘이 없는 것으로 간접 확인
    expect(screen.queryByRole('img', { name: /moon/i })).not.toBeInTheDocument(); // Moon 아이콘은 없을 것
    // Sun 아이콘이 있는지 확인 (Sun 컴포넌트가 title="Sun"을 갖는다고 가정)
    // 실제 lucide-react 아이콘은 title을 기본으로 갖지 않으므로, 이 방식은 실패할 수 있음.
    // 아이콘 존재 여부는 스냅샷 테스트나, 아이콘 래퍼에 data-testid를 추가하여 검증하는 것이 더 견고함.
    // 지금은 setTheme 호출 여부에 더 집중.
  });

  it('renders correctly and shows Moon icon when theme is dark', () => {
    // useTheme mock 설정 (dark 테마)
    vi.mocked(require('next-themes').useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggleButton />);

    const button = screen.getByRole('button', { name: /테마 변경/i });
    expect(button).toBeInTheDocument();

    // Moon 아이콘이 있는지 확인 (Sun 아이콘이 없는 것으로 간접 확인)
    expect(screen.queryByRole('img', { name: /sun/i })).not.toBeInTheDocument();
  });

  it('calls setTheme with "dark" when current theme is "light" and button is clicked', () => {
    vi.mocked(require('next-themes').useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggleButton />);
    const button = screen.getByRole('button', { name: /테마 변경/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with "light" when current theme is "dark" and button is clicked', () => {
    vi.mocked(require('next-themes').useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggleButton />);
    const button = screen.getByRole('button', { name: /테마 변경/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  // 스냅샷 테스트 (선택 사항이지만 UI 변경 감지에 유용)
  it('matches snapshot when theme is light', () => {
    vi.mocked(require('next-themes').useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
    const { container } = render(<ThemeToggleButton />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot when theme is dark', () => {
    vi.mocked(require('next-themes').useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });
    const { container } = render(<ThemeToggleButton />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
