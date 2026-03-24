/**
 * @nuvira/chat-components
 *
 * Chat message components for React with MUI theming support.
 *
 * Public API: theme helpers, message-type renderers, conversation list primitives,
 * and shared contact badge layout.
 */

export { createChatTheme, type ChatThemeOptions } from "./theme";

export {
  TextMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
  DocumentMessage,
  type TextMessageProps,
  type ImageMessageProps,
  type AudioMessageProps,
  type VideoMessageProps,
  type DocumentMessageProps
} from "./components/MessageTypes";

export {
  ChatList,
  ChatListItem,
  type ChatListProps,
  type ChatListItemProps
} from "./components/ChatList";
export { ContactBadgeGroup, type ContactBadgeGroupProps } from "./components/ContactBadgeGroup";
export type { ChatListItemData } from "./types";
