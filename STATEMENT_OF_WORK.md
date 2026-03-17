# Statement of Work: @nuvira/chat-components

**Document Version:** 1.0  
**Last Updated:** 2025-03-17  
**Package:** @nuvira/chat-components (single NPM package)

---

## 1. Executive Summary

This document defines the scope, approach, and deliverables for transforming the chat components in this repository into a standalone, publishable NPM component library. The library will be **purely presentational**—all media resolution, message sending, and data fetching logic will be implemented by the consuming application. The library provides components with well-defined prop interfaces and TypeScript types.

---

## 2. Current Project Status Assessment

### 2.1 Repository Structure (As-Is)

```
nuvira-chat/
├── chat/                          # All chat components (flat + nested)
│   ├── MessageTypes/               # 5 message type components + stories
│   │   ├── TextMessage.tsx
│   │   ├── ImageMessage.tsx
│   │   ├── AudioMessage.tsx
│   │   ├── VideoMessage.tsx
│   │   ├── DocumentMessage.tsx
│   │   ├── index.ts
│   │   └── stories/               # 5 story files
│   ├── Agent/
│   │   ├── ChatAgentSwitch.tsx
│   │   └── ChatAiCover.tsx
│   ├── ChatContactStatus/          # 4 files - app-coupled
│   ├── ContactNotes/               # 1 file - app-coupled
│   ├── FunnelStageSelector/        # 4 files - app-coupled
│   ├── stories/
│   │   ├── ChatMessage.stories.tsx
│   │   └── ChatWindow.stories.tsx
│   ├── AISummary.tsx               # app-coupled
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   ├── ChatMessagesContainer.tsx
│   ├── ChatWindow.tsx              # app-coupled
│   ├── ChatWindowHeader.tsx        # app-coupled
│   ├── ChatWindowSC.tsx            # app-coupled
│   ├── ConsolidatedChatActions.tsx # app-coupled
│   ├── ContactInfoEditor.tsx       # app-coupled
│   └── ...
├── util/
│   ├── ppsFormatDate.ts            # ✅ Portable (lodash only)
│   ├── mediaUpload.ts              # ❌ App-specific (API calls)
│   ├── getUser.ts                  # ❌ App-specific (auth, prisma)
│   ├── getWorkspace.ts             # ❌ App-specific (prisma)
│   └── WorkspaceCookieSettter.tsx   # ❌ App-specific
├── .gitignore
├── LICENSE
└── README.md
```

**Missing:** `package.json`, `tsconfig.json`, build config, Storybook config, `useMediaUrl` hook (referenced but not present).

### 2.2 Component Dependency Matrix

| Component | External Deps | Portable? | In Scope |
|-----------|----------------|-----------|----------|
| **TextMessage** | MUI only | ✅ | ✅ |
| **ImageMessage** | MUI only | ✅ | ✅ |
| **AudioMessage** | MUI only | ✅ | ✅ |
| **VideoMessage** | MUI only | ✅ | ✅ |
| **DocumentMessage** | MUI only | ✅ | ✅ |
| **ChatMessage** | ppsFormatDate, useMediaUrl, logger, Prisma | ⚠️ | ✅ (refactor) |
| **ChatInput** | PpsTextField, THEME_COLOR_PRIMARY | ⚠️ | ✅ (refactor) |
| **ChatMessagesContainer** | ChatMessage, ChatAiCover, THEME_LIGHT_GREY, Prisma | ⚠️ | ✅ (refactor) |
| **ChatAiCover** | LoadingAnimation, THEME_COLOR_PRIMARY | ⚠️ | ✅ (refactor) |
| **ChatAgentSwitch** | MUI only | ✅ | ✅ |
| ChatWindow, ChatWindowHeader, etc. | Many app-specific | ❌ | ❌ Excluded |

### 2.3 Key Design Decisions (Confirmed)

