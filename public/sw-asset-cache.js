/* 3D/폰트 런타임 캐시. 첫 요청만 네트워크, 재방문은 Cache Storage를 먼저 반환한다.
 * 매칭 규칙은 src/shared/lib/static-asset-cache.ts 와 같게 유지한다.
 */
const CACHE_PREFIX = '3d-blog-static-';
const CACHE_NAME = '3d-blog-static-v1';
const CACHEABLE_FILE_RE = /\.(?:glb|gltf|fbx|hdr|bin|woff2?|mp3|ogg|wav)$/i;
const CACHEABLE_PATH_RE = /^\/(?:cosmos|desk-os)\//;

const isCacheableStaticAssetRequest = (request) => {
  if (request.method !== 'GET') {
    return false;
  }

  if (request.headers.has('range')) {
    return false;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return false;
  }

  return CACHEABLE_FILE_RE.test(url.pathname) || CACHEABLE_PATH_RE.test(url.pathname);
};

const updateCachedAsset = async (cache, request) => {
  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (!isCacheableStaticAssetRequest(event.request)) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);

      if (cached) {
        event.waitUntil(updateCachedAsset(cache, event.request).catch(() => undefined));
        return cached;
      }

      return updateCachedAsset(cache, event.request);
    })(),
  );
});
