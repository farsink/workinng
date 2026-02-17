<template>
  <div class="flex items-center justify-between px-6 py-4">
    <button 
      class="p-2 hover:bg-white/5 rounded-full transition-colors text-base-content/60 hover:text-base-content"
      @click="$emit('prev')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <h2 class="text-xl font-bold tracking-tight text-base-content">
      {{ monthName }} {{ year }}
    </h2>

    <button 
      class="p-2 hover:bg-white/5 rounded-full transition-colors text-base-content/60 hover:text-base-content"
      @click="$emit('next')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  month: number
  year: number
}>()

const monthName = computed(() => {
  const date = new Date(props.year, props.month)
  return date.toLocaleString('default', { month: 'long' })
})

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>
