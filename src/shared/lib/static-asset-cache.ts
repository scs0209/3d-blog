/** 해시 없는 public 3D/폰트. 7일 신선, 이후에도 stale 제공하며 재검증 */
export const STATIC_ASSET_CACHE_CONTROL = 'public, max-age=604800, stale-while-revalidate=31536000';

export const STATIC_ASSET_CACHE_NAME = '3d-blog-static-v1';

const CACHEABLE_FILE_RE = /\.(?:glb|gltf|fbx|hdr|bin|woff2?|mp3|ogg|wav)$/i;
const CACHEABLE_PATH_RE = /^\/(?:cosmos|desk-os)\//;

export const isCacheableStaticAssetPath = (pathname: string) =>
  CACHEABLE_FILE_RE.test(pathname) || CACHEABLE_PATH_RE.test(pathname);

export const STATIC_ASSET_SERVICE_WORKER_URL = '/sw-asset-cache.js';
