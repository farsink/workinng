#!/usr/bin/env bash
set -e

SHOW_HELP() {
  cat <<EOF
pwa-audit.sh - quick checks for a Vue 3 + Vite PWA project.

Usage:
  ./pwa-audit.sh [path]

If unsure, run with --help.

Checks:
  - existence of vite.config.* with VitePWA plugin
  - presence of manifest icons
  - presence of service worker registration in main.* or plugins
EOF
}

if [[ "$1" == "--help" ]]; then
  SHOW_HELP
  exit 0
fi

ROOT="${1:-.}"

echo "Running PWA audit in: $ROOT"

if ! grep -R "VitePWA" "$ROOT/vite.config."* >/dev/null 2>&1; then
  echo "WARN: VitePWA plugin not detected in vite.config.*"
else
  echo "OK: VitePWA plugin detected."
fi

if ! find "$ROOT/public" -maxdepth 2 -name "manifest*.json" | grep -q .; then
  echo "WARN: No manifest*.json found under public/."
else
  echo "OK: Manifest file found under public/."
fi

if ! find "$ROOT/public" -maxdepth 3 -name "icon-192*" -o -name "icon-512*" | grep -q .; then
  echo "WARN: PWA icons (192/512) not found under public/."
else
  echo "OK: PWA icons detected."
fi

grep -R "registerServiceWorker" "$ROOT/src" >/dev/null 2>&1 \
  || grep -R "serviceWorker" "$ROOT/src" >/dev/null 2>&1 \
  || echo "WARN: Service worker registration not obviously present in src/."

echo "PWA audit completed."
