# TimeTracker PWA – Product Requirements Document (PRD)

_Last updated: 2026-01-21_

---

## 1. Overview

### 1.1 Product Name
**TimeTracker PWA**

### 1.2 Summary
TimeTracker PWA is a local-first, multi-device time tracking web application that runs as a Progressive Web App (PWA) on mobile and desktop. It allows a user to automatically log daily work hours, work offline, and transparently sync data to a secure cloud backend so that entries are available on all signed-in devices. [web:83][web:84][web:87]

### 1.3 Goals & Non-Goals

- **Goals (Current Version)**
  - Replace manual spreadsheet-based time logging with a simple, reliable PWA.
  - Automatically create daily entries on weekdays at end-of-day.
  - Allow manual creation and editing of entries (including weekends).
  - Support offline usage with local storage and background sync.
  - Provide CSV export and cloud backup of all entries.
  - **Support multi-device access with a single account (login).**
  - **Provide real-time or near-real-time sync of entries across devices.**
  - **Maintain a central, durable cloud data store to prevent data loss.**

- **Non-Goals (Current Version)**
  - Team management, roles, and org-level administration.
  - Complex analytics dashboards and billing logic.
  - Deep third-party integrations (payroll, calendars, etc.).
  - Fine-grained access control and sharing between multiple users.

---

## 2. Problem Statement

Manually tracking work hours in spreadsheets is tedious and error-prone, and keeping data consistent across laptop and phone is difficult. The user needs a local-first PWA that automates weekday entries, supports offline editing, and reliably syncs to the cloud so that the same, up-to-date time log is available on all authenticated devices. [web:78][web:83][web:84]

---

## 3. Target User & Use Cases

### 3.1 Target User Persona
- **Role:** Individual contractor / freelancer / hourly employee.
- **Tech level:** Comfortable with basic web apps; prefers minimal setup.
- **Devices:** Uses both desktop and mobile devices; expects data to follow them.
- **Context:** Logs working hours daily for personal records, invoicing, or payroll support.

### 3.2 Primary Use Cases

1. **Auto Weekday Logging**
   - Same as before: app auto-creates entries on weekdays at end-of-day if missing.

2. **Manual Weekend Logging**
   - User manually logs entries on weekends.

3. **Daily Review & Editing**
   - User reviews and adjusts hours and notes per day.

4. **Export for Reporting**
   - User exports a CSV for a date range.

5. **Login & Sync (New)**
   - User logs in on Desktop with a federated account (e.g., Google).
   - Logs 4 hours for today.
   - Later opens the app on Mobile, logs in with the same account, and sees the same 4-hour entry once connected or after sync completes. [web:84][web:87]

6. **Offline Mode with Queued Sync (Updated)**
   - User opens the app on Mobile, goes offline (e.g., in transit), edits today’s hours and notes.
   - Changes are stored locally first, marked as “pending sync.”
   - When the device comes online, the sync engine automatically pushes local changes to the cloud and pulls any remote changes, resolving conflicts according to defined rules. [web:83][web:84][web:86][web:87]

---

## 4. Scope

### 4.1 Scope (Current Version)

#### Core Functional Requirements (Must-Have)
1. Daily Entry Model (unchanged conceptually).
2. Weekday Auto-Entry.
3. Weekend Manual Entry.
4. Entry Management (CRUD).
5. CSV Export.
6. **Local-First + Cloud Sync:**
   - All operations write to a local IndexedDB database first (via Dexie.js).
   - A sync layer (Dexie Cloud or similar managed sync service) mirrors data with the cloud. [web:84][web:87]
   - Changes from other devices are synced back to local storage.
7. **Authentication:**
   - User must log in to use sync.
   - Support federated login (e.g., Google, GitHub) or passwordless (e.g., email magic link) through an OAuth2/OIDC provider. [web:89][web:92]
8. PWA & Offline Behavior (updated to include queued sync).

#### Non-Functional Requirements (Must-Have)
- Same browser, performance, and UX requirements as before.
- **Cloud-backed durability:** Data remains safe even if local browser storage is cleared.
- **Eventual consistency:** All devices converge on the same data given network connectivity. [web:83][web:84]

---

## 5. User Stories & Acceptance Criteria (Updated Highlights)

### 5.1 Login & Sync

**User Story:**  
As a user, I want to log in and have my time entries synced across all devices so I can seamlessly switch between desktop and mobile.

