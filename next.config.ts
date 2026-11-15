import type { NextConfig } from 'next';
import { STATIC_ASSET_CACHE_CONTROL } from './src/shared/lib/static-asset-cache';

const staticAssetCacheHeaders = [{ key: 'Cache-Control', value: STATIC_ASSET_CACHE_CONTROL }];

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  experimental: {
    // TypeScript 7은 JS Compiler API가 없어 로컬 tsc로 타입체크
    useTypeScriptCli: true,
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },
  // 예전 주소는 하나로 합친 새 주소로 넘긴다 (쿼리는 그대로 따라간다)
  async redirects() {
    return [
      { source: '/portfolio', destination: '/', permanent: true },
      { source: '/classic', destination: '/', permanent: true },
      { source: '/blog/all', destination: '/blog', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/cosmos/:path*',
        headers: staticAssetCacheHeaders,
      },
      {
        source: '/desk-os/:path*',
        headers: staticAssetCacheHeaders,
      },
      {
        source: '/:all*(glb|gltf|fbx|hdr|bin|woff|woff2)',
        headers: staticAssetCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
