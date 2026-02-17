<template>
  <div class="px-6 flex flex-col items-center">
    <!-- Weekday Headers -->
    <div class="grid grid-cols-7 w-full mb-2">
      <div 
        v-for="day in weekDays" 
        :key="day"
        class="text-center text-[10px] font-bold tracking-wider text-base-content/30 uppercase"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Days -->
    <div class="grid grid-cols-7 gap-2 w-full">
      <DayCell
        v-for="(day, index) in calendarDays"
        :key="index"
        :day="day.date.getDate()"
        :is-current-month="day.isCurrentMonth"
        :total-duration-ms="day.totalDurationMs"
        @select="$emit('select-day', day.dateStr as string)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DayCell from './DayCell.vue'

const props = defineProps<{
  month: number
  year: number
  entries: any[] // Array of time entries
}>()

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Helper to format date as YYYY-MM-DD in local time
// Avoiding toISOString() because it converts to UTC, which can shift the date
const formatDateLocal = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const calendarDays = computed(() => {
  const days = []
  const firstDayOfMonth = new Date(props.year, props.month, 1)
  const lastDayOfMonth = new Date(props.year, props.month + 1, 0)
  
  // Adjust for Monday start (0=Sun, 1=Mon, ..., 6=Sat) -> (0=Mon, ..., 6=Sun)
  let startDay = firstDayOfMonth.getDay() - 1
  if (startDay === -1) startDay = 6 // Sunday becomes 6

  // Previous month padding
  const prevMonthLastDate = new Date(props.year, props.month, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(props.year, props.month - 1, prevMonthLastDate - i)
    days.push({
      date,
      dateStr: formatDateLocal(date), // Use local date string
      isCurrentMonth: false,
      totalDurationMs: 0
    })
  }

  // Current month days
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(props.year, props.month, i)
    const dateStr = formatDateLocal(date) // Use local date string
    
    // Calculate total duration for this day
    const dayEntries = props.entries.filter(e => e.date === dateStr)
    const duration = dayEntries.reduce((total, entry) => {
        const end = entry.endTime || Date.now()
        // Ensure valid numbers
        const diff = Math.max(0, Number(end) - Number(entry.startTime))
        return total + diff
    }, 0)

    days.push({
      date,
      dateStr,
      isCurrentMonth: true,
      totalDurationMs: duration
    })
  }

  // Next month padding (fill remaining grid slots)
  // We want a consistent grid, often 6 rows (42 cells) cover all months
  const remainingCells = 42 - days.length
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(props.year, props.month + 1, i)
    days.push({
      date,
      dateStr: formatDateLocal(date), // Use local date string
      isCurrentMonth: false,
      totalDurationMs: 0
    })
  }

  return days
})

defineEmits<{
  (e: 'select-day', date: string): void
}>()
</script>
