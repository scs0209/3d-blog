/**
 * AboutMe 페이지 애니메이션 설정
 */
export const ABOUT_ME_ANIMATION_CONFIG = {
  SLIDE_DURATION: 0.5,
  DROP_DURATION: 0.7,
  BORDER_BASE_DURATION: 0.28,
  BORDER_SECONDARY_DURATION: 0.18,

  // 지연 시간 관련
  CONTENT_FADE_DELAY: 0.3,
  CONTENT_FADE_DURATION: 0.4,
  LABEL_DURATION: 0.22,
  LABEL_OFFSET: 0.82,
  LABEL_EXIT_OFFSET: 0.72,

  // 섹션 stagger
  SECTION_STAGGER: 0.5,
} as const;

/**
 * 섹션별 border 애니메이션 지연 시간 계산
 */
export const calculateBorderDelay = (sectionCount: number) => {
  return sectionCount * ABOUT_ME_ANIMATION_CONFIG.SECTION_STAGGER + 0.2;
};

/**
 * 섹션 인덱스에 따른 기본 지연 시간 계산
 */
export const calculateSectionBaseDelay = (sectionIndex: number, sectionCount: number, isClosing: boolean): number => {
  const { DROP_DURATION, SLIDE_DURATION, SECTION_STAGGER } = ABOUT_ME_ANIMATION_CONFIG;
  const closingOffset = isClosing ? DROP_DURATION + SLIDE_DURATION : 0;
  return isClosing
    ? closingOffset + (sectionCount - 1 - sectionIndex) * SECTION_STAGGER
    : sectionIndex * SECTION_STAGGER;
};

/**
 * border 애니메이션 순서별 지연 시간 계산
 */
export const calculateBorderTiming = (baseDelay: number, isClosing: boolean) => {
  const { BORDER_BASE_DURATION, BORDER_SECONDARY_DURATION } = ABOUT_ME_ANIMATION_CONFIG;

  /**
   * 닫기 애니메이션(isClosing: true)은 열기 애니메이션의 역순으로 진행됩니다.
   * (열기 순서: bottom → right → top → left)
   * baseDelay를 기준으로 이전 단계의 duration만큼 시간을 빼서 시작 시점을 앞당겨 역순 재생을 구현합니다.
   */
  return {
    bottom: {
      delay: baseDelay,
      duration: BORDER_BASE_DURATION,
    },
    right: {
      delay: isClosing ? baseDelay - BORDER_SECONDARY_DURATION : baseDelay + BORDER_BASE_DURATION,
      duration: BORDER_SECONDARY_DURATION,
    },
    top: {
      delay: isClosing
        ? baseDelay - BORDER_SECONDARY_DURATION * 2
        : baseDelay + BORDER_BASE_DURATION + BORDER_SECONDARY_DURATION,
      duration: BORDER_SECONDARY_DURATION,
    },
    left: {
      delay: isClosing
        ? baseDelay - BORDER_SECONDARY_DURATION * 3
        : baseDelay + BORDER_BASE_DURATION + BORDER_SECONDARY_DURATION * 2,
      duration: BORDER_SECONDARY_DURATION,
    },
  };
};

/**
 * 닫기 애니메이션 총 시간 계산
 */
export const calculateTotalCloseTime = (sectionCount: number) => {
  const { SLIDE_DURATION, LABEL_OFFSET, SECTION_STAGGER } = ABOUT_ME_ANIMATION_CONFIG;
  const sectionCardsAnimationTime = sectionCount * SECTION_STAGGER + LABEL_OFFSET;
  return SLIDE_DURATION + sectionCardsAnimationTime;
};
