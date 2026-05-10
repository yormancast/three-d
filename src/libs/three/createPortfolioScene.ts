import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { SceneConfig } from '@/definitions/portfolio';
import { setupCamera } from './setupCamera';
import { setupLights } from './setupLights';
import { setupMaterials } from './setupMaterials';
import { setupOrbitControls } from './setupOrbitControls';

interface PortfolioSceneController {
  resize: () => void;
}

export const createPortfolioScene = (
  container: HTMLElement,
  config: SceneConfig
): PortfolioSceneController => {
  const scene = new THREE.Scene();
  const debugWindow: any = window;

  debugWindow.scene = scene;
  const camera = setupCamera(config.initialCameraPosition);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  const loader = new GLTFLoader();

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  const controls = setupOrbitControls(camera, renderer.domElement);

  debugWindow.controls = controls;

  setupLights(scene);

  loader.load(
    config.model.path,
    (gltf: any) => {
      const model = gltf.scene;
      const scale = config.model.scale || { x: 1.5, y: 0.5, z: 0.5 };
      const position = config.model.position || { x: 0, y: 0, z: 0 };
      const rotation = config.model.rotation || { x: 0, y: 0, z: 0 };

      model.scale.set(scale.x, scale.y, scale.z);
      model.position.set(position.x, position.y, position.z);
      model.rotation.set(rotation.x, rotation.y, rotation.z);
      setupMaterials(model, maxAnisotropy);

      scene.add(model);
    },
    undefined,
    (error: any) => {
      console.error(`Unable to load portfolio model: ${config.model.path}`, error);
    }
  );

  const render = () => {
    window.requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  };

  render();

  return {
    resize: () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };
};
