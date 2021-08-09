<template>
  <section class="three-d">
    <main-header :nav="dataModel" @navItemClicked="handleNavClickEvent" />
    <model-3d :cameraPosition="cameraPOV"/>
    <window :class="{ isVisible :  i.visible }" v-for="i in dataModel" :key="i.title" :itemData="i" />
  </section>
</template>

<script>
import model3d from './model3D/model3d.vue';
import mainHeader from './header/header.vue';
import window from './window/window.vue';

export default {
  name:'threeD',
  components: { model3d, mainHeader, window },
  data() {
    return {
      cameraPOV: [],
      dataModel: [
        {
          visible: true,
          name: 'bio',
          title: 'Bio',
          modelPosition: {x: -2.751, y: 0.2, z: 4},
          copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id elit eu ipsum aliquam viverra. Maecenas sed ipsum dignissim, feugiat quam eget, tincidunt tellus.'
        },
        {
          visible: false,
          name: 'link2',
          title: "Link 2",
          modelPosition: {x: 2.751, y: -0.397, z: 3.201},
          copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id elit eu ipsum aliquam viverra. Maecenas sed ipsum dignissim, feugiat quam eget, tincidunt tellus.'
        },
        {
          visible: false,
          name: 'link3',
          title: "Link 3",
          modelPosition: {x: -5, y: 2, z: 6},
          copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id elit eu ipsum aliquam viverra. Maecenas sed ipsum dignissim, feugiat quam eget, tincidunt tellus.'
        },
        {
          visible: false,
          name: 'contact',
          title: "Contact",
          modelPosition: {x: 3, y: -4, z: 1},
          copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id elit eu ipsum aliquam viverra. Maecenas sed ipsum dignissim, feugiat quam eget, tincidunt tellus.'
        }
      ]
    }
  },
  methods: {
    handleNavClickEvent(itemClicked) {
      const currentNavItem = this.getNavItem(itemClicked)[0];
      this.updateCamera(currentNavItem.modelPosition);
      this.resetVisibility();
      currentNavItem.visible = true;
    },
    updateCamera(position) {
      this.cameraPOV = position;
    },
    getNavItem(itemName) {
      return this.dataModel.filter(el => {
        return el.name === itemName
      });
    },
    resetVisibility() {
      this.dataModel.forEach(element => {
        element.visible = false;
      });
    }
  }
};
</script>

<style lang="scss">
  @import '@/styles/global';
</style>