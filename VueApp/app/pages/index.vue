<template>
  <div class="relative w-full max-w-md h-screen flex flex-col bg-base-100 overflow-y-auto mx-auto">
    <HomeHeader :sync-status="syncStatus" />

    <main class="flex-1 flex flex-col gap-8 pb-40">
      <DailySummary :duration-ms="todaysDuration" />

      <Timeline :entries="todaysEntries" />

      <WeekIndicator 
        :selected-date="selectedDate"
        @select-day="handleSelectDay"
      />
    </main>

    <BottomNav @add="openAddModal" />

    <AddEntryModal ref="addModal" @save="handleSaveEntry" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTimeEntriesStore } from '@/stores/timeEntries'
import HomeHeader from '@/components/home/HomeHeader.vue'
import DailySummary from '@/components/home/DailySummary.vue'
import Timeline from '@/components/home/Timeline.vue'
import WeekIndicator from '@/components/home/WeekIndicator.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import AddEntryModal from '@/components/entry/AddEntryModal.vue'

const store = useTimeEntriesStore()
const addModal = ref<InstanceType<typeof AddEntryModal> | null>(null)
const selectedDate = ref<string>(new Date().toISOString().split('T')[0] || '')
const syncStatus = ref<'synced' | 'syncing' | 'offline'>('synced')

const todaysEntries = computed(() => store.getEntriesForDay(selectedDate.value))
const todaysDuration = computed(() => store.getTotalDurationForDay(selectedDate.value))

const openAddModal = () => {
  // Pass the first entry of the day if it exists, to populate the form
  const currentEntry = todaysEntries.value[0]
  addModal.value?.open(currentEntry)
}

const handleSelectDay = (date: string) => {
  selectedDate.value = date
}

const handleSaveEntry = (payload: any) => {
  // payload: { date, startTime, endTime, hoursWorked, tasks, isWeekend, ... } 
  // startTime/endTime are strings "HH:mm"
  
  const [startHour, startMinute] = payload.startTime.split(':').map(Number)
  const [endHour, endMinute] = payload.endTime.split(':').map(Number)

  if (
    startHour === undefined || startMinute === undefined || 
    endHour === undefined || endMinute === undefined
  ) {
    return
  }

  const date = new Date(selectedDate.value)
  
  const startTime = new Date(date)
  startTime.setHours(startHour, startMinute, 0, 0)

  // Handle overnight: if end time < start time (e.g. 02:00 < 22:00), it's next day
  const endTime = new Date(date)
  endTime.setHours(endHour, endMinute, 0, 0)
  
  if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
  }

  store.saveEntryForDay(selectedDate.value, {
    startTime: startTime.getTime(),
    endTime: endTime.getTime(),
    tasks: payload.tasks,
    isOvertime: payload.isWeekend // Mapping isWeekend (from form) to isOvertime (store)
  })
}
</script>
