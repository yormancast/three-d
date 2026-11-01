<script setup lang="ts">
import { portfolio } from '@/content/portfolio'

const logoUrl = `${import.meta.env.BASE_URL}identity/g2.svg`
</script>

<template>
  <div class="brand">
    <img class="brand-symbol" :src="logoUrl" :alt="portfolio.name" width="76" height="48" />
  </div>
</template>

<style scoped>
.brand {
  display: flex;
  align-items: center;
}
.brand-symbol {
  display: block;
  width: 76px;
  height: auto;
}
:global(.public-scene.layout-compact .brand-symbol) {
  width: 68px;
}
:global(.environment-review.layout-compact .brand-symbol) {
  width: 60px;
}
</style>
