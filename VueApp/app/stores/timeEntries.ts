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

  // Debug logging helper
  const logDebug = (action: string, data?: any) => {
    const timestamp = new Date().toISOString()
    console.log(`[TimeEntries Store] ${timestamp} - ${action}`, data || '')
  }

  // Log initial state
  logDebug('Store initialized', { entriesCount: entries.value.length })

  // Actions
  const addEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID()
    }
    logDebug('Adding new entry', { 
      id: newEntry.id, 
      date: newEntry.date,
      startTime: new Date(newEntry.startTime).toLocaleString(),
      endTime: newEntry.endTime ? new Date(newEntry.endTime).toLocaleString() : 'N/A'
    })
    entries.value.push(newEntry)
    logDebug('Entry added successfully', { 
      totalEntries: entries.value.length,
      allEntries: entries.value.map(e => ({ id: e.id, date: e.date }))
    })
  }

  const updateEntry = (id: string, updates: Partial<TimeEntry>) => {
    logDebug('Updating entry', { id, updates })
    const index = entries.value.findIndex(e => e.id === id)
    if (index !== -1) {
      const currentEntry = entries.value[index]
      if (currentEntry) {
        const before = { ...currentEntry }
        entries.value[index] = { ...currentEntry, ...updates } as TimeEntry
        logDebug('Entry updated successfully', { 
          id,
          before: { date: before.date, startTime: new Date(before.startTime).toLocaleString() },
          after: { date: entries.value[index]!.date, startTime: new Date(entries.value[index]!.startTime).toLocaleString() },
          totalEntries: entries.value.length
        })
      }
    } else {
      logDebug('Entry not found for update', { id, availableIds: entries.value.map(e => e.id) })
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
    logDebug('saveEntryForDay called', { 
      date, 
      data: {
        startTime: new Date(data.startTime).toLocaleString(),
        endTime: data.endTime ? new Date(data.endTime).toLocaleString() : 'N/A',
        tasks: data.tasks,
        isOvertime: data.isOvertime
      }
    })
    const dayEntries = getEntriesForDay(date)
    if (dayEntries.length > 0) {
      // For now, we update the first entry found for that day to match requested behavior
      const firstEntry = dayEntries[0]
      if (firstEntry) {
        logDebug('Existing entry found for date, updating', { date, entryId: firstEntry.id })
        updateEntry(firstEntry.id, data)
      }
    } else {
      logDebug('No existing entry for date, creating new', { date })
      addEntry({ ...data, date })
    }
    
    // Verify localStorage after save
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('timeEntries')
      logDebug('localStorage verification after save', { 
        hasData: !!stored,
        dataLength: stored?.length || 0,
        preview: stored?.substring(0, 100)
      })
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
  persist: true,
  // Hydration hook - called when store is restored from localStorage
  onHydrate(ctx) {
    console.log('[TimeEntries Store] Hydrating from localStorage', {
      key: 'timeEntries',
      entriesCount: ctx.store.entries?.length || 0,
      entries: ctx.store.entries?.map((e: TimeEntry) => ({ id: e.id, date: e.date }))
    })
  }
})
