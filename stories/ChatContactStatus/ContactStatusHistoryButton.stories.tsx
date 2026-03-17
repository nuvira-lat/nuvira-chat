import { ContactStatusHistoryButton } from "@/components/ChatContactStatus/ContactStatusHistoryButton";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { mockContact } from "../fixtures";
import { createFetchMock } from "../mockFetch";
import { mockContactStatusHistoryItem } from "../fixtures";

const meta: Meta<typeof ContactStatusHistoryButton> = {
  title: "Components/Chat/ChatContactStatus/ContactStatusHistoryButton",
  component: ContactStatusHistoryButton,
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "status/history": { statusHistory: [mockContactStatusHistoryItem] }
      });
      useEffect(() => () => restore(), []); // eslint-disable-line react-hooks/exhaustive-deps
      return (
        <Stack sx={{ p: 3, bgcolor: "grey.50" }}>
          <Story />
        </Stack>
      );
    }
  ],
  parameters: {
    docs: {
      description: {
        component: "Button to open contact status history dialog."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ContactStatusHistoryButton>;

export const IconVariant: Story = {
  args: {
    contact: mockContact,
    variant: "icon"
  }
};

export const ButtonVariant: Story = {
  args: {
    contact: mockContact,
    variant: "button"
  }
};
