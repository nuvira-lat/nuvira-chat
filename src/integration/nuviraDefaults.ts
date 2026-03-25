import type { Contact, CustomStage } from "@/types";
import { fetchContactStatusHistoryDefault } from "@/stubs/contactStatusHistory";
import type {
  ChatIntegrationAdapter,
  SaveContactInput,
  UpdateTalkingToAgentInput,
  SendChatMessageInput,
  ContactStatusUpdateInput,
  FunnelUpdateInput,
  StageUpdateInput
} from "./types";

/**
 * Default Nuvira API: persist name/email/phone (and optional fields).
 * Override via {@link ChatIntegrationAdapter.saveContact} or `saveContact` on {@link ContactInfoEditor}.
 */
export async function nuviraDefaultSaveContact(data: SaveContactInput): Promise<void> {
  const response = await fetch("/api/v1/contact/info", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    let message = "Failed to save contact";
    try {
      const err = (await response.json()) as { error?: string };
      if (err.error) message = err.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
}

export async function nuviraDefaultGenerateSummary(contactId: string): Promise<string> {
  const response = await fetch("/api/v1/agents/contact-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contactId })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      typeof errorData === "object" && errorData && "error" in errorData
        ? String((errorData as { error?: string }).error)
        : "Failed to generate summary"
    );
  }
  const responseData = (await response.json()) as { description?: string };
  return responseData.description ?? "";
}

export async function nuviraDefaultUpdateContactStatus(
  input: ContactStatusUpdateInput
): Promise<Contact | void> {
  const response = await fetch("/api/v1/contact/status/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contactId: input.contactId,
      newStatus: input.newStatus,
      reason: input.reason ?? "Updated status from chat",
      isAutomatic: input.isAutomatic ?? false
    })
  });
  if (!response.ok) {
    throw new Error("Failed to update contact status");
  }
  const data = (await response.json()) as { success?: boolean; contact?: Contact; error?: string };
  if (data.success && data.contact) {
    return data.contact;
  }
  throw new Error(data.error || "Failed to update contact status");
}

export const nuviraDefaultLoadContactStatusHistory = fetchContactStatusHistoryDefault;

export async function nuviraDefaultLoadStages(funnelId: string): Promise<CustomStage[]> {
  if (!funnelId) return [];
  const response = await fetch(`/api/v1/custom-funnels/${funnelId}/stages`);
  if (!response.ok) {
    throw new Error("Failed to fetch stages");
  }
  const data = (await response.json()) as { stages?: CustomStage[] };
  return data.stages || [];
}

export async function nuviraDefaultUpdateFunnel(input: FunnelUpdateInput): Promise<void> {
  const response = await fetch("/api/v1/contact/custom-funnel", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contactId: input.contactId,
      funnelId: input.funnelId,
      reason: input.reason ?? "Funnel updated from chat interface"
    })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      typeof errorData === "object" && errorData && "error" in errorData
        ? String((errorData as { error?: string }).error)
        : "Failed to update funnel"
    );
  }
}

export async function nuviraDefaultUpdateStage(input: StageUpdateInput): Promise<void> {
  const response = await fetch("/api/v1/contact/custom-stage", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contactId: input.contactId,
      customStageId: input.customStageId,
      useCustomStages: input.useCustomStages ?? true,
      reason: input.reason ?? "Stage updated from chat interface"
    })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      typeof errorData === "object" && errorData && "error" in errorData
        ? String((errorData as { error?: string }).error)
        : "Failed to update stage"
    );
  }
}

export async function nuviraDefaultUpdateTalkingToAgent(
  input: UpdateTalkingToAgentInput
): Promise<boolean | void> {
  const response = await fetch("/api/v1/contact/update-taling-to-agent", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      talkingToAgent: input.talkingToAgent,
      workspaceId: input.workspaceId,
      id: input.contactId
    })
  });
  if (!response.ok) {
    let detail: unknown;
    try {
      detail = await response.json();
    } catch {
      detail = undefined;
    }
    throw new Error(
      typeof detail === "object" && detail && "error" in detail
        ? String((detail as { error?: string }).error)
        : "Failed to update talking-to-agent state"
    );
  }
  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}

export async function nuviraDefaultSendChatMessage(input: SendChatMessageInput): Promise<void> {
  const response = await fetch("/api/v1/meta/whatsapp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: input.message,
      contactId: input.contactId,
      messageType: input.messageType,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
      fileName: input.fileName
    })
  });
  if (!response.ok) {
    let detail: unknown;
    try {
      detail = await response.json();
    } catch {
      detail = undefined;
    }
    throw new Error(
      typeof detail === "object" && detail && "error" in detail
        ? String((detail as { error?: string }).error)
        : "Failed to send message"
    );
  }
}

/**
 * Returns a {@link ChatIntegrationAdapter} with all Nuvira default HTTP implementations.
 * Pass `overrides` to replace individual callbacks or set `onIntegrationError`.
 */
export function createNuviraChatIntegration(
  overrides?: Partial<ChatIntegrationAdapter>
): ChatIntegrationAdapter {
  return {
    saveContact: overrides?.saveContact ?? nuviraDefaultSaveContact,
    onGenerateSummary: overrides?.onGenerateSummary ?? nuviraDefaultGenerateSummary,
    onStatusUpdate: overrides?.onStatusUpdate ?? nuviraDefaultUpdateContactStatus,
    loadContactStatusHistory:
      overrides?.loadContactStatusHistory ?? nuviraDefaultLoadContactStatusHistory,
    loadStages: overrides?.loadStages ?? nuviraDefaultLoadStages,
    onFunnelUpdate: overrides?.onFunnelUpdate ?? nuviraDefaultUpdateFunnel,
    onStageUpdate: overrides?.onStageUpdate ?? nuviraDefaultUpdateStage,
    onUpdateTalkingToAgent: overrides?.onUpdateTalkingToAgent ?? nuviraDefaultUpdateTalkingToAgent,
    onSendMessage: overrides?.onSendMessage ?? nuviraDefaultSendChatMessage,
    onIntegrationError: overrides?.onIntegrationError
  };
}
