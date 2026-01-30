<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# also i need to create an techincal documentation for this application , where specifing which tech stack are using , performance guidance ,file/folder structure , schema , and all the things included in the technical documentation.

```markdown
# TimeTracker PWA – Technical Documentation

_Version: 1.0.0_  
_Last Updated: 2026-01-21_

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Architecture Overview](#2-architecture-overview)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Development Setup](#6-development-setup)
7. [Configuration](#7-configuration)
8. [Performance Guidelines](#8-performance-guidelines)
9. [Security Considerations](#9-security-considerations)
10. [Deployment](#10-deployment)
11. [Testing Strategy](#11-testing-strategy)
12. [Troubleshooting](#12-troubleshooting)
13. [API Reference](#13-api-reference)
14. [Appendix](#14-appendix)

---

## 1. Introduction

### 1.1 Purpose
This document provides comprehensive technical documentation for the TimeTracker PWA, a local-first time tracking application built with Vue 3, Nuxt 4, and Dexie Cloud. It serves as a reference for developers, architects, and DevOps engineers working on the project. [web:93][web:98][web:100]

### 1.2 Audience
- **Frontend Developers**: Building UI components and implementing features
- **Backend/Sync Engineers**: Configuring Dexie Cloud and authentication
- **DevOps**: Deploying and maintaining infrastructure
- **QA Engineers**: Testing and validation

### 1.3 Scope
Covers architecture, implementation details, deployment processes, and operational procedures for the TimeTracker PWA MVP and future versions. [web:93][web:100]

---

## 2. Architecture Overview

### 2.1 System Architecture

```

┌─────────────────────────────────────────────────────────┐
│                     User Devices                         │
│  ┌──────────────┐          ┌──────────────┐            │
│  │   Desktop    │          │    Mobile    │            │
│  │   Browser    │          │   Browser    │            │
│  └──────┬───────┘          └──────┬───────┘            │
│         │                          │                     │
│         │    PWA (Service Worker)  │                     │
│         └────────┬─────────────────┘                     │
│                  │                                        │
└──────────────────┼────────────────────────────────────────┘
│
│ HTTPS
│
┌──────────────────▼────────────────────────────────────────┐
│              Server A: Frontend (Nuxt SSR)                │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Nitro Server (Node.js)                          │    │
│  │  - SSR rendering                                 │    │
│  │  - Static asset serving                          │    │
│  │  - Service worker hosting                        │    │
│  └──────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
│
│
┌──────────────────▼────────────────────────────────────────┐
│        Server B: Backend (Dexie Cloud)                    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Sync Engine                                     │    │
│  │  - Two-way data synchronization                  │    │
│  │  - Conflict resolution                           │    │
│  │  - Access control (realms)                       │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Authentication Service (OAuth2/OIDC)            │    │
│  │  - Google OAuth                                  │    │
│  │  - Token validation                              │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Cloud Database (PostgreSQL)                     │    │
│  │  - User data (encrypted)                         │    │
│  │  - Time entries                                  │    │
│  └──────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│             Client Storage (IndexedDB)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Dexie.js Local Database                         │   │
│  │  - Primary data store                            │   │
│  │  - Offline operations                            │   │
│  │  - Sync queue                                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

```

### 2.2 Key Design Principles

1. **Local-First**: All operations write to IndexedDB first; sync happens in background [web:83][web:84][web:87]
2. **Offline-Capable**: Full CRUD operations work without network connection [web:41]
3. **Progressive Enhancement**: Core functionality works on all browsers; enhanced features where supported
4. **Performance-Oriented**: Target <2s initial load, 60fps interactions [web:50][web:88]

### 2.3 Data Flow

```

User Action (Create Entry)
↓
Pinia Store Action
↓
Dexie.js Write (IndexedDB) ← [Local-First]
↓
UI Update (Immediate)
↓
Dexie Cloud Sync (Background) → Cloud Database
↓
Other Devices Pull Changes ← [Eventual Consistency]

