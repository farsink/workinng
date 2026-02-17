<template>
  <div class="relative w-full max-w-md h-screen flex flex-col bg-[#121212] overflow-hidden mx-auto">
    <!-- Header -->
    <div class="pt-8 px-6 pb-2">
      <h1 class="text-3xl font-bold tracking-tight text-white">Settings</h1>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-24 h-24 rounded-3xl bg-base-content/5 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      
      <h2 class="text-xl font-bold text-white mb-2">Coming Soon</h2>
      <p class="text-base-content/60 max-w-xs">
        App configuration and preferences will be available here soon.
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
