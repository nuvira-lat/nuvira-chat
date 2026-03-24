/**
 * @nuvira/chat-components — published entry: theme, message renderers,
 * `ChatList` / `ChatListItem`, `ContactBadgeGroup`, `ChatListItemData`.
 * See README “Conversation list and badges”.
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

/** Conversation list and row; see README “Conversation list and badges”. */
export {
  ChatList,
  ChatListItem,
  type ChatListProps,
  type ChatListItemProps
} from "./components/ChatList";

/** Status + funnel + stage chips in one horizontal group. */
export { ContactBadgeGroup, type ContactBadgeGroupProps } from "./components/ContactBadgeGroup";

/** View model for each {@link ChatList} row. */
export type { ChatListItemData } from "./types";
