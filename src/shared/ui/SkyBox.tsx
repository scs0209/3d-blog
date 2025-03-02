import { useThree } from '@react-three/fiber';

import { CubeTextureLoader } from 'three';

const SkyBox = () => {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  const texture = loader.load([
    './space/right.png',
    './space/left.png',
    './space/top.png',
    './space/bottom.png',
    './space/front.png',
    './space/back.png',
  ]);
  scene.background = texture;
  return null;
};

export default SkyBox;