| Decision | Value |
|----------|--------|
| **Hooks** | Library does NOT implement media resolution or message-sending hooks. Consuming app implements these. Library only defines prop interfaces. |
| **Storybook** | All in-scope components must have Storybook stories. Stories use mock props only—no hooks required. |
| **Source structure** | Move components into `src/` folder. Build output goes to `dist/`. |
| **Package name** | @nuvira/chat-components |
| **Architecture** | Single package (not monorepo) |

---

## 3. Storybook Without Hooks: Feasibility

**Yes.** All Storybook stories can be implemented using mock props only.

### 3.1 Message Type Components (TextMessage, ImageMessage, etc.)

These components already receive `mediaUrl`, `mediaLoading`, `mediaError`, `retryMedia` as props. No hooks. Stories pass mock values:

```tsx
// Example: ImageMessage.stories.tsx
args: {
  mediaUrl: "https://picsum.photos/800/600",
  mediaLoading: false,
  mediaError: false,
  retryMedia: () => {},
  message: "Here's the design mockup"
}
```

**Status:** ✅ Already work with mocks. No changes needed to component API.

### 3.2 ChatMessage (Refactor Required)

**Current:** Uses `useMediaUrl(message.mediaUrl)` internally. Hook does not exist in repo; stories would fail.

**Target:** Accept `mediaState` as an optional prop from parent. Parent (app) provides resolved state via its own hook.

```tsx
// New ChatMessage props
interface ChatMessageProps {
  message: ContactMessage;
  contact: Contact;
  mediaState?: MediaState;  // { url, loading, error, retry } - required for media message types
  additional?: React.ReactNode;
  inverse?: boolean;
}

// In Storybook - mock mediaState
args: {
  message: { ...baseMessage, messageType: MessageType.IMAGE, mediaUrl: "...", ... },
  contact,
  mediaState: { url: "https://picsum.photos/800/600", loading: false, error: null, retry: () => {} }
}
```

**Status:** ✅ Feasible. Refactor ChatMessage to accept `mediaState` prop; stories pass mock.

### 3.3 ChatMessagesContainer

**Current:** Renders `ChatMessage` for each message. ChatMessage needs `mediaState` per message.

**Target:** Accept `renderMessage?: (message, contact) => ReactNode` so the app can inject its own wrapper (e.g., one that uses `useMediaUrl` per message). Default render uses `ChatMessage` with `mediaState` derived from a simple pass-through (e.g., for CDN URLs, use `message.mediaUrl` as-is).

For Storybook: pass `renderMessage` that returns `<ChatMessage ... mediaState={mockMediaState} />`, or provide a default that works for mock data.

**Status:** ✅ Feasible. Define `renderMessage` prop; stories use mock renderer.

### 3.4 ChatInput

**Current:** No hooks. Receives `onSubmit`, `onMessageChange`, etc. as props.

**Status:** ✅ Already presentational. Stories pass mock handlers: `onSubmit: async () => {}`, `onMessageChange: () => {}`.

### 3.5 ChatAiCover, ChatAgentSwitch

No hooks. Stories pass mock props.

**Status:** ✅ Feasible.

---

## 4. Prop Interfaces for App Implementation

The library defines these interfaces. The consuming app implements the logic and passes the results as props.

### 4.1 Media State (for signed URLs, CDN URLs, S3 keys)

```typescript
export interface MediaState {
  /** Resolved URL (CDN or signed). Null when loading or error. */
  url: string | null;
  /** True while resolving (e.g., fetching signed URL from API). */
  loading: boolean;
  /** Error message if resolution failed. Null when success or loading. */
  error: string | null;
  /** Callback to retry resolution. */
  retry: () => void;
}
```

**App responsibility:** Implement a hook (e.g., `useMediaUrl`) that:
- Accepts a reference (CDN URL, S3 key, signed URL reference, etc.)
- Returns `MediaState`
- Handles CDN URLs (pass-through), signed URLs (API call), S3 keys (API call), etc.

