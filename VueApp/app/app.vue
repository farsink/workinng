<template>
  <div class="dark">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { debugStorage } from '@/utils/debugStorage'

// Configure PWA icons and meta tags
useHead({
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
  ],
  meta: [
    { name: 'theme-color', content: '#000000' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
  ]
})

// Apply dark mode globally
onMounted(() => {
  document.documentElement.classList.add('dark')
  
  // Initialize debugging
  console.log('='.repeat(60))
  console.log('🚀 Worklog App Initialized')
  console.log('='.repeat(60))
  console.log('Time:', new Date().toLocaleString())
  console.log('User Agent:', navigator.userAgent)
  console.log('localStorage available:', typeof localStorage !== 'undefined')
  
  // Log initial storage state
  debugStorage.logStorageState()
  
  // Start monitoring localStorage changes
  debugStorage.watchStorage()
  
  // Verify data integrity
  const isValid = debugStorage.verifyIntegrity()
  if (!isValid) {
    console.warn('⚠️ No valid data found in localStorage - this is normal on first launch')
  }
  
  console.log('='.repeat(60))
  console.log('💡 Debug utilities available in console:')
  console.log('  window.debugStorage.logStorageState() - View current storage')
  console.log('  window.debugStorage.exportData() - Download backup JSON')
  console.log('  window.debugStorage.verifyIntegrity() - Check data validity')
  console.log('='.repeat(60))
})

onBeforeUnmount(() => {
  console.log('⏳ App unmounting - final storage state:')
  debugStorage.logStorageState()
})
</script>
