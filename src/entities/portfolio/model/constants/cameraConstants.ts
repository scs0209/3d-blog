import type { CameraTarget, Position3D } from '../types';

export const INITIAL_CAMERA_POS: Position3D = [2, 5, 2.5]; // 초기 카메라 위치
export const INITIAL_CAMERA_LOOK: Position3D = [0, 0, 0]; // 초기 카메라 바라보는 방향

export const CAMERA_ANIMATION_DURATION = 3; // 3초
export const SECONDARY_ANIMATION_DURATION = 1;
export const CAMERA_ANIMATION_DELAY = 3000; // 3초

export const GROUP_CAMERA_TARGETS: Record<string, CameraTarget> = {
  work: {
    offset: [1, 2, 0],
    lookAt: [4.2, 0, 0],
    pulse: [4.2, 0, 0],
    modelPosition: [4, 0, 0],
    secondaryOffset: [0.7, 0.5, 2.7],
    secondaryLookAt: [0, 0, 0],
  },
  server: {
    offset: [0, 2.5, 1.5],
    lookAt: [0, 1, -4],
    pulse: [0, 0, -4],
    modelPosition: [0, 1, -4],
    secondaryOffset: [0.3, -0.38, 0.6],
    secondaryLookAt: [0.3, 0.3, -4],
  },
  experience: {
    // 모델의 절대 위치
    modelPosition: [-1, -0.5, 3],

    // 첫 번째 애니메이션: 모델 기준 상대 위치
    offset: [0, 1, 2],
    // 실제 첫 번째 카메라 위치 = modelPosition + offset
    // = [-1, -0.5, 3] + [0, 1, 2] = [-1, 0.5, 5]

    // 첫 번째 애니메이션에서 카메라가 바라보는 절대 좌표 (모델을 일직선으로 바라봄)
    lookAt: [-1, -0.5, 3],

    // 클릭 시 펄스 효과 위치
    pulse: [1.75, 0, 4.15],

    // 두 번째 애니메이션: 카메라를 살짝 위로 올림
    secondaryOffset: [0, 1.5, 2],
    // 실제 두 번째 카메라 위치 = modelPosition + secondaryOffset
    // = [-1, -0.5, 3] + [0, 1.5, 2] = [-1, 1.0, 5] (y축으로 0.5 상승)

    // 두 번째 애니메이션에서 카메라가 바라보는 절대 좌표 (책상/사람 중심)
    secondaryLookAt: [-1, 1, 4],
  },
  home: {
    offset: [2, 0.5, 0], // 첫 번째 카메라: [-2, 0.5, -0.1]
    lookAt: [-4, 0, -0.1],
    pulse: [-4, 0, -0.1],
    modelPosition: [-4, 0, -0.1],
    secondaryOffset: [0.3, 0.5, 0], // 두 번째 카메라: [-4.7, 0.5, -0.1] (문에 훨씬 더 가까이)
    secondaryLookAt: [-4.7, 0.5, -0.1],
  },
  resumeConsole: {
    // 모델 위치를 기준으로 카메라가 상대적으로 얼마나 떨어진 곳에 위치할지
    // 실제 카메라 위치 = 모델 위치 + offset = [3.2, 0, -2.8] + [1.5, 1.0, 0] = [4.7, 1.0, -2.8]
    offset: [1.5, 1.0, 0],
    // 카메라가 바라보는 절대 좌표(어디를 향해 보는지)
    lookAt: [3.2, 0, -2.8],
    // 카메라 펄스 위치(카메라가 펄스 효과를 주는 위치)
    pulse: [3.2, 0, -2.8],
    // 모델 위치(카메라가 바라보는 대상)
    modelPosition: [3.2, 0, -2.8],
    // 보조 애니메이션 시 카메라 위치
    // 실제 카메라 위치 = 모델 위치 + offset = [3.2, 0, -2.8] + [1.5, 1.0, 0.8] = [4.7, 1.0, -2.0]
    secondaryOffset: [1.5, 1.0, 0.8],
    // 보조 애니메이션 시 카메라가 바라보는 절대 좌표(어디를 향해 보는지)
    secondaryLookAt: [3.2, 0, -2.0],
  },
  radar: {
    offset: [1.6, 2.4, 1.6], // lookAt에서 1.3배 거리만큼 떨어진 위치
    lookAt: [-3, 0, -3.5],
    pulse: [-3, 0, -3.5],
    modelPosition: [-3, 0, -3.5],
    secondaryOffset: [1.6 - 1.2, 2.4, 1.6 + 1.2], // [0.4, 2.4, 2.8]
    secondaryLookAt: [-3 - 1.2, 0, -3.5 + 1.2], // [-4.2, 0, -2.3]
  },
  skill: {
    // 모델의 절대 위치
    modelPosition: [1.5, 0, 1.5],

    // 첫 번째 애니메이션: 모델 기준 상대 위치
    offset: [1, 1.5, 1],
    // 실제 첫 번째 카메라 위치 = modelPosition + offset
    // = [1.5, 0, 1.5] + [1, 1.5, 1] = [2.5, 1.5, 2.5]

    // 첫 번째 애니메이션에서 카메라가 바라보는 절대 좌표
    lookAt: [1.5, 0, 1.5], // 모델을 정면으로 바라봄

    // 클릭 시 펄스 효과 위치 (보통 모델 위치와 동일)
    pulse: [1.5, 0, 1.5],

    // 두 번째 애니메이션: 모델 기준 상대 위치 (더 많이 움직이도록 조정)
    secondaryOffset: [2.5, 1.5, -0.5],
    // 실제 두 번째 카메라 위치 = modelPosition + secondaryOffset
    // = [1.5, 0, 1.5] + [2.5, 1.5, -0.5] = [4, 1.5, 1]

    // 카메라 이동 벡터 = 두 번째 위치 - 첫 번째 위치
    // = [4, 1.5, 1] - [2.5, 1.5, 2.5] = [1.5, 0, -1.5]

    // 평행 이동을 위해 lookAt도 같은 벡터만큼 이동
    // 두 번째 lookAt = 첫 번째 lookAt + 카메라 이동 벡터
    // = [1.5, 0, 1.5] + [1.5, 0, -1.5] = [3, 0, 0]
    secondaryLookAt: [3, 0, 0],
  },
};
