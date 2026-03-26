import { describe, expect, it } from "vitest";
import type { Contact, ChatThreadAlert } from "@/types";
import {
  CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR,
  CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW,
  CHAT_THREAD_ALERT_REACHABILITY_MESSAGE
} from "@/types";
import { mergeChatThreadAlerts } from "./mergeChatThreadAlerts";

const baseContact: Contact = {
  id: "c1",
  name: "Test",
  talkingToAgent: false,
  workspaceId: "w1"
};

describe("mergeChatThreadAlerts", () => {
  it("returns empty when no built-ins and no app alerts", () => {
    expect(mergeChatThreadAlerts({ contact: baseContact, alerts: [] })).toEqual([]);
  });

  it("adds last-message built-in from contact.lastMessageErrorReason", () => {
    const out = mergeChatThreadAlerts({
      contact: { ...baseContact, lastMessageErrorReason: "Delivery failed." },
      alerts: []
    });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      id: CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR,
      severity: "warning",
      message: "Delivery failed."
    });
  });

  it("adds reachability built-in when showReachabilityWindow", () => {
    const out = mergeChatThreadAlerts({
      contact: baseContact,
      alerts: [],
      showReachabilityWindow: true
    });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      id: CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW,
      severity: "warning",
      message: CHAT_THREAD_ALERT_REACHABILITY_MESSAGE
    });
  });

  it("replaces last-message built-in with app alert of same id", () => {
    const custom: ChatThreadAlert = {
      id: CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR,
      severity: "error",
      message: "Localized error."
    };
    const out = mergeChatThreadAlerts({
      contact: { ...baseContact, lastMessageErrorReason: "Server reason." },
      alerts: [custom]
    });
    expect(out).toHaveLength(1);
    expect(out[0]).toEqual(custom);
  });

  it("uses last occurrence for duplicate non-reserved ids in alerts", () => {
    const out = mergeChatThreadAlerts({
      contact: baseContact,
      alerts: [
        { id: "x", severity: "info", message: "first" },
        { id: "x", severity: "warning", message: "second" }
      ]
    });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ id: "x", message: "second", severity: "warning" });
  });

  it("does not duplicate reserved ids in the tail section", () => {
    const reachApp: ChatThreadAlert = {
      id: CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW,
      severity: "warning",
      message: "Custom reach."
    };
    const out = mergeChatThreadAlerts({
      contact: baseContact,
      alerts: [reachApp, { id: "extra", severity: "info", message: "Extra." }],
      showReachabilityWindow: true
    });
    expect(out.map((a) => a.id)).toEqual([CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW, "extra"]);
    expect(out[0]).toEqual(reachApp);
  });

  it("orders last-message before reachability then tail", () => {
    const out = mergeChatThreadAlerts({
      contact: { ...baseContact, lastMessageErrorReason: "Err" },
      alerts: [{ id: "tail", severity: "info", message: "T" }],
      showReachabilityWindow: true
    });
    expect(out.map((a) => a.id)).toEqual([
      CHAT_THREAD_ALERT_ID_LAST_MESSAGE_ERROR,
      CHAT_THREAD_ALERT_ID_REACHABILITY_WINDOW,
      "tail"
    ]);
  });
});