**Library responsibility:** Export the `MediaState` type. Components receive `MediaState` as a prop.

### 4.2 Message Sending (ChatInput)

```typescript
export interface ChatInputProps {
  message: string | null;
  agentActive: boolean;
  loading?: boolean;
  onMessageChange: (message: string) => void;
  onSubmit: (message: string | null, mediaFile?: MediaFile) => Promise<void>;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

export interface MediaFile {
  file: File;
  type: "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT";
  url: string;  // Object URL for preview
}
```

**App responsibility:** Implement `onSubmit` (e.g., call API, upload, send). Implement `onMessageChange` (e.g., update local state).

**Library responsibility:** Only render UI and call these callbacks.

---

## 5. Target Project Structure (To-Be)

```
nuvira-chat/
├── src/
│   ├── index.ts                    # Barrel export
│   ├── types/
│   │   └── index.ts                # Contact, ContactMessage, MessageType, MediaState, MediaFile
│   ├── util/
│   │   └── ppsFormatDate.ts        # Copy from util/ (or re-export)
│   └── components/
│       ├── MessageTypes/
│       │   ├── index.ts
│       │   ├── TextMessage.tsx
│       │   ├── ImageMessage.tsx
│       │   ├── AudioMessage.tsx
│       │   ├── VideoMessage.tsx
│       │   └── DocumentMessage.tsx
│       ├── ChatMessage/
│       │   └── ChatMessage.tsx
│       ├── ChatInput/
│       │   └── ChatInput.tsx
│       ├── ChatMessagesContainer/
│       │   └── ChatMessagesContainer.tsx
│       ├── ChatAiCover/
│       │   └── ChatAiCover.tsx
│       └── ChatAgentSwitch/
│           └── ChatAgentSwitch.tsx
├── stories/
│   ├── MessageTypes/
│   │   ├── TextMessage.stories.tsx
│   │   ├── ImageMessage.stories.tsx
│   │   ├── AudioMessage.stories.tsx
│   │   ├── VideoMessage.stories.tsx
│   │   └── DocumentMessage.stories.tsx
│   ├── ChatMessage.stories.tsx
│   ├── ChatInput.stories.tsx
│   ├── ChatMessagesContainer.stories.tsx
│   ├── ChatAiCover.stories.tsx
│   └── ChatAgentSwitch.stories.tsx
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
├── dist/                           # Build output (gitignored)
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── .npmignore
├── README.md
├── STATEMENT_OF_WORK.md
└── util/                           # Legacy; ppsFormatDate source (can be removed after migration)
```

---

## 6. Deliverables (Statement of Work)

### Phase 1: Project Setup & Structure

| # | Task | Description |
|---|------|-------------|
| 1.1 | Create `package.json` | Name: `@nuvira/chat-components`, scripts for build, dev, storybook. Dependencies: MUI, lodash, Emotion. Peer deps: React, MUI. Dev deps: Storybook, tsup, TypeScript. |
| 1.2 | Create `tsconfig.json` | Target ES2020, strict mode, jsx react-jsx, declaration. Include `src/**/*`. Exclude `node_modules`, `dist`, `stories`. |
| 1.3 | Create `tsup.config.ts` | Entry: `src/index.ts`. Formats: cjs, esm. DTS. Externalize React, MUI, Emotion. |
| 1.4 | Create `src/` folder structure | `src/types/`, `src/util/`, `src/components/` with subfolders per component. |
| 1.5 | Create `src/types/index.ts` | Export `MessageType`, `Contact`, `ContactMessage`, `MediaState`, `MediaFile`. Replace Prisma types with library types. |

### Phase 2: Portable Utilities

| # | Task | Description |
|---|------|-------------|
| 2.1 | Add `src/util/ppsFormatDate.ts` | Copy from `util/ppsFormatDate.ts`. Update imports (lodash). No app-specific code. |

### Phase 3: Message Type Components (Zero Refactor)

