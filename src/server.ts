/**
 * Server-safe (RSC-friendly) exports for Next.js App Router and other environments
 * that distinguish Server vs Client Components.
 *
 * Import from `@nuvira/chat-components/server` in Server Components. Do **not** import
 * the package root (`@nuvira/chat-components`) from RSC — it is a Client Component entry.
 *
 * Excludes React components and client hooks (`useTimelineStream`, `useIsMobile`).
 */

export { createChatTheme, type ChatThemeOptions } from "./theme";

export {
  mergeChatThreadAlerts,
  type MergeChatThreadAlertsInput
} from "./chatThreadAlerts/mergeChatThreadAlerts";

export type { ChatThreadAlert, ChatThreadAlertSeverity } from "./types";
export {
  CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR,
  CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW,
  CHAT_THREAD_ALERT_REACHABILITY_MESSAGE
} from "./types";

export {
  MessageType,
  CHAT_SIDEBAR_SECTIONS,
  CHAT_SIDEBAR_SIMPLE,
  CHAT_SIDEBAR_STANDARD,
  CHAT_SIDEBAR_FULL,
  CHAT_SIDEBAR_SECTION_TITLES
} from "./types";

export type {
  Contact,
  ContactMessage,
  ContactNotes,
  Workspace,
  CustomStage,
  CustomFunnel,
  ContactStatusHistory,
  ContactStatus,
  MediaState,
  MediaFile,
  ChatListItemData,
  ChatSidebarSectionId,
  ChatSidebarSectionConfig,
  ChatSidebarCustomSection,
  ChatSidebarProps
} from "./types";

/**
 * @deprecated Use `nuviraDefaultLoadContactStatusHistory` (same implementation).
 */
export { fetchContactStatusHistoryDefault } from "./stubs/contactStatusHistory";
export type { ContactStatusHistoryListItem } from "./stubs/contactStatusHistory";

export type { UseTimelineStreamOptions } from "./stubs/useWorkspaceStream";

export { uploadMediaFileWithUrls } from "./stubs/mediaUpload";
export { CONTACT_UPDATED_BROADCAST_MESSAGE_TYPE } from "./stubs/broadcast";

export type {
  ChatIntegrationAdapter,
  SaveContactInput,
  UpdateTalkingToAgentInput,
  SendChatMessageInput,
  ContactStatusUpdateInput,
  FunnelUpdateInput,
  StageUpdateInput,
  LoadContactStatusHistoryFn
} from "./integration/types";

export {
  nuviraDefaultSaveContact,
  nuviraDefaultGenerateSummary,
  nuviraDefaultUpdateContactStatus,
  nuviraDefaultLoadContactStatusHistory,
  nuviraDefaultLoadStages,
  nuviraDefaultUpdateFunnel,
  nuviraDefaultUpdateStage,
  nuviraDefaultUpdateTalkingToAgent,
  nuviraDefaultSendChatMessage,
  createNuviraChatIntegration
} from "./integration/nuviraDefaults";

export {
  pickIntegration,
  pickOnIntegrationError,
  mergeOnIntegrationError
} from "./integration/pickIntegration";

/** Component prop types only — safe for RSC type positions; no component runtime. */
export type { ChatListAvatarComponentProps } from "./components/ChatList/ChatListItem";
export type { ContactBadgeGroupComponents } from "./components/ContactBadgeGroup";
export type { ChatMessageUseMediaUrl } from "./components/ChatMessage";
export type { ChatAiCoverProps } from "./components/Agent/ChatAiCover";
