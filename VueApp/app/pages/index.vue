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
  addModal.value?.open()
}

const handleSelectDay = (date: string) => {
  selectedDate.value = date
}

const handleSaveEntry = (times: { start: string, end: string }) => {
  const [startHour, startMinute] = times.start.split(':').map(Number)
  const [endHour, endMinute] = times.end.split(':').map(Number)

  if (
    startHour === undefined || startMinute === undefined || 
    endHour === undefined || endMinute === undefined
  ) {
    return
  }

  const date = new Date(selectedDate.value)
  
  const startTime = new Date(date)
  startTime.setHours(startHour, startMinute, 0, 0)

  const endTime = new Date(date)
  endTime.setHours(endHour, endMinute, 0, 0)

  store.addEntry({
    date: selectedDate.value,
    startTime: startTime.getTime(),
    endTime: endTime.getTime()
  })
}
</script>
