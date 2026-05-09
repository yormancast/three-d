import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type {
  CameraPosition,
  SceneAnimationSequence,
  SceneAnimationTarget,
  SceneConfig,
  Vector3Value
} from '@/definitions/portfolio';

interface PortfolioSceneController {
  animateCamera: (position: CameraPosition) => void;
  destroy: () => void;
  playAnimation: (animationName: string) => void;
  resize: () => void;
}

interface TargetState {
  object: any;
  basePosition: Vector3Value;
  baseRotation: Vector3Value;
  baseScale: Vector3Value;
}

interface TargetStateMap {
  [key: string]: TargetState;
}

export const createPortfolioScene = (
  container: HTMLElement,
  config: SceneConfig
): PortfolioSceneController => {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const loader = new GLTFLoader();
  const { resizeRatio } = config;
  let animationFrameId = 0;
  let cameraAnimation: TWEEN.Tween<any> | null = null;
  let sceneModel: any = null;
  let activeAnimationTweens: TWEEN.Tween<any>[] = [];
  let idleTweens: TWEEN.Tween<any>[] = [];
  const targetStates: TargetStateMap = {};

  const getCanvasSize = () => {
    return {
      height: window.innerHeight - (window.innerHeight * resizeRatio),
      width: window.innerWidth - (window.innerWidth * resizeRatio)
    };
  };

  const { height, width } = getCanvasSize();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.37, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);

  const setupRenderer = () => {
    const canvasSize = getCanvasSize();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setClearColor(new THREE.Color(0xff0000));
    renderer.setClearAlpha(0);
    container.appendChild(renderer.domElement);
  };

  const createLights = () => {
    const hemi = new THREE.HemisphereLight(0x00aaff, 0xffaa00, 2);
    scene.add(hemi);
  };

  const setupControls = () => {
    const initialPosition = config.initialCameraPosition;

    camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    controls.enabled = false;
    controls.update();
  };

  const getEasing = (easingName?: string) => {
    switch (easingName) {
      case 'quadraticOut':
        return TWEEN.Easing.Quadratic.Out;
      case 'quadraticIn':
        return TWEEN.Easing.Quadratic.In;
      case 'elasticOut':
        return TWEEN.Easing.Elastic.Out;
      case 'backOut':
        return TWEEN.Easing.Back.Out;
      case 'quadraticInOut':
      default:
        return TWEEN.Easing.Quadratic.InOut;
    }
  };

  const vectorToPlain = (vector: any): Vector3Value => {
    return {
      x: vector.x,
      y: vector.y,
      z: vector.z
    };
  };

  const applyVector = (target: any, nextValue?: Vector3Value) => {
    if (!nextValue) {
      return;
    }

    target.set(nextValue.x, nextValue.y, nextValue.z);
  };

  const captureTargetState = (object: any) => {
    targetStates[object.name] = {
      object,
      basePosition: vectorToPlain(object.position),
      baseRotation: vectorToPlain(object.rotation),
      baseScale: vectorToPlain(object.scale)
    };
  };

  const getAnimationObject = (targetName?: string) => {
    if (!targetName && sceneModel) {
      return sceneModel;
    }

    if (!targetName) {
      return null;
    }

    return scene.getObjectByName(targetName);
  };

  const stopTweens = (tweens: TWEEN.Tween<any>[]) => {
    tweens.forEach((tween) => tween.stop());
    tweens.length = 0;
  };

  const applyModelDefaults = (model: any) => {
    applyVector(model.scale, config.model.scale);
    applyVector(model.position, config.model.position);
    applyVector(model.rotation, config.model.rotation);
  };

  const createTargetTween = (
    target: any,
    property: 'position' | 'rotation' | 'scale',
    nextValue: Vector3Value,
    duration: number,
    easingName?: string,
    collection?: TWEEN.Tween<any>[]
  ) => {
    const tween = new TWEEN.Tween(target[property])
      .to(nextValue, duration)
      .easing(getEasing(easingName));

    if (collection) {
      collection.push(tween);
    }

    return tween;
  };

  const animateTarget = (
    animationTarget: SceneAnimationTarget,
    duration: number,
    easingName?: string
  ) => {
    const state = targetStates[animationTarget.name];

    if (!state) {
      return [];
    }

    const tweens: TWEEN.Tween<any>[] = [];
    const nextPosition = animationTarget.position || state.basePosition;
    const nextRotation = animationTarget.rotation || state.baseRotation;
    const nextScale = animationTarget.scale || state.baseScale;

    tweens.push(
      createTargetTween(state.object, 'position', nextPosition, duration, easingName, activeAnimationTweens),
      createTargetTween(state.object, 'rotation', nextRotation, duration, easingName, activeAnimationTweens),
      createTargetTween(state.object, 'scale', nextScale, duration, easingName, activeAnimationTweens)
    );

    return tweens;
  };

  const playSequenceStep = (sequence: SceneAnimationSequence, stepIndex: number) => {
    const step = sequence.steps[stepIndex];

    if (!step) {
      return;
    }

    let completedTweens = 0;
    const stepTweens = step.targets.flatMap((target) => {
      return animateTarget(target, step.duration, step.easing);
    });

    if (!stepTweens.length) {
      playSequenceStep(sequence, stepIndex + 1);
      return;
    }

    stepTweens.forEach((tween) => {
      tween.onComplete(() => {
        completedTweens += 1;

        if (completedTweens === stepTweens.length) {
          playSequenceStep(sequence, stepIndex + 1);
        }
      });

      tween.start();
    });
  };

  const resetAnimatedTargets = () => {
    Object.values(targetStates).forEach((state) => {
      state.object.position.set(state.basePosition.x, state.basePosition.y, state.basePosition.z);
      state.object.rotation.set(state.baseRotation.x, state.baseRotation.y, state.baseRotation.z);
      state.object.scale.set(state.baseScale.x, state.baseScale.y, state.baseScale.z);
    });
  };

  const setupIdleAnimation = () => {
    if (!config.idleAnimation) {
      return;
    }

    const idleTarget = getAnimationObject(config.idleAnimation.targetName);

    if (!idleTarget) {
      return;
    }

    if (config.idleAnimation.position) {
      const axis = config.idleAnimation.position.axis;
      const origin = idleTarget.position[axis];
      const offset = {
        [axis]: origin + config.idleAnimation.position.distance
      };

      idleTweens.push(
        new TWEEN.Tween(idleTarget.position)
          .to(offset, config.idleAnimation.position.duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .yoyo(true)
          .repeat(Infinity)
          .start()
      );
    }

    if (config.idleAnimation.rotation) {
      const axis = config.idleAnimation.rotation.axis;
      const origin = idleTarget.rotation[axis];
      const offset = {
        [axis]: origin + config.idleAnimation.rotation.angle
      };

      idleTweens.push(
        new TWEEN.Tween(idleTarget.rotation)
          .to(offset, config.idleAnimation.rotation.duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .yoyo(true)
          .repeat(Infinity)
          .start()
      );
    }
  };

  const loadModel = () => {
    loader.load(config.model.path, (gltf: any) => {
      const model = gltf.scene;

      sceneModel = model;
      applyModelDefaults(model);
      scene.add(model);

      model.traverse((child: any) => {
        if (child.name) {
          captureTargetState(child);
        }
      });

      if (model.name) {
        captureTargetState(model);
      }

      setupIdleAnimation();
    });
  };

  const animateScene = () => {
    scene.rotation.y += config.backgroundRotationStep;
  };

  const animate = () => {
    animationFrameId = window.requestAnimationFrame(animate);
    animateScene();
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
  };

  const resize = () => {
    const canvasSize = getCanvasSize();

    renderer.setSize(canvasSize.width, canvasSize.height);
    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();
  };

  const playAnimation = (animationName: string) => {
    const sequence = config.sectionAnimations[animationName];

    if (!sequence) {
      return;
    }

    stopTweens(activeAnimationTweens);
    resetAnimatedTargets();
    playSequenceStep(sequence, 0);
  };

  const animateCamera = (position: CameraPosition) => {
    const nextPosition = { ...position };

    cameraAnimation = new TWEEN.Tween(camera.position)
      .to(nextPosition, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        cameraAnimation = null;
      })
      .start();
  };

  const destroy = () => {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }

    cameraAnimation?.stop();
    stopTweens(activeAnimationTweens);
    stopTweens(idleTweens);
    controls.dispose();
    renderer.dispose();

    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  setupRenderer();
  createLights();
  setupControls();
  loadModel();
  resize();
  animate();

  return {
    animateCamera,
    destroy,
    playAnimation,
    resize
  };
};
