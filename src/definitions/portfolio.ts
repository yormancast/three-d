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
  name: string;
  title: string;
  copy: string;
  visible?: boolean;
}

export interface SocialLink {
  href: string;
  imageSrc: string;
  alt: string;
  imageStyle?: {
    [key: string]: string;
  };
}

export interface SceneModelConfig {
  path: string;
  scale?: Vector3Value;
  position?: Vector3Value;
  rotation?: Vector3Value;
}

export interface SceneConfig {
  initialCameraPosition: CameraPosition;
  model: SceneModelConfig;
}
