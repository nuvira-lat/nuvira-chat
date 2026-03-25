import type { Contact, CustomStage } from "@/types";
import type { ContactStatusHistoryListItem } from "@/stubs/contactStatusHistory";

/** Loader for contact status history rows (same contract as {@link ContactStatusHistoryList}). */
export type LoadContactStatusHistoryFn = (
  contactId: string
) => Promise<ContactStatusHistoryListItem[]>;

/** Persisted contact fields (matches {@link ContactInfoEditor} save payload). */
export interface SaveContactInput {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  workspaceId: string;
  company?: string | null;
  website?: string | null;
  description?: string | null;
}

export interface UpdateTalkingToAgentInput {
  contactId: string;
  workspaceId?: string;
  talkingToAgent: boolean;
}

export interface SendChatMessageInput {
  contactId: string;
  message: string | null;
  messageType: string;
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
}

export interface ContactStatusUpdateInput {
  contactId: string;
  newStatus: string;
  reason?: string;
  isAutomatic?: boolean;
}

export interface FunnelUpdateInput {
  contactId: string;
  funnelId: string;
  reason?: string;
}

export interface StageUpdateInput {
  contactId: string;
  customStageId: string;
  useCustomStages?: boolean;
  reason?: string;
}

/**
 * Optional callbacks and loaders shared by {@link ChatSidebar} and {@link ChatWindow}.
 * Per-component props override the same field on this object when both are set.
 */
export interface ChatIntegrationAdapter {
  /** Central error sink for integration failures (mutations, loads). */
  onIntegrationError?: (error: unknown, context: string) => void;

  saveContact?: (data: SaveContactInput) => Promise<void>;
  onGenerateSummary?: (contactId: string) => Promise<string>;
  onStatusUpdate?: (input: ContactStatusUpdateInput) => Promise<Contact | void>;
  loadContactStatusHistory?: LoadContactStatusHistoryFn;
  loadStages?: (funnelId: string) => Promise<CustomStage[]>;
  onFunnelUpdate?: (input: FunnelUpdateInput) => Promise<void>;
  onStageUpdate?: (input: StageUpdateInput) => Promise<void>;
  onUpdateTalkingToAgent?: (input: UpdateTalkingToAgentInput) => Promise<boolean | void>;
  onSendMessage?: (input: SendChatMessageInput) => Promise<void>;
}
