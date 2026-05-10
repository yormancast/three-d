import * as THREE from 'three';

const textureProperties = [
  'map',
  'normalMap',
  'roughnessMap',
  'metalnessMap',
  'aoMap',
  'emissiveMap',
  'alphaMap'
];

export const setupMaterials = (model: any, maxAnisotropy: number) => {
  model.traverse((child: any) => {
    if (!child.isMesh) {
      return;
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];

    materials.forEach((material: any) => {
      if (!material) {
        return;
      }

      material.side = THREE.DoubleSide;
      material.needsUpdate = true;

      textureProperties.forEach((property) => {
        const texture = material[property];

        if (!texture) {
          return;
        }

        if (property === 'map' || property === 'emissiveMap') {
          texture.encoding = THREE.sRGBEncoding;
        }

        texture.anisotropy = maxAnisotropy;
        texture.generateMipmaps = false;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
      });
    });
  });
};
