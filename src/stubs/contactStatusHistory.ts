import type { ContactStatusHistory, CustomFunnel, CustomStage } from "@/types";

/** Row shape returned by status history loaders (extends API `ContactStatusHistory`). */
export type ContactStatusHistoryListItem = ContactStatusHistory & {
  customStage?: CustomStage | null;
  previousCustomStage?: CustomStage | null;
  customFunnel?: CustomFunnel | null;
  previousCustomFunnel?: CustomFunnel | null;
  changedBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

/**
 * Default loader matching the Nuvira app route (same implementation as
 * `nuviraDefaultLoadContactStatusHistory` in the package public API).
 *
 * @deprecated Prefer `nuviraDefaultLoadContactStatusHistory` from `@nuvira/chat-components`
 *   (same behavior; aligns with `ChatIntegrationAdapter.loadContactStatusHistory`).
 */
export async function fetchContactStatusHistoryDefault(
  contactId: string
): Promise<ContactStatusHistoryListItem[]> {
  if (!contactId) return [];
  try {
    const response = await fetch(`/api/v1/contact/status/history?contactId=${contactId}`);
    const data = await response.json();
    return data.statusHistory ?? [];
  } catch {
    return [];
  }
}
