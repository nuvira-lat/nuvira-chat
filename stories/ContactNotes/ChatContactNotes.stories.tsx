import { ChatContactNotes } from "@/components/ContactNotes/ChatContactNotes";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { mockContact, mockContactNotes, mockWorkspace } from "../fixtures";

const meta: Meta<typeof ChatContactNotes> = {
  title: "Chat/Primitives/ContactNotes/ChatContactNotes",
  component: ChatContactNotes,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "400px", minHeight: "300px" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: "Contact notes section with add/edit functionality."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatContactNotes>;

export const Empty: Story = {
  args: {
    contact: mockContact,
    notes: [],
    workspace: mockWorkspace
  }
};

export const WithNotes: Story = {
  args: {
    contact: mockContact,
    notes: mockContactNotes,
    workspace: mockWorkspace
  }
};
