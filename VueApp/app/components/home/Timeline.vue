<template>
  <div class="flex flex-col gap-2 w-full px-6 py-6">
    <div class="flex justify-between text-xs text-base-content/40 font-medium px-1">
      <span>00:00</span>
      <span>12:00</span>
      <span>24:00</span>
    </div>
    
    <div class="relative h-12 bg-base-content/5 rounded-2xl w-full flex items-center overflow-hidden border border-base-content/5">
      <!-- Grid lines -->
      <div class="absolute inset-0 flex justify-between px-[2px] w-full h-full pointer-events-none">
        <div class="w-[1px] h-full bg-base-content/5"></div>
        <div class="w-[1px] h-full bg-base-content/5"></div>
        <div class="w-[1px] h-full bg-base-content/10"></div>
        <div class="w-[1px] h-full bg-base-content/5"></div>
        <div class="w-[1px] h-full bg-base-content/5"></div>
      </div>

      <!-- Time segments -->
      <div 
        v-for="segment in segments" 
        :key="segment.id"
        class="absolute h-8 bg-primary rounded-lg shadow-[0_0_15px_rgba(236,218,19,0.3)] flex items-center justify-center group cursor-pointer transition-all hover:brightness-110"
        :style="{
          left: `${segment.startPercent}%`,
          width: `${segment.widthPercent}%`
        }"
      >
        <div class="hidden group-hover:flex absolute -top-10 bg-surface-dark px-2 py-1 rounded text-xs text-primary border border-primary/20 whitespace-nowrap z-20">
          {{ segment.startTime }} - {{ segment.endTime }}
        </div>
      </div>
    </div>

    <div class="relative h-6 w-full text-sm font-medium text-primary">
      <span 
        v-for="segment in segments" 
        :key="segment.id + '-label'"
        class="absolute transform -translate-x-1/2"
        :style="{ left: `${segment.startPercent}%` }"
      >
        {{ segment.startTime }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TimeEntry } from '@/stores/timeEntries'

const props = defineProps<{
  entries: TimeEntry[]
}>()

const segments = computed(() => {
  return props.entries.map(entry => {
    const start = new Date(entry.startTime)
    const end = entry.endTime ? new Date(entry.endTime) : new Date()
    
    const startMinutes = start.getHours() * 60 + start.getMinutes()
    const endMinutes = end.getHours() * 60 + end.getMinutes()
    const totalDayMinutes = 24 * 60

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    }

    return {
      id: entry.id,
      startPercent: (startMinutes / totalDayMinutes) * 100,
      widthPercent: ((endMinutes - startMinutes) / totalDayMinutes) * 100,
      startTime: formatTime(start),
      endTime: formatTime(end)
    }
  })
})
</script>