```

---

## 3. Tech Stack

### 3.1 Frontend

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Vue 3 | ^3.4.0 | Reactive UI framework |
| **Meta-framework** | Nuxt 4 | ^4.0.0 | SSR, routing, bundling [web:65] |
| **Build Tool** | Vite | ^5.0.0 | Fast dev server, optimized builds |
| **Language** | TypeScript | ^5.3.0 | Type safety |
| **State Management** | Pinia | ^2.1.0 | Reactive store |
| **Styling** | Tailwind CSS | ^3.4.0 | Utility-first CSS |
| **UI Components** | DaisyUI | ^4.6.0 | Pre-built Tailwind components |
| **PWA** | @vite-pwa/nuxt | ^0.6.0 | Service worker, manifest [web:41][web:63] |

### 3.2 Data Layer

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Local DB** | Dexie.js | ^4.0.0 | IndexedDB wrapper [web:83][web:84] |
| **Sync Service** | Dexie Cloud | ^4.0.0 | Multi-device sync [web:84][web:87] |
| **CSV Export** | PapaParse | ^5.4.0 | CSV generation |
| **Date Utils** | date-fns | ^3.0.0 | Date manipulation |

### 3.3 Backend (Managed Services)

| Service | Provider | Purpose |
|---------|----------|---------|
| **Sync Backend** | Dexie Cloud | Database replication, conflict resolution [web:84][web:87] |
| **Authentication** | Google OAuth 2.0 | Federated identity [web:89][web:92] |
| **Hosting (Frontend)** | Netlify / Vercel | Static + SSR hosting [web:49] |

### 3.4 Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Vitest | Unit testing |
| Playwright | E2E testing |
| Lighthouse CI | Performance monitoring [web:41] |

---

## 4. Project Structure

### 4.1 Directory Layout

```

time-tracker-pwa/
├── .nuxt/                    \# Auto-generated build files[^1]
├── .output/                  \# Production build output
├── public/                   \# Static assets
│   ├── icon-192.png         \# PWA icon (192x192)
│   ├── icon-512.png         \# PWA icon (512x512)
│   ├── favicon.ico
│   └── robots.txt
├── pages/                    \# File-based routes[^1]
│   ├── index.vue            \# Home (Today's entry)
│   ├── history.vue          \# Entry history
│   ├── export.vue           \# CSV export
│   ├── login.vue            \# Authentication
│   └── settings.vue         \# User preferences
├── components/               \# Vue components[^1]
│   ├── entry/
│   │   ├── EntryForm.vue    \# Entry creation/edit form
│   │   ├── EntryCard.vue    \# Single entry display
│   │   └── EntryList.vue    \# List of entries
│   ├── layout/
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── Navigation.vue
│   └── ui/
│       ├── Button.vue
│       ├── Input.vue
│       └── Modal.vue
├── composables/              \# Reusable logic
│   ├── useDB.ts             \# Dexie setup \& queries[^2]
│   ├── useAuth.ts           \# Authentication logic[^3]
│   ├── useAutoEntry.ts      \# Auto-entry cron
│   ├── useSyncStatus.ts     \# Sync state indicator
│   └── useOffline.ts        \# Network detection
├── stores/                   \# Pinia stores
│   ├── entries.ts           \# Time entries state
│   ├── auth.ts              \# User auth state
│   └── sync.ts              \# Sync status state
├── types/                    \# TypeScript definitions
│   ├── entry.ts             \# TimeEntry interface
│   └── user.ts              \# User interface
├── plugins/                  \# Nuxt plugins
│   ├── dexie.client.ts      \# Initialize Dexie[^4]
│   └── auth.client.ts       \# Initialize OAuth client
├── middleware/               \# Route middleware
│   └── auth.ts              \# Protected route guard
├── utils/                    \# Helper functions
│   ├── csv.ts               \# CSV generation logic
│   ├── date.ts              \# Date utilities
│   └── validation.ts        \# Input validation
├── tests/
│   ├── unit/                \# Vitest unit tests
│   └── e2e/                 \# Playwright E2E tests
├── nuxt.config.ts           \# Nuxt configuration[^1]
├── tailwind.config.js       \# Tailwind configuration
├── tsconfig.json            \# TypeScript config[^1]
├── package.json             \# Dependencies[^1]
└── README.md                \# Project overview

