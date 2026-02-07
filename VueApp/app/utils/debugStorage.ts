/**
 * Debug utility for monitoring localStorage
 */

export const debugStorage = {
  /**
   * Logs current localStorage state for debugging
   */
  logStorageState() {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('[Storage Debug] localStorage not available (SSR context)')
      return
    }

    console.group('🔍 [Storage Debug] Current localStorage State')
    
    const keys = Object.keys(localStorage)
    console.log('Total keys:', keys.length)
    
    keys.forEach(key => {
      const value = localStorage.getItem(key)
      const size = value ? value.length : 0
      
      if (key === 'timeEntries') {
        console.group(`📦 ${key} (${size} bytes)`)
        try {
          const parsed = JSON.parse(value || '{}')
          console.log('Parsed data:', parsed)
          if (parsed.entries) {
            console.log('Entries count:', parsed.entries.length)
            console.table(parsed.entries.map((e: any) => ({
              id: e.id,
              date: e.date,
              startTime: new Date(e.startTime).toLocaleString(),
              endTime: e.endTime ? new Date(e.endTime).toLocaleString() : 'N/A'
            })))
          }
        } catch (e) {
          console.error('Failed to parse:', e)
        }
        console.groupEnd()
      } else {
        console.log(`${key}: ${size} bytes`)
      }
    })
    
    console.groupEnd()
  },

  /**
   * Monitor localStorage changes
   */
  watchStorage() {
    if (typeof window === 'undefined') return

    console.log('[Storage Debug] Monitoring localStorage changes...')
    
    // Store original setItem
    const originalSetItem = localStorage.setItem
    const originalRemoveItem = localStorage.removeItem
    const originalClear = localStorage.clear

    // Override setItem
    localStorage.setItem = function(key: string, value: string) {
      console.log('[Storage Debug] localStorage.setItem called', { 
        key, 
        valueLength: value.length,
        timestamp: new Date().toISOString()
      })
      if (key === 'timeEntries') {
        try {
          const parsed = JSON.parse(value)
          console.log('[Storage Debug] timeEntries data:', {
            entriesCount: parsed.entries?.length || 0,
            preview: parsed.entries?.slice(0, 3)
          })
        } catch (e) {
          console.error('[Storage Debug] Failed to parse timeEntries:', e)
        }
      }
      originalSetItem.apply(this, [key, value])
    }

    // Override removeItem
    localStorage.removeItem = function(key: string) {
      console.warn('[Storage Debug] localStorage.removeItem called', { 
        key,
        timestamp: new Date().toISOString()
      })
      originalRemoveItem.apply(this, [key])
    }

    // Override clear
    localStorage.clear = function() {
      console.error('[Storage Debug] ⚠️ localStorage.clear called! All data will be lost!', {
        timestamp: new Date().toISOString(),
        stack: new Error().stack
      })
      originalClear.apply(this)
    }
  },

  /**
   * Export current data as JSON
   */
  exportData() {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.error('[Storage Debug] localStorage not available')
      return null
    }

    const data = localStorage.getItem('timeEntries')
    if (!data) {
      console.warn('[Storage Debug] No timeEntries data found')
      return null
    }

    try {
      const parsed = JSON.parse(data)
      const exportData = {
        exportedAt: new Date().toISOString(),
        data: parsed
      }
      
      console.log('[Storage Debug] Data exported:', exportData)
      
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
  verifyIntegrity() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }

    const data = localStorage.getItem('timeEntries')
    if (!data) {
      console.warn('[Storage Debug] ⚠️ No data in localStorage')
      return false
    }

    try {
      const parsed = JSON.parse(data)
      const isValid = parsed && Array.isArray(parsed.entries)
      
      if (isValid) {
        console.log('[Storage Debug] ✅ Data integrity check passed', {
          entriesCount: parsed.entries.length
        })
      } else {
        console.error('[Storage Debug] ❌ Data integrity check failed - invalid structure')
      }
      
      return isValid
    } catch (e) {
      console.error('[Storage Debug] ❌ Data integrity check failed - parse error:', e)
      return false
    }
  }
}

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).debugStorage = debugStorage
}
