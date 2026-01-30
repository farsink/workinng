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
        <div v-if="day.isToday" class="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"></div>
        
        <span 
          class="text-[10px] font-medium transition-colors"
          :class="day.isToday ? 'text-primary font-bold' : day.hours > 0 ? 'text-base-content/60 group-hover:text-base-content' : 'text-base-content/40'"
        >
          {{ day.hours > 0 ? `${day.hours}h` : '' }}
        </span>
        
        <div 
          class="w-full rounded-t-md rounded-b-sm transition-all relative flex items-end justify-center pb-1"
          :class="[
            day.isToday ? 'border-2 border-primary bg-primary/10' : day.hours >= 8 ? 'bg-secondary opacity-90 group-hover:opacity-100' : day.hours > 0 ? 'bg-secondary opacity-90 group-hover:opacity-100' : 'bg-base-content/5 hover:bg-base-content/10'
          ]"
          :style="{ height: day.hours > 0 ? `${Math.max(day.percentage, 10)}%` : '100%' }"
        >
          <div v-if="day.isToday" class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
          <div v-else-if="day.isCompleted" class="absolute bottom-1 w-full flex justify-center text-base-300/40">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>

        <span 
          class="text-xs font-medium transition-colors"
          :class="day.isToday ? 'text-base-content font-bold' : 'text-base-content/60'"
        >
          {{ day.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  selectedDate: string
}>()

defineEmits<{
  (e: 'select-day', date: string): void
}>()

const weekDays = computed(() => {
  const days = []
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // Adjust to make Monday first
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + mondayOffset + i)
    
    const dateStr = d.toISOString().split('T')[0] || ''
    const isToday = dateStr === new Date().toISOString().split('T')[0]
    
    // Mock data for visualization - replace with store data later
    const hours = isToday ? 6.5 : i < 2 ? Math.floor(Math.random() * 3) + 7 : 0
    
    days.push({
      date: dateStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      hours,
      percentage: (hours / 12) * 100, // Scale based on 12h max
      isToday,
      isCompleted: hours >= 8
    })
  }
  return days
})
</script>
