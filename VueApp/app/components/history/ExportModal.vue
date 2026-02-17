<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    @click.self="close"
  >
    <div class="bg-base-100 rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-base-content/10">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-base-content/10">
        <h2 class="text-xl font-bold text-white">Export to CSV</h2>
        <p class="text-sm text-base-content/60 mt-1">Select date range and work type to export</p>
      </div>

      <!-- Content -->
      <div class="px-6 py-6 space-y-6">
        <!-- Date Range Section -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-base-content/80 uppercase tracking-wide">Date Range</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Start Date -->
            <div>
              <label class="block text-xs text-base-content/60 mb-2">Start Date</label>
              <input
                v-model="filters.startDate"
                type="date"
                class="w-full px-3 py-2 bg-base-200 border border-base-content/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <!-- End Date -->
            <div>
              <label class="block text-xs text-base-content/60 mb-2">End Date</label>
              <input
                v-model="filters.endDate"
                type="date"
                class="w-full px-3 py-2 bg-base-200 border border-base-content/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <!-- Work Type Section -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-base-content/80 uppercase tracking-wide">Work Type</h3>
          
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-content/5 cursor-pointer transition-colors">
              <input
                v-model="filters.workType"
                type="radio"
                value="all"
                class="w-4 h-4 text-primary focus:ring-primary"
              />
              <span class="text-sm text-white">All Work Data</span>
            </label>

            <label class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-content/5 cursor-pointer transition-colors">
              <input
                v-model="filters.workType"
                type="radio"
                value="overtime"
                class="w-4 h-4 text-primary focus:ring-primary"
              />
              <span class="text-sm text-white">Overtime Only</span>
            </label>

            <label class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-content/5 cursor-pointer transition-colors">
              <input
                v-model="filters.workType"
                type="radio"
                value="regular"
                class="w-4 h-4 text-primary focus:ring-primary"
              />
              <span class="text-sm text-white">Regular Work Only</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-base-200/50 border-t border-base-content/10 flex gap-3">
        <button
          class="flex-1 px-4 py-3 rounded-xl bg-base-content/10 text-white font-medium hover:bg-base-content/20 transition-colors"
          @click="close"
        >
          Cancel
        </button>
        <button
          class="flex-1 px-4 py-3 rounded-xl bg-primary text-base-100 font-medium hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          @click="handleExport"
        >
          Export CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ExportFilters } from '@/composables/useCSVExport'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'export', filters: ExportFilters): void
}>()

// Initialize with current month
const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

const filters = ref<ExportFilters>({
  startDate: firstDay.toISOString().split('T')[0],
  endDate: lastDay.toISOString().split('T')[0],
  workType: 'all'
})

const close = () => {
  emit('close')
}

const handleExport = () => {
  emit('export', filters.value)
  close()
}
</script>
