<template>
  <header class="flex items-center justify-between px-6 pt-12 pb-4 w-full z-10 bg-base-100/95 backdrop-blur-sm sticky top-0">
    <h2 class="text-base-content text-lg font-bold leading-tight tracking-tight">
      {{ formattedDate }}
    </h2>
    <div class="flex items-center gap-2">
      <div v-if="syncStatus === 'offline'" class="badge badge-warning gap-1 text-xs font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        Local Only
      </div>
      <button class="flex items-center justify-center text-base-content/80 hover:text-primary transition-colors">
      <svg v-if="syncStatus === 'syncing'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  syncStatus?: 'synced' | 'syncing' | 'offline'
}>()

const syncStatus = computed(() => props.syncStatus || 'offline')

const syncStatusText = computed(() => {
  switch (syncStatus.value) {
    case 'synced': return 'All changes saved'
    case 'syncing': return 'Syncing...'
    case 'offline': return 'Offline mode'
    default: return ''
  }
})

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(new Date())
})
</script>
