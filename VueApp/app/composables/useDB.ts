import { db, type TimeEntry } from '@/utils/db'

export const useDB = () => {
  // Return null during SSR
  if (process.server) return null

  return {
    db,
    timeEntries: db.timeEntries,
    
    // Helper to get entries for a specific date
    async getEntriesByDate(date: string) {
      return await db.timeEntries.where('date').equals(date).toArray()
    },

    // Helper to add an empty entry if none exists (legacy behavior support)
    async getOrInitEntryForDate(date: string) {
      const existing = await this.getEntriesByDate(date)
      if (existing.length > 0) return existing[0]
      return null
    }
  }
}
