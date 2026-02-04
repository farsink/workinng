import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TimeEntry {
  id: string
  startTime: number // timestamp
  endTime?: number // timestamp
  date: string // YYYY-MM-DD
  tasks?: string
  isOvertime?: boolean
}

export const useTimeEntriesStore = defineStore('timeEntries', () => {
  const entries = ref<TimeEntry[]>([])

  // Actions
  const addEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID()
    }
    entries.value.push(newEntry)
  }

  const updateEntry = (id: string, updates: Partial<TimeEntry>) => {
    const index = entries.value.findIndex(e => e.id === id)
    if (index !== -1) {
      const currentEntry = entries.value[index]
      if (currentEntry) {
        entries.value[index] = { ...currentEntry, ...updates } as TimeEntry
      }
    }
  }

  // Getters
  const getEntriesForDay = (date: string) => {
    return entries.value.filter(e => e.date === date)
  }

  const getTotalDurationForDay = (date: string) => {
    const dayEntries = getEntriesForDay(date)
    return dayEntries.reduce((total, entry) => {
      const end = entry.endTime || Date.now()
      return total + (end - entry.startTime)
    }, 0)
  }

  const saveEntryForDay = (date: string, data: Omit<TimeEntry, 'id' | 'date'>) => {
    const dayEntries = getEntriesForDay(date)
    if (dayEntries.length > 0) {
      // For now, we update the first entry found for that day to match requested behavior
      const firstEntry = dayEntries[0]
      if (firstEntry) {
        updateEntry(firstEntry.id, data)
      }
    } else {
      addEntry({ ...data, date })
    }
  }

  return {
    entries,
    addEntry,
    updateEntry,
    saveEntryForDay,
    getEntriesForDay,
    getTotalDurationForDay
  }
}, {
  persist: true
})
