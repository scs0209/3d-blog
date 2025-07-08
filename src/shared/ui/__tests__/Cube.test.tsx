import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { CubeModel } from '../Cube'; // 경로 확인

// @react-three/drei 와 @react-three/fiber 는 tests/setup.ts 에서 이미 mock 되어 있음
// useGLTF 에 대한 mock을 좀 더 구체화할 필요가 있음
const mockUseGLTF = vi.fn();

vi.mock('@react-three/drei', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useGLTF: mockUseGLTF, // 여기서 useGLTF를 mock 함수로 대체
  };
});

describe('CubeModel', () => {
  const mockOnClick = vi.fn();
  const defaultProps = {
    position: [0, 0, 0] as [number, number, number],
    onClick: mockOnClick,
  };

  beforeEach(() => {
    // 각 테스트 전에 useGLTF mock을 기본값으로 설정
    mockUseGLTF.mockReturnValue({
      nodes: {
        Cube_Material_0: { // geometry를 포함하는 mock 객체
          geometry: 'mockGeometry', // 실제 geometry 객체 대신 간단한 문자열 또는 객체
        },
      },
      materials: {
        Material: 'mockMaterial', // 실제 material 객체 대신 간단한 문자열 또는 객체
      },
    });
    vi.clearAllMocks();
    document.body.style.cursor = 'auto'; // 테스트 시작 전 커서 스타일 초기화
  });

  it('renders correctly without errors', () => {
    const { container } = render(<CubeModel {...defaultProps} />);
    // <group> 요소가 렌더링 되는지 (실제로는 tests/setup.ts의 mock Canvas 내부의 div로 렌더링됨)
    // data-testid 등을 CubeModel의 최상위 group에 추가하면 더 명확하게 찾을 수 있음
    expect(container.firstChild).toBeInTheDocument();
    // useGLTF.preload도 호출되는지 확인 (Cube.tsx 파일 하단에 있음)
    // preload는 useGLTF의 속성으로 mock해야 함
  });

  it('calls useGLTF with the correct path and preloads it', () => {
    // useGLTF.preload를 mock
    const mockPreload = vi.fn();
    mockUseGLTF.preload = mockPreload; // preload 함수를 mockUseGLTF 객체에 할당

    render(<CubeModel {...defaultProps} />);
    expect(mockUseGLTF).toHaveBeenCalledWith('/tesseract_cube.glb');
    expect(mockPreload).toHaveBeenCalledWith('/tesseract_cube.glb');
  });

  it('calls onClick handler when the group is clicked', () => {
    // CubeModel 내부의 클릭 가능한 group에 data-testid를 추가하면 선택이 용이함
    // 현재는 <group>이 특별한 role이나 text를 가지지 않으므로,
    // CubeModel 최상단 group에 data-testid="cube-model-group"을 추가했다고 가정.
    // Cube.tsx: <group {...props} data-testid="cube-model-clickable-group" dispose={null} scale={0.5} position={position}>
    // 내부 클릭 대상 group에 testid를 추가하는 것이 더 정확함.
    //   <group ref={cubeRef} data-testid="clickable-cube-mesh-group" onClick ... >

    // 여기서는 컴포넌트의 최상위 요소(div로 mock된 group)를 가져와서 테스트
    const { container } = render(<CubeModel {...defaultProps} />);
    const clickableGroup = container.querySelector('[scale="0.5"]'); // 좀 더 구체적인 selector 필요

    // 만약 CubeModel의 <group ref={cubeRef} ... /> 에 data-testid="inner-cube"를 추가했다면:
    // render(<CubeModel {...defaultProps} data-testid="outer-group" />);
    // const innerCube = screen.getByTestId('inner-cube'); // 이 방식이 더 좋음
    // fireEvent.click(innerCube);

    // 현재 코드에서는 최상위 group의 자식 group이 클릭 이벤트를 가짐
    // <mesh>를 포함하는 group을 찾아야 함.
    // CubeModel의 <group ref={cubeRef} ...> 에 data-testid="cube-interaction-group" 를 추가하면 좋음
    // 지금은 일단 첫번째 group을 클릭한다고 가정. (실제로는 div로 렌더링됨)
    const firstGroupElement = container.querySelector('div > div'); // Canvas mock > Group mock
    if (firstGroupElement) {
      fireEvent.click(firstGroupElement);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    } else {
      throw new Error("Clickable group element not found. Consider adding a data-testid.");
    }
  });

  it('changes cursor style on pointer over and out', () => {
    // 위와 마찬가지로 data-testid를 사용하는 것이 좋음
    const { container } = render(<CubeModel {...defaultProps} />);
    const firstGroupElement = container.querySelector('div > div');

    if (firstGroupElement) {
      fireEvent.pointerOver(firstGroupElement);
      expect(document.body.style.cursor).toBe('pointer');

      fireEvent.pointerOut(firstGroupElement);
      expect(document.body.style.cursor).toBe('auto');
    } else {
      throw new Error("Interactive group element not found for pointer events.");
    }
  });

  // useFrame의 호출 자체를 테스트하기는 어려우나,
  // useFrame이 tests/setup.ts에서 mock처리 되어 있으므로,
  // 해당 mock이 의도대로 동작하는지 (예: 특정 함수를 호출하거나 상태를 변경) 간접적으로 확인할 수 있음.
  // 여기서는 useFrame이 사용되고 있다는 사실에 대한 테스트는 생략하고,
  // 렌더링 및 이벤트 핸들러에 집중.

  it('matches snapshot', () => {
    const { container } = render(<CubeModel {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
