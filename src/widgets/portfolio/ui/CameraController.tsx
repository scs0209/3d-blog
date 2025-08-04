import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as three from 'three';
import type { CameraAnimationRef, Position3D, FocusedGroup } from '@/entities/portfolio/model/types';
import {
  CAMERA_ANIMATION_DURATION,
  SECONDARY_ANIMATION_DURATION,
  easeInOutCubic,
  GROUP_CAMERA_TARGETS,
  INITIAL_CAMERA_POS,
  INITIAL_CAMERA_LOOK,
} from '@/entities/portfolio/model/constants';
import { useWorkCameraAnimation } from '@/features/portfolio/model/animations/use-work-camera-animation';
import { SECONDARY_ANIMATION_TARGETS } from '../consts';

type CameraControllerProps = {
  targetPos: Position3D | null;
  targetLook: Position3D | null;
  secondaryAnimation: boolean;
  aboutMeAnimationDone: boolean;
  aboutMeClosing: boolean;
  setCameraAnimationDone: (done: boolean) => void;
  setSecondaryAnimation: (animation: boolean) => void;
  setTargetPos: (pos: Position3D) => void;
  setTargetLook: (look: Position3D) => void;
  // 오버레이 관련
  cameraAnimationDone: boolean;
  hasClickedBack: boolean;
  focusedGroup: FocusedGroup;
  setShowAboutMeOverlay: (show: boolean) => void;
  setShowExperienceOverlay: (show: boolean) => void;
  setShowContactForm: (show: boolean) => void;
  // workAnimation에서만 사용되는 props들
  setFocusedGroup: (group: FocusedGroup) => void;
  setAboutMeClosing: (closing: boolean) => void;
  setAboutMeAnimationDone: (done: boolean) => void;
  onAboutMeAnimationComplete: () => void;
  // contact 역순 애니메이션용
  contactClosing: boolean;
  setContactClosing: (closing: boolean) => void;
  // 초기 애니메이션 관련
  isInitialAnimation?: boolean;
  // server 애니메이션용
  setShowWorksLoading: (show: boolean) => void;
  setShowCards: (show: boolean) => void;
  // 포트폴리오 EXIT 상태
  portfolioExiting: boolean;
};

export const CameraController = (props: CameraControllerProps) => {
  const {
    targetPos,
    targetLook,
    secondaryAnimation,
    aboutMeAnimationDone,
    aboutMeClosing,
    setCameraAnimationDone,
    setSecondaryAnimation,
    setTargetPos,
    setTargetLook,
    cameraAnimationDone,
    hasClickedBack,
    focusedGroup,
    setShowAboutMeOverlay,
    setShowExperienceOverlay,
    setShowContactForm,
    // workAnimation에서만 사용되는 props들
    setFocusedGroup,
    setAboutMeClosing,
    setAboutMeAnimationDone,
    // contact 역순 애니메이션용
    contactClosing,
    setContactClosing,
    // 초기 애니메이션 관련
    isInitialAnimation,
    // server 애니메이션용
    setShowWorksLoading,
    // 포트폴리오 EXIT 상태
    portfolioExiting,
  } = props;

  const { camera, clock } = useThree();
  const animRef = useRef<CameraAnimationRef>({
    start: 0,
    fromPos: [0, 0, 0],
    toPos: [0, 0, 0],
    fromLook: [0, 0, 0],
    toLook: [0, 0, 0],
    running: false,
    isSecondary: false,
  });

  // 각 모델별 애니메이션 훅들
  const workAnimation = useWorkCameraAnimation({
    focusedGroup,
    cameraAnimationDone,
    aboutMeClosing,
    secondaryAnimation,
    hasClickedBack,
    setShowAboutMeOverlay,
    setSecondaryAnimation,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setAboutMeClosing,
    setAboutMeAnimationDone,
    setCameraAnimationDone,
  });

  // Experience 모델 클릭 시 카메라 애니메이션 완료 후 처리
  useEffect(() => {
    if (focusedGroup === 'experience' && cameraAnimationDone && !secondaryAnimation && !hasClickedBack) {
      setShowExperienceOverlay(true);
    }
  }, [focusedGroup, cameraAnimationDone, secondaryAnimation, hasClickedBack, setShowExperienceOverlay]);

  // 카메라 애니메이션 시작
  // 언제 애니메이션을 시작할지 담당
  useEffect(() => {
    // 초기 애니메이션 중에는 카메라 애니메이션 실행하지 않음
    if (isInitialAnimation) {
      return;
    }

    // portfolioExiting 중이거나 기존 aboutMe 조건 만족 시 애니메이션 시작
    if (
      targetPos &&
      targetLook &&
      !animRef.current.running &&
      (portfolioExiting || aboutMeAnimationDone || !aboutMeClosing)
    ) {
      animRef.current.start = clock.getElapsedTime();
      // 애니메이션 시작 시 현재 카메라 위치를 시작점으로 설정
      animRef.current.fromPos = [camera.position.x, camera.position.y, camera.position.z];
      animRef.current.toPos = targetPos;
      // 카메라가 현재 바라보고 있는 방향 계산
      const dir = new three.Vector3();
      camera.getWorldDirection(dir);
      animRef.current.fromLook = [camera.position.x + dir.x, camera.position.y + dir.y, camera.position.z + dir.z];
      animRef.current.toLook = targetLook;
      animRef.current.running = true; // 애니메이션 실행 플래그 설정
      animRef.current.isSecondary = secondaryAnimation;
      setCameraAnimationDone(false);
    }
  }, [
    targetPos,
    targetLook,
    camera,
    aboutMeAnimationDone,
    aboutMeClosing,
    secondaryAnimation,
    setCameraAnimationDone,
    isInitialAnimation,
    clock,
    portfolioExiting,
  ]);

  // 카메라 애니메이션 업데이트
  // 어떻게 애니메이션을 실행하는지 담당
  useFrame(() => {
    if (animRef.current.running) {
      const elapsed = clock.getElapsedTime() - animRef.current.start;
      const duration = animRef.current.isSecondary ? SECONDARY_ANIMATION_DURATION : CAMERA_ANIMATION_DURATION;
      const t = Math.min(1, elapsed / duration);
      const eased = animRef.current.isSecondary ? t : easeInOutCubic(t);

      // position 보간
      const from = animRef.current.fromPos;
      const to = animRef.current.toPos;
      // useFrame에서 카메라 위치 업데이트
      camera.position.set(
        from[0] + (to[0] - from[0]) * eased,
        from[1] + (to[1] - from[1]) * eased,
        from[2] + (to[2] - from[2]) * eased,
      );

      // lookAt 보간
      const fromL = animRef.current.fromLook;
      const toL = animRef.current.toLook;
      // 카메라가 바라보는 지점 변경
      camera.lookAt(
        fromL[0] + (toL[0] - fromL[0]) * eased,
        fromL[1] + (toL[1] - fromL[1]) * eased,
        fromL[2] + (toL[2] - fromL[2]) * eased,
      );

      if (t === 1) {
        // 애니메이션 끝날 때 최종 위치로 확실히 고정
        camera.position.set(...animRef.current.toPos);
        camera.lookAt(...animRef.current.toLook);

        animRef.current.running = false;
        // 카메라 애니메이션 완료 플래그 설정
        setCameraAnimationDone(true);

        const needSecondaryAnimation = SECONDARY_ANIMATION_TARGETS.includes(focusedGroup);

        // 보조 애니메이션 트리거 (Work, Server, ContactMe, Radar, Resume, Skill)
        // portfolioExiting 중일 때는 server 제외
        if (
          !animRef.current.isSecondary &&
          (needSecondaryAnimation || (focusedGroup === 'server' && !portfolioExiting)) &&
          !aboutMeClosing &&
          !hasClickedBack &&
          focusedGroup
        ) {
          const target = GROUP_CAMERA_TARGETS[focusedGroup];
          if (target?.secondaryOffset && target?.secondaryLookAt) {
            {
              // Contact, Resume, Skill, Server 모델의 보조 애니메이션 트리거
              setSecondaryAnimation(true);
              const newPos: Position3D = [
                target.modelPosition[0] + target.secondaryOffset[0],
                target.modelPosition[1] + target.secondaryOffset[1],
                target.modelPosition[2] + target.secondaryOffset[2],
              ];
              // 보조 애니메이션 위치 설정 후 useEffect에서 카메라 애니메이션 다시 시작
              setTargetPos(newPos);
              setTargetLook(target.secondaryLookAt);
              setCameraAnimationDone(false);
            }
            return;
          }
        } else if (animRef.current.isSecondary && focusedGroup === 'radar' && contactClosing) {
          // Radar 모델의 보조 애니메이션 역순 완료 시 초기 위치로 복귀
          setSecondaryAnimation(false);
          setTargetPos(INITIAL_CAMERA_POS);
          setTargetLook(INITIAL_CAMERA_LOOK);
          setCameraAnimationDone(false);

          // 초기 위치 복귀 완료 후 완전 초기화 플래그 설정
          setTimeout(() => {
            setFocusedGroup(null);
            setContactClosing(false);
          }, CAMERA_ANIMATION_DURATION * 1000);
          return;
        } else if (animRef.current.isSecondary && focusedGroup === 'radar' && !hasClickedBack) {
          // Radar 모델의 보조 애니메이션 완료 시 Contact Form 표시
          setShowContactForm(true);
          setSecondaryAnimation(false);
          return;
        } else if (animRef.current.isSecondary && focusedGroup === 'work' && !hasClickedBack) {
          // Work 모델의 종료 처리
          workAnimation.handleWorkExit();
          return;
        } else if (animRef.current.isSecondary && focusedGroup === 'server' && !portfolioExiting) {
          // Server 모델의 보조 애니메이션 완료 처리 (portfolioExiting이 아닐 때만)
          setSecondaryAnimation(false);
          setShowWorksLoading(true);
          return;
        } else if (animRef.current.isSecondary && focusedGroup === 'contactMe') {
          // ContactMe 모델의 보조 애니메이션 완료 처리
          setSecondaryAnimation(false);
          return;
        } else if (animRef.current.isSecondary && focusedGroup === 'resumeConsole') {
          // ResumeConsole 모델의 보조 애니메이션 완료 처리
          setSecondaryAnimation(false);
          return;
        } else if (animRef.current.isSecondary && focusedGroup === 'skill') {
          // Skill 모델의 보조 애니메이션 완료 처리
          setSecondaryAnimation(false);
          return;
        } else if (animRef.current.isSecondary) {
          // 기타 모델들의 보조 애니메이션 완료 처리
          setSecondaryAnimation(false);
          return;
        }
        setSecondaryAnimation(false);
      }
    }
  });

  return null;
};
