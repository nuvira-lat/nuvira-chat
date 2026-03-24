import type { ReactNode } from "react";

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT"
}

export interface Contact {
  id: string;
  name: string | null;
  email?: string | null;
  company?: string | null;
  website?: string | null;
  phone?: string | null;
  status?: string;
  workspaceId?: string;
  customStageId?: string | null;
  useCustomStages?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string | null;
  aiNotesSummary?: string | null;
  websiteAnalysis?: string | null;
  websiteDescription?: string | null;
  lastMessageErrored?: boolean;
  talkingToAgent?: boolean;
  lastMessageErrorReason?: string | null;
  customFunnelId?: string | null;
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

export interface MediaState {
  url: string | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export interface MediaFile {
  file: File;
  type: "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT";
  url: string;
}

export interface ContactNotes {
  id: number;
  description: string;
  contactId?: string;
  edited?: boolean;
  createdAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
}

export interface CustomStage {
  id: string;
  name: string;
  customFunnelId: string;
  backgroundColor?: string;
  color?: string;
  isActive?: boolean;
  order?: number;
}

export interface CustomFunnel {
  id: string;
  name: string;
  workspaceId: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface ContactStatusHistory {
  id: string;
  contactId: string;
  changedAt: Date;
  previousStatus?: string;
  newStatus?: string;
  previousCustomStageId?: string;
  customStageId?: string;
  previousCustomFunnelId?: string;
  customFunnelId?: string;
  customStage?: CustomStage | null;
  previousCustomStage?: CustomStage | null;
  customFunnel?: CustomFunnel | null;
  previousCustomFunnel?: CustomFunnel | null;
  changedBy?: { id: string; name: string | null; email: string } | null;
  reason?: string;
  isAutomatic?: boolean;
  createdAt?: Date | string;
  [key: string]: unknown;
}

export type ContactStatus = string;

// Chat Sidebar (configurable sections)
export type ChatSidebarSectionId = "status" | "infoEditor" | "funnelStage" | "aiSummary" | "notes";

export const CHAT_SIDEBAR_SECTIONS: ChatSidebarSectionId[] = [
  "status",
  "infoEditor",
  "funnelStage",
  "aiSummary",
  "notes"
];

export const CHAT_SIDEBAR_SIMPLE: ChatSidebarSectionId[] = ["status"];
export const CHAT_SIDEBAR_STANDARD: ChatSidebarSectionId[] = ["status", "infoEditor", "aiSummary"];
export const CHAT_SIDEBAR_FULL: ChatSidebarSectionId[] = CHAT_SIDEBAR_SECTIONS;

export const CHAT_SIDEBAR_SECTION_TITLES: Record<ChatSidebarSectionId, string> = {
  status: "Contact Status",
  infoEditor: "Contact Information",
  funnelStage: "Funnel & Stage",
  aiSummary: "AI Summary",
  notes: "Contact Notes"
};

export interface ChatSidebarSectionConfig {
  /** Override section title (where applicable) */
  title?: string;
  /** Optional icon for the accordion header. Uses default when omitted. */
  icon?: ReactNode;
  /**
   * Disables the section accordion (non-interactive header). Also passed to built-in
   * section content where applicable (e.g. FunnelStageSelector, AISummary generate button).
   */
  disabled?: boolean;
  /** Replace built-in content with custom ReactNode */
  slot?: ReactNode;
  /** Whether this section is expanded when the sidebar first renders. Default: false */
  defaultExpanded?: boolean;
}

export interface ChatSidebarCustomSection {
  /** Unique key for React list rendering */
  id: string;
  /** Optional section header (rendered like "Funnel & Stage") */
  title?: string;
  /** Optional icon for the accordion header. Uses default when omitted. */
  icon?: ReactNode;
  /** The custom component to render */
  content: ReactNode;
  /** Placement: 'start' = before built-in sections, 'end' = after. Default: 'end' */
  position?: "start" | "end";
  /** Whether this section is expanded when the sidebar first renders. Default: false */
  defaultExpanded?: boolean;
}

export interface ChatSidebarProps {
  contact: Contact;
  /** Sections to show, in order. Omit = show all in default order. */
  sections?: ChatSidebarSectionId[];
  /** Per-section overrides */
  sectionConfig?: Partial<Record<ChatSidebarSectionId, ChatSidebarSectionConfig>>;
  /** Custom sections to add before or after built-in sections */
  customSections?: ChatSidebarCustomSection[];
  /** Section IDs expanded on initial render. Per-section defaultExpanded in sectionConfig overrides. */
  defaultExpandedSections?: ChatSidebarSectionId[];
  /** Required when infoEditor or notes is in sections */
  workspace?: Workspace;
  /** Required when funnelStage is in sections */
  funnels?: CustomFunnel[];
  /** Required when notes is in sections */
  notes?: ContactNotes[];
  /** MUI sx prop for the root Stack */
  sx?: import("@mui/material/styles").SxProps<import("@mui/material/styles").Theme>;
}
