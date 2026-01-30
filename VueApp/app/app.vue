<template>
  <div class="dark">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Apply dark mode globally
onMounted(() => {
  document.documentElement.classList.add('dark')
})
</script>
