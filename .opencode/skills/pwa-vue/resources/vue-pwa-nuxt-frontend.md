---
name: using-vue-pwa-nuxt-frontend
description: Configures Nuxt.js for Progressive Web App (PWA) functionality, handling offline support, caching strategies, and update prompts. Use when building performant, installable, and resilient web applications with Vue.js and Nuxt.
---

# Using Vue PWA with Nuxt Frontend

> [!NOTE]
> This resource is part of the [architecting-vue-pwa-apps](../SKILL.md) skill. It provides Nuxt-specific guidance for PWA development.

## Quick Start

This section provides a minimal setup to get a Nuxt 3 PWA running with basic offline capabilities and an update prompt.

**1. Install Nuxt 3:**
If you don't have a Nuxt 3 project, create one:
```bash
npx nuxi init nuxt-pwa-app
cd nuxt-pwa-app
npm install
```

**2. Install `vite-plugin-pwa`:**
This is the recommended plugin for PWA features in Vite-based projects like Nuxt 3.

```bash
npm install vite-plugin-pwa -D
```

**3. Configure `nuxt.config.ts`:**
Add `vite-plugin-pwa` to your Vite configuration and define basic PWA options.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'vite-plugin-pwa'
  ],
  // PWA module options
  pwa: {
    meta: {
      name: 'My Nuxt PWA App',
      description: 'A PWA built with Nuxt 3',
      theme_color: '#ffffff',
      apple_mobile_web_app_capable: 'yes',
      apple_mobile_web_app_status_bar_style: 'default',
      lang: 'en',
      ogType: 'website',
      ogSiteName: 'My Nuxt PWA App',
      ogTitle: 'My Nuxt PWA App',
      ogDescription: 'A PWA built with Nuxt 3',
      ogImage: '/icon.png',
      twitterCard: 'summary_large_image',
      twitterTitle: 'My Nuxt PWA App',
      twitterDescription: 'A PWA built with Nuxt 3',
      twitterImage: '/icon.png',
    },
    manifest: {
      name: 'My Nuxt PWA App',
      short_name: 'NuxtPWA',
      description: 'A PWA built with Nuxt 3',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'icon.png',
          sizes: 'any',
          type: 'image/png'
        },
        {
          src: 'icon.svg',
          sizes: 'any',
          type: 'image/svg+xml'
        }
      ]
    },
    // PWA configuration options
    registerType: 'autoUpdate', // Automatically registers and updates the service worker
    workbox: {
      // Configuration for Workbox
      // For example, precaching specific assets
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'nuxt-pwa-cache',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 60 * 60 * 24 * 7 // Cache for 7 days
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true // Enable PWA features in development
    }
  }
})
```

**4. Add an Icon:**
Create an `public/icon.png` (or other specified icon) file for your PWA.

**5. Implement Update Prompt (Optional but Recommended):**
Modify `app.vue` to show a prompt when a new version is available.

```vue
<template>
  <div>
    <NuxtPage />
    <div v-if="updateAvailable" class="update-prompt">
      A new version is available. <button @click="refreshApp">Refresh</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNuxtApp, reloadNuxtApp } from '#app'; // Use Nuxt app instance

const nuxtApp = useNuxtApp();
const updateAvailable = ref(false);

// Nuxt 3.8.0+ Manifest Hook for update detection
nuxtApp.hook('app:manifest:update', () => {
  console.log('New manifest detected, update available.');
  updateAvailable.value = true;
});

function refreshApp() {
  console.log('Refreshing app...');
  reloadNuxtApp({
    path: '/', // Path to reload, usually root
    persistState: false, // Whether to persist Nuxt app state
  });
}
</script>

<style>
.update-prompt {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: #333;
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
}
</style>
```

**6. Run your Nuxt app:**
```bash
npm run dev
```
Now, when you navigate to `http://localhost:3000` in your browser, you should see PWA features enabled (e.g., you can "Add to Home Screen" on supported devices/browsers).

## Core Concepts

