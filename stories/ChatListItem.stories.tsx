import { ChatListItem } from "@/components/ChatList/ChatListItem";
import { Stack, Chip } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { mockChatListItems } from "./fixtures";

const meta: Meta<typeof ChatListItem> = {
  title: "Chat/Primitives/List/ChatListItem",
  component: ChatListItem,
  decorators: [
    (Story) => (
      <Stack sx={{ width: 380, bgcolor: "grey.50", border: "1px solid", borderColor: "divider" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: "Single row for the conversation list."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatListItem>;

export const Default: Story = {
  args: {
    item: mockChatListItems[0],
    selected: false
  }
};

export const Selected: Story = {
  args: {
    item: mockChatListItems[1],
    selected: true
  }
};

export const WithSlotBadges: Story = {
  args: {
    item: mockChatListItems[0],
    selected: true
  },
  render: (args) => (
    <ChatListItem
      {...args}
      slotBadges={<Chip label="VIP" size="small" color="secondary" variant="outlined" />}
    />
  )
};
