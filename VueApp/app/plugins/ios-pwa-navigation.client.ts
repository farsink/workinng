/**
 * iOS PWA Standalone Navigation Fix
 *
 * On iOS, when a PWA is added to the home screen and run in standalone mode,
 * any navigation that triggers a full page reload (instead of a client-side
 * route push) breaks out of standalone mode and opens Safari.
 *
 * This plugin intercepts all <a> tag clicks on iOS standalone mode and forces
 * them through Vue Router for client-side navigation, preserving the app experience.
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (!import.meta.client) return

  // Check if running on iOS in standalone PWA mode
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone = ('standalone' in navigator) && (navigator as any).standalone === true

  if (!isIOS || !isStandalone) return

  const router = useRouter()

  // Intercept all click events on the document
  document.addEventListener('click', (event: MouseEvent) => {
    // Find if the click was on or inside an <a> tag
    const target = event.target as HTMLElement
    const anchor = target.closest('a') as HTMLAnchorElement | null

    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href) return

    // Skip external links, mailto, tel, etc.
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#') ||
      anchor.getAttribute('target') === '_blank'
    ) return

    // Skip if it's already being handled by a router-link
    // (NuxtLink sets data-v-* attributes and handles clicks internally,
    // but we need to make sure iOS doesn't intercept before Vue Router)

    // Check if it's an internal route
    try {
      const resolved = router.resolve(href)
      if (resolved.name === undefined && resolved.matched.length === 0) return

      // Prevent default browser navigation (which would open Safari)
      event.preventDefault()
      event.stopPropagation()

      // Navigate via Vue Router (client-side, keeps standalone mode)
      router.push(href)
    } catch {
      // If router can't resolve it, let the browser handle it
      return
    }
  }, true) // Use capture phase to intercept before other handlers
})
