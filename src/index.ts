/**
 * @nuvira/chat-components
 *
 * Chat message components for React with MUI theming support.
 *
 * v0.1 public API: theme helpers and message-type renderers. Additional
 * chat shell and CRM widgets remain internal until a future minor release.
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
