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
