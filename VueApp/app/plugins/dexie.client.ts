import { db } from '@/utils/db'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Database is already initialized as singleton in db.ts
    // This plugin just ensures it's available in the app context if needed
    // and handles any specific client-side initialization
    
    return {
      provide: {
        db
      }
    }
  }
})
