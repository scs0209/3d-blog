import { Html } from '@react-three/drei';

/** useProgress는 에셋 로드 중 다른 컴포넌트 렌더에서 setState를 유발할 수 있어 사용하지 않음 */
export const CanvasLoader = () => {
  return (
    <Html
      as='div'
      center
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div role='status' aria-live='polite'>
        <span className='canvas-loader' />
        <p
          style={{
            fontSize: 14,
            color: '#F1F1F1',
            fontWeight: 800,
            marginTop: 40,
          }}
        >
          Loading…
        </p>
      </div>
    </Html>
  );
};
