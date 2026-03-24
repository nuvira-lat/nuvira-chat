import type {
  ChatListItemData,
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

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

/** Build a full `Contact` from a list row for demos and tests. */
export function contactFromChatListItem(item: ChatListItemData, workspace: Workspace): Contact {
  return {
    ...mockContact,
    id: item.id,
    name: item.name,
    status: item.status,
    customFunnelId: item.customFunnelId ?? null,
    customStageId: item.customStageId ?? null,
    lastMessageErrored: item.lastMessageErrored ?? false,
    lastMessageErrorReason: item.lastMessageErrorReason ?? null,
    workspaceId: workspace.id
  };
}

export const mockChatListItems: ChatListItemData[] = [
  {
    id: "contact-1",
    name: "John Doe",
    status: "LEAD_NEW",
    customFunnelId: null,
    customStageId: null,
    lastMessageErrored: false,
    lastMessageErrorReason: null,
    subtitle: "Thanks, I'll review the proposal tomorrow.",
    updatedAt: hoursAgo(2),
    unreadCount: 2
  },
  {
    id: "contact-2",
    name: "Acme Corp — Billing",
    status: "LEAD_CONTACTED",
    customFunnelId: "funnel-1",
    customStageId: "stage-1",
    lastMessageErrored: false,
    lastMessageErrorReason: null,
    subtitle:
      "This is a very long preview line that should ellipsize nicely in the list row without breaking the layout or overlapping the timestamp column.",
    updatedAt: hoursAgo(5),
    unreadCount: 0,
    avatarUrl: "https://picsum.photos/seed/chatlist2/128/128"
  },
  {
    id: "contact-3",
    name: "Maria Garcia",
    status: "LEAD_QUALIFIED",
    customFunnelId: null,
    customStageId: null,
    lastMessageErrored: true,
    lastMessageErrorReason: "Message failed to deliver",
    subtitle: "Can we reschedule?",
    updatedAt: daysAgo(1),
    unreadCount: 1
  },
  {
    id: "contact-4",
    name: "Quiet Lead",
    status: "LEAD_NEW",
    customFunnelId: null,
    customStageId: null,
    lastMessageErrored: false,
    lastMessageErrorReason: null,
    subtitle: "👍",
    updatedAt: daysAgo(3),
    unreadCount: 0
  },
  {
    id: "contact-5",
    name: "Week-old thread",
    status: "LEAD_NEW",
    customFunnelId: "funnel-1",
    customStageId: "stage-1",
    lastMessageErrored: false,
    lastMessageErrorReason: null,
    subtitle: "Following up from last week",
    updatedAt: daysAgo(10),
    unreadCount: 100
  }
];

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
