<template>
  <div class="flex flex-col items-center justify-center pt-8 pb-4">
    <div class="relative">
      <div class="absolute inset-0 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>
      <h1 class="relative text-[64px] font-bold leading-none tracking-tight text-base-content text-center">
        {{ hours }}<span class="text-4xl align-top pt-2 inline-block">h</span> {{ minutes }}<span class="text-4xl align-top pt-2 inline-block">m</span>
      </h1>
    </div>
    <p class="text-base-content/40 text-base text-white/55 font-medium mt-2">Worked today</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  durationMs: number
}>()

const hours = computed(() => Math.floor(props.durationMs / (1000 * 60 * 60)))
const minutes = computed(() => Math.floor((props.durationMs % (1000 * 60 * 60)) / (1000 * 60)))
</script>
