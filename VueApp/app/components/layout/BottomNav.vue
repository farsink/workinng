<template>
  <div class="fixed bottom-8 left-0 right-0 px-6 max-w-md mx-auto z-50">
    <nav class="bg-base-200/90 backdrop-blur-xl rounded-3xl p-1.5 shadow-2xl border border-base-content/5">
      <div class="grid grid-cols-4 items-center gap-1">
        <button class="flex flex-col items-center justify-center gap-1 py-3 px-1 text-base-content/40 hover:text-base-content transition-all rounded-2xl hover:bg-base-content/5 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-[10px] font-semibold tracking-wide">History</span>
        </button>

        <button class="flex flex-col items-center justify-center gap-1 py-3 px-1 text-base-content/40 hover:text-base-content transition-all rounded-2xl hover:bg-base-content/5 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="text-[10px] font-semibold tracking-wide">Stats</span>
        </button>

        <div class="relative flex justify-center items-center">
          <button 
            class="w-full h-[72px] bg-primary rounded-2xl flex items-center justify-center text-base-100 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            @click="$emit('add')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <button class="flex flex-col items-center justify-center gap-1 py-3 px-1 text-base-content/40 hover:text-base-content transition-all rounded-2xl hover:bg-base-content/5 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-[10px] font-semibold tracking-wide">Settings</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'add'): void
}>()
</script>
