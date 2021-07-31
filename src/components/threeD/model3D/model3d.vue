<template>
  <section class="model-3d">
    <div class="model" ref="model"></div>
  </section>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default {
  name: "model-3d",
  methods: {
    setup3DScene() {
      this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
      this.$refs.model.appendChild(this.renderer.domElement);
      this.load3Dmodel();
      this.animate();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    load3Dmodel() {
      const loader = new GLTFLoader();
      loader.load("/gltf/crow.glb", (gltf) => { 
        this.scene.add(gltf.scene.children[0]);
      });
    },
  },
  created () {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ),
    this.renderer = new THREE.WebGLRenderer();
  },
  mounted() {
    this.setup3DScene();
  },
};
</script>

<style lang="scss" scoped>
</style>