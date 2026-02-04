<template>
  <div class="flex flex-col gap-4 mt-2 px-6">
    <div class="flex justify-between items-end">
      <h3 class="text-lg font-bold text-base-content">This Week</h3>
      <button class="text-xs text-primary font-medium hover:underline">View Report</button>
    </div>
    
    <div class="grid grid-cols-7 gap-2 h-40 items-end">
      <div 
        v-for="day in weekDays" 
        :key="day.date"
        class="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
        :class="{ 'relative': day.isToday }"
        @click="$emit('select-day', day.date)"
      >
        <span 
          class="text-[10px] font-medium transition-colors"
          :class="day.isToday ? 'text-primary font-bold' : day.hours > 0 ? 'text-base-content/60 group-hover:text-base-content' : 'text-base-content/20'"
        >
          {{ day.hours > 0 ? `${day.hours}h` : '' }}
        </span>
        
        <div 
          class="w-full rounded-t-lg rounded-b-sm transition-all relative flex items-end justify-center pb-2 border border-transparent"
          :class="[
            day.isToday ? 'border-primary/40 bg-primary/20 shadow-[0_0_15px_rgba(236,218,19,0.1)]' : 
            day.hours > 0 ? 'bg-secondary border-secondary/50 group-hover:bg-secondary/80 group-hover:border-secondary' : 
            day.isPast ? 'bg-error/30 border border-error' :
            'bg-base-content/5 hover:bg-base-content/10 border-base-content/5'
          ]"
          :style="{ height: day.hours > 0 ? `${Math.min(Math.max(day.percentage, 15), 100)}%` : '8%' }"
        >
          <div v-if="day.isToday" class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(236,218,19,0.6)]"></div>
          <div v-else-if="day.isCompleted" class="absolute bottom-2 w-full flex justify-center text-primary/40">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>

        <div v-if="day.isToday" class="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"></div>

        <span 
          class="text-xs font-medium transition-colors"
          :class="day.isToday ? 'text-primary font-bold' : 'text-base-content/60'"
        >
          {{ day.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTimeEntriesStore } from '@/stores/timeEntries'

const props = defineProps<{
  selectedDate: string
}>()

defineEmits<{
  (e: 'select-day', date: string): void
}>()

const store = useTimeEntriesStore()

const weekDays = computed(() => {
  const days = []
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // Adjust to make Monday first
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + mondayOffset + i)
    
    const dateStr = d.toISOString().split('T')[0] || ''
    const isToday = dateStr === (new Date().toISOString().split('T')[0] || '')
    const isPast = dateStr < (new Date().toISOString().split('T')[0] || '')
    
    // Get real duration from store
    const durationMs = store.getTotalDurationForDay(dateStr)
    const hours = durationMs / (1000 * 60 * 60)
    const roundedHours = Math.round(hours * 10) / 10 // Round to 1 decimal place
    
    days.push({
      date: dateStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: roundedHours,
      percentage: Math.min((roundedHours / 12) * 100, 100), // Cap at 100%
      isToday,
      isPast,
      isCompleted: roundedHours >= 8
    })
  }
  return days
})
</script>
