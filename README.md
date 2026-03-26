# @nuvira/chat-components

React chat UI for Nuvira: MUI-based theming, message renderers, conversation list (`ChatList`, `ChatListItem`, `ContactBadgeGroup`), CRM sidebar (`ChatSidebar`), and full thread shell (`ChatWindow`, header, messages, input).

## Install

```bash
npm install @nuvira/chat-components
```

### Peer dependencies

The package expects your app to provide compatible versions of React, MUI, and Emotion (install these in your application; they are not bundled):

- `react` and `react-dom` (>= 18)
- `@mui/material` and `@mui/icons-material` (>= 5)
- `@emotion/react` and `@emotion/styled` (>= 11)

Runtime dependencies shipped with the package: `lodash`, `date-fns`.

## Usage

Wrap your app (or subtree) with MUI’s `ThemeProvider` and `CssBaseline`, using `createChatTheme` for defaults or overrides:

```tsx
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  createChatTheme,
  TextMessage,
  type TextMessageProps,
} from "@nuvira/chat-components";

const theme = createChatTheme({
  palette: { primary: { main: "#1976d2" } },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TextMessage message="Hello" intent="general_inquiry" />
    </ThemeProvider>
  );
}
```

### Public API

- **Theme:** `createChatTheme`, `ChatThemeOptions`
- **Message components:** `TextMessage`, `ImageMessage`, `AudioMessage`, `VideoMessage`, `DocumentMessage`, and their `*Props` types
- **Conversation list:** `ChatList`, `ChatListItem`, `ChatListProps`, `ChatListItemProps`, `ChatListItemData`
- **Contact badges:** `ContactBadgeGroup`, `ContactBadgeGroupProps` (status, funnel, and stage chips in one row)
- **Layout:** `CollapsibleEdgePanel`, `CollapsibleEdgePanelProps`
- **Agent / thread chrome:** `ChatAgentSwitch`, `ChatAiCover`, `ChatMessage`, `ChatMessagesContainer`, `ChatInput`, `ChatWindowHeader`, `ChatWindow`, `ChatThreadAlerts`, and their `*Props` types (`ChatInputMediaFile` for attachments)
- **Thread alerts (typed):** `ChatThreadAlert`, `ChatThreadAlertSeverity`, `mergeChatThreadAlerts`, `MergeChatThreadAlertsInput`, reserved id constants (`CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR`, `CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW`), `CHAT_THREAD_ALERT_REACHABILITY_MESSAGE`
- **AI summary:** `AISummary`, `AISummaryProps`
- **Funnel & stage:** `FunnelStageSelector`, `FunnelSelector`, `StageSelector`, and their `*Props` types
- **CRM sidebar (accordion sections):** `ChatSidebar` (canonical name; `ConsolidatedChatActions` is a deprecated alias), plus `ChatContactStatus`, `StatusChangeDisplay`, `ContactStatusHistoryList`, `ContactStatusHistoryButton`, `ContactInfoEditor`, `ChatContactNotes`, and their prop types
- **Types & constants:** `MessageType`, `Contact`, `ContactMessage`, `ContactNotes`, `Workspace`, `CustomFunnel`, `CustomStage`, `ContactStatusHistory`, `ContactStatus`, `MediaState`, `MediaFile`, `ChatSidebarSectionId`, `ChatSidebarSectionConfig`, `ChatSidebarCustomSection`, `ChatSidebarProps`, and `CHAT_SIDEBAR_*` constants
- **Integration (typed callbacks):** `ChatIntegrationAdapter`, `createNuviraChatIntegration`, payload types (`SaveContactInput`, `SendChatMessageInput`, …), and Nuvira default implementations (`nuviraDefaultSaveContact`, `nuviraDefaultSendChatMessage`, …). Helpers `pickIntegration` and `pickOnIntegrationError` are mainly for advanced composition. `mergeOnIntegrationError` remains as a deprecated alias for `pickOnIntegrationError` (it picks section-over-root; it does not merge handlers).
- **Legacy integration helpers:** `ContactStatusHistoryListItem`, `UseTimelineStreamOptions`, `useTimelineStream`, `useIsMobile`, `uploadMediaFileWithUrls`, `CONTACT_UPDATED_BROADCAST_MESSAGE_TYPE`. `fetchContactStatusHistoryDefault` is deprecated; use `nuviraDefaultLoadContactStatusHistory` instead (same implementation).

`ChatWindow` accepts optional `integration`, `onSendMessage`, `onUpdateTalkingToAgent`, plus `useTimelineStream`, `useIsMobile`, `uploadMediaFileWithUrls`, and `contactUpdatedBroadcastType` for realtime, layout, and uploads. It also accepts **`alerts`** (`ChatThreadAlert[]`), **`showReachabilityWindow`**, **`onThreadAlertDismissed`**, and **`components.chatThreadAlerts`** for the thread alert strip (see **Thread alerts** below).

### Thread alerts

Thread alerts are **typed** values rendered in a strip **below `ChatWindowHeader` and above `ChatMessagesContainer`**. Use them for standardized warnings, errors, and info (severity maps to MUI `Alert`).

