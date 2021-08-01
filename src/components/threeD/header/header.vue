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
          modelPosition: [0,0,0]
        },
        {
          title: "Link 2",
          modelPosition: [0,0,0]
        },
        {
          title: "Link 3",
          modelPosition: [0,0,0]
        },
        {
          title: "Contact",
          modelPosition: [0,0,0]
        }
      ]
    }
  },
  methods: {
    navClickHandler(navItem) {
      console.log(navItem);
    }
  },
};
</script>