/**
 * iOS PWA Standalone Navigation Fix
 * 
 * This plugin ensures ALL internal navigation stays within the PWA standalone window.
 * It works by:
 * 1. Intercepting any <a> tag clicks (including those from NuxtLink) in capture phase
 * 2. Preventing the default browser navigation 
 * 3. Using navigateTo() for client-side routing instead
 * 
 * This is needed because iOS processes <a href="..."> at the native OS level
 * BEFORE JavaScript event handlers fire, causing Safari to open.
 */
export default defineNuxtPlugin(() => {
  // Only run on client side
  if (!import.meta.client) return

  // Check if running in standalone PWA mode (iOS or Android)
  const isStandalone = 
    // iOS check
    (('standalone' in navigator) && (navigator as any).standalone === true) ||
    // Android/general check
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)

  if (!isStandalone) return

  const router = useRouter()

  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const anchor = target.closest('a') as HTMLAnchorElement | null

    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href) return

    // Get the full URL to compare origins
    const url = new URL(href, window.location.origin)
    
    // Skip external links (different origin)
    if (url.origin !== window.location.origin) return
    
    // Skip special protocols
    if (['mailto:', 'tel:', 'sms:', 'blob:', 'data:'].some(p => href.startsWith(p))) return
    
    // Skip target="_blank" links
    if (anchor.getAttribute('target') === '_blank') return
    
    // Skip download links
    if (anchor.hasAttribute('download')) return

    // This is an internal link — prevent browser navigation and use router
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    // Use the pathname for navigation (strips origin)
    const path = url.pathname + url.search + url.hash
    navigateTo(path)
  }, true) // Capture phase — runs before ANY other click handlers
})
