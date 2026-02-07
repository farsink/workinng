# Example Vue 3 PWA Structure

This example shows a small but scalable structure for a Vue 3 + Vite PWA.

```text
src/
  assets/
  components/
    base/
      BaseButton.vue
      BaseInput.vue
    layout/
      AppShell.vue
      AppHeader.vue
      AppFooter.vue
    features/
      auth/
        LoginForm.vue
        RegisterForm.vue
      dashboard/
        DashboardStats.vue
        RecentActivity.vue
  composables/
    useAuth.ts
    useOnlineStatus.ts
    useTheme.ts
  stores/
    auth.ts
    settings.ts
  router/
    index.ts
    guards.ts
  services/
    httpClient.ts
    authService.ts
    userService.ts
  pwa/
    sw-registration.ts
  views/
    HomeView.vue
    LoginView.vue
    DashboardView.vue
  plugins/
    pinia.ts
    router.ts
  App.vue
  main.ts
```

Key files:

- `main.ts`: creates the app, installs Pinia, Router, and registers PWA logic.
- `pwa/sw-registration.ts`: encapsulates service worker registration and update handling.
- `composables/useOnlineStatus.ts`: tracks `navigator.onLine` and related events for offline UI.
- `components/base/`: contains unopinionated, reusable UI primitives shared across the app.