*   **Nuxt.js as a Full-Stack Framework:** Nuxt is a Vue.js framework that provides an intuitive and performant way to build full-stack web applications. It handles routing, server-side rendering (SSR), code splitting, and auto-imports out-of-the-box.
*   **Progressive Web App (PWA):** PWAs enhance web applications with native app-like features, including offline accessibility, installability, and background sync, through service workers and web app manifests.
*   **Vite:** Nuxt 3 uses Vite by default as its build tool, providing fast hot module replacement (HMR) during development and optimized production builds. `vite-plugin-pwa` integrates PWA capabilities seamlessly with Vite.
*   **`vite-plugin-pwa`:** A zero-configuration PWA plugin for Vite that simplifies PWA integration. It handles the generation of service workers and manifest files.
*   **Service Workers:** JavaScript scripts that run in the background, separate from the web page, enabling features like offline caching, push notifications, and background sync.
*   **Web App Manifest:** A JSON file that provides metadata about the web application, allowing browsers to display it in a more app-like manner (e.g., standalone window, icons).
*   **Server-Side Rendering (SSR) vs. Static Site Generation (SSG) vs. Client-Side Rendering (CSR):** Nuxt supports multiple rendering modes. For PWAs, SSR provides a fast initial load and SEO benefits, while SSG generates fully static assets. PWA functionality works across these modes, often leveraging client-side JavaScript for dynamic features after the initial load.
*   **`@nuxt/pwa` (Nuxt 2):** While `vite-plugin-pwa` is preferred for Nuxt 3, the `@nuxt/pwa` module was the standard for Nuxt 2, offering similar PWA features.

## Essential Patterns

### 1. Basic PWA Setup with `vite-plugin-pwa`

This pattern involves installing the plugin, configuring it in `nuxt.config.ts`, and providing necessary assets like icons.

**Description:**
The simplest way to enable PWA features. It automatically generates a service worker and a manifest file based on provided configurations.

**Code Example:**
*(See Quick Start section for `nuxt.config.ts` configuration and `public/icon.png` requirement)*

**Expected Output/Behavior:**
- A service worker (`sw.js`) is generated and registered.
- A web app manifest (`manifest.json`) is generated.
- The application can be "Add to Home Screen" on supported devices.
- Basic caching is enabled by default.

### 2. Handling Application Updates

This pattern focuses on notifying users when a new version of the PWA is available and facilitating an update.

**Description:**
Leverages Nuxt's lifecycle hooks and `reloadNuxtApp` to detect manifest changes and prompt the user for a refresh, ensuring they get the latest code.

**Code Example:**
*(See Quick Start section for `app.vue` implementation)*

**Expected Output/Behavior:**
- When `vite-plugin-pwa` detects a new manifest (after a deployment and cache clear/refresh), the `updateAvailable` ref becomes true.
- A prompt appears in the UI.
- Clicking "Refresh" calls `reloadNuxtApp` to load the new version of the application.

### 3. Customizing Service Worker Cache Strategies

Tailoring Workbox's caching to specific routes or asset types can optimize performance and offline capabilities.

**Description:**
Using `workbox.runtimeCaching` in `nuxt.config.ts` to define different caching strategies (e.g., `CacheFirst`, `NetworkFirst`, `StaleWhileRevalidate`) for various URL patterns.

**Code Example:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vite-plugin-pwa'],
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      // Cache API requests separately
      runtimeCaching: [
        {
          urlPattern: '/api/.*', // Example: Cache all API requests
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10, // Timeout for network request
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5 // Cache API responses for 5 minutes
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|gif|svg)$/, // Cache images
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // Cache images for 30 days
            }
          }
        },
        // Default caching for other assets (as in Quick Start)
        {
          urlPattern: '/',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'nuxt-pwa-cache',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 60 * 60 * 24 * 7 // Cache for 7 days
            }
          }
        }
      ],
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'], // Precache these assets
    },
    // ... other PWA options
  }
})
```

**Expected Output/Behavior:**
- API requests will try the network first, fall back to cache, and cache responses for 5 minutes.
- Image requests will be served from cache first if available, otherwise fetched from the network and cached.
- Other assets listed in `globPatterns` are precached.

### 4. Implementing "Offline" Mode UI

Providing a user-friendly interface when the application is offline.

**Description:**
Using Nuxt's error handling (`error.vue`) or window events (`online`, `offline`) to detect network status and display custom UI elements or messages.

**Code Example (using `app.vue` and `error.vue`):**

`app.vue`:
```vue
<template>
  <div>
    <NuxtErrorBoundary>
      <NuxtPage />
      <template #error="{ error }">
        <div v-if="error.statusCode === 503">
          <h1>You are offline!</h1>
          <p>Please check your internet connection.</p>
          <button @click="refreshApp">Try Again</button>
        </div>
        <div v-else>
          <h1>An error occurred</h1>
          <p>{{ error.message }}</p>
          <button @click="refreshApp">Retry</button>
        </div>
      </template>
    </NuxtErrorBoundary>

    <div v-if="updateAvailable" class="update-prompt">
      A new version is available. <button @click="refreshApp">Refresh</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNuxtApp, reloadNuxtApp } from '#app';

