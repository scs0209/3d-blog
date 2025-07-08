import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // 전역 API (describe, it 등) 사용 설정
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'], // 테스트 설정 파일 추가
    // coverage: { // 필요시 커버리지 설정 추가
    //   provider: 'v8', // or 'istanbul'
    //   reporter: ['text', 'json', 'html'],
    // },
    alias: { // 경로 별칭이 있다면 Vitest에도 동일하게 설정
      '@': path.resolve(__dirname, './src'),
      // 다른 경로 별칭들도 여기에 추가
    },
  },
  resolve: { // 경로 별칭을 Vite 자체에서도 인식하도록 설정 (옵션)
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 다른 경로 별칭들도 여기에 추가
    },
  },
});
