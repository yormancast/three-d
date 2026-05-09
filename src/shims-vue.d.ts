declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module 'three';
declare module 'three/examples/jsm/controls/OrbitControls.js';
declare module 'three/examples/jsm/loaders/GLTFLoader.js';
