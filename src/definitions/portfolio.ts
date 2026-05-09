export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export interface Vector3Value {
  x: number;
  y: number;
  z: number;
}

export interface PortfolioSection {
  visible: boolean;
  name: string;
  title: string;
  modelPosition: CameraPosition;
  sceneAnimation: string;
  copy: string;
}

export interface SocialLink {
  href: string;
  imageSrc: string;
  alt: string;
  imageStyle?: Record<string, string>;
}

export interface SceneModelConfig {
  path: string;
  rootNodeName?: string;
  scale?: Vector3Value;
  position?: Vector3Value;
  rotation?: Vector3Value;
}

export interface SceneAnimationTarget {
  name: string;
  position?: Vector3Value;
  rotation?: Vector3Value;
  scale?: Vector3Value;
}

export interface SceneAnimationStep {
  duration: number;
  easing?: string;
  targets: SceneAnimationTarget[];
}

export interface SceneAnimationSequence {
  steps: SceneAnimationStep[];
}

export interface SceneIdleAnimationConfig {
  targetName?: string;
  position?: {
    axis: 'x' | 'y' | 'z';
    distance: number;
    duration: number;
  };
  rotation?: {
    axis: 'x' | 'y' | 'z';
    angle: number;
    duration: number;
  };
}

export interface SceneConfig {
  backgroundRotationStep: number;
  initialCameraPosition: CameraPosition;
  model: SceneModelConfig;
  idleAnimation?: SceneIdleAnimationConfig;
  sectionAnimations: Record<string, SceneAnimationSequence>;
  resizeRatio: number;
}