| # | Task | Description |
|---|------|-------------|
| 3.1 | Move MessageTypes to `src/components/MessageTypes/` | Copy TextMessage, ImageMessage, AudioMessage, VideoMessage, DocumentMessage. Update internal imports to relative paths. |
| 3.2 | Create `src/components/MessageTypes/index.ts` | Barrel export all message types and their prop types. |

### Phase 4: ChatMessage Refactor

| # | Task | Description |
|---|------|-------------|
| 4.1 | Refactor ChatMessage to accept `mediaState` prop | Remove `useMediaUrl` usage. Add `mediaState?: MediaState` prop. For media message types, require `mediaState` from parent. Use `mediaState.url`, `mediaState.loading`, etc. |
| 4.2 | Replace Prisma types | Use `Contact`, `ContactMessage`, `MessageType` from `src/types`. |
| 4.3 | Replace ppsFormatDate import | Use `../util/ppsFormatDate` or `../../util/ppsFormatDate`. |
| 4.4 | Remove logger | Remove or replace with optional `onDebug?: (info) => void` prop. |
| 4.5 | Fix bugs | Pass `intent` to TextMessage. Fix typo "Unknonwn" → "Unknown". Fix corrupted JSDoc. |
| 4.6 | Move to `src/components/ChatMessage/` | |

### Phase 5: ChatInput Refactor

| # | Task | Description |
|---|------|-------------|
| 5.1 | Replace PpsTextField with MUI TextField | Use `TextField` from `@mui/material`. Preserve multiline, adornments, disabled state. |
| 5.2 | Replace THEME_COLOR_PRIMARY | Use `"primary.main"` from MUI theme (sx) or accept optional `primaryColor` prop. |
| 5.3 | Export MediaFile type | Ensure `MediaFile` is exported from types or ChatInput. |
| 5.4 | Move to `src/components/ChatInput/` | |

### Phase 6: ChatAiCover Refactor

| # | Task | Description |
|---|------|-------------|
| 6.1 | Replace LoadingAnimation | Use MUI `CircularProgress` or simple CSS dots animation. |
| 6.2 | Replace THEME_COLOR_PRIMARY | Use `avatarColor` prop (default: `"primary.main"`). |
| 6.3 | Add configurable branding | Add `label?: string` prop (default: e.g., "AI is talking with your contact"). |
| 6.4 | Move to `src/components/ChatAiCover/` | |

### Phase 7: ChatMessagesContainer Refactor

| # | Task | Description |
|---|------|-------------|
| 7.1 | Add `renderMessage` prop | `renderMessage?: (message: ContactMessage, contact: Contact) => ReactNode`. Default: render `ChatMessage` with `mediaState` derived from `message.mediaUrl` as pass-through for CDN URLs (or require `renderMessage` when media needs resolution). |
| 7.2 | Replace THEME_LIGHT_GREY | Use MUI `grey[300]` or similar. |
| 7.3 | Replace Prisma types | Use library types. |
| 7.4 | Update ChatMessage import | Relative path to `../ChatMessage`. |
| 7.5 | Move to `src/components/ChatMessagesContainer/` | |

### Phase 8: ChatAgentSwitch

| # | Task | Description |
|---|------|-------------|
| 8.1 | Move to `src/components/ChatAgentSwitch/` | No refactor. MUI only. |

### Phase 9: Storybook Setup

| # | Task | Description |
|---|------|-------------|
| 9.1 | Initialize Storybook | `npx storybook@latest init` (React, Vite, TypeScript). |
| 9.2 | Configure `.storybook/main.ts` | Stories: `../stories/**/*.stories.@(js|jsx|ts|tsx)`. Addons: essentials, interactions, links. Framework: react-vite. |
| 9.3 | Configure `.storybook/preview.tsx` | MUI ThemeProvider, CssBaseline. Layout centered. |
| 9.4 | Move/copy MessageType stories | Update imports to library components. Use mock props. |
| 9.5 | Update ChatMessage stories | Use `mediaState` prop with mock values. Replace Prisma types with library types. |
| 9.6 | Create ChatInput stories | Placeholder, with media, disabled, loading states. |
| 9.7 | Create ChatMessagesContainer stories | Empty, with messages, with AI cover. Use mock `renderMessage` or default. |
| 9.8 | Create ChatAiCover stories | Default, custom label, custom color. |
| 9.9 | Create ChatAgentSwitch stories | Off, on states. |

