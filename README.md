# @nuvira/chat-components

React chat UI primitives for Nuvira: MUI-based theming, message-type renderers (text, image, audio, video, document), and conversation list building blocks (`ChatList`, `ChatListItem`, `ContactBadgeGroup`).

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

Other chat shell pieces (e.g. full `ChatWindow`) remain internal to this repo until explicitly exported.

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
