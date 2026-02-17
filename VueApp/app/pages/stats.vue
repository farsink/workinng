<template>
  <div class="relative w-full max-w-md h-screen flex flex-col bg-[#121212] overflow-hidden mx-auto">
    <!-- Header -->
    <div class="pt-8 px-6 pb-2">
      <h1 class="text-3xl font-bold tracking-tight text-white">Stats</h1>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-24 h-24 rounded-3xl bg-base-content/5 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      
      <h2 class="text-xl font-bold text-white mb-2">Coming Soon</h2>
      <p class="text-base-content/60 max-w-xs">
        Advanced analytics and detailed reports are currently under development.
      </p>
    </div>

    <!-- Bottom Nav -->
    <BottomNav @add="openAddModal" />
    
    <!-- Edit Modal (needed for Nav functionality) -->
    <AddEntryModal ref="addModal" :selected-date="new Date().toISOString().split('T')[0]" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import AddEntryModal from '@/components/entry/AddEntryModal.vue'

const addModal = ref<InstanceType<typeof AddEntryModal> | null>(null)

const openAddModal = () => {
  addModal.value?.open()
}
</script>