**Acceptance Criteria:**
- User can authenticate using a supported identity provider (e.g., “Continue with Google”). [web:92]
- After login, existing entries are loaded from the cloud into local storage.
- Changes made on Device A (while online) appear on Device B within a reasonable delay (e.g., under 10 seconds for near-real-time, or next sync cycle if offline). [web:84][web:87]
- Logging out clears local cached user data but does not delete cloud data.

### 5.2 Offline Edits with Queued Sync

**User Story:**  
As a user, I want to edit entries offline and have them automatically sync when I’m online so I don’t think about connectivity.

**Acceptance Criteria:**
- When offline:
  - User can create, edit, and delete entries.
  - Each change is stored locally with metadata indicating “pending sync.”
- When network becomes available:
  - Sync engine pushes pending changes to cloud.
  - Remote changes are pulled and merged into local database.
- If sync fails (e.g., network error, auth error), user receives a non-intrusive error message and can retry manually.

### 5.3 Sync Conflict Handling (New)

**User Story:**  
As a user, I want my data to stay coherent even if I edit the same day on two devices, so I don’t lose important changes.

**Acceptance Criteria:**
- If the same entry (same date) is modified on two devices before sync:
  - System applies a deterministic conflict resolution strategy:
    - **MVP: Last-Write-Wins** based on `modifiedAt` timestamp.
  - Optionally, UI marks conflicted entries for transparency (e.g., “Updated from another device”).
- No app crashes or data corruption due to concurrent edits.

---

## 6. UX & UI Requirements (Additions)

### 6.1 Auth Flows

- **Login Screen**
  - “Continue with Google” (and optionally GitHub/Apple later).
  - Simple explanation: “We use your account to sync time entries securely across your devices.”
- **Account Indicator**
  - Show logged-in email/name in Settings.
  - Logout button.

### 6.2 Sync Status Indicators

- Subtle icon or status text:
  - “All changes synced.”
  - “Syncing…”
  - “Offline – changes will sync when you’re online.”
- Errors:
  - Non-blocking toast: “Sync failed, tap to retry.”

---

## 7. Technical Requirements (Major Update)

### 7.1 Frontend

- **Framework:** Vue 3 + Nuxt 3/4.
- **Rendering Mode:**  
  - Use **Universal (SSR) mode** for better performance and SEO on marketing pages, while the app shell behaves as a SPA after hydration. [web:50][web:88]
  - Nuxt Nitro server acts as the frontend server (Server A) serving SSR HTML and static assets. [web:54][web:65]

- **PWA:** `@vite-pwa/nuxt` for manifest and service worker.
- **State Management:** Pinia.
- **Local Storage:** Dexie.js (IndexedDB) for entries, extended with Dexie Cloud add-on for sync. [web:83][web:84][web:87]

### 7.2 Data Model

**Local-First with Cloud Sync**

- **Local Schema (IndexedDB / Dexie):**
  - `TimeEntry`:
    - `id: string` – globally unique ID (e.g., Dexie Cloud `@id` pattern).
    - `date: string` – ISO date (e.g., `2026-01-19`).
    - `hoursWorked: number`.
    - `tasks: string`.
    - `isWeekend: boolean`.
    - `autoGenerated: boolean`.
    - `modifiedAt: number` (timestamp).
    - `userId: string` (implicit in realm/tenant if using Dexie Cloud), or derived from auth. [web:84][web:87]

- **Cloud Schema (Sync Service / Dexie Cloud):**
  - Mirrors local schema; cloud is authoritative for multi-device consistency.
  - Data is logically partitioned per user (realm) for isolation and security. [web:84][web:87]

- **Sync Behavior:**
  - Local DB is the primary source of truth for the UI (local-first).
  - Sync service ensures two-way synchronization with the cloud. [web:83][web:84][web:87]

### 7.3 Architecture

**Dual Server + Sync Engine**

- **Server A – Frontend / SSR**
  - Nuxt (Nitro) hosting:
    - SSR-rendered app shell and marketing pages.
    - Static assets and service worker.
  - Deployed on Node-compatible platforms (e.g., Vercel/Netlify functions). [web:88]

