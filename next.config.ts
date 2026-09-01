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
