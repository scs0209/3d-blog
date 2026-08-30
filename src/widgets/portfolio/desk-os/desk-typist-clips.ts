/** 포트폴리오 데스크 타이피스트 — Typing.glb(Pele) + Mixamo FBX 클립 */
export const DESK_TYPIST_CLIPS = {
  model: '/Typing.glb',
  sitToStand: '/desk-os/animations/SitToStand.fbx',
  rightTurn: '/desk-os/animations/RightTurn90.fbx',
  walk: '/desk-os/animations/Walking.fbx',
} as const;

export const MIXAMO_GLB_CLIP = 'Armature|mixamo.com|Layer0';
export const MIXAMO_FBX_CLIP = 'mixamo.com';

/** Mixamo FBX export 기본 클립 (duration > 0) */
export const pickMixamoFbxClip = (clips: { name: string; duration: number }[]) =>
  clips.find((clip) => clip.name === MIXAMO_FBX_CLIP && clip.duration > 0) ??
  clips.find((clip) => clip.duration > 0) ??
  clips[0];

export const pickTypingClip = (clips: { duration: number }[]) =>
  clips.reduce((longest, clip) => (clip.duration > longest.duration ? clip : longest));