### Phase 10: Barrel Export & Build

| # | Task | Description |
|---|------|-------------|
| 10.1 | Create `src/index.ts` | Export all components, types, util. |
| 10.2 | Run build | `npm run build`. Verify `dist/` output. |
| 10.3 | Run Storybook | `npm run storybook`. Verify all stories render. |
| 10.4 | Add `.npmignore` | Exclude `src`, `stories`, `.storybook`, `*.stories.*`, `node_modules`. |

### Phase 11: Documentation & Publish Prep

| # | Task | Description |
|---|------|-------------|
| 11.1 | Update README | Installation, usage examples, prop interfaces for media and message sending. Document that app must implement hooks. |
| 11.2 | Publish checklist | `npm run build`, `npm run build-storybook`, `npm publish --access public`. |

---

## 7. Out of Scope (Excluded Components)

| Component | Reason |
|-----------|--------|
| ChatWindow | App-specific hooks, API, prisma |
| ChatWindowHeader | PpsAvatar, ContactStatusChip, CustomStageDisplay |
| ConsolidatedChatActions | FunnelStageSelector, ContactNotes |
| FunnelStageSelector/* | CustomStageChip, CustomFunnelDisplay, Prisma |
| ChatContactStatus/* | ContactStatusChip, ContactStatusSelector |
| ContactNotes/* | ContactNoteCard, ContactNoteForm, PpsModal |
| ContactInfoEditor | updateContactData, logger |
| AISummary | LoadingAnimation, API calls |
| ChatWindowSC | prisma, ChatWindow |
| util/mediaUpload, getUser, getWorkspace, WorkspaceCookieSettter | App-specific |

---

## 8. Dependencies Summary

### Dependencies (shipped with library)

- `@emotion/react`
- `@emotion/styled`
- `@mui/material`
- `@mui/icons-material`
- `lodash`

### Peer Dependencies

- `react` >= 18
- `react-dom` >= 18
- `@mui/material` >= 5
- `@mui/icons-material` >= 5
- `@emotion/react` >= 11
- `@emotion/styled` >= 11

### Dev Dependencies

- Storybook 8.x (react, react-vite, addons)
- TypeScript 5.x
- tsup 8.x
- @types/react, @types/react-dom, @types/lodash
- eslint

---

## 9. Acceptance Criteria

- [ ] All in-scope components live under `src/`
- [ ] Build produces `dist/` with CJS and ESM
- [ ] No hooks in library; only prop interfaces
- [ ] All 10 components have Storybook stories
- [ ] Stories render without errors (mock props only)
- [ ] README documents prop interfaces for media and message sending
- [ ] Package published to NPM as `@nuvira/chat-components`

---

## 10. Appendix: Type Definitions

### Contact (minimal)

```typescript
export interface Contact {
  id: string;
  name: string | null;
}
```

### ContactMessage

```typescript
export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
}

export interface ContactMessage {
  id: string;
  messageId: string;
  contactId: string;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
  inbound: boolean;
  timestamp: Date;
  intent?: string | null;
  confidence?: number | null;
  needsScaling?: boolean | null;
  errorReason?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  mediaType?: string | null;
  mediaUrl?: string | null;
  messageType: MessageType;
  s3Key?: string | null;
}
```

### MediaState

```typescript
export interface MediaState {
  url: string | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}
```

### MediaFile (ChatInput)

```typescript
export interface MediaFile {
  file: File;
  type: "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT";
  url: string;
}
```

---

*End of Statement of Work*
