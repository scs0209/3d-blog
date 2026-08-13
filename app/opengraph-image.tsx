import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '3D Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(145deg, #2a1545 0%, #1c0e38 45%, #12082a 100%)',
          color: '#ffe8d0',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, color: '#ff9a3c', textTransform: 'uppercase' }}>
          3D TECH BLOG
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>웹 개발 기록과 3D 실험</div>
          <div style={{ fontSize: 28, color: '#d4a8c0' }}>Next.js · Three.js · React Three Fiber</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#ffc8a0' }}>3D Blog</div>
      </div>
    ),
    { ...size },
  );
}
