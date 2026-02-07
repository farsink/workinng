import { db } from './db'

/**
 * Debug utility for monitoring IndexedDB (Dexie)
 */

export const debugStorage = {
  /**
   * Logs current IndexedDB state for debugging
   */
  async logStorageState() {
    if (typeof window === 'undefined') return

    console.group('🔍 [Storage Debug] Current IndexedDB State')
    
    try {
      const count = await db.timeEntries.count()
      console.log('Total entries:', count)
      
      const entries = await db.timeEntries.toArray()
      console.table(entries.map(e => ({
        id: e.id,
        date: e.date,
        startTime: new Date(e.startTime).toLocaleString(),
        endTime: new Date(e.endTime).toLocaleString(),
        tasks: e.tasks ? (e.tasks.length > 20 ? e.tasks.substring(0, 20) + '...' : e.tasks) : '',
        isOvertime: e.isOvertime
      })))

      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate()
        if (estimate.usage && estimate.quota) {
          const usageMB = (estimate.usage / (1024 * 1024)).toFixed(2)
          const quotaMB = (estimate.quota / (1024 * 1024)).toFixed(0)
          console.log(`Storage Usage: ${usageMB} MB / ${quotaMB} MB`)
        }
      }
    } catch (e) {
      console.error('Failed to read IndexedDB:', e)
    }
    
    console.groupEnd()
  },

  /**
   * Export current data as JSON
   */
  async exportData() {
    if (typeof window === 'undefined') return null

    try {
      const entries = await db.timeEntries.toArray()
      
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: 1,
        source: 'IndexedDB',
        count: entries.length,
        data: entries
      }
      
      console.log('[Storage Debug] Data export prepared, ' + entries.length + ' entries')
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `worklog-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      return exportData
    } catch (e) {
      console.error('[Storage Debug] Failed to export:', e)
      return null
    }
  },

  /**
   * Verify data integrity
   */
  async verifyIntegrity() {
    if (typeof window === 'undefined') return false

    try {
      const entries = await db.timeEntries.toArray()
      let validCount = 0
      let issues = []
      
      for (const entry of entries) {
        if (!entry.date) issues.push(`Entry ${entry.id}: Missing date`)
        if (!entry.startTime) issues.push(`Entry ${entry.id}: Missing startTime`)
        if (typeof entry.startTime !== 'number') issues.push(`Entry ${entry.id}: Invalid startTime type`)
        else validCount++
      }
      
      if (issues.length === 0) {
        console.log(`[Storage Debug] ✅ Data integrity check passed (${validCount} entries)`)
        return true
      } else {
        console.error('[Storage Debug] ❌ Data integrity issues found:', issues)
        return false
      }
    } catch (e) {
      console.error('[Storage Debug] ❌ Data integrity check failed - DB error:', e)
      return false
    }
  }
}

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).debugStorage = debugStorage
}

