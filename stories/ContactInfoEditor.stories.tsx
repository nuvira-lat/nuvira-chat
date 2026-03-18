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
        component: "Editable contact information (name, email, phone)."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ContactInfoEditor>;

export const Default: Story = {
  args: {
    contact: mockContact,
    workspace: mockWorkspace
  }
};

export const Expanded: Story = {
  args: {
    contact: mockContact,
    workspace: mockWorkspace
  },
  parameters: {
    docs: {
      description: {
        story: "Contact info with expanded details (user can expand to see more)."
      }
    }
  }
};
