import { test, expect } from '@playwright/test';

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 모든 테스트 전에 홈페이지로 이동
    await page.goto('/');
  });

  test('should load the homepage and display the correct title', async ({ page }) => {
    // 페이지 타이틀 확인 (Next.js <head>의 <title> 태그 기준)
    // 실제 프로젝트의 타이틀로 변경해야 함
    await expect(page).toHaveTitle(/3D Blog/i); // 프로젝트 이름에 맞게 수정
  });

  test('should display a canvas for 3D content', async ({ page }) => {
    // react-three-fiber Canvas는 <canvas> 태그를 렌더링함
    // HomeCanvas.tsx 또는 유사한 컴포넌트가 <canvas>를 포함한다고 가정
    const canvasElement = page.locator('canvas');
    await expect(canvasElement).toBeVisible();
    // 추가적으로 canvas의 특정 속성 (예: data-testid, class)으로 더 정확히 식별 가능
    // 예: const mainCanvas = page.locator('canvas[data-testid="home-canvas"]');
  });

  test('should have a navigation bar with a "Blog" link and navigate to blog page', async ({ page }) => {
    // src/shared/ui/Navbar.tsx의 menuItems 배열과 로그인 상태에 따른 버튼 텍스트 참고
    // 데스크톱 네비게이션을 기준으로 테스트 (hidden md:block)
    // 모바일 메뉴는 별도의 테스트 케이스나 헬퍼 필요 가능성
    const blogLink = page.locator('header nav').getByRole('link', { name: 'Blog' });
    await expect(blogLink).toBeVisible();

    await blogLink.click();

    // URL이 블로그 페이지로 변경되었는지 확인
    await expect(page).toHaveURL(/.*\/blog/);
    // 블로그 페이지의 특정 제목이나 요소가 로드되었는지 추가로 확인 가능
    // 예: await expect(page.getByRole('heading', { name: /All Posts/i })).toBeVisible(); // 실제 블로그 페이지 제목으로 변경
  });

  test('should have a navigation bar with a "Portfolio" link and handle coming soon', async ({ page }) => {
    // "Portfolio" 링크는 isComingSoon: true 이므로 클릭 시 alert가 떠야 함.
    const portfolioLink = page.locator('header nav').getByRole('link', { name: 'Portfolio' });
    await expect(portfolioLink).toBeVisible();

    // alert를 처리하기 위한 핸들러 등록
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.dismiss(); // 또는 dialog.accept()
    });

    await portfolioLink.click();

    // Portfolio는 isComingSoon = true 이므로 페이지 이동은 일어나지 않음
    await expect(page).toHaveURL('/'); // 현재 페이지 URL 유지 확인
    // alert 메시지 확인
    expect(alertMessage).toBe('서비스 준비 중입니다...');
  });

  // 추가: 로그인 페이지로 이동하는 링크/버튼 테스트 (옵션)
  test('should navigate to login page from "Log In" link', async ({ page }) => {
    // Navbar.tsx에 따르면 로그아웃 상태일 때 "Log In" 링크가 표시됨
    const loginLink = page.locator('header').getByRole('link', { name: 'Log In' });
    // E2E 테스트는 일반적으로 로그아웃된 상태에서 시작하므로 이 링크가 보여야 함
    await expect(loginLink).toBeVisible();

    await loginLink.click();
    await expect(page).toHaveURL(/.*\/login/);
        // 로그인 폼의 특정 요소가 보이는지 확인
        await expect(page.getByRole('heading', { name: /로그인/i, level: 1 })).toBeVisible();
    } else {
        // 로그인 링크가 없다면 테스트 스킵 또는 다른 방식으로 처리
        console.log('Login link not found on homepage, skipping navigation to login page test.');
    }
  });
});
