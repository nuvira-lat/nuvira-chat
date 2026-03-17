import type {
  Contact,
  ContactMessage,
  ContactNotes,
  Workspace,
  CustomFunnel,
  CustomStage,
  ContactStatusHistory
} from "@/types";
import { MessageType } from "@/types";

export const mockContact: Contact = {
  id: "contact-1",
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Corp",
  website: null,
  phone: "+1234567890",
  status: "LEAD_NEW",
  workspaceId: "workspace-1",
  customStageId: null,
  useCustomStages: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  description: null,
  aiNotesSummary: null,
  websiteAnalysis: null,
  websiteDescription: null,
  lastMessageErrored: false,
  talkingToAgent: false,
  lastMessageErrorReason: null,
  customFunnelId: null
};

export const mockContactWithFunnel: Contact = {
  ...mockContact,
  customFunnelId: "funnel-1",
  customStageId: "stage-1"
};

export const mockWorkspace: Workspace = {
  id: "workspace-1",
  name: "Workspace 1"
};

export const mockContactNotes: ContactNotes[] = [
  {
    id: 1,
    description: "Initial meeting notes. Discussed project scope and timeline.",
    contactId: "contact-1",
    edited: false,
    createdAt: new Date("2024-01-15T10:00:00")
  },
  {
    id: 2,
    description: "Follow-up call. Client approved the proposal.",
    contactId: "contact-1",
    edited: false,
    createdAt: new Date("2024-01-20T14:30:00")
  }
];

export const mockContactMessage = {
  id: "1",
  messageId: "msg-1",
  contactId: "contact-1",
  message: "Hello!",
  inbound: true,
  messageType: MessageType.TEXT,
  createdAt: new Date(),
  updatedAt: new Date(),
  timestamp: new Date(),
  confidence: null,
  errorReason: null,
  needsScaling: null,
  intent: "general_inquiry",
  mediaUrl: null,
  mediaType: null,
  fileName: null,
  fileSize: null
} as unknown as ContactMessage;

export const mockCustomFunnel: CustomFunnel = {
  id: "funnel-1",
  name: "Sales Pipeline",
  workspaceId: "workspace-1",
  isActive: true,
  isDefault: true
};

export const mockCustomStage: CustomStage = {
  id: "stage-1",
  name: "Qualified",
  customFunnelId: "funnel-1",
  isActive: true,
  order: 2
};

export const mockContactStatusHistoryItem: ContactStatusHistory & {
  customStage?: CustomStage | null;
  previousCustomStage?: CustomStage | null;
  customFunnel?: CustomFunnel | null;
  previousCustomFunnel?: CustomFunnel | null;
  changedBy?: { id: string; name: string | null; email: string } | null;
} = {
  id: "history-1",
  contactId: "contact-1",
  changedAt: new Date("2024-01-15T10:00:00"),
  previousStatus: "LEAD_NEW",
  newStatus: "LEAD_CONTACTED",
  customStage: mockCustomStage,
  previousCustomStage: null,
  customFunnel: mockCustomFunnel,
  previousCustomFunnel: null,
  changedBy: { id: "user-1", name: "Jane Smith", email: "jane@example.com" },
  reason: "Initial contact made",
  isAutomatic: false,
  createdAt: new Date("2024-01-15T10:00:00")
};

export const mockStatusChangeItem: ContactStatusHistory & {
  customStage?: CustomStage | null;
  previousCustomStage?: CustomStage | null;
  customFunnel?: CustomFunnel | null;
  previousCustomFunnel?: CustomFunnel | null;
} = {
  id: "history-1",
  contactId: "contact-1",
  changedAt: new Date(),
  previousStatus: "LEAD_NEW",
  newStatus: "LEAD_CONTACTED",
  customStage: mockCustomStage,
  previousCustomStage: null,
  customFunnel: mockCustomFunnel,
  previousCustomFunnel: null,
  isAutomatic: false
};

export const mockStageChangeItem: ContactStatusHistory & {
  customStage?: CustomStage | null;
  previousCustomStage?: CustomStage | null;
  customFunnel?: CustomFunnel | null;
  previousCustomFunnel?: CustomFunnel | null;
} = {
  id: "history-2",
  contactId: "contact-1",
  changedAt: new Date(),
  previousCustomStageId: "stage-0",
  customStageId: "stage-1",
  previousCustomStage: { id: "stage-0", name: "New", customFunnelId: "funnel-1" },
  customStage: mockCustomStage,
  customFunnel: mockCustomFunnel,
  previousCustomFunnel: mockCustomFunnel,
  previousStatus: "LEAD_CONTACTED",
  newStatus: "LEAD_CONTACTED",
  isAutomatic: false
};

export const mockFunnelChangeItem: ContactStatusHistory & {
  customStage?: CustomStage | null;
  previousCustomStage?: CustomStage | null;
  customFunnel?: CustomFunnel | null;
  previousCustomFunnel?: CustomFunnel | null;
} = {
  id: "history-3",
  contactId: "contact-1",
  changedAt: new Date(),
  previousCustomFunnelId: "funnel-0",
  customFunnelId: "funnel-1",
  previousCustomFunnel: { id: "funnel-0", name: "Old Funnel", workspaceId: "workspace-1" },
  customFunnel: mockCustomFunnel,
  previousStatus: "LEAD_CONTACTED",
  newStatus: "LEAD_CONTACTED",
  isAutomatic: false
};
