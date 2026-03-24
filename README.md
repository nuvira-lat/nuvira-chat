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
- **Agent / thread chrome:** `ChatAgentSwitch`, `ChatAiCover`, `ChatMessage`, `ChatMessagesContainer`, `ChatInput`, `ChatWindowHeader`, `ChatWindow`, and their `*Props` types (`ChatInputMediaFile` for attachments)
- **AI summary:** `AISummary`, `AISummaryProps`
- **Funnel & stage:** `FunnelStageSelector`, `FunnelSelector`, `StageSelector`, and their `*Props` types
- **CRM sidebar (accordion sections):** `ChatSidebar` (canonical name; `ConsolidatedChatActions` is a deprecated alias), plus `ChatContactStatus`, `StatusChangeDisplay`, `ContactStatusHistoryList`, `ContactStatusHistoryButton`, `ContactInfoEditor`, `ChatContactNotes`, and their prop types
- **Types & constants:** `MessageType`, `Contact`, `ContactMessage`, `ContactNotes`, `Workspace`, `CustomFunnel`, `CustomStage`, `ContactStatusHistory`, `ContactStatus`, `MediaState`, `MediaFile`, `ChatSidebarSectionId`, `ChatSidebarSectionConfig`, `ChatSidebarCustomSection`, `ChatSidebarProps`, and `CHAT_SIDEBAR_*` constants
- **Integration helpers (defaults you can override):** `fetchContactStatusHistoryDefault`, `ContactStatusHistoryListItem`, `UseTimelineStreamOptions`, `useTimelineStream`, `useIsMobile`, `uploadMediaFileWithUrls`, `CONTACT_UPDATED_BROADCAST_MESSAGE_TYPE`

`ChatWindow` accepts optional `useTimelineStream`, `useIsMobile`, `uploadMediaFileWithUrls`, and `contactUpdatedBroadcastType` so host apps replace Storybook/no-op defaults with real SSE, breakpoints, and uploads.

### Stubs and app integration

Several components use **Nuvira-branded stubs** under `src/stubs/` (e.g. `NvAvatar`, `NvTextField`, `LoadingAnimation`, `ContactStatusChip`) for consistent Storybook and internal demos. They ship with the package and are suitable for quick integration; replace them over time with your own primitives via fork or future slot APIs where needed.

**Status history:** `ContactStatusHistoryList` and `ContactStatusHistoryButton` accept an optional `loadHistory` callback; the default calls `fetchContactStatusHistoryDefault` (Nuvira `/api/v1/contact/status/history`). Pass your own loader in non-Nuvira apps.

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
