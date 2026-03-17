import type { Meta, StoryObj } from "@storybook/react";
import { Contact, ContactMessage, ContactNotes, Workspace } from "@/types";
import { ChatWindow } from "@/components/ChatWindow";

const meta: Meta<typeof ChatWindow> = {
  title: "Components/Chat/ChatWindow",
  component: ChatWindow
};

export default meta; // Ensure this default export exists

type Story = StoryObj<typeof ChatWindow>;

const message = {
  id: "1",
  messageId: "msg-1",
  inbound: true,
  contactId: "contact-1",
  message: "Hello!",
  createdAt: new Date(),
  updatedAt: new Date(),
  timestamp: new Date(),
  confidence: null,
  errorReason: null,
  needsScaling: null,
  intent: null
} as ContactMessage;

const note = {
  id: 0,
  description: "This is a note.",
  contactId: "contact-1",
  edited: false,
  createdAt: new Date()
} as ContactNotes;

export const Default: Story = {
  args: {
    messages: [
      message,
      {
        id: "2",
        messageId: "msg-2",
        inbound: false,
        contactId: "contact-1",
        message: "Hi there!",
        createdAt: new Date(),
        updatedAt: new Date(),
        timestamp: new Date(),
        confidence: null,
        errorReason: null,
        needsScaling: null,
        intent: null
      } as ContactMessage
    ],
    contact: {
      id: "contact-1",
      name: "John Doe",
      talkingToAgent: false,
      workspaceId: "workspace-1"
    } as Contact,
    notes: [note, note, note, note, note, note],
    workspace: {
      id: "workspace-1",
      name: "Workspace 1"
    } as Workspace,
    funnels: []
  }
};
