import * as THREE from 'three';
import { createStandClip } from './animations/createStandClip';

export type SceneAnimationName = 'idle' | 'walk' | 'stand' | 'sit';

export interface AnimationMixerController {
  playAnimation: (animationName: SceneAnimationName) => void;
  update: (delta: number) => void;
}

interface SceneAnimationActions {
  [key: string]: any;
  idle: any;
  walk: any;
  stand: any;
  sit: any;
}

const unstableBlinkTrackPattern = /eye_[lr]_(upper|lower)/i;

const createStableIdleClip = (clip: any) => {
  const stableClip = clip.clone();

  stableClip.tracks = clip.tracks.filter((track: any) => (
    !unstableBlinkTrackPattern.test(track.name)
  ));
  stableClip.resetDuration();

  return stableClip;
};

export const setupAnimationMixer = (
  model: any,
  animations: any[]
): AnimationMixerController => {
  const mixer = new THREE.AnimationMixer(model);
  const idleClip = animations[0] ? createStableIdleClip(animations[0]) : null;

  let skeleton: any = null;
  model.traverse((obj: any) => {
    if (!skeleton && obj.isSkinnedMesh) skeleton = obj.skeleton;
  });

  const standClip = animations.find((clip) => clip.name === 'stand')
    || (skeleton ? createStandClip(skeleton) : null);
  const walkClip = animations.find((clip) => clip.name === 'walk');
  const sitClip = animations.find((clip) => clip.name === 'sit');
  const actions: SceneAnimationActions = {
    idle: null,
    stand: null,
    walk: null,
    sit: null
  };

  if (idleClip) {
    actions.idle = mixer.clipAction(idleClip);

    actions.idle.reset();
    actions.idle.setLoop(THREE.LoopRepeat, Infinity);
    actions.idle.play();
  }

  if (standClip) {
    actions['stand'] = mixer.clipAction(standClip);

    actions['stand'].reset();
    actions['stand'].setLoop(THREE.LoopOnce, 1);
    actions['stand'].clampWhenFinished = true;
  }

  if (walkClip) {
    actions.walk = mixer.clipAction(walkClip);

    actions.walk.reset();
    actions.walk.setLoop(THREE.LoopOnce, 1);
    actions.walk.clampWhenFinished = true;
  }

  if (sitClip) {
    actions.sit = mixer.clipAction(sitClip);

    actions.sit.reset();
    actions.sit.setLoop(THREE.LoopOnce, 1);
    actions.sit.clampWhenFinished = true;
  }

  return {
    playAnimation: (animationName: SceneAnimationName) => {
      const action = actions[animationName];

      if (!action) {
        return;
      }

      const fadeTime = 0.25;
      Object.keys(actions).forEach((key) => {
        if (actions[key] && actions[key] !== action) {
          actions[key].fadeOut(fadeTime);
        }
      });

      action.reset().fadeIn(fadeTime).play();
    },
    update: (delta: number) => {
      mixer.update(delta);
    }
  };
};
