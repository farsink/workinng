<template>
  <div class="flex flex-col gap-2 w-full px-6 py-6">
    <div class="flex justify-between text-xs text-base-content/40 font-medium px-[1px]">
      <span>00:00</span>
      <span>12:00</span>
      <span>24:00</span>
    </div>
    
    <div 
      class="relative h-12 bg-base-content/5 rounded-2xl w-full flex items-center overflow-hidden border border-base-content/5 cursor-pointer hover:bg-base-content/10 transition-colors"
      @click="handleTimelineClick"
    >
      <!-- Background blocks (4 segments) -->
      <div class="absolute inset-0 flex w-full h-full pointer-events-none px-[2px]">
        <div v-for="i in 4" :key="i" class="flex-1 h-full flex items-center justify-end">
          <div v-if="i < 4" class="w-[1px] h-full bg-white/10"></div>
        </div>
      </div>

      <!-- Empty state hint -->
      <div v-if="segments.length === 0" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="text-base-content/30 text-sm font-medium">Click to add entry</span>
      </div>

      <!-- Time segments -->
      <div 
        v-for="segment in segments" 
        :key="segment.id"
        class="absolute h-8 bg-primary rounded-lg shadow-[0_0_15px_rgba(236,218,19,0.3)] flex items-center justify-center group cursor-pointer transition-all hover:brightness-110 z-10"
        :style="{
          left: `${segment.startPercent}%`,
          width: `${segment.widthPercent}%`
        }"
        @click.stop="$emit('edit-entry', findEntry(segment.id as string))"
      >
        <div class="hidden group-hover:flex absolute -top-10 bg-surface-dark px-2 py-1 rounded text-xs text-primary border border-primary/20 whitespace-nowrap z-20">
          {{ segment.startTime }} - {{ segment.endTime }}
        </div>
      </div>
    </div>

    <!-- <div class="relative h-6 w-full text-sm font-medium text-primary">
      <span 
        v-for="(marker, index) in uniqueTimeMarkers" 
        :key="'marker-' + index"
        class="absolute"
        :style="{ left: `${marker.percent}%` }"
      >
        {{ marker.time }}
      </span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TimeEntry } from '@/utils/db'

const props = defineProps<{
  entries: TimeEntry[]
}>()

const emit = defineEmits<{
  (e: 'edit-entry', entry: TimeEntry | undefined): void
  (e: 'add-entry'): void
}>()

const findEntry = (id: string) => props.entries.find(e => e.id === id)

const handleTimelineClick = () => {
  // Emit add-entry event when clicking on empty timeline or blank areas
  emit('add-entry')
}

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

// Collect unique time markers (start and end points)
const uniqueTimeMarkers = computed(() => {
  const markers = new Map<string, number>()
  
  segments.value.forEach(segment => {
    // Add start time
    if (!markers.has(segment.startTime)) {
      markers.set(segment.startTime, segment.startPercent)
    }
    
    // Add end time
    if (!markers.has(segment.endTime)) {
      markers.set(segment.endTime, segment.startPercent + segment.widthPercent)
    }
  })
  
  // Convert to array and sort by position
  return Array.from(markers.entries())
    .map(([time, percent]) => ({ time, percent }))
    .sort((a, b) => a.percent - b.percent)
})
</script>
