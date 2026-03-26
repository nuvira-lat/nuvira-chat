# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.8] - 2025-03-26

### Fixed

- **`CollapsibleEdgePanel`:** `prefers-reduced-motion` is applied via CSS in `sx` instead of MUI `useMediaQuery`, avoiding server/client markup and style mismatch during hydration (e.g. Next.js App Router).

## [0.1.7] - 2025-03-25

### Added

- Vitest and unit tests for `mergeChatThreadAlerts`.
- Re-exports for chat thread alert types and constants from the `@/types` barrel (`src/types/index.ts`).

### Changed

- `CHAT_THREAD_ALERT_REACHABILITY_MESSAGE`: clearer wording (two sentences; “24 hours”).
- `ChatThreadAlerts`: `onAlertDismissed` / `onThreadAlertDismissed` fire at most once per alert `id` per dismiss transition (after state commit), not on redundant close attempts.

### Migration

- **`ChatWindowHeader`:** the `showAlert` prop was removed. Use **`ChatWindow`** with **`showReachabilityWindow`** and/or the typed **`alerts`** prop (see README **Thread alerts**). Built-in reachability and last-message error rows are merged via `mergeChatThreadAlerts` when using `ChatWindow`.
