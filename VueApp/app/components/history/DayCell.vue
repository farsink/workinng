<template>
  <div 
    class="relative group aspect-square flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer"
    :class="[
      isCurrentMonth ? '' : 'opacity-20 pointer-events-none',
      hasEntries ? 'bg-base-content/5 ring-1 ring-base-content/10' : 'hover:bg-white/5'
    ]"
    @click="$emit('select')"
  >
    <span 
      class="text-sm font-medium transition-colors"
      :class="hasEntries ? 'text-base-content' : 'text-base-content/40'"
    >
      {{ day }}
    </span>

    <div v-if="hasEntries" class="flex flex-col items-center mt-1">
      <span class="text-[10px] font-bold text-primary">
        {{ formattedHours }}
      </span>
      <div class="w-1 h-1 rounded-full bg-primary mt-0.5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  day: number
  isCurrentMonth: boolean
  totalDurationMs: number
}>()

const hasEntries = computed(() => props.totalDurationMs > 0)

const formattedHours = computed(() => {
  const hours = Math.floor(props.totalDurationMs / (1000 * 60 * 60))
  return `${hours.toString().padStart(2, '0')}h`
})

defineEmits<{
  (e: 'select'): void
}>()
</script>
