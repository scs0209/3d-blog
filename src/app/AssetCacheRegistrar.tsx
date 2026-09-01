'use client';

import { useEffect } from 'react';
import { STATIC_ASSET_SERVICE_WORKER_URL } from '@/shared/lib/static-asset-cache';

const registerAssetCacheWorker = () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (!('serviceWorker' in navigator)) {
    return;
  }

  const handleLoad = () => {
    void navigator.serviceWorker.register(STATIC_ASSET_SERVICE_WORKER_URL, { scope: '/' });
  };

  if (document.readyState === 'complete') {
    handleLoad();
    return;
  }

  window.addEventListener('load', handleLoad, { once: true });
};

export const AssetCacheRegistrar = () => {
  useEffect(() => {
    registerAssetCacheWorker();
  }, []);

  return null;
};
