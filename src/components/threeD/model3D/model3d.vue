<template>
  <section class="model-3d">
    <div class="model" ref="model"></div>
  </section>
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const TWEEN = require('@tweenjs/tween.js');
export default defineComponent({
  name: "model-3d",
  props: {
    cameraPosition: {
      type: Object,
      default: ()=>{return {}}
    },
  },
  setup(props) {
    const model = ref(null);
    const resizeRatio = 0.08;
    const canvasHeight = ref(window.innerWidth - (window.innerWidth * resizeRatio));
    const canvasWidth = ref(window.innerWidth - (window.innerWidth * resizeRatio));
    const cameraAnimation = ref(null);
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialiasing: true, alpha: true });
    let camera;
    let controls;
    let animationFrameId = null;

    const setupOrbitControls = () => {
      controls = new OrbitControls(camera, renderer.domElement);
      camera.position.set(2.751, 0, 8);
      controls.enabled = false;
      controls.update();
    };

    const createCamera = () => {
      camera = new THREE.PerspectiveCamera(
        60,
        canvasWidth.value / canvasHeight.value,
        0.37,
        1000
      );

      setupOrbitControls();
    };

    const animateScene = () => {
      const scenePosition = scene.rotation;
      scenePosition.y = scenePosition.y + 0.01;
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      animateScene();
      TWEEN.update();
      controls.update();
      renderer.render(scene, camera);
    };

    const load3Dmodel = () => {
      const loader = new GLTFLoader();
      loader.load("/gltf/bunny.glb", (gltf) => {
        const model = gltf.scene.children[0];
        scene.add(model);
      });
    };

    const createLights = () => {
      const hemi = new THREE.HemisphereLight( 0x00aaff, 0xffaa00, 2 );
      scene.add(hemi);
    };

    const animateCamera = (position) => {
      const currentPosition = camera.position;
      const newPosition = JSON.parse(JSON.stringify(position));
      cameraAnimation.value = new TWEEN.Tween(currentPosition).to(newPosition, 500).easing(TWEEN.Easing.Quadratic.InOut).start();
      cameraAnimation.value.onComplete(() => {
        cameraAnimation.value = null;
      });
    };

    const windowResizeEvent = () => {
      canvasHeight.value = window.innerHeight - (window.innerHeight * resizeRatio);
      canvasWidth.value = window.innerWidth - (window.innerWidth * resizeRatio);
      renderer.setSize(canvasWidth.value, canvasHeight.value);
      camera.aspect = canvasWidth.value / canvasHeight.value;
      camera.updateProjectionMatrix();
    };

    const flipSkateboard = () => {
      const bunny = scene.getObjectByName("Bunny_2");

      if (!bunny) {
        return;
      }

      const skateBoard = bunny.rotation;
      const rotation = skateBoard.y === 20 ? {x:skateBoard.x, y: 0, z: skateBoard.z} : {x:skateBoard.x, y: 20, z: skateBoard.z}
      const flip = new TWEEN.Tween(skateBoard).to(rotation, 800).easing(TWEEN.Easing.Quadratic.InOut);
      flip.start();
    };

    const setup3DScene = () => {
      renderer.setSize(canvasWidth.value, canvasHeight.value);
      renderer.setClearColor( new THREE.Color( 0xff0000 ) );
      renderer.setClearAlpha( 0 );
      model.value.appendChild(renderer.domElement);
      load3Dmodel();
      animate();
    };

    createCamera();
    createLights();
    window.scene = scene;

    onMounted(() => {
      window.addEventListener('resize', windowResizeEvent);
      setup3DScene();
      windowResizeEvent();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', windowResizeEvent);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (controls) {
        controls.dispose();
      }

      renderer.dispose();
    });

    watch(
      () => props.cameraPosition,
      (newValue) => {
        if (newValue) {
          animateCamera(newValue);
          flipSkateboard();
        }
      }
    );

    return {
      model
    };
  }
});
</script>
