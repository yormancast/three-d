<template>
  <section class="three-d">
    <main-header :nav="dataModel" @navItemClicked="handleNavClickEvent" />
    <model-3d :cameraPosition="cameraPOV"/>
    <window :class="{ isVisible :  i.visible }" v-for="i in dataModel" :key="i.title" :itemData="i" />
    <socials />
  </section>
</template>

<script>
import model3d from './model3D/model3d.vue';
import mainHeader from './header/header.vue';
import window from './window/window.vue';
import socials from './socials/socials.vue';

export default {
  name:'threeD',
  components: { model3d, mainHeader, window, socials },
  data() {
    return {
      cameraPOV: [],
      dataModel: [
        {
          visible: false,
          name: 'bio',
          title: 'Bio',
          modelPosition: {x: -2.751, y: 0.2, z: 4},
          copy: "I'm a born Venezuelan living in Chile, and to this day I can never get a straight answer from my parents about where the hell my first name comes from. I found out early in my life that I like to build things and stay to stay inside most of my time, so I learnt to code. And I have been coding for more than a decade now. <br/><br/> I write mostly Javascript but I've dabbled in Python and C++ while failing at learning Unity lol. I'm technically a fullstack dev and I'm supposed to be working on my AWS certification, but here I am building things in threeJS because the frontend and the 3D world is where my passion lies, I'd rather stare at canvas' animations, material meshes and UV mappings all day instead of writing a stupid sql query that never ever ever does what I want."
        },
        {
          visible: false,
          name: 'about',
          title: "About this site",
          modelPosition: {x: 2.751, y: -0.397, z: 3.8},
          copy: "I built this site using threejs and vuejs. Animations are done with Tweenjs. The skateboarder ninja bunny models is from <a href='https://sketchfab.com/3d-models/silent-ash-bc44272e8c1047148b33c913e659fcfa' target='_blank'>Sketchfab</a>. I plan to replace it once I step up my Blender skills, mainly because I spent what it feels like 300 weeks trying to rig this model and animate the skeleton, a task a wiser man would have deemed foolish after seen the initial position of the skater Bunny. </br> The skater's glb file originally was around 70mb, so trimming that down to a manageable file size was also fun (lol), I want to draco compress the glb eventually but I promised myseld I'd stop increasing the scope and eventually pushing this site out."
        },
        {
          visible: false,
          name: 'link3',
          title: "Link 3",
          modelPosition: {x: -5, y: 2, z: 6},
          copy: "I have no idea what to put here"
        },
        {
          visible: false,
          name: 'contact',
          title: "Contact",
          modelPosition: {x: 3, y: -4, z: 1},
          copy: "I barely use linkd in these days but that is the best way to get in touch with me, because I will probably never put a form in this page, although it is on my to do list. <br/> <a href='https://www.linkedin.com/in/yormancastellanos/?locale=en_US' target='_blank' style='font-size:1.3em;'>linkdin</a>"
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