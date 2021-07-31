<template>
  <section class="model-3d">
    <div class="model" ref="model"></div>
  </section>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
export default {
  name: "model-3d",
  methods: {
    setup3DScene() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.model.appendChild(this.renderer.domElement);
      this.load3Dmodel();
      this.animate();
    },
    createCamera() {
      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.37,
        1000
      );
      this.setupOrbitControls();
    },
    setupOrbitControls(){
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.camera.position.set(2.751, -0.397, 3.201);
      this.controls.enabled = false;
      this.controls.update();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
    load3Dmodel() {
      const loader = new GLTFLoader();
      loader.load("/gltf/skull1.glb", (gltf) => {
        this.scene.add(gltf.scene.children[0]);
      });
    },
    createLights(){
      const hemi = new THREE.HemisphereLight( 0xffffff, 0x000000, 1 );
      this.scene.add(hemi);
    }
  },
  created () {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    //this.scene.background = new THREE.Color( 0xf2f2f2 );
    this.createCamera();
    this.createLights();
    window.scene = this.scene;
    window.camera = this.controls;
  },
  mounted() {
    this.setup3DScene();
  },
};
</script>

<style lang="scss" scoped>
</style>