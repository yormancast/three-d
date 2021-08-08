<template>
  <section class="main-header row middle-xs">
    <div class="main-header-logo col-xs-12 col-sm-1">
      <img src="@/assets/logo.png" alt="logo">
    </div>
    <div class="main-header-nav col-xs-12 col-sm-3">
      <div class="row">
        <button class="col-xs-3 main-header-nav-list primary" v-for="i in nav" @click="navClickHandler(i)" :key="i.title">{{ i.title }}</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "main-header",
  props: {
    nav: {
      type: Array,
      default: ()=> {return []}
    }
  },
  methods: {
    navClickHandler(navItem) {
      this.$emit('navItemClicked', navItem.name);
    }
  },
};
</script>