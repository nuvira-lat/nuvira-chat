import { AISummary } from "@/components/AISummary";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { mockContact } from "./fixtures";
import { createFetchMock } from "./mockFetch";

const meta: Meta<typeof AISummary> = {
  title: "Chat/Primitives/AISummary",
  component: AISummary,
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "contact-summary": { description: "AI-generated summary of the contact." }
      });
      useEffect(() => () => restore(), []); // eslint-disable-line react-hooks/exhaustive-deps
      return (
        <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "400px" }}>
          <Story />
        </Stack>
      );
    }
  ],
  parameters: {
    docs: {
      description: {
        component: "AI-generated summary for a contact with generate functionality."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof AISummary>;

export const NoSummary: Story = {
  args: {
    contact: { ...mockContact, aiNotesSummary: null },
    disabled: false
  }
};

export const WithSummary: Story = {
  args: {
    contact: {
      ...mockContact,
      aiNotesSummary:
        "Contact has shown interest in enterprise plan. Had two meetings. Follow-up scheduled for next week."
    },
    disabled: false
  }
};

export const Disabled: Story = {
  args: {
    contact: mockContact,
    disabled: true
  }
};