**Shape (`ChatThreadAlert`):**

| Field | Type | Purpose |
| --- | --- | --- |
| `id` | `string` | Stable key for React lists, deduplication, and replacing built-ins |
| `severity` | `"error" \| "warning" \| "info" \| "success"` | Visual level |
| `message` | `string` | Main body text |
| `title` | `string` (optional) | Optional title above the body |
| `dismissible` | `boolean` (optional) | When `true`, shows a close control; dismissal is stored inside **`ChatThreadAlerts`** (no parent state). If that `id` later disappears from `alerts`, the dismissal clears for that id so it can show again |

**Dismissal:** `ChatThreadAlerts` keeps a set of dismissed ids. Optional **`onAlertDismissed(id)`** on `ChatThreadAlerts`, or **`onThreadAlertDismissed`** on `ChatWindow`, runs **at most once per `id` each time that id newly enters the dismissed set** (after React commits state)—for example analytics. Redundant close actions do not invoke the callback again. Custom **`components.chatThreadAlerts.Alert`** receives **`onDismiss`** when `dismissible` is true — call it from your close control and do not forward `dismissible` / `onDismiss` to DOM nodes.

**Merging (`mergeChatThreadAlerts`):** `ChatWindow` merges `alerts` with built-ins from `contact` and flags:

1. **Last message error** — If `contact.lastMessageErrorReason` is set, a warning with id **`CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR`** (`nuvira:last-message-error`) is included unless you pass your own alert with that `id` (e.g. localized copy).
2. **Reachability** — If `showReachabilityWindow` is true, a warning with id **`CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW`** (`nuvira:reachability-window`) and message **`CHAT_THREAD_ALERT_REACHABILITY_MESSAGE`** is included unless you pass an alert with that `id`.
3. **Additional app alerts** — Remaining entries from `alerts` are appended in order. For duplicate `id` values inside `alerts`, the **last** occurrence wins. Alerts whose `id` was already emitted from steps 1–2 are skipped.

**Migration (`ChatWindowHeader`):** The **`showAlert`** prop was removed from **`ChatWindowHeader`**. Use **`ChatWindow`** with **`showReachabilityWindow`** and/or typed **`alerts`** instead (see [CHANGELOG.md](CHANGELOG.md)).

You can call **`mergeChatThreadAlerts`** yourself when building custom layouts; `ChatWindow` uses it internally.

**Example:**

```tsx
import { ChatWindow, type ChatThreadAlert } from "@nuvira/chat-components";

const extraAlerts: ChatThreadAlert[] = [
  {
    id: "billing-hold",
    severity: "info",
    title: "Billing",
    message: "Invoice pending review.",
    dismissible: true
  }
];

<ChatWindow
  {...windowProps}
  alerts={extraAlerts}
  showReachabilityWindow
  onThreadAlertDismissed={(id) => {
    /* optional: telemetry */
  }}
/>;
```

**i18n:** Set `showReachabilityWindow={false}` and pass an alert with `id: CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW` and your translated `message`, or pass the same `id` with localized text to override the default string.

**Customization:** `ChatWindow` supports `components.chatThreadAlerts.Alert` — a component receiving `ChatThreadAlert` fields plus `sx` and optional `onDismiss` (same pattern as other `components` maps). You can also render **`ChatThreadAlerts`** standalone with your own `alerts` array and `onAlertDismissed`.

**Thread vs CRM:** On `ChatWindow`, `onSendMessage` and `onUpdateTalkingToAgent` are resolved in order: **window prop → `integration` → Nuvira default**. That resolution applies to the **thread/header** (messages, agent toggle). The **CRM sidebar** receives the same `integration` for mutations and loaders (`saveContact`, `onGenerateSummary`, funnel/stage, status history, etc.). The sidebar does **not** get separate `onSendMessage` / `onUpdateTalkingToAgent` props; include those on `ChatIntegrationAdapter` only if a sidebar-related code path should call them.

### `ChatIntegrationAdapter` and Nuvira defaults

Pass a single **`integration`** object to **`ChatSidebar`** or **`ChatWindow`** to override how the CRM sidebar and thread talk to your backend. **`createNuviraChatIntegration()`** returns an adapter wired to the same Nuvira `fetch` routes the library used internally before (you can still override individual fields).

- **Per-section overrides:** `ChatSidebar` supports `sectionConfig[sectionId].integration` — each field there wins over the root `integration` for that section only.
- **Per-component props** (e.g. `saveContact` on `ContactInfoEditor`, `onGenerateSummary` on `AISummary`) override both root and section adapter values when set.

Set **`onIntegrationError`** on the adapter (or section override) to receive mutation/load failures in one place instead of relying on `alert` or console-only behavior.

**`ContactInfoEditor`** persists via **`saveContact`** (default: `nuviraDefaultSaveContact` → `PUT /api/v1/contact/info`). Storybook and tests should pass a no-op or mock `saveContact` when the API is unavailable.

### UI `components` maps (stub substitution)

