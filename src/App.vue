<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import PublicScene from '@/components/PublicScene.vue'

const ActiveExperience = import.meta.env.DEV
  ? defineAsyncComponent(() => import('@/components/review/SceneReview.vue'))
  : PublicScene
</script>

<template>
  <component :is="ActiveExperience" />
</template>
