import { create, act } from '@react-three/test-renderer';
import { vi } from 'vitest';
import { CubeModel } from '../Cube'; // 경로 확인
import * as drei from '@react-three/drei'; // useGLTF를 mock하기 위해

// useGLTF mock 설정
const mockUseGLTF = vi.fn();
// useGLTF.preload도 mock 해야 함
mockUseGLTF.preload = vi.fn();

// @react-three/drei 모듈에서 useGLTF만 mock하도록 설정
vi.mock('@react-three/drei', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useGLTF: mockUseGLTF,
  };
});

// document.body.style.cursor를 mock (jsdom 환경에서는 실제 body.style이 없음)
const mockCursorSet = vi.fn();
Object.defineProperty(document.body.style, 'cursor', {
  get: () => mockCursorSet.mock.calls.length > 0 ? mockCursorSet.mock.calls[mockCursorSet.mock.calls.length - 1][0] : 'auto',
  set: mockCursorSet,
});


describe('CubeModel with @react-three/test-renderer', () => {
  const mockOnClick = vi.fn();
  const defaultProps = {
    position: [1, 2, 3] as [number, number, number],
    onClick: mockOnClick,
  };

  const mockGLTFResult = {
    nodes: {
      Cube_Material_0: { // geometry를 포함하는 mock 객체
        geometry: { uuid: 'mockGeometry-uuid' }, // 실제 geometry 객체 대신 고유 식별자나 간단한 객체
      },
    },
    materials: {
      Material: { uuid: 'mockMaterial-uuid' }, // 실제 material 객체 대신 고유 식별자나 간단한 객체
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGLTF.mockReturnValue(mockGLTFResult);
    // mockCursorSet.mockClear(); // 위에서 setter를 mock했으므로 이걸로 초기화
    document.body.style.cursor = 'auto'; // mockCursorSet을 통해 'auto'로 설정됨
    mockCursorSet.mockClear(); // 호출 기록만 초기화
  });

  test('renders correctly and applies initial props', async () => {
    const renderer = await create(<CubeModel {...defaultProps} />);
    const group = renderer.scene.children[0]; // 최상위 group

    expect(group.type).toBe('Group');
    expect(group.props.position).toEqual(defaultProps.position);
    expect(group.props.scale).toEqual(0.5);

    const interactionGroup = group.children[0]; // 클릭 이벤트가 있는 내부 group
    expect(interactionGroup.type).toBe('Group');

    const mesh = interactionGroup.children[0]; // mesh
    expect(mesh.type).toBe('Mesh');
    expect(mesh.props.geometry).toEqual(mockGLTFResult.nodes.Cube_Material_0.geometry);
    expect(mesh.props.material).toEqual(mockGLTFResult.materials.Material);
    expect(mesh.props.scale).toEqual(100);
  });

  test('calls useGLTF with the correct path and preloads it', async () => {
    await create(<CubeModel {...defaultProps} />);
    expect(mockUseGLTF).toHaveBeenCalledWith('/tesseract_cube.glb');
    // useGLTF.preload는 CubeModel 컴포넌트 파일의 최하단에서 호출됩니다.
    // vi.mock('@react-three/drei', ...)에서 useGLTF가 mockUseGLTF로 대체되었고,
    // mockUseGLTF.preload = vi.fn()으로 설정했으므로, mockUseGLTF.preload를 확인해야 합니다.
    expect(mockUseGLTF.preload).toHaveBeenCalledWith('/tesseract_cube.glb');
  });

  test('handles onClick event', async () => {
    const renderer = await create(<CubeModel {...defaultProps} />);
    const interactionGroup = renderer.scene.children[0].children[0]; // 내부 group

    // onClick prop이 있는지 확인
    expect(interactionGroup.props.onClick).toBeDefined();

    // 이벤트 시뮬레이션 (stopPropagation을 mock해야 할 수도 있음)
    const mockStopPropagation = vi.fn();
    await act(async () => {
      interactionGroup.props.onClick({ stopPropagation: mockStopPropagation });
    });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockStopPropagation).toHaveBeenCalledTimes(1);
  });

  test('handles pointerOver and pointerOut events for cursor change', async () => {
    const renderer = await create(<CubeModel {...defaultProps} />);
    const interactionGroup = renderer.scene.children[0].children[0];

    expect(interactionGroup.props.onPointerOver).toBeDefined();
    expect(interactionGroup.props.onPointerOut).toBeDefined();

    const mockStopPropagation = vi.fn();

    await act(async () => {
      interactionGroup.props.onPointerOver({ stopPropagation: mockStopPropagation });
    });
    expect(mockCursorSet).toHaveBeenLastCalledWith('pointer');
    expect(mockStopPropagation).toHaveBeenCalledTimes(1);

    mockStopPropagation.mockClear(); // 이전 호출 초기화

    await act(async () => {
      interactionGroup.props.onPointerOut({ stopPropagation: mockStopPropagation });
    });
    expect(mockCursorSet).toHaveBeenLastCalledWith('auto');
    expect(mockStopPropagation).toHaveBeenCalledTimes(1);
  });

  test('useFrame updates rotation (conceptual)', async () => {
    const renderer = await create(<CubeModel {...defaultProps} />);
    const interactionGroup = renderer.scene.children[0].children[0]; // cubeRef가 가리키는 group

    const initialRotationY = interactionGroup.instance.rotation.y;

    // advanceFrames를 사용하여 프레임 진행 및 시간 경과 시뮬레이션
    // 1프레임, 16ms (60fps 기준) 경과
    await act(async () => {
      renderer.advanceFrames(1, 1/60);
    });

    // useFrame 내부 로직: cubeRef.current.rotation.y += delta * 0.5;
    // delta는 1/60 (약 0.01666)
    // 예상 증가량: (1/60) * 0.5
    const expectedIncrease = (1/60) * 0.5;
    expect(interactionGroup.instance.rotation.y).toBeCloseTo(initialRotationY + expectedIncrease);

    // 여러 프레임 진행
    await act(async () => {
      renderer.advanceFrames(10, 1/60);
    });
    expect(interactionGroup.instance.rotation.y).toBeCloseTo(initialRotationY + expectedIncrease * 11); // (10+1) 프레임
  });

  test('matches initial snapshot of the scene', async () => {
    const renderer = await create(<CubeModel {...defaultProps} />);
    // renderer.scene은 Three.js 객체이므로 toMatchSnapshot()에 직접 사용하기 부적합할 수 있음
    // renderer.toGraph() 와 같은 API로 JSON 직렬화 가능한 형태로 변환하거나,
    // 주요 노드의 props를 스냅샷으로 만드는 것이 더 일반적입니다.
    // 여기서는 주요 요소들의 props를 스냅샷으로 만듭니다.
    const group = renderer.scene.children[0];
    const interactionGroup = group.children[0];
    const mesh = interactionGroup.children[0];

    const snapshotData = {
      groupProps: { position: group.props.position, scale: group.props.scale },
      interactionGroupType: interactionGroup.type, // ref는 props에 직접 나타나지 않음
      meshProps: {
        geometry: mesh.props.geometry,
        material: mesh.props.material,
        scale: mesh.props.scale,
        rotation: mesh.props.rotation, // 초기 rotation 값
      },
    };
    expect(snapshotData).toMatchSnapshot();
  });
});