```

### 4.2 Key Files

**nuxt.config.ts** [web:41][web:63][web:65]
```typescript
export default defineNuxtConfig({
  ssr: true,                  // Universal rendering
  devtools: { enabled: true },
  
  modules: [
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  
  pwa: {
    registerType: 'autoUpdate',
    manifest: { /* ... */ },
    workbox: { /* ... */ }
  },
  
  runtimeConfig: {
    public: {
      dexieCloudUrl: process.env.NUXT_PUBLIC_DEXIE_CLOUD_URL,
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID
    }
  }
})
```

**composables/useDB.ts** [web:83][web:84]

```typescript
import Dexie from 'dexie';
import dexieCloud from 'dexie-cloud-addon';

export interface TimeEntry {
  id?: string;
  date: string;
  hoursWorked: number;
  tasks: string;
  isWeekend: boolean;
  autoGenerated: boolean;
  modifiedAt: number;
  userId?: string;
}

class TimeTrackerDB extends Dexie {
  entries!: Dexie.Table<TimeEntry, string>;
  
  constructor() {
    super('TimeTrackerDB', { addons: [dexieCloud] });
    
    this.version(1).stores({
      entries: '@id, date, isWeekend, userId'
    });
    
    this.cloud.configure({
      databaseUrl: useRuntimeConfig().public.dexieCloudUrl,
      requireAuth: true
    });
  }
}

let db: TimeTrackerDB | null = null;

export const useDB = () => {
  if (process.server) return null;
  if (!db) db = new TimeTrackerDB();
  return db;
};
```


---

## 5. Database Schema

### 5.1 IndexedDB Schema (Local)

**Object Store: `entries`** [web:64][web:84]


| Field | Type | Index | Description |
| :-- | :-- | :-- | :-- |
| `id` | string | Primary (@id) | Dexie Cloud auto-generated UUID |
| `date` | string | Yes | ISO date (YYYY-MM-DD) |
| `hoursWorked` | number | No | Decimal hours (e.g., 8.5) |
| `tasks` | string | No | Free-text notes |
| `isWeekend` | boolean | Yes | Weekend flag for queries |
| `autoGenerated` | boolean | No | Indicates auto-created entry |
| `modifiedAt` | number | No | Unix timestamp (ms) |
| `userId` | string | Yes | User identifier (realm) |
| `realmId` | string | Auto | Dexie Cloud realm (implicit) |

**Indexes:**

- `date`: Fast lookup by date
- `isWeekend`: Filter weekday vs. weekend
- `userId`: Multi-user support (future)


### 5.2 Cloud Schema (Dexie Cloud)

Mirrors local schema; managed automatically by Dexie Cloud sync service [web:84][web:87]:

- Data partitioned by `realmId` (user-scoped)
- Server-side conflict resolution with Last-Write-Wins
- Automatic schema migration on version changes


### 5.3 Sample Data

```json
{
  "id": "dc8f7a2b-3c4d-4e5f-8a9b-1c2d3e4f5a6b",
  "date": "2026-01-21",
  "hoursWorked": 8.0,
  "tasks": "Implemented auth flow, fixed sync bugs",
  "isWeekend": false,
  "autoGenerated": true,
  "modifiedAt": 1737489600000,
  "userId": "user_google_123456789",
  "realmId": "realm_abc123"
}
```


---

## 6. Development Setup

### 6.1 Prerequisites

- **Node.js**: ≥ 18.x (LTS recommended)
- **npm**: ≥ 9.x or **pnpm**: ≥ 8.x
- **Git**: ≥ 2.x
- **Browser**: Chrome/Edge (for PWA testing)


### 6.2 Installation

```bash
# Clone repository
git clone https://github.com/your-org/time-tracker-pwa.git
cd time-tracker-pwa

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure environment variables
# NUXT_PUBLIC_DEXIE_CLOUD_URL=https://YOUR_DEXIE_CLOUD_URL
# NUXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```


### 6.3 Development Commands

```bash
# Start dev server with HMR
npm run dev
# → http://localhost:3000

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Preview production build
npm run preview
```


### 6.4 PWA Testing in Development [web:41][web:63]

```bash
# Enable PWA in dev mode (already configured in nuxt.config.ts)
npm run dev

# Open Chrome DevTools
# → Application tab → Service Workers
# → Verify "TimeTracker PWA" is registered
# → Test offline mode: Network → Offline checkbox
```


---

## 7. Configuration

### 7.1 Environment Variables

**Required:**

```bash
NUXT_PUBLIC_DEXIE_CLOUD_URL=https://YOUR_DB.dexie.cloud
NUXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
```

**Optional:**

```bash
NUXT_PUBLIC_DEFAULT_HOURS=8.0        # Default weekday hours
NUXT_PUBLIC_AUTO_ENTRY_TIME=23:59    # Auto-entry trigger time
```


### 7.2 Dexie Cloud Configuration [web:84][web:87]

1. Create account at https://dexie.cloud
2. Create new database
3. Configure OAuth redirect URLs:
    - Development: `http://localhost:3000/auth/callback`
    - Production: `https://your-app.com/auth/callback`
4. Copy Database URL to `.env.local`

### 7.3 Google OAuth Setup [web:89][web:92]

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project → Enable OAuth 2.0
3. Add authorized origins:
    - `http://localhost:3000` (dev)
    - `https://your-app.com` (prod)
4. Add redirect URIs:
    - `http://localhost:3000/auth/callback`
5. Copy Client ID to `.env.local`

---

## 8. Performance Guidelines

### 8.1 Performance Targets [web:41][web:50][web:88]

| Metric | Target | Measurement |
| :-- | :-- | :-- |
| **First Contentful Paint (FCP)** | < 1.5s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **Time to Interactive (TTI)** | < 3.0s | Lighthouse |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse |
| **Bundle Size (JS)** | < 300KB | Vite build |
| **Sync Latency (online)** | < 10s | Manual testing |

### 8.2 Optimization Techniques

**Code Splitting** [web:50]

```typescript
// Lazy load heavy components
const ExportModal = defineAsyncComponent(() => 
  import('~/components/export/ExportModal.vue')
);
```

**Image Optimization**

```vue
<NuxtImg 
  src="/icon-512.png" 
  width="192" 
  height="192" 
  format="webp"
  loading="lazy"
/>
```

**Tailwind Purging** [web:41]

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './components/**/*.vue',
    './pages/**/*.vue'
  ],
  // Only include used classes
};
```

**IndexedDB Best Practices** [web:64]

```typescript
// Batch reads
const entries = await db.entries
  .where('date')
  .between('2026-01-01', '2026-01-31')
  .toArray();

