/**
 * Storybook stories for TextMessage component
 *
 * Showcases different text message scenarios including short text,
 * long text, and various text formatting cases.
 */

import { TextMessage } from "@/components/MessageTypes/TextMessage";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TextMessage> = {
  title: "Components/Chat/MessageTypes/TextMessage",
  component: TextMessage,
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
          "Simple text message component that renders plain text with proper typography and accessibility."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof TextMessage>;

export const ShortMessage: Story = {
  args: {
    message: "Hello!"
  },
  parameters: {
    docs: {
      description: {
        story: "Basic short text message"
      }
    }
  }
};

export const LongMessage: Story = {
  args: {
    message:
      "This is a much longer message that demonstrates how the TextMessage component handles longer text content. It should wrap properly and maintain good readability even with extensive explanations and multiple sentences that go on for quite a while."
  },
  parameters: {
    docs: {
      description: {
        story: "Long text message demonstrating text wrapping"
      }
    }
  }
};

export const MessageWithEmojis: Story = {
  args: {
    message:
      "Great work! 🎉 Looking forward to our next meeting 📅 Let me know if you have any questions! 💬"
  },
  parameters: {
    docs: {
      description: {
        story: "Text message containing emojis"
      }
    }
  }
};

export const MessageWithSpecialCharacters: Story = {
  args: {
    message:
      "Here are the specs: 50% increase, $1,000 budget, #ProjectAlpha, @john-doe, & more details..."
  },
  parameters: {
    docs: {
      description: {
        story: "Text message with special characters and symbols"
      }
    }
  }
};

export const MultilineMessage: Story = {
  args: {
    message: `Line 1: Project overview
Line 2: Timeline details
Line 3: Budget considerations
Line 4: Next steps`
  },
  parameters: {
    docs: {
      description: {
        story: "Multi-line text message with line breaks"
      }
    }
  }
};

export const EmptyMessage: Story = {
  args: {
    message: ""
  },
  parameters: {
    docs: {
      description: {
        story: "Empty text message (edge case)"
      }
    }
  }
};
