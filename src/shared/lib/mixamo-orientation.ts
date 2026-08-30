import type { Group } from 'three';
import * as three from 'three';

export const MIXAMO_CLIP = 'Armature|mixamo.com|Layer0';

const uprightQ = new three.Quaternion();
const yawQ = new three.Quaternion();
const axisX = new three.Vector3(1, 0, 0);
const axisY = new three.Vector3(0, 1, 0);

/** Mixamo Y-up 스켈레톤을 지면에 세운 뒤 이동 방향으로 회전 */
export const applyMixamoWalkOrientation = (root: Group, dx: number, dz: number) => {
  uprightQ.setFromAxisAngle(axisX, Math.PI / 2);
  yawQ.setFromAxisAngle(axisY, Math.atan2(dx, dz));
  root.quaternion.multiplyQuaternions(yawQ, uprightQ);
};

export const playMixamoWalk = (walk: three.AnimationAction | null) => {
  if (!walk) {
    return;
  }
  walk.enabled = true;
  walk.paused = false;
  walk.setEffectiveWeight(1);
  if (!walk.isRunning()) {
    walk.play();
  }
};

export const pauseMixamoWalkIdle = (walk: three.AnimationAction | null, time = 0.18) => {
  if (!walk) {
    return;
  }
  walk.enabled = true;
  walk.setEffectiveWeight(1);
  if (!walk.isRunning()) {
    walk.play();
  }
  walk.paused = true;
  walk.time = time;
};