const nuxtApp = useNuxtApp();
const updateAvailable = ref(false);

// Detect online/offline status using window events
const isOnline = ref(navigator.onLine);
const handleOnline = () => isOnline.value = true;
const handleOffline = () => isOnline.value = false;

onMounted(() => {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
});

onUnmounted(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
});

nuxtApp.hook('app:manifest:update', () => {
  updateAvailable.value = true;
});

function refreshApp() {
  if (!isOnline.value) {
    alert("You are still offline. Cannot refresh.");
    return;
  }
  reloadNuxtApp({ persistState: false });
}
</script>

<style>
/* ... existing styles ... */
.update-prompt { /* ... */ }
</style>
```

`error.vue` (in the root of your project):
```vue
<template>
  <div>
    <div v-if="error.statusCode === 503">
      <h1>You are offline!</h1>
      <p>Please check your internet connection.</p>
      <button @click="handleErrorClear">Refresh</button>
    </div>
    <div v-else>
      <h1>An error occurred</h1>
      <p>{{ error.message }}</p>
      <button @click="handleErrorClear">Retry</button>
    </div>
  </div>
</template>

<script setup>
// Access the Nuxt error object
const props = defineProps({
  error: Object
});

// Clear the error and retry navigation
const handleErrorClear = () => clearError({ redirect: '/' });
</script>

```

**Expected Output/Behavior:**
- If the network connection is lost, `isOnline` becomes `false`. The `NuxtErrorBoundary` could catch specific network-related errors (e.g., fetching data that fails due to no connection) and display an offline message. A `503 Service Unavailable` status could be manually thrown or caught.
- When the user tries to refresh while offline, a message prompts them to check their connection.
- If using `error.vue` directly to handle offline errors, it provides a dedicated screen.

### 5. Integrating VueUse `useOnline`

A more declarative and reactive way to manage online/offline state.

**Description:**
Using the `useOnline` composable from the VueUse library to get a reactive boolean indicating the network status.

**Code Example:**

Install VueUse:
```bash
npm install @vueuse/core
```

Modify `app.vue`:
```vue
<template>
  <div>
    <NuxtPage />
    <div v-if="!isOnline" class="offline-banner">
      You are offline. Some features may not be available.
    </div>
     <div v-if="updateAvailable" class="update-prompt">
      A new version is available. <button @click="refreshApp">Refresh</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useOnline } from '@vueuse/core';
import { useNuxtApp, reloadNuxtApp } from '#app';

const isOnline = useOnline(); // Reactive boolean: true if online, false if offline
const nuxtApp = useNuxtApp();
const updateAvailable = ref(false);

nuxtApp.hook('app:manifest:update', () => {
  updateAvailable.value = true;
});

function refreshApp() {
  if (!isOnline.value) {
    alert("You are still offline. Cannot refresh.");
    return;
  }
  reloadNuxtApp({ persistState: false });
}
</script>

<style>
.offline-banner {
  background-color: #f44336; /* Red */
  color: white;
  padding: 10px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
}
/* ... existing update-prompt styles ... */
</style>
```

**Expected Output/Behavior:**
- `isOnline` automatically updates based on the browser's network status.
- A persistent banner informs the user if they are offline.
- PWA update logic remains the same.

## Authentication & Setup

Nuxt.js itself doesn't directly handle PWA authentication, but PWAs built with Nuxt can implement various authentication strategies:

1.  **Token-based Authentication (JWT):**
    *   Store tokens (e.g., JWT) in `localStorage` or `sessionStorage`.
    *   Use Nuxt API routes (`server/api/`) to handle login/logout requests.
    *   In `nuxt.config.ts`, configure `runtimeCaching` to cache API responses appropriately.
    *   Use composables to fetch protected data, attaching the token in the `Authorization` header.
    *   For offline scenarios, consider storing sensitive data locally using tools like `dexie.js` or `localforage`.

2.  **OAuth / Third-Party Authentication:**
    *   Use libraries like `next-auth` (though check for Nuxt compatibility/alternatives) or dedicated Nuxt OAuth modules.
    *   Nuxt Nitro server can handle callbacks from OAuth providers.
    *   Similar to JWT, store session tokens or cookies securely.

**Environment Setup:**

*   **Node.js:** Ensure a recent LTS version of Node.js is installed.
*   **npm/yarn/pnpm:** A package manager is required.
*   **Nuxt CLI:** `npx nuxi` is used for project commands.
*   **Vite:** Integrated by default in Nuxt 3.

**Configuration:**
The primary configuration file is `nuxt.config.ts`. PWA-specific settings are nested under the `pwa` key. Vite configurations are nested under `vite`.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ... other configurations
  pwa: {
    // PWA manifest and meta options
    // ...
    workbox: {
      // Workbox specific configurations
      // ...
    },
    // Other vite-plugin-pwa options
    registerType: 'autoUpdate',
    devOptions: {
      enabled: process.env.NODE_ENV === 'development', // Enable in dev
    },
    client: {
      installPrompt: true, // Show install prompt on mobile
      // Acknowledge that the prompt is shown
      skipWaiting: true,
    },
    scope: '/', // Service worker scope
    // ...
  },
  vite: {
    // Vite specific configurations if needed
  },
  // ...
})
```

## Common Pitfalls

### 1. Service Worker Not Updating

*   **Symptom:** Users are stuck on an older version of the PWA even after a new deployment; manual cache clearing is required.
*   **Root Cause:** The browser's cache holds onto the old service worker script, which prevents the new one from being registered. Or, the update detection mechanism isn't triggered correctly.
*   **Solution:**
    *   Ensure `vite-plugin-pwa` is configured with `registerType: 'autoUpdate'`.
    *   Implement the `app:manifest:update` hook to trigger a user-facing refresh prompt.
    *   In production deployments, ensure any CDN or edge caching for `sw.js` is bypassed or appropriately invalidated.
    *   Use `skipWaiting: true` in `pwa.client` options to allow the new service worker to take control immediately.

    ```typescript
    // nuxt.config.ts
    export default defineNuxtConfig({
      modules: ['vite-plugin-pwa'],
      pwa: {
        // ... other options
        registerType: 'autoUpdate',
        client: {
          skipWaiting: true, // Important for immediate updates
        },
        // ...
      }
    })
    ```
    *(Refer to Quick Start for `app.vue` update prompt logic)*

### 2. `manifest.json` or `sw.js` Not Found (404 Errors)

*   **Symptom:** Browser console shows 404 errors for `/manifest.json` or `/sw.js`.
*   **Root Cause:** The PWA assets are not being generated or served correctly. This can happen if the `vite-plugin-pwa` is not properly installed or configured, or if there are conflicts with the build process.
*   **Solution:**
    *   Verify `vite-plugin-pwa` is listed in `modules` in `nuxt.config.ts`.
    *   Ensure the `pwa` configuration object is present and syntactically correct.
    *   Check that the `public/` directory exists and contains any necessary icon files referenced in the manifest.
    *   Run `npm run build` to see if assets are generated in the `.output/public/` directory.

### 3. Service Worker Not Registering in Development

*   **Symptom:** PWA features (like offline caching) don't work during local development.
*   **Root Cause:** The `devOptions.enabled` flag for `vite-plugin-pwa` might be `false` or environment-specific.
*   **Solution:** Ensure `devOptions.enabled` is set to `true` or is conditionally enabled for the development environment in `nuxt.config.ts`.

    ```typescript
    // nuxt.config.ts
    export default defineNuxtConfig({
      // ...
      pwa: {
        // ... other options
        devOptions: {
          enabled: true, // Ensure PWA features are enabled in development
        },
        // ...
      }
      // ...
    })
    ```

