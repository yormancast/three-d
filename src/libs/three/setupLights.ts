import * as THREE from 'three';

export const setupLights = (scene: any) => {
  const ambientLight = new THREE.HemisphereLight(0x8fb8e8, 0x160f0b, .32);
  const keyLight = new THREE.DirectionalLight(0xffb08a, .58);
  const fillLight = new THREE.DirectionalLight(0x74b8ff, .22);
  const frontLight = new THREE.PointLight(0xffdfc4, .16, 10);
  const rimLight = new THREE.DirectionalLight(0x8fd6ff, .34);

  keyLight.position.set(-2.8, 4.6, 3.2);
  fillLight.position.set(3.5, 1.8, -2.5);
  frontLight.position.set(0, 1.5, 4);
  rimLight.position.set(2.6, 3.1, -3.4);
  scene.add(ambientLight, keyLight, fillLight, frontLight, rimLight);
};