// Avoid N+1 queries
```


### 8.3 Monitoring

```bash
# Run Lighthouse CI
npm run lighthouse

# Bundle analysis
npm run build --analyze

# Performance profiling
# Chrome DevTools → Performance tab
```


---

## 9. Security Considerations

### 9.1 Authentication Security [web:89][web:92]

- **OAuth 2.0 + PKCE**: Prevents authorization code interception
- **Token Storage**: Access tokens in memory only; refresh tokens in secure httpOnly cookies (if applicable)
- **No Passwords**: Federated login eliminates password storage risk


### 9.2 Data Security [web:84]

- **HTTPS Only**: All network communication encrypted
- **Realm Isolation**: Dexie Cloud enforces user-scoped data access
- **Client-Side Encryption** (optional): Encrypt sensitive fields before sync


### 9.3 CSP (Content Security Policy)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          'http-equiv': 'Content-Security-Policy',
          content: "default-src 'self'; connect-src 'self' https://*.dexie.cloud https://accounts.google.com"
        }
      ]
    }
  }
});
```


### 9.4 Dependency Security

```bash
# Regular audits
npm audit

# Update dependencies
npm update

# Check for vulnerabilities
npx snyk test
```


---

## 10. Deployment

### 10.1 Netlify Deployment [web:49]

**netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

**Deploy Commands**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Environment variables
# Set in Netlify UI: Site settings → Environment variables
```


### 10.2 Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables
# Set via CLI or Vercel dashboard
```


### 10.3 CI/CD Pipeline

**GitHub Actions Example**

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run test:unit
      - name: Deploy to Netlify
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        run: netlify deploy --prod --dir=.output/public
```


---

## 11. Testing Strategy

### 11.1 Unit Tests (Vitest)

```typescript
// tests/unit/composables/useDB.test.ts
import { describe, it, expect } from 'vitest';
import { useDB } from '~/composables/useDB';

describe('useDB', () => {
  it('creates entry successfully', async () => {
    const db = useDB();
    const entry = {
      date: '2026-01-21',
      hoursWorked: 8,
      tasks: 'Test',
      isWeekend: false,
      autoGenerated: false,
      modifiedAt: Date.now()
    };
    
    const id = await db.entries.add(entry);
    expect(id).toBeTruthy();
  });
});
```


### 11.2 E2E Tests (Playwright)

```typescript
// tests/e2e/entry-flow.spec.ts
import { test, expect } from '@playwright/test';