Optional **`components`** props let you swap MUI/stub primitives without forking:

- **`ChatList`:** `itemComponents` → forwarded to each `ChatListItem` (`Avatar`, nested `badgeGroup` chips).
- **`ChatListItem` / `ChatWindowHeader`:** `components.Avatar` (see `ChatListAvatarComponentProps`), header also `components.Loading`, `components.badgeGroup`.
- **`ContactBadgeGroup`:** `StatusChip`, `FunnelDisplay`, `StageDisplay` (`ContactBadgeGroupComponents`).
- **`ChatInput`:** `TextField` (defaults to `NvTextField`).
- **`ChatMessage`:** `useMediaUrl` hook (same signature as the package default; must follow rules of hooks).
- **`ChatMessagesContainer`:** `components.AiCover`, `components.useMediaUrl` for child messages.
- **`ChatWindow`:** `components.chatThreadAlerts.Alert` → forwarded to `ChatThreadAlerts` (`ChatThreadAlertRenderProps`).
- **`ChatAiCover`:** `components.Loading`.
- **`AISummary`:** `components.Loading` on the generate button.
- **`StatusChangeDisplay`:** `ContactStatusChip`, `CustomStageChip`.
- **`ChatContactNotes`:** `NoteCard`, `NoteForm`, `Modal`.

### Stubs and app integration

Several components still default to **Nuvira-branded stubs** under `src/stubs/` when you do not pass `components`. They ship with the package for quick demos.

**Status history:** `ContactStatusHistoryList` / `ContactStatusHistoryButton` accept optional `loadHistory`; default is `nuviraDefaultLoadContactStatusHistory`. The same loader is `ChatIntegrationAdapter.loadContactStatusHistory`. (`fetchContactStatusHistoryDefault` is deprecated but still exported.)

**Not published:** `ChatWindowSC` (server/prisma demo) remains internal to this repo only.

### Conversation list and badges

These components are **presentational**: your app owns fetching conversations, selection state, and routing.

#### `ChatListItemData`

Type for each row. It extends contact-like fields (`id`, `name`, `status`, `customFunnelId`, `customStageId`, `lastMessageErrored`, `lastMessageErrorReason`) with optional list fields:

| Field | Purpose |
| --- | --- |
| `avatarUrl` | Image URL for the avatar; initials fallback when absent |
| `subtitle` | Last message preview (single line, ellipsis) |
| `updatedAt` | Shown as relative time (today / yesterday / date) |
| `unreadCount` | Badge on the avatar when greater than 0 |

#### `ChatList`

Scrollable MUI `List` of `ChatListItem` rows.

- **`items`** – `ChatListItemData[]`
- **`selectedId`** – highlights the matching row
- **`onSelect(id)`** – called when a row is activated
- **`emptyState`** – custom node when `items` is empty (default copy: “No conversations”)
- **`sx`** – root styles
- **`itemComponents`** – optional `components` for each `ChatListItem` (avatar / badge chips)

#### `ChatListItem`

One conversation row: `ListItemButton`, avatar (with optional unread badge), name, optional subtitle/time, `ContactBadgeGroup`, and optional error icon when `lastMessageErrored` / `lastMessageErrorReason` is set.

- **`item`** – `ChatListItemData`
- **`selected`**, **`onClick`**, **`slotBadges`** (extra chips after the default badges), **`sx`**

#### `ContactBadgeGroup`

Single row of chips: contact status, then funnel and stage when IDs are present. Use **`slotEnd`** for extra chips (e.g. channel or “VIP”).

### Example: list + selection

```tsx
import {
  ChatList,
  type ChatListItemData,
} from "@nuvira/chat-components";

const items: ChatListItemData[] = [
  {
    id: "c1",
    name: "Ada",
    status: "LEAD_NEW",
    subtitle: "See you tomorrow",
    updatedAt: new Date(),
    unreadCount: 2,
  },
];

export function Inbox() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <ChatList
      items={items}
      selectedId={selectedId}
      onSelect={setSelectedId}
      sx={{ maxHeight: 400 }}
    />
  );
}
```

### Storybook and internal layout demos

Run `npm run storybook` to see:

- **Chat list** / **Chat list item** stories
- **Chat list with ChatWindow** – composite layout (list + `ChatWindow`, collapsible panels, `sidebarPosition`, etc.)

Story demos may import from `@/` paths in this repo; published consumers should import from `@nuvira/chat-components` per the list above (`src/index.ts`).

## Development

```bash
npm install
npm run storybook
```

Quality checks:

```bash
npm run check
npm run build
```

## Publishing (maintainers)

Publishing is manual. Before the first (or any) release:

1. Ensure `main` is green (`npm run check`, `npm run build`).
2. Bump `version` in `package.json` as appropriate.
3. Inspect the tarball: `npm pack --dry-run`
4. Publish: `npm publish` (scoped public access is set in `publishConfig`).

`prepublishOnly` runs `npm run build` so the published package always includes a fresh `dist/`.

## License

MIT. See [LICENSE](./LICENSE).
