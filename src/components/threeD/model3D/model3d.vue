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
      canvasHeight: window.innerWidth - (window.innerWidth * 0.05),
      canvasWidth: window.innerWidth - (window.innerWidth *0.05),
      cameraAnimation: null
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
      this.camera.position.set(2.751, 0, 8);
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
      loader.load("/gltf/bunny.glb", (gltf) => {
        const model = gltf.scene.children[0];
        this.scene.add(model);
      });
    },
    createLights(){
      const hemi = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.5 );
      this.scene.add(hemi);
    },
    animateCamera(position) {
      const currentPosition = this.camera.position;
      const newPosition = JSON.parse(JSON.stringify(position));
      this.cameraAnimation = new TWEEN.Tween(currentPosition).to(newPosition, 500).easing(TWEEN.Easing.Quadratic.InOut).start();
      this.cameraAnimation.onComplete(() => {delete this.tween;});
    },
    animateScene() {
      let scenePosition = this.scene.position;
      let sceneAnimationUp = new TWEEN.Tween(scenePosition).to({y: scenePosition.y + 0.03}, 900);
      let sceneAnimationDown = new TWEEN.Tween(scenePosition).to({y: scenePosition.y - 0.03}, 900);
      sceneAnimationUp.chain(sceneAnimationDown);
      sceneAnimationDown.chain(sceneAnimationUp);
      sceneAnimationUp.start();
    },
    windowResizeEvent() {
      if (window.innerWidth > window.innerHeight) {
        this.canvasHeight = window.innerHeight - (window.innerHeight * 0.05);
        this.canvasWidth = window.innerWidth - (window.innerWidth * 0.05);
      } else {
        this.canvasHeight = window.innerHeight;
        this.canvasWidth = window.innerWidth;
      }

      this.renderer.setSize(this.canvasWidth, this.canvasHeight);
      this.camera.aspect = this.canvasWidth / this.canvasHeight;
      this.camera.updateProjectionMatrix();
    }
  },
  created () {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer( { antialiasing: true, alpha: true } );
    this.createCamera();
    this.createLights();
    window.scene = this.scene;
  },
  mounted() {
    window.addEventListener('resize', this.windowResizeEvent);
    this.setup3DScene();
    this.windowResizeEvent();
    this.animateScene();
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