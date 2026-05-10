import * as THREE from 'three';
import type { CameraPosition } from '@/definitions/portfolio';

export const setupCamera = (initialPosition: CameraPosition) => {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
  camera.lookAt(0, 0, 0);

  return camera;
};
