import { computed } from 'vue'
import type { TimeEntry } from '@/utils/db'

export interface ExportFilters {
  startDate: string
  endDate: string
  workType: 'all' | 'overtime' | 'regular'
}

export const useCSVExport = () => {
  /**
   * Format date as DD/MM/YYYY
   */
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  /**
   * Get day of week name
   */
  const getDayName = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }

  /**
   * Format time as HH:MM AM/PM
   */
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  /**
   * Calculate duration in decimal hours
   */
  const calculateHours = (startTime: number, endTime: number): string => {
    const durationMs = endTime - startTime
    const hours = durationMs / (1000 * 60 * 60)
    return hours.toFixed(1)
  }

  /**
   * Format timing range
   */
  const formatTiming = (startTime: number, endTime: number): string => {
    return `${formatTime(startTime)} TO ${formatTime(endTime)}`
  }

  /**
   * Escape CSV field (handle commas, quotes, newlines)
   */
  const escapeCSVField = (field: string): string => {
    if (!field) return ''
    // If field contains comma, quote, or newline, wrap in quotes and escape quotes
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`
    }
    return field
  }

  /**
   * Filter entries based on criteria
   */
  const filterEntries = (entries: TimeEntry[], filters: ExportFilters): TimeEntry[] => {
    return entries.filter(entry => {
      // Date range filter
      if (entry.date < filters.startDate || entry.date > filters.endDate) {
        return false
      }

      // Work type filter
      if (filters.workType === 'overtime' && !entry.isOvertime) {
        return false
      }
      if (filters.workType === 'regular' && entry.isOvertime) {
        return false
      }

      return true
    })
  }

  /**
   * Generate CSV content
   */
  const generateCSV = (entries: TimeEntry[], filters: ExportFilters): string => {
    // Filter entries
    const filteredEntries = filterEntries(entries, filters)

    // Sort by date
    const sortedEntries = [...filteredEntries].sort((a, b) => 
      a.date.localeCompare(b.date) || a.startTime - b.startTime
    )

    // Determine title based on work type
    let title = 'all_work_data'
    if (filters.workType === 'overtime') {
      title = 'overtime_work_data'
    } else if (filters.workType === 'regular') {
      title = 'regular_work_data'
    }

    // Build CSV
    const lines: string[] = []
    
    // Title row
    lines.push(title)
    
    // Header row
    lines.push('Day,Date,Hours,Timing,Notes')

    // Data rows
    sortedEntries.forEach(entry => {
      const day = getDayName(entry.date)
      const date = formatDate(entry.date)
      const hours = calculateHours(entry.startTime, entry.endTime || Date.now())
      const timing = formatTiming(entry.startTime, entry.endTime || Date.now())
      const notes = escapeCSVField(entry.tasks || '')

      lines.push(`${day},${date},${hours},${timing},${notes}`)
    })

    return lines.join('\r\n') // Use CRLF for Excel compatibility
  }

  /**
   * Trigger CSV download
   */
  const downloadCSV = (csvContent: string, filename: string = 'work_data.csv') => {
    // Create blob with UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    
    // Create download link
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
  }

  /**
   * Export entries to CSV
   */
  const exportToCSV = (entries: TimeEntry[], filters: ExportFilters) => {
    const csvContent = generateCSV(entries, filters)
    
    // Generate filename with date range
    const filename = `work_data_${filters.startDate}_to_${filters.endDate}.csv`
    
    downloadCSV(csvContent, filename)
  }

  return {
    exportToCSV,
    generateCSV,
    downloadCSV,
    filterEntries
  }
}