- **Server B – Backend / Sync & Auth**
  - **Option A (Recommended for MVP): Dexie Cloud**
    - Dexie Cloud acts as the managed sync and auth backend:
      - Provides database URL and sync endpoints.
      - Handles two-way sync, conflict resolution hooks, and access control. [web:84][web:87][web:90]
    - Local Dexie instance configured with Dexie Cloud add-on.
  - **Option B (Future): Custom Backend (Node/NestJS or Python/FastAPI)**
    - Expose REST/GraphQL endpoints for sync.
    - Implement custom sync protocol (queue, diff, merge).
    - Higher complexity; reserved for later phases. [web:86]

- **Client Sync Engine**
  - Runs inside the PWA, talking to the sync backend (Dexie Cloud). [web:83][web:84][web:87]
  - Queues operations when offline and flushes them when online.

### 7.4 Security & Authentication

- **Auth Model:**
  - Use OpenID Connect / OAuth2 Authorization Code Flow with PKCE (via an identity provider like Google or a provider such as Auth0/Supabase Auth). [web:89][web:92]
  - PWA obtains and stores short-lived tokens (in memory or secure storage), not long-lived secrets.

- **Requirements:**
  - No custom username/password storage in MVP.
  - Use federated login (Google/GitHub) or passwordless (magic links).
  - Token validation performed on Server B (sync backend) or within Dexie Cloud’s built-in auth. [web:84][web:87][web:92]

- **Data Protection:**
  - All network communication over HTTPS.
  - Cloud data scoped per user with access control (realms). [web:84][web:87]

---

## 8. Risks & Assumptions (Updated)

### 8.1 Risks

1. **Sync Conflicts (New)**
   - **Risk:** Simultaneous offline edits to the same entry on multiple devices can cause conflicts.
   - **Mitigation (MVP):** Last-Write-Wins based on `modifiedAt`. Future enhancement: manual merge UI for critical conflicts. [web:83][web:84][web:86][web:87]

2. **Auth Integration Complexity**
   - **Risk:** Incorrect OAuth2/OIDC integration can cause security vulnerabilities or broken login flows.
   - **Mitigation:** Use established libraries and providers; follow Authorization Code + PKCE best practices for PWAs. [web:89][web:92]

3. **Sync Service Vendor Lock-in**
   - **Risk:** Using Dexie Cloud tightly couples app to a specific vendor.
   - **Mitigation:** Abstract sync layer behind a repository interface; allow future migration to a custom backend.

### 8.2 Removed / Changed Risks

- **Removed:** “Data loss risk if browser cache cleared.”
  - Now mitigated by cloud backup through Dexie Cloud or equivalent. [web:84][web:87]

---

## 9. Metrics & Success Criteria (Expanded)

### 9.1 Usage & Reliability Metrics

- Sync success rate: ≥ 99% of sync attempts succeed over 30 days.
- Average sync latency (online edits across devices): target < 10 seconds in normal network conditions. [web:84][web:87]
- Number of devices per user: at least 2 devices used regularly.

### 9.2 Product Success Metrics

- User can reinstall browser or change devices without losing data.
- User reports fewer discrepancies between “what I worked” and “what the record shows.”
- Self-rated satisfaction: 8/10 or higher after using on at least two devices for 2 weeks.

---

## 10. Release Plan (Adjusted)

### Phase 1 – Dual-Server Ready Foundation
- Migrate Nuxt to Universal/SSR mode.
- Introduce login page and basic auth wiring (stub or provider sandbox).
- Integrate Dexie.js with initial schema.

### Phase 2 – Local-First + Cloud Sync
- Add Dexie Cloud (or chosen sync service) to Dexie setup.
- Implement basic two-way sync and offline queue.
- Add sync status indicators.

### Phase 3 – Conflict Handling & UX Polish
- Implement Last-Write-Wins strategy and surface simple conflict info.
- Refine multi-device flows and optimize sync performance.

### Phase 4 – Hardening & Observability
- Add logging/monitoring for sync errors and auth failures.
- Conduct multi-device QA (desktop + mobile, online/offline scenarios).

---

## 11. Open Decisions

- Final choice of sync provider for MVP:
  - **Dexie Cloud (recommended)** vs custom backend.
- Identity provider(s) to support at launch (Google-only vs multiple).
- How prominently to surface conflict information in the UI.

---

## 12. Appendix

- PRD structure based on modern templates and best practices. [web:67][web:70][web:73][web:80]
- Local-first + sync patterns and Dexie Cloud approach. [web:83][web:84][web:87][web:90]
- PWA authentication best practices (OAuth2/OIDC). [web:89][web:92]

