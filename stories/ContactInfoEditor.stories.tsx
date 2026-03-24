import { ContactInfoEditor } from "@/components/ContactInfoEditor";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { mockContact, mockWorkspace } from "./fixtures";

const meta: Meta<typeof ContactInfoEditor> = {
  title: "Chat/Primitives/ContactInfoEditor",
  component: ContactInfoEditor,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "400px" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Editable contact information (name, email, phone). Save is disabled until you make changes."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ContactInfoEditor>;

export const Default: Story = {
  args: {
    contact: mockContact,
    workspace: mockWorkspace,
    variant: "standalone"
  }
};

export const Sidebar: Story = {
  args: {
    contact: mockContact,
    workspace: mockWorkspace,
    variant: "sidebar"
  },
  parameters: {
    docs: {
      description: {
        story: "As used in ChatSidebar accordion (no title, compact layout)."
      }
    }
  }
};
