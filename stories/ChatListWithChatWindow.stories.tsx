import { useId, useMemo, useState } from "react";
import { ChatList } from "@/components/ChatList";
import { ChatWindow } from "@/components/ChatWindow";
import { CollapsibleEdgePanel } from "@/components/CollapsibleEdgePanel";
import { CHAT_SIDEBAR_STANDARD } from "@/types";
import type { ContactMessage, ContactNotes } from "@/types";
import { MessageType } from "@/types";
import { Box, Stack, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import {
  contactFromChatListItem,
  mockChatListItems,
  mockContactMessage,
  mockContactNotes,
  mockCustomFunnel,
  mockWorkspace
} from "./fixtures";

function messagesForContact(contactId: string): ContactMessage[] {
  return [
    {
      ...mockContactMessage,
      id: `${contactId}-a`,
      messageId: `${contactId}-a`,
      contactId,
      message: "Hello, we need a quote for the Q2 rollout.",
      inbound: true,
      messageType: MessageType.TEXT
    },
    {
      ...mockContactMessage,
      id: `${contactId}-b`,
      messageId: `${contactId}-b`,
      contactId,
      message: "Thanks for reaching out — we will send pricing shortly.",
      inbound: false,
      messageType: MessageType.TEXT
    }
  ] as ContactMessage[];
}

function notesForContact(contactId: string): ContactNotes[] {
  if (contactId === "contact-1") {
    return mockContactNotes;
  }
  return [];
}

function ChatListAndWindow() {
  const [selectedId, setSelectedId] = useState<string>(mockChatListItems[0].id);

  const selectedItem = useMemo(
    () => mockChatListItems.find((i) => i.id === selectedId) ?? mockChatListItems[0],
    [selectedId]
  );

  const contact = useMemo(
    () => contactFromChatListItem(selectedItem, mockWorkspace),
    [selectedItem]
  );

  const messages = useMemo(() => messagesForContact(contact.id), [contact.id]);
  const notes = useMemo(() => notesForContact(contact.id), [contact.id]);

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        height: 720,
        maxHeight: "min(90vh, 900px)",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "background.default"
      }}
    >
      <Stack
        sx={{
          width: 340,
          flexShrink: 0,
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "grey.50"
        }}
      >
        <Box px={1.5} py={1} borderBottom={1} borderColor="divider">
          <Typography variant="subtitle2" fontWeight={600}>
            Conversations
          </Typography>
        </Box>
        <ChatList
          items={mockChatListItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
          sx={{ flex: 1 }}
        />
      </Stack>
      <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <ChatWindow
          key={selectedId}
          messages={messages}
          contact={contact}
          workspace={mockWorkspace}
          funnels={[mockCustomFunnel]}
          notes={notes}
          sidebarSections={CHAT_SIDEBAR_STANDARD}
          sidebarPosition="right"
          avatarUrl={selectedItem.avatarUrl}
          sx={{
            height: "100%",
            minHeight: 0,
            maxHeight: "100%"
          }}
        />
      </Box>
    </Stack>
  );
}

function ChatListAndWindowCollapsible({
  initialListOpen = true,
  defaultSidebarOpen = true
}: {
  initialListOpen?: boolean;
  defaultSidebarOpen?: boolean;
}) {
  const listPanelId = useId();
  const [listOpen, setListOpen] = useState(initialListOpen);
  const [selectedId, setSelectedId] = useState<string>(mockChatListItems[0].id);

  const selectedItem = useMemo(
    () => mockChatListItems.find((i) => i.id === selectedId) ?? mockChatListItems[0],
    [selectedId]
  );

  const contact = useMemo(
    () => contactFromChatListItem(selectedItem, mockWorkspace),
    [selectedItem]
  );

  const messages = useMemo(() => messagesForContact(contact.id), [contact.id]);
  const notes = useMemo(() => notesForContact(contact.id), [contact.id]);

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        height: 720,
        maxHeight: "min(90vh, 900px)",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "background.default"
      }}
    >
      <CollapsibleEdgePanel
        open={listOpen}
        onOpenChange={setListOpen}
        expandedWidth={340}
        side="start"
        panelId={listPanelId}
        toggleAriaLabelExpand="Show conversations list"
        toggleAriaLabelCollapse="Hide conversations list"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "grey.50"
        }}
      >
        <Stack sx={{ height: "100%", minHeight: 0, flex: 1 }}>
          <Box px={1.5} py={1} borderBottom={1} borderColor="divider">
            <Typography variant="subtitle2" fontWeight={600}>
              Conversations
            </Typography>
          </Box>
          <ChatList
            items={mockChatListItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            sx={{ flex: 1 }}
          />
        </Stack>
      </CollapsibleEdgePanel>
      <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <ChatWindow
          key={selectedId}
          messages={messages}
          contact={contact}
          workspace={mockWorkspace}
          funnels={[mockCustomFunnel]}
          notes={notes}
          sidebarSections={CHAT_SIDEBAR_STANDARD}
          sidebarPosition="right"
          sidebarCollapsible
          defaultSidebarOpen={defaultSidebarOpen}
          avatarUrl={selectedItem.avatarUrl}
          sx={{
            height: "100%",
            minHeight: 0,
            maxHeight: "100%"
          }}
        />
      </Box>
    </Stack>
  );
}

const meta: Meta<typeof ChatListAndWindow> = {
  title: "Chat/Composites/ChatList with ChatWindow",
  component: ChatListAndWindow,
  decorators: [
    (Story) => (
      <Box sx={{ p: 2, maxWidth: 1280, mx: "auto" }}>
        <Story />
      </Box>
    )
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Conversation list beside the chat shell: selecting a row updates the active contact, header avatar (when set), messages, and sidebar. Use **WithCollapsiblePanels** to collapse the list and/or CRM sidebar."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatListAndWindow>;

export const Default: Story = {
  render: () => <ChatListAndWindow />
};

export const WithCollapsiblePanels: Story = {
  render: () => <ChatListAndWindowCollapsible />
};

export const CollapsiblePanelsStartClosed: Story = {
  render: () => <ChatListAndWindowCollapsible initialListOpen={false} defaultSidebarOpen={false} />
};
