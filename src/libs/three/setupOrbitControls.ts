import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const setupOrbitControls = (camera: any, domElement: HTMLElement) => {
  const controls = new OrbitControls(camera, domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.rotateSpeed = 0.45;
  controls.target.set(0, 0, 0);
  controls.update();

  return controls;
};
