<template>
  <section class="three-d">
    <main-header @cameraPosition="updateCamera"/>
    <model-3d  :cameraPosition="cameraPOV"/>
  </section>
</template>

<script>
import model3d from './model3D/model3d.vue';
import mainHeader from './header/header.vue'

export default {
  name:'threeD',
  components: { model3d, mainHeader },
  data() {
    return {
      cameraPOV: []
    }
  },
  methods: {
    updateCamera(position) {
      this.cameraPOV = position;
    }
  }
};
</script>

<style lang="scss">
  @import '@/styles/global';
</style>