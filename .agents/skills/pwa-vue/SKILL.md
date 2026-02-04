---
name: architecting-vue-pwa-apps
description: Guides the agent in designing and refactoring Vue 3 applications as PWAs with modern best practices for performance, code reuse, extensibility, and modular architecture. Use when the user mentions Vue, Nuxt, PWAs, performance tuning, frontend architecture, or reusable components/composables.
---

# Vue PWA Architecture & Best Practices

## When to use this skill
- User is building or refactoring a Vue 3 SPA or PWA.
- User asks about Vue app performance, bundle size, or load speed.
- User wants a modular, extensible architecture for a Vue codebase.
- User asks how to maximize code reuse via components, composables, or stores.
- User mentions offline support, service workers, app install, or PWA features.
- User requests guidance on scaling or organizing a Vue project.

## Default interaction pattern

When this skill is active, the agent must follow this interaction pattern:

1. **First response: clarifying questions only**
   - Internally draft a 3–7 bullet checklist of planned steps (do not show it yet).
   - Respond to the user **only** with a concise list of clarifying questions.
   - Each question must be brief and focused on requirements or constraints.

2. **Second response: solution using the answers**
   - After the user replies, use their answers as context.
   - Present architecture, code, and guidance tailored to their situation.

3. **Final step: self-validation**
   - At the end of the main response, add 1–2 lines labeled “Validation”.
   - Check alignment with the user’s intent; self-correct or add a brief fix if needed.

Example first reply format:

- No intro or explanation.
- A flat bullet list of short questions, for example:
  - "Which Vue version (2/3) and tooling (Vite/CLI/Nuxt)?"
  - "Is this a new project or refactor?"
  - "Target devices and network conditions?"

## Workflow

Use this checklist internally for any request handled with this skill:

- [ ] Clarify context (Vue version, tooling, app type, scale, hosting).
- [ ] Define goals (PWA features, performance targets, reuse/extensibility needs).
- [ ] Propose a high-level architecture and folder structure.
- [ ] Detail core patterns (state, routing, components, composables, services).
- [ ] Add PWA setup and configuration specifics.
- [ ] Add performance and DX (developer experience) recommendations.
- [ ] Run a brief validation against user goals and refine if needed.

For larger tasks, apply a Plan–Validate–Execute loop:

- **Plan**: Propose architecture, patterns, and critical decisions as a short list.
- **Validate**: If the change is significant (e.g., major refactor), ask the user to confirm the plan before providing detailed code.
- **Execute**: Provide code snippets, file structures, and concrete steps based on the approved plan.

## Instructions

Focus on Vue 3 and modern tooling unless the user states otherwise.

### 1. Tech stack and baseline conventions

Prefer these defaults unless user constraints differ:

- Vue 3, `<script setup>` syntax, and TypeScript.
- Vite as the build tool, ESLint + Prettier + TypeScript strict mode.
- Pinia for global state management, Vue Router 4 for routing.
- PWA via `vite-plugin-pwa` or framework-equivalent tooling (e.g., Nuxt modules).
- Component libraries or design systems only if justified by requirements.

Key conventions:

- Use Composition API (with composables) for logic reuse.
- Keep components small and focused (single responsibility).
- Prefer dependency injection via composables/services instead of global singletons.
- Use environment variables for runtime configuration, not hard-coded URLs.

### 2. Project and folder structure

Default structure to propose (adapt to user’s scale):

```text
src/
  assets/
  components/
    base/        # Reusable, app-agnostic UI (BaseButton, BaseInput)
    layout/      # Layout components (AppShell, NavBar)
    features/    # Feature-specific components
  composables/   # Reusable logic (useAuth, useFetch, useTheme)
  stores/        # Pinia stores (user, settings, entities)
  router/
    index.ts     # Route definitions and guards
  services/      # API clients, gateways, adapters
  views/         # Route-level components (pages)
  plugins/       # Vue plugins, 3rd-party integrations
  pwa/           # PWA config (optional if not using plugin defaults)
  App.vue
  main.ts
```

Guidelines:

- **Base components**: No business logic, no external API calls, accept props and emit events.
- **Feature components**: Wire base components to composables/stores.
- **Views**: Compose feature components, handle routing concerns only.
- **Services**: Encapsulate network calls, storage, and 3rd-party APIs.
- **Composables**: Reuse domain and UI logic; no direct DOM access unless strictly UI-related.


### 3. State management and data flow

Use this pattern by default:

- Local UI state: keep inside components or UI-specific composables.
- Shared domain state: use Pinia stores (e.g., `useUserStore`, `useCartStore`).
- Remote data:
    - Encapsulate API calls in `services/` (e.g., `services/httpClient.ts`, `services/userService.ts`).
    - Use composables or stores to orchestrate fetching, caching, and error handling.
- Avoid tight coupling:
    - Components should depend on composables/stores, not on raw services.
    - Stores/composables depend on services; services depend on HTTP/client layers.

Example Pinia store (TypeScript):

```ts
// stores/user.ts
import { defineStore } from 'pinia'
import { fetchCurrentUser } from '@/services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    current: null as null | { id: string; name: string },
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async loadCurrent() {
      this.loading = true
      this.error = null
      try {
        this.current = await fetchCurrentUser()
      } catch (e: any) {
        this.error = e?.message ?? 'Failed to load user'
      } finally {
        this.loading = false
      }
    },
  },
})
```


### 4. Reusability and extensibility patterns

When designing for reuse and extensibility:

- **Base components**:
    - Stateless, styleable via props and slots.
    - No external imports except style tokens, UI utilities.
- **Composables**:
    - Use `useXxx` naming, return only what’s needed (state, actions).
    - Accept parameters instead of capturing globals when possible.
    - Avoid direct imports of specific components to keep them UI-agnostic.
- **Feature modules**:
    - Group components, stores, composables, and services per feature where it helps.
    - Keep clear boundaries: do not cross-import between features unless explicitly intended.

Example composable:

```ts
// composables/usePaginatedFetch.ts
import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'

export function usePaginatedFetch<T>(
  fetchPage: (page: number) => Promise<T[]>,
  page: Ref<number>,
) {
  const items = ref<T[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  watchEffect(async () => {
    loading.value = true
    error.value = null
    try {
      items.value = await fetchPage(page.value)
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to fetch data'
    } finally {
      loading.value = false
    }
  })

  return { items, loading, error }
}
```


### 5. PWA features and setup

Default recommendations:

- Use `vite-plugin-pwa` (or equivalent), configured with:
    - A web app manifest (name, icons, theme/background colors, display mode).
    - Service worker with:
        - Asset caching (precache build assets).
        - Runtime caching for APIs and images where appropriate.
- Ensure HTTPS and valid `start_url` for PWA installability.
- Handle updates:
    - Listen for new service worker versions and prompt users to refresh.
- Offline behavior:
    - Define what should work offline (read-only views, cached data, skeleton screens).
    - Show clear fallback UIs for offline errors rather than generic failures.

Example basic PWA config:

```ts
// vite.config.ts (excerpt)
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My Vue PWA',
        short_name: 'VuePWA',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#42b883',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
          },
        ],
      },
    }),
  ],
}
```


### 6. Performance practices

When the user asks about performance, cover:

- **Bundling and code splitting**
    - Use route-level code-splitting via dynamic imports in Vue Router.
    - Split large feature modules or heavy components with `defineAsyncComponent`.
- **Rendering**
    - Avoid unnecessary reactive dependencies in `computed` and watchers.
    - Use `v-memo`, `v-once`, and `key` strategically when appropriate.
    - Prefer `computed` over `watch` when deriving state.
- **Lists**
    - Use `key` for list items.
    - For very large lists, suggest virtualization libraries.
- **Network and data**
    - Cache frequently used data.
    - Debounce/throttle input-driven API calls (e.g., search).
    - Compress and optimize images; lazy load heavy media.
- **Build-level**
    - Enable chunk splitting, minification, and gzip/brotli on the server.
    - Use source maps only in non-production environments (or upload to error tracking, not serve publicly).

Example route-level code splitting:

```ts
// router/index.ts (excerpt)
const Dashboard = () => import('@/views/DashboardView.vue')

const routes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
]
```


### 7. Modular architecture and scaling

When the app grows:

- Encourage domain- or feature-driven structure (e.g., `features/auth`, `features/catalog`).
- In each feature, keep a mini-structure:
    - `features/auth/components/`, `features/auth/composables/`, `features/auth/stores/`, `features/auth/services/`.
- Define clear boundaries:
    - Expose only needed entry points (e.g., `features/auth/index.ts`).
    - Avoid deep cross-feature imports; introduce shared modules for common logic.
- Use interfaces/types in shared modules to decouple layers.
- Document extension points:
    - Where new routes, features, or integrations should be added.
    - How to add new entities to state and API layers consistently.


### 8. Validation loop and error handling

For any non-trivial change or refactor:

- **Plan**:
    - List planned changes (files, patterns, and impacts) in 3–7 bullets.
- **Validate**:
    - If the user has not requested code directly, ask them to confirm the plan.
    - Adjust the plan if the user pushes back on complexity, libraries, or tooling.
- **Execute**:
    - Provide concrete file structures, key code snippets, and migration notes.

Error handling guidance:

- At script or CLI level, treat helper scripts as black boxes:
    - If unsure, instruct: “Run `<script> --help` to see available options.”
- In Vue code:
    - Catch errors at boundaries (services, async actions).
    - Propagate user-friendly messages to UI; log technical details where the user specifies (console, external logging).
    - Always show a usable fallback UI on network and offline errors in PWAs.


### 9. Response format

When generating the main solution (after clarifying questions are answered):

- Start with a brief summary of the proposed architecture or changes (2–4 sentences).
- Use sections and bullet lists for:
    - Folder structure and architecture.
    - PWA configuration.
    - Performance improvements.
    - Reusability/extensibility patterns.
- Provide code snippets that are:
    - Minimal but complete enough to convey the pattern.
    - Consistent with Vue 3, TypeScript, and Composition API unless user states otherwise.

End every main response with a short validation block:

```text
Validation:
- [ ] Aligned with user’s Vue version and tooling
- [ ] Covers PWA, performance, and reusability requirements as stated
```

Update the checkboxes in text and add 1–2 lines explaining any adjustments.

## Resources

- `scripts/pwa-audit.sh`: Simple helper to audit PWA-related files and configs (run with `--help` if uncertain).
- `resources/vue-structure-example.md`: Example Vue 3 PWA project structure and key files.
- `resources/vue-pwa-nuxt-frontend.md`: Nuxt-specific PWA configuration and patterns (use when project involves Nuxt 3/4).
- `resources/dexie-postgres-pinia.md`: Dexie.js, PostgreSQL (via Dexie Cloud), and Pinia integration patterns for robust offline-first state management.
