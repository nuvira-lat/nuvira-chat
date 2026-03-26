import type { Contact, ChatThreadAlert } from "@/types";
import {
  CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR,
  CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW,
  CHAT_THREAD_ALERT_REACHABILITY_MESSAGE
} from "@/types";

export interface MergeChatThreadAlertsInput {
  contact: Contact;
  /** App-supplied alerts; duplicate ids use last occurrence in this array. */
  alerts?: ChatThreadAlert[];
  /** When true, appends the reachability built-in unless overridden by an alert with the reachability id. */
  showReachabilityWindow?: boolean;
}

/**
 * Merges built-in thread alerts with app `alerts`.
 *
 * **Order:** (1) last-message error slot, (2) reachability slot, (3) remaining app alerts.
 * **Overrides:** An app alert whose `id` matches a reserved id replaces the auto-generated alert for that slot.
 * **Duplicate ids in `alerts`:** Last occurrence wins for non-reserved ids; reserved slots use the same rule when an app alert targets that id.
 */
export function mergeChatThreadAlerts(input: MergeChatThreadAlertsInput): ChatThreadAlert[] {
  const { contact, alerts = [], showReachabilityWindow = false } = input;
  const result: ChatThreadAlert[] = [];
  const inResult = new Set<string>();

  const push = (a: ChatThreadAlert) => {
    result.push(a);
    inResult.add(a.id);
  };

  const lastMessageMatches = alerts.filter((a) => a.id === CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR);
  const lastMessageFromApp = lastMessageMatches[lastMessageMatches.length - 1];
  if (lastMessageFromApp) {
    push(lastMessageFromApp);
  } else if (contact.lastMessageErrorReason) {
    push({
      id: CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR,
      severity: "warning",
      message: contact.lastMessageErrorReason
    });
  }

  const reachabilityMatches = alerts.filter(
    (a) => a.id === CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW
  );
  const reachabilityFromApp = reachabilityMatches[reachabilityMatches.length - 1];
  if (reachabilityFromApp) {
    push(reachabilityFromApp);
  } else if (showReachabilityWindow) {
    push({
      id: CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW,
      severity: "warning",
      message: CHAT_THREAD_ALERT_REACHABILITY_MESSAGE
    });
  }

  const lastIndexById = new Map<string, number>();
  alerts.forEach((a, i) => lastIndexById.set(a.id, i));

  for (let i = 0; i < alerts.length; i++) {
    const a = alerts[i];
    if (lastIndexById.get(a.id) !== i) {
      continue;
    }
    if (inResult.has(a.id)) {
      continue;
    }
    result.push(a);
  }

  return result;
}
