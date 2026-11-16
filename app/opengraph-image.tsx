import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '3D Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        background: '#050608',
        color: '#e9edf1',
      }}
    >
      <div style={{ display: 'flex', fontSize: 28, color: '#4de3ff' }}>AYAAN</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>웹 개발 기록과 3D 실험</div>
        <div style={{ fontSize: 28, color: '#8d98a3' }}>Next.js · Three.js · React Three Fiber</div>
      </div>
      <div style={{ display: 'flex', fontSize: 24, color: '#8d98a3' }}>Frontend Developer</div>
    </div>,
    { ...size },
  );
}
