import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  experimental: {
    // TypeScript 7은 JS Compiler API가 없어 로컬 tsc로 타입체크
    useTypeScriptCli: true,
  },
};

export default nextConfig;
