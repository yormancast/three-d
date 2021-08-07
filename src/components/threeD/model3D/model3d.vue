<template>
  <section class="model-3d">
    <div class="model" ref="model"></div>
  </section>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const TWEEN = require('@tweenjs/tween.js');
export default {
  name: "model-3d",
  props: {
    cameraPosition: {
      type: Object,
      default: ()=>{return {}}
    },
  },
  data() {
    return {
      canvasHeight: window.innerWidth - (window.innerHeight * 0.05),
      canvasWidth: window.innerWidth - (window.innerWidth *0.05),
      tween: null
    }
  },
  methods: {
    setup3DScene() {
      this.renderer.setSize(this.canvasWidth, this.canvasHeight);
      this.renderer.setClearColor( new THREE.Color( 0xff0000 ) );
      this.renderer.setClearAlpha( 0 );
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
      TWEEN.update();
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
      const hemi = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.5 );
      this.scene.add(hemi);
    },
    animateCamera(position) {
      const currentPosition = this.camera.position;
      const newPosition = JSON.parse(JSON.stringify(position));
      this.tween = new TWEEN.Tween(currentPosition).to(newPosition, 500).easing(TWEEN.Easing.Quadratic.InOut).start();
      this.tween.onComplete(() => {delete this.tween;});
    }
  },
  created () {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer( { alpha: true } );
    this.createCamera();
    this.createLights();
    window.camera = this.controls;
  },
  mounted() {
    this.setup3DScene();
  },
  watch: {
    cameraPosition(newValue) {
      if(newValue) {
        this.animateCamera(newValue)
      }
    }
  }
};
</script>