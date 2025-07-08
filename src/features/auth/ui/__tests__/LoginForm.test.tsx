import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '../LoginForm'; // 경로 확인
import * as AuthApi from '../../api/auth-api'; // login 함수를 mock 하기 위해 import

// next/navigation (useRouter)는 tests/setup.ts 에서 이미 mock 되어 있음
const mockRouterPush = vi.fn();
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: mockRouterPush,
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    }),
  };
});

// auth-api.ts의 login 함수를 mock
const mockLoginApi = vi.spyOn(AuthApi, 'login');

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // 모든 mock 초기화
    // login API mock의 기본 성공 응답 설정
    mockLoginApi.mockResolvedValue(undefined); // 성공 시 반환값이 없다고 가정
  });

  // mounted 상태를 위한 helper 함수 (선택 사항)
  const renderAndWaitForMount = async () => {
    render(<LoginForm />);
    // useEffect가 실행되고 mounted가 true가 될 때까지 기다림
    // "로그인" 텍스트가 있는 헤더가 나타날 때까지 기다림
    await screen.findByRole('heading', { name: /로그인/i });
  };

  it('renders email and password fields and a submit button', async () => {
    await renderAndWaitForMount();

    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    await renderAndWaitForMount();
    const loginButton = screen.getByRole('button', { name: /로그인/i });

    fireEvent.click(loginButton);

    // zod 스키마에 따라 에러 메시지가 달라질 수 있음.
    // loginSchema를 확인하여 실제 에러 메시지와 일치시켜야 함.
    // 예시: "필수 입력 항목입니다." 또는 "유효한 이메일을 입력해주세요."
    expect(await screen.findByText(/유효한 이메일을 입력해주세요./i)).toBeInTheDocument(); // Zod 기본 메시지 또는 커스텀 메시지
    expect(await screen.findByText(/비밀번호는 최소 6자 이상이어야 합니다./i)).toBeInTheDocument(); // Zod 스키마에 정의된 메시지 가정
    expect(mockLoginApi).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email format', async () => {
    await renderAndWaitForMount();
    const emailInput = screen.getByLabelText(/이메일/i);
    const loginButton = screen.getByRole('button', { name: /로그인/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(loginButton);

    expect(await screen.findByText(/유효한 이메일을 입력해주세요./i)).toBeInTheDocument();
    expect(mockLoginApi).not.toHaveBeenCalled();
  });

  it('calls login API and redirects on successful login', async () => {
    await renderAndWaitForMount();
    const emailInput = screen.getByLabelText(/이메일/i);
    const passwordInput = screen.getByLabelText(/비밀번호/i);
    const loginButton = screen.getByRole('button', { name: /로그인/i });

    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    fireEvent.change(emailInput, { target: { value: testEmail } });
    fireEvent.change(passwordInput, { target: { value: testPassword } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLoginApi).toHaveBeenCalledTimes(1);
      expect(mockLoginApi).toHaveBeenCalledWith({ email: testEmail, password: testPassword });
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledTimes(1);
      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });

    // 성공 시 에러 메시지가 없어야 함
    expect(screen.queryByText(/로그인에 실패했습니다!/i)).not.toBeInTheDocument();
  });

  it('shows root error message on login API failure', async () => {
    mockLoginApi.mockRejectedValueOnce(new Error('Login failed')); // API 실패 mock

    await renderAndWaitForMount();
    const emailInput = screen.getByLabelText(/이메일/i);
    const passwordInput = screen.getByLabelText(/비밀번호/i);
    const loginButton = screen.getByRole('button', { name: /로그인/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(await screen.findByText(/로그인에 실패했습니다!/i)).toBeInTheDocument();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  // mounted 상태 관련 테스트 (선택 사항)
  it('initially renders null and then the form due to useEffect mounting', async () => {
    const { container } = render(<LoginForm />);
    // 초기 렌더링 시에는 폼이 없어야 함 (mounted가 false)
    expect(container.firstChild).toBeNull(); // 또는 expect(screen.queryByRole('form')).not.toBeInTheDocument();

    // useEffect 실행 후 폼이 렌더링 되어야 함
    expect(await screen.findByRole('heading', { name: /로그인/i })).toBeInTheDocument();
  });
});
