<template>
  <section class="main-header row">
    <div class="main-header-logo col-sm-3"></div>
    <div class="main-header-nav col-sm-9">
      <div class="row">
        <button class="col-sm-3 main-header-nav-list primary" v-for="i in nav" @click="navClickHandler(i)" :key="i.title">{{ i.title }}</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "main-header",
  data() {
    return {
      nav: [
        {
          title: "Bio",
          modelPosition: {x: -2.751, y: 0.2, z: 2}
        },
        {
          title: "Link 2",
          modelPosition: {x: 2.751, y: -0.397, z: 3.201}
        },
        {
          title: "Link 3",
          modelPosition: {x: -3, y: 2, z: 0}
        },
        {
          title: "Contact",
          modelPosition: {x: 3, y: -4, z: 1}
        }
      ]
    }
  },
  methods: {
    navClickHandler(navItem) {
      this.$emit('cameraPosition', navItem.modelPosition);
    }
  },
};
</script>