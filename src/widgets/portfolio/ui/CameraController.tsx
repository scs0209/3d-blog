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
      console.log('Experience: 카메라 애니메이션 완료, Experience 오버레이 표시');
      setShowExperienceOverlay(true);
    }
  }, [focusedGroup, cameraAnimationDone, secondaryAnimation, hasClickedBack, setShowExperienceOverlay]);

  // ResumeConsole 모델 클릭 시 카메라 애니메이션 완료 후 처리
  useEffect(() => {
    if (focusedGroup === 'resumeConsole' && cameraAnimationDone && !secondaryAnimation && !hasClickedBack) {
      console.log('ResumeConsole: 카메라 애니메이션 완료, 뒤로가기 버튼으로 복귀 가능');
      // 자동 복귀 없이 사용자가 직접 뒤로가기 버튼을 누를 때까지 유지
    }
  }, [focusedGroup, cameraAnimationDone, secondaryAnimation, hasClickedBack]);

  // 카메라 애니메이션 시작
  useEffect(() => {
    // 초기 애니메이션 중에는 카메라 애니메이션 실행하지 않음
    if (isInitialAnimation) {
      return;
    }

    if (targetPos && targetLook && (aboutMeAnimationDone || !aboutMeClosing)) {
      console.log('카메라 애니메이션 시작:', { targetPos, targetLook, secondaryAnimation });
      animRef.current.start = clock.getElapsedTime();
      animRef.current.fromPos = [camera.position.x, camera.position.y, camera.position.z];
      animRef.current.toPos = targetPos;
      const dir = new three.Vector3();
      camera.getWorldDirection(dir);
      animRef.current.fromLook = [camera.position.x + dir.x, camera.position.y + dir.y, camera.position.z + dir.z];
      animRef.current.toLook = targetLook;
      animRef.current.running = true;
      animRef.current.isSecondary = secondaryAnimation;
      setCameraAnimationDone(false);
    }
  }, [
    targetPos,
    targetLook,
    clock,
    camera,
    aboutMeAnimationDone,
    aboutMeClosing,
    secondaryAnimation,
    setCameraAnimationDone,
    isInitialAnimation, // 의존성 추가
  ]);

  // 카메라 애니메이션 업데이트
  useFrame(() => {
    if (animRef.current.running) {
      const elapsed = clock.getElapsedTime() - animRef.current.start;
      const duration = animRef.current.isSecondary ? SECONDARY_ANIMATION_DURATION : CAMERA_ANIMATION_DURATION;
      const t = Math.min(1, elapsed / duration);
      const eased = animRef.current.isSecondary ? t : easeInOutCubic(t);

      // position 보간
      const from = animRef.current.fromPos;
      const to = animRef.current.toPos;
      camera.position.set(
        from[0] + (to[0] - from[0]) * eased,
        from[1] + (to[1] - from[1]) * eased,
        from[2] + (to[2] - from[2]) * eased,
      );

      // lookAt 보간
      const fromL = animRef.current.fromLook;
      const toL = animRef.current.toLook;
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
        console.log('카메라 애니메이션 완료:', {
          focusedGroup,
          isSecondary: animRef.current.isSecondary,
          contactClosing,
          hasClickedBack,
        });
        setCameraAnimationDone(true);

        // 보조 애니메이션 트리거 (Work, Server, ContactMe, Radar, Resume, Skill)
        if (
          !animRef.current.isSecondary &&
          (focusedGroup === 'work' ||
            focusedGroup === 'server' ||
            focusedGroup === 'contactMe' ||
            focusedGroup === 'radar' ||
            focusedGroup === 'resumeConsole' ||
            focusedGroup === 'skill') &&
          !aboutMeClosing &&
          !hasClickedBack
        ) {
          const target = GROUP_CAMERA_TARGETS[focusedGroup];
          if (target?.secondaryOffset && target?.secondaryLookAt) {
            console.log(`${focusedGroup}: 보조 애니메이션 트리거`);
            if (focusedGroup === 'work') {
              workAnimation.triggerSecondaryAnimation();
            } else if (
              focusedGroup === 'radar' ||
              focusedGroup === 'contactMe' ||
              focusedGroup === 'resumeConsole' ||
              focusedGroup === 'skill' ||
              focusedGroup === 'server'
            ) {
              // Contact, Resume, Skill, Server 모델의 보조 애니메이션 트리거
              console.log(`${focusedGroup}: ${focusedGroup} 보조 애니메이션 시작`);
              setSecondaryAnimation(true);
              const newPos: Position3D = [
                target.modelPosition[0] + target.secondaryOffset[0],
                target.modelPosition[1] + target.secondaryOffset[1],
                target.modelPosition[2] + target.secondaryOffset[2],
              ];
              setTargetPos(newPos);
              setTargetLook(target.secondaryLookAt);
              setCameraAnimationDone(false);
            }
            // 다른 모델들도 필요시 보조 애니메이션 추가
            return;
          }
        } else if (animRef.current.isSecondary && focusedGroup === 'radar' && contactClosing) {
          // Radar 모델의 보조 애니메이션 역순 완료 시 초기 위치로 복귀
          console.log(`${focusedGroup}: 보조 애니메이션 역순 완료, 초기 위치로 복귀`);
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
          console.log(`${focusedGroup}: 보조 애니메이션 완료, Contact Form 표시`);
          setShowContactForm(true);
          setSecondaryAnimation(false);
          return;
        } else if (animRef.current.isSecondary && focusedGroup === 'work' && aboutMeClosing) {
          // Work 모델의 종료 처리
          workAnimation.handleWorkExit();
          return;
        } else if (animRef.current.isSecondary) {
          // 다른 그룹들의 보조 애니메이션 완료 처리
          setSecondaryAnimation(false);
          return;
        }
        setSecondaryAnimation(false);
      }
    }
  });

  return null;
};
