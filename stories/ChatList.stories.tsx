import { ChatList } from "@/components/ChatList";
import { Stack, Chip, Avatar } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { mockChatListItems } from "./fixtures";

const meta: Meta<typeof ChatList> = {
  title: "Chat/Primitives/List/ChatList",
  component: ChatList,
  decorators: [
    (Story) => (
      <Stack
        sx={{
          width: 380,
          maxHeight: 480,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Scrollable list of conversations with avatar, preview, status badges, and selection."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatList>;

export const Default: Story = {
  args: {
    items: mockChatListItems,
    selectedId: "contact-1",
    onSelect: fn()
  }
};

export const Empty: Story = {
  args: {
    items: [],
    onSelect: fn()
  }
};

export const EmptyCustom: Story = {
  args: {
    items: [],
    emptyState: <Chip label="No matches" size="small" variant="outlined" />,
    onSelect: fn()
  }
};

export const SelectedSecond: Story = {
  args: {
    items: mockChatListItems,
    selectedId: "contact-2",
    onSelect: fn()
  }
};

/** Demonstrates `itemComponents.Avatar` (MUI `Avatar` instead of default `NvAvatar`). */
export const CustomAvatar: Story = {
  args: {
    items: mockChatListItems,
    selectedId: "contact-1",
    onSelect: fn(),
    itemComponents: {
      Avatar: ({ name, src, sx }) => (
        <Avatar src={src ?? undefined} alt={name} sx={{ width: 40, height: 40, ...sx }}>
          {name?.[0]?.toUpperCase() ?? "?"}
        </Avatar>
      )
    }
  }
};
