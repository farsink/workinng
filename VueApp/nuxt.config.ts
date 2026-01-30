// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true, // Universal Mode (SSR + Client Hydration)
  srcDir: 'app', // Set app as the source directory

  modules: [
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@pinia-plugin-persistedstate/nuxt'
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Time Tracker PWA',
      short_name: 'TimeTrack',
      description: 'Daily work hours tracker',
      theme_color: '#4DBA87',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
