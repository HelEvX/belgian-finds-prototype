# Local Storage & Data Architecture Investigation — Vondsten App

_Status: exploratory notes for briefing a future developer. Not implemented, no decision made on final architecture._

## Context

This prototype is a UI/UX vehicle, not a production build. It exists to give a future developer (and the client) a fully rounded, clickable picture of every planned feature — including the parts that won't be real in the demo — instead of a Figma file. It's deployed as a static site to a free Netlify account.

Two hard constraints shape every option below:

- Everything must run at zero cost — this is unpaid volunteer work.
- The "share with community" / public-record functionality will never be real in this demo. It stays mocked. The point is to demonstrate the intended UX and data flow, not to build a working backend.

## Why this came up

A developer building a comparable Belgian finds-registration app (Flutter, "ZoekApp") uses on-device SQLite for private records plus a sync queue for anything reported to a remote system. That's a clean, well-established pattern — local-first storage, with an explicit queue for whatever crosses to a server — and worth adopting conceptually here, even though the underlying engine won't be the same.

## The platform fork

The Flutter app's approach doesn't transfer directly: Flutter has native OS-level SQLite available through a plugin (`sqflite`). This prototype is a React web app running in a browser, which has no access to that OS-level SQLite library. "SQLite" means something different depending on target platform:

- **Native app (Capacitor / React Native), if ever pursued:** real on-device SQLite, same category as the Flutter app, via `@capacitor-community/sqlite` or `expo-sqlite` / `react-native-sqlite-storage`. Not relevant to the current demo; only a live option if this project is ever wrapped as an installable app.
- **Web/PWA (current target):** no OS-level SQLite. The realistic options are IndexedDB (the browser's native structured storage) or SQLite compiled to WebAssembly.

## Options considered (web/PWA context)

**Tier 1 — `localStorage`**
Near-zero effort. Fixes the current gap where nothing survives a page refresh. Limitations: string-only, no real querying, roughly 5–10MB ceiling, synchronous. Suitable only for a handful of small mock records.

**Tier 2 — IndexedDB via Dexie.js (recommended for this prototype)**
The browser's actual structured local database, wrapped by Dexie for a workable API instead of raw IndexedDB's notoriously clunky interface. Async, handles binary data (relevant for image-heavy find records), no realistic size problem for prototype use. Free and open source (MIT), pure client-side — no server, no paid tier, fits the Netlify free-tier static deploy exactly as-is.

**Tier 3 — SQLite-in-the-browser (`@sqlite.org/sqlite-wasm` + OPFS)**
Genuine SQLite running client-side via WebAssembly, persisted through the Origin Private File System. Real SQL, real file-backed storage — but needs to run inside a Web Worker due to how OPFS's synchronous access API works, adding real complexity for a prototype that's otherwise mock-data-driven. Also free.

**Tier 4 — Native SQLite via Capacitor**
Only relevant if this project is later wrapped as an installable native app. The SQLite plugin itself is free; the cost that enters the picture at that point is app-store distribution (Apple Developer Program ~$99/year, Google Play ~$25 one-time) — unrelated to the storage engine, and moot for the current mocked demo.

## Recommendation for this prototype

**Tier 2 (IndexedDB via Dexie.js).** It's free, has no backend dependency, and is straightforward enough that a future developer can look at the code and immediately understand it's standing in for a real local-first data layer — without needing to untangle Web Worker/OPFS plumbing to get the point. Tier 3 would be justified only if demonstrating genuine SQLite specifically becomes important for the handoff conversation; Tier 4 isn't relevant unless the project moves toward a real native build.

## Pattern to carry into the architecture, regardless of storage engine

Local-first writes, with an explicit sync/outbox queue for anything a user chooses to publish or share — mirroring the "SyncQueue" concept in the reference app. In this codebase, that split can live behind the existing service-layer boundary (`findsService`, `determinationsService`, etc.) rather than scattered through components: local calls resolve against the local store, "publish" or "share" calls would resolve against a mocked remote call for now, and a real developer can swap the mock for an actual server integration later without the UI layer needing to change.

## Open questions for a future developer

- Whether the eventual production build stays a web app (IndexedDB/Postgres) or moves to a native wrapper (device SQLite + server sync).
- What the real backend/public database looks like — out of scope for this prototype and explicitly left to a backend specialist.
- Whether the mocked "share with community" interactions in this demo are detailed enough to brief that handoff, or need further UX passes.
