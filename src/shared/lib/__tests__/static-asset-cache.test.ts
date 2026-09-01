import { describe, expect, test } from 'vitest';
import { isCacheableStaticAssetPath, STATIC_ASSET_CACHE_NAME } from '../static-asset-cache';

describe('isCacheableStaticAssetPath', () => {
  test('3D 모델과 폰트 확장자를 캐시한다', () => {
    expect(isCacheableStaticAssetPath('/WalkingAstro.glb')).toBe(true);
    expect(isCacheableStaticAssetPath('/Typing.fbx')).toBe(true);
    expect(isCacheableStaticAssetPath('/Inter-Bold.woff')).toBe(true);
    expect(isCacheableStaticAssetPath('/desk-os/audio/void-ambient.mp3')).toBe(true);
  });

  test('cosmos·desk-os 경로의 텍스처를 캐시한다', () => {
    expect(isCacheableStaticAssetPath('/cosmos/textures/dark_rock_nor_2k.jpg')).toBe(true);
    expect(isCacheableStaticAssetPath('/desk-os/world/baked_environment.jpg')).toBe(true);
  });

  test('HTML·API·일반 이미지는 캐시하지 않는다', () => {
    expect(isCacheableStaticAssetPath('/logo.png')).toBe(false);
    expect(isCacheableStaticAssetPath('/api/sidebar')).toBe(false);
    expect(isCacheableStaticAssetPath('/blog/all')).toBe(false);
    expect(isCacheableStaticAssetPath('/_next/static/chunks/main.js')).toBe(false);
  });

  test('서비스 워커 캐시 이름이 TS 상수와 같다', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const sw = readFileSync(join(process.cwd(), 'public/sw-asset-cache.js'), 'utf8');
    expect(sw).toContain(`const CACHE_NAME = '${STATIC_ASSET_CACHE_NAME}'`);
  });
});
