/**
 * @nuvira/chat-components — theme, message renderers, conversation list, CRM sidebar,
 * chat shell, and shared types. See README “Public API”.
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

export {
  CollapsibleEdgePanel,
  type CollapsibleEdgePanelProps
} from "./components/CollapsibleEdgePanel";
export { ChatAgentSwitch } from "./components/Agent/ChatAgentSwitch";
export { ChatAiCover } from "./components/Agent/ChatAiCover";

export { ChatMessage, type ChatMessageProps } from "./components/ChatMessage";
export {
  ChatMessagesContainer,
  type ChatMessagesContainerProps
} from "./components/ChatMessagesContainer";
export { ChatInput, type ChatInputProps, type ChatInputMediaFile } from "./components/ChatInput";
export { ChatWindowHeader, type ChatWindowHeaderProps } from "./components/ChatWindowHeader";
export { ChatWindow, type ChatWindowProps } from "./components/ChatWindow";

export { AISummary, type AISummaryProps } from "./components/AISummary";

export {
  FunnelStageSelector,
  type FunnelStageSelectorProps
} from "./components/FunnelStageSelector/FunnelStageSelector";
export {
  FunnelSelector,
  type FunnelSelectorProps
} from "./components/FunnelStageSelector/FunnelSelector";
export {
  StageSelector,
  type StageSelectorProps
} from "./components/FunnelStageSelector/StageSelector";

export {
  ChatContactStatus,
  type ChatContactStatusProps
} from "./components/ChatContactStatus/ChatContactStatus";
export {
  StatusChangeDisplay,
  type StatusChangeDisplayProps
} from "./components/ChatContactStatus/StatusChangeDisplay";
export {
  ContactStatusHistoryList,
  type ContactStatusHistoryListProps
} from "./components/ChatContactStatus/ContactStatusHistoryList";
export {
  ContactStatusHistoryButton,
  type ContactStatusHistoryButtonProps
} from "./components/ChatContactStatus/ContactStatusHistoryButton";

export { ContactInfoEditor, type ContactInfoEditorProps } from "./components/ContactInfoEditor";
export {
  ChatContactNotes,
  type ChatContactNotesProps
} from "./components/ContactNotes/ChatContactNotes";

export { ChatSidebar, ConsolidatedChatActions } from "./components/ConsolidatedChatActions";

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
export { useTimelineStream } from "./stubs/useWorkspaceStream";
export { useIsMobile } from "./stubs/isMobile";
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

export type { ChatListAvatarComponentProps } from "./components/ChatList/ChatListItem";
export type { ContactBadgeGroupComponents } from "./components/ContactBadgeGroup";
export type { ChatMessageUseMediaUrl } from "./components/ChatMessage";
export type { ChatAiCoverProps } from "./components/Agent/ChatAiCover";