test('create and edit entry', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Create entry
  await page.fill('[data-testid="hours-input"]', '7.5');
  await page.fill('[data-testid="tasks-input"]', 'Development work');
  await page.click('[data-testid="save-button"]');
  
  // Verify saved
  await expect(page.locator('[data-testid="entry-card"]')).toContainText('7.5');
});
```


### 11.3 PWA Testing Checklist [web:41]

- [ ] Manifest validates (Chrome DevTools → Application)
- [ ] Service worker registers
- [ ] Install prompt appears
- [ ] Offline mode works (create/edit entries)
- [ ] Lighthouse PWA score ≥ 90

---

## 12. Troubleshooting

### 12.1 Common Issues

**Service Worker Not Updating** [web:41]

```bash
# Solution: Hard refresh
# Chrome: Ctrl+Shift+R
# Or: DevTools → Application → Service Workers → Update
```

**Sync Failures** [web:84]

```typescript
// Check sync status
const db = useDB();
db.cloud.syncState.subscribe(state => {
  if (state.phase === 'error') {
    console.error('Sync error:', state.error);
  }
});
```

**IndexedDB Quota Exceeded** [web:64]

```typescript
// Check storage usage
navigator.storage.estimate().then(estimate => {
  const usage = estimate.usage / estimate.quota * 100;
  console.log(`Storage: ${usage.toFixed(2)}%`);
});
```


### 12.2 Debug Tools

```typescript
// Enable Dexie debug mode
import Dexie from 'dexie';
Dexie.debug = true;

// Monitor sync events
db.cloud.events.subscribe(event => {
  console.log('Sync event:', event);
});
```


---

## 13. API Reference

### 13.1 Composables

**`useDB()`** [web:83][web:84]

```typescript
const db = useDB();
// Returns: TimeTrackerDB instance or null (SSR)
```

**`useAuth()`** [web:92]

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

**`useAutoEntry()`**

```typescript
const { scheduleAutoEntry, checkMissingEntries } = useAutoEntry();
```


### 13.2 Stores

**`useEntriesStore()`**

```typescript
const store = useEntriesStore();
store.addEntry(entry);
store.getEntry(date);
store.exportCSV(startDate, endDate);
```


---

## 14. Appendix

### 14.1 References

- Nuxt 4 Documentation: https://nuxt.com/docs
- Dexie.js Documentation: https://dexie.org [web:84][web:87]
- Dexie Cloud Guide: https://dexie.org/cloud [web:84]
- PWA Best Practices: https://web.dev/progressive-web-apps [web:41][web:92]


### 14.2 Changelog

| Version | Date | Changes |
| :-- | :-- | :-- |
| 1.0.0 | 2026-01-21 | Initial release with local-first sync |

### 14.3 Contributing

See `CONTRIBUTING.md` for development workflow, code style, and PR guidelines.

### 14.4 License

MIT License - See `LICENSE` file for details.

---

**Document Maintainer:** Engineering Team
**Review Cycle:** Quarterly or on major version releases
**Feedback:** Open GitHub issue for documentation improvements

```

This technical documentation covers all essential aspects per 2026 best practices. You can save this as `TECHNICAL_DOCUMENTATION.md` in your repository root alongside the PRD.[^5][^6][^7]
<span style="display:none">[^10][^11][^12][^13][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.djamware.com/post/68fc3a096ec70a546d45da39/build-a-pwa-with-nuxt-4-and-capacitor
[^2]: https://alexop.dev/posts/building-local-first-apps-vue-dexie/
[^3]: https://dev.to/azure/27-best-practices-for-pwa-authentication-29md
[^4]: https://dexie.org/cloud
[^5]: https://asana.com/templates/technical-documentation
[^6]: https://www.xcubelabs.com/blog/best-practices-for-designing-and-maintaining-software-architecture-documentation/
[^7]: https://www.altexsoft.com/blog/technical-documentation-in-software-development-types-best-practices-and-tools/
[^8]: https://www.madcapsoftware.com/downloads/madcap-flare-project-templates/
[^9]: https://www.notion.com/templates/tech-spec
[^10]: https://slite.com/templates/technical-documentation
[^11]: https://document360.com/blog/software-documentation-tools/
[^12]: https://www.fluidtopics.com/blog/content-ops/technical-documentation-software-tools/
[^13]: https://www.nunuqs.com/blog/progressive-web-apps-in-nuxt-best-strategies-for-2026```

