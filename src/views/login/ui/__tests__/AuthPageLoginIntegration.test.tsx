import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AuthPage from '../AuthPage'; // 경로 확인
import * as AuthApi from '@/features/auth/api/auth-api'; // login 함수를 mock 하기 위해

// next/navigation (useRouter)는 tests/setup.ts 에서 이미 mock 되어 있음
const mockRouterPush = vi.fn();
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: mockRouterPush,
      // 다른 router 메소드들도 필요에 따라 mock
    }),
  };
});

// features/auth/api/auth-api.ts의 login 함수를 mock
const mockLoginApi = vi.spyOn(AuthApi, 'login');

describe('AuthPage - Login Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 로그인 API mock의 기본 성공 응답 설정
    mockLoginApi.mockResolvedValue(undefined); // 성공 시 반환값이 없다고 가정
  });

  // AuthPage 내부의 LoginForm이 마운트될 때까지 기다리는 helper
  const renderAuthPageAndWaitForForm = async () => {
    render(<AuthPage type="login" />);
    // LoginForm 내부의 "로그인" 헤더가 나타날 때까지 기다림
    await screen.findByRole('heading', { name: /로그인/i, level: 1 });
  };

  it('renders LoginForm when type is "login" and handles successful login flow', async () => {
    await renderAuthPageAndWaitForForm();

    // LoginForm이 렌더링 되었는지 확인 (LoginForm의 특정 요소로 확인)
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
    const loginButton = screen.getByRole('button', { name: /로그인/i });
    expect(loginButton).toBeInTheDocument();

    // SpacePortal 위젯도 렌더링 되는지 간단히 확인 (SpacePortal이 특정 testid를 갖는다고 가정)
    // 예: <div data-testid="space-portal-widget">...</div>
    // expect(screen.getByTestId('space-portal-widget')).toBeInTheDocument();
    // SpacePortal의 실제 내용을 모르므로, 여기서는 LoginForm에 집중합니다.

    // 유효한 데이터 입력
    const testEmail = 'testuser@example.com';
    const testPassword = 'password123';
    fireEvent.change(screen.getByLabelText(/이메일/i), { target: { value: testEmail } });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), { target: { value: testPassword } });

    // 로그인 버튼 클릭
    fireEvent.click(loginButton);

    // API 호출 검증
    await waitFor(() => {
      expect(mockLoginApi).toHaveBeenCalledTimes(1);
      expect(mockLoginApi).toHaveBeenCalledWith({ email: testEmail, password: testPassword });
    });

    // 라우팅 호출 검증
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledTimes(1);
      expect(mockRouterPush).toHaveBeenCalledWith('/'); // LoginForm에서 성공 시 '/'로 이동
    });

    // 실패 메시지가 없는지 확인
    expect(screen.queryByText(/로그인에 실패했습니다!/i)).not.toBeInTheDocument();
  });

  it('renders LoginForm and handles login failure within AuthPage', async () => {
    // API가 실패하도록 mock 설정
    mockLoginApi.mockRejectedValueOnce(new Error('Invalid credentials'));

    await renderAuthPageAndWaitForForm();

    const emailInput = screen.getByLabelText(/이메일/i);
    const passwordInput = screen.getByLabelText(/비밀번호/i);
    const loginButton = screen.getByRole('button', { name: /로그인/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    // API 호출 검증
    await waitFor(() => {
      expect(mockLoginApi).toHaveBeenCalledTimes(1);
    });

    // 실패 메시지 확인 (LoginForm에서 표시)
    expect(await screen.findByText(/로그인에 실패했습니다!/i)).toBeInTheDocument();

    // 라우팅이 호출되지 않았는지 확인
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  // SignupForm 렌더링 테스트 (선택 사항)
  it('renders SignupForm when type is "signup"', async () => {
    render(<AuthPage type="signup" />);
    // SignupForm이 렌더링 되었는지 확인 (SignupForm의 특정 요소로 확인)
    // 예: SignupForm에 "회원가입" 헤더가 있다고 가정
    expect(await screen.findByRole('heading', { name: /회원가입/i })).toBeInTheDocument();
    // LoginForm 관련 요소는 없어야 함
    expect(screen.queryByLabelText(/이메일/i)).not.toBeInTheDocument(); // LoginForm의 이메일 필드가 아니어야 함 (SignupForm도 이메일 필드가 있을 수 있으므로, 더 구체적인 식별자 필요)
  });
});
