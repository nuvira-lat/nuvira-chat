/**
 * Typed alerts shown in the chat thread strip (below header, above messages).
 * Built-in rows use ids `CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR` and
 * `CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW`; see `mergeChatThreadAlerts`.
 */

export type ChatThreadAlertSeverity = "error" | "warning" | "info" | "success";

/** Stable id for list keys, dedupe, and filtering (e.g. omitting or replacing built-ins). */
export interface ChatThreadAlert {
  id: string;
  severity: ChatThreadAlertSeverity;
  /** Main alert body (required for consistent, accessible content). */
  message: string;
  /** Optional MUI Alert title. */
  title?: string;
  /**
   * When true, the strip shows a close control and hides this row in local state until the alert
   * `id` disappears from the incoming `alerts` list (then dismissal resets for that id).
   */
  dismissible?: boolean;
}

/** Reserved id: derived from `contact.lastMessageErrorReason` unless overridden via `alerts`. */
export const CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR = "nuvira:last-message-error" as const;

/** Reserved id: reachability window when `showReachabilityWindow` is true unless overridden. */
export const CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW = "nuvira:reachability-window" as const;

/** Default English copy for the reachability built-in; override by passing an alert with the reachability id. */
export const CHAT_THREAD_ALERT_REACHABILITY_MESSAGE =
  "This contact can't be reached. More than 24 hours have passed.";