### 4. Caching Issues with API Routes

*   **Symptom:** Stale data from API endpoints is served when offline, or API data isn't updating correctly.
*   **Root Cause:** Incorrect `runtimeCaching` strategy or cache expiration settings for API routes.
*   **Solution:**
    *   Use `NetworkFirst` or `StaleWhileRevalidate` for API routes that change frequently.
    *   Set appropriate `maxAgeSeconds` and `maxEntries` to balance cache freshness and storage.
    *   Consider excluding sensitive data or dynamic content that shouldn't be cached offline.

    ```typescript
    // nuxt.config.ts
    pwa: {
      workbox: {
        runtimeCaching: [
          {
            urlPattern: '/api/.*',
            handler: 'NetworkFirst', // Or 'StaleWhileRevalidate'
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // Cache for 5 minutes
              },
            },
          },
          // ... other cache rules
        ],
      },
      // ...
    }
    ```

### 5. `useNuxtApp().hook('app:manifest:update')` Not Firing

*   **Symptom:** The update prompt logic never triggers, even after new deployments.
*   **Root Cause:** The hook might be placed incorrectly, or the PWA module is not correctly integrated to emit this event. Sometimes, browser caching of the service worker can interfere.
*   **Solution:**
    *   Ensure the hook is placed within `setup()` in `app.vue` or a top-level composable.
    *   Verify `vite-plugin-pwa` is correctly configured and the `registerType` is appropriate (e.g., `autoUpdate`).
    *   Clear browser cache and service worker cache manually during testing to ensure the latest `sw.js` is active.

### 6. Console Errors Related to Service Worker Scope or Lifecycle

*   **Symptom:** Errors like "Uncaught DOMException: Failed to register a ServiceWorker..." or issues with `navigator.serviceWorker.ready`.
*   **Root Cause:** Conflicts with other service workers, incorrect `scope` configuration, or issues during the service worker's installation/activation lifecycle.
*   **Solution:**
    *   Ensure the `scope` in `nuxt.config.ts` (`pwa.scope`) correctly matches the intended directory structure. The default (`/`) is usually correct.
    *   If multiple PWAs are tested on the same origin, unregister previous service workers via browser DevTools (`Application` tab -> `Service Workers` -> `Unregister`).
    *   Check `workboxOptions` for any custom configurations that might interfere.

### 7. PWA Install Prompt Not Showing

*   **Symptom:** The "Add to Home Screen" prompt doesn't appear on mobile devices or supported browsers.
*   **Root Cause:** The PWA doesn't meet the browser's criteria for showing the prompt (e.g., requires HTTPS, manifest is correctly linked, service worker is active, app is not already installed).
*   **Solution:**
    *   Ensure the site is served over HTTPS (except for `localhost`).
    *   Verify `manifest.json` is correctly generated and linked (usually handled by `vite-plugin-pwa`).
    *   Ensure the service worker is registered and controlling the pages (`navigator.serviceWorker.controller` should not be null).
    *   Add `client: { installPrompt: true }` to `pwa` options in `nuxt.config.ts`.
    *   Make sure the manifest includes required properties like `display: 'standalone'` and `start_url`.

## Best Practices

*   **Use HTTPS:** PWAs require a secure connection to function correctly, especially for service workers.
*   **Optimize Assets:** Compress images, minify CSS/JS, and use modern formats (like WebP) to reduce load times and data usage. Nuxt/Vite handle much of this automatically.
*   **Strategic Caching:** Don't cache everything indefinitely. Use appropriate caching strategies (`NetworkFirst`, `CacheFirst`, `StaleWhileRevalidate`) based on the content type and update frequency. Cache essential assets for offline use.
*   **Informative Offline States:** Clearly communicate to users when they are offline and what functionality might be limited. Provide an easy way to retry actions.
*   **Seamless Updates:** Implement the update detection and prompt mechanism. Aim for a smooth transition so users always have the latest version without disruption. Use `skipWaiting: true` for faster activation.
*   **Thorough Testing:** Test PWA features across different browsers, devices, and network conditions (including simulated offline mode in DevTools).
*   **Respect User Data:** Be mindful of caching sensitive information. Provide options for users to clear cache if necessary.
*   **Keep it Lean:** Avoid unnecessary dependencies and large assets that bloat the PWA size and slow down initial loading.
*   **Accessibility:** Ensure PWA features and offline modes are accessible to all users, including those using screen readers.

## API Reference

This refers to the configuration options available within `nuxt.config.ts` for `vite-plugin-pwa`.

**`pwa` Object:**

| Option                   | Type                               | Description                                                                                                                                  | Default       |
| :----------------------- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| `meta`                   | `VitePwaMetaOptions`               | SEO and meta tags configuration. Extends `head` object in Nuxt automatically.                                                                | `{}`          |
| `manifest`               | `ManifestOptions`                  | Web App Manifest configuration (`name`, `short_name`, `icons`, `start_url`, etc.).                                                           | `{}`          |
| `registerType`           | `'autoUpdate' | 'prompt' | 'inline'` | How the service worker is registered. `'autoUpdate'` handles updates automatically. `'prompt'` asks the user. `'inline'` registers SW directly. | `'autoUpdate'`|
| `workbox`                | `VitePwaWorkboxOptions`            | Configuration for Workbox, crucial for caching strategies (`globPatterns`, `runtimeCaching`, etc.).                                         | `{}`          |
| `devOptions`             | `VitePwaDevOptions`                | Options specific to development mode (e.g., `enabled`).                                                                                      | `{ enabled: true }` |
| `buildLocalDistDirectory`| `boolean`                          | Whether to build PWA assets into the local `.nuxt/dist/client` directory. Useful for debugging or specific deployment workflows.              | `false`       |
| `injectRegister`         | `boolean | 'script'`                | How the service worker registration script is injected.                                                                                      | `true`        |
| `injectManifest`         | `boolean`                          | If true, injects PWA assets into the `sw.js` file.                                                                                           | `true`        |
| `srcDir`                 | `string`                           | Source directory relative to Nuxt root.                                                                                                      | `undefined`   |
| `filename`               | `string`                           | Name for the service worker file (e.g., `sw.js`).                                                                                            | `'sw.js'`     |
| `base`                   | `string`                           | Base public path for PWA assets.                                                                                                             | `'/'`         |
| `scope`                  | `string`                           | Service worker scope.                                                                                                                        | `'/'`         |
| `strategies`             | `VitePwaStrategies`                | Options for different caching strategies.                                                                                                    | `undefined`   |
| `plugins`                | `string[]`                         | Array of paths to custom Workbox plugins.                                                                                                    | `[]`          |
| `skipWaiting`            | `boolean`                          | Alias for `client.skipWaiting`.                                                                                                              | `undefined`   |
| `client`                 | `VitePwaClient`                    | Options for client-side PWA behavior (`installPrompt`, `skipWaiting`).                                                                       | `{}`          |

**`workbox` Options (`VitePwaWorkboxOptions`):**

| Option           | Type                     | Description                                                                                                                                      |
| :--------------- | :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `globPatterns`   | `string[]`               | Files to precache.                                                                                                                               |
| `globDirectory`  | `string`                 | Directory to look for files in `globPatterns`.                                                                                                   |
| `globIgnores`    | `string[]`               | Files/patterns to ignore during globbing.                                                                                                        |
| `runtimeCaching` | `Array<RuntimeCacheRule>`| Rules for caching assets on runtime. Requires `urlPattern`, `handler`, and optionally `options`.                                                 |
| `skipWaiting`    | `boolean`                | If service worker should skip waiting.                                                                                                           |
| `clientsClaim`   | `boolean`                | If service worker should claim clients immediately.                                                                                              |
| `navigateFallback`| `string`                 | URL to fallback to when a navigation request fails.                                                                                              |
| `navigateFallbackDenylist` | `RegExp[]` | URLs to deny fallback for.                                                                                                               |
| `navigateFallbackAllowlist`| `RegExp[]` | URLs to allow fallback for.                                                                                                                  |
| `ignoreURLParametersMatching` | `RegExp[]` | URL parameters to ignore when matching cache entries.                                                                                            |
| `cleanCacheOnIndex`| `boolean`                | If `true`, cleans the cache when `index.html` is updated.                                                                                        |
| `cacheExpiration`| `CacheExpirationPlugin`  | Default expiration for caches.                                                                                                                   |

**`runtimeCaching` Rule (`RuntimeCacheRule`):**

| Option        | Type                                  | Description                                                                                          | Required |
| :------------ | :------------------------------------ | :--------------------------------------------------------------------------------------------------- | :------- |
| `urlPattern`  | `string | RegExp | Function`        | The URL pattern to match.                                                                            | Yes      |
| `handler`     | `'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate' | 'Fastest'` | The caching strategy to use.         | Yes      |
| `options`     | `RuntimeCacheOptions`                 | Additional options for the handler (e.g., `cacheName`, `expiration`, `networkTimeoutSeconds`).       | No       |

---

## Workflows

### 1. Building and Deploying a Nuxt PWA

This workflow covers the steps from development to deployment for a Nuxt PWA.

**Steps:**

1.  **Develop your Nuxt application:**
    *   Use Nuxt conventions (folder structure, auto-imports).
    *   Implement PWA features using `vite-plugin-pwa` as shown in the "Quick Start" and "Essential Patterns" sections.
    *   Ensure icons and manifest details are correctly configured in `nuxt.config.ts`.
    *   Test PWA functionality locally using `npm run dev`. Use browser developer tools to simulate offline conditions and inspect service workers.

2.  **Build the application for production:**
    *   Run the Nuxt build command. This typically generates static assets and server-side bundles.
    ```bash
    npm run build
    ```
    *   This command, using Vite, compiles your Vue components, bundles assets, and importantly, generates the PWA assets (`manifest.json`, `sw.js`) based on your `nuxt.config.ts` settings. These will be placed in the `.output` directory.

3.  **Choose a deployment strategy:**
    *   **Static Hosting (SSG):** If your Nuxt app is configured for static generation (e.g., using `nuxt generate` in Nuxt 2, or adapting Nuxt 3 output), you can deploy the contents of `.output/public/` to static hosting providers like Netlify, Vercel, GitHub Pages, or AWS S3. This is often the simplest for content-heavy sites.
    *   **Node.js Server / Serverless:** For applications requiring SSR or server-side API routes, deploy the `.output` directory (which contains both server and client bundles) to a Node.js environment (e.g., Docker container on AWS ECS/EKS, Heroku) or a serverless platform (e.g., Vercel Functions, AWS Lambda via Nitro presets).

4.  **Configure your hosting provider:**
    *   **Static Hosting:** Ensure correct routing rules if using client-side routing (Nuxt handles this well). Ensure the root of your site serves `index.html`.
    *   **Server Hosting:** Configure your server to serve static assets from `.output/public` and run the Node.js server executable found in `.output/server/index.mjs`. Set environment variables required by your Nuxt app.

5.  **Deploy:**
    *   Upload the built files or configure your CI/CD pipeline to automate the build and deploy process.

6.  **Verify PWA Functionality:**
    *   After deployment, access your live URL.
    *   Check the browser's developer tools (`Application` tab) to confirm the service worker is registered and active, and the manifest is loaded correctly.
    *   Test offline access and the update prompt mechanism.

**Code Example Snippets:**

*   **`nuxt.config.ts` (relevant parts):**
    ```typescript
    export default defineNuxtConfig({
      modules: ['vite-plugin-pwa'],
      pwa: {
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'],
          runtimeCaching: [ /* ... caching rules ... */ ],
        },
        manifest: { /* ... manifest details ... */ },
        meta: { /* ... meta details ... */ },
        client: { skipWaiting: true, installPrompt: true },
        devOptions: { enabled: process.env.NODE_ENV === 'development' },
      },
      // If deploying statically, you might have build target configurations
      // ssr: false, // For pure client-side rendering PWA
    })
    ```

*   **Running the build:**
    ```bash
    npm run build
    ```
    *(Output is in `.output/`)*

*   **Deployment Notes:**
    *   For static hosting (Netlify/Vercel), simply point the build output to `.output/public`.
    *   For server environments, deploy the `.output` directory and configure the server runner (e.g., `node .output/server/index.mjs`). Nitro provides presets for various deployment targets.