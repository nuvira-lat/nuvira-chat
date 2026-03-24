/**
 * Storybook stories for DocumentMessage component
 *
 * Showcases document message scenarios including different file types,
 * sizes, loading states, and error handling.
 */

import { DocumentMessage } from "@/components/MessageTypes/DocumentMessage";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

// Mock function for retry actions in Storybook
const mockRetryFunction = () => {
  // Mock retry action for Storybook demonstration
};

const meta: Meta<typeof DocumentMessage> = {
  title: "Chat/Primitives/Messages/MessageTypes/DocumentMessage",
  component: DocumentMessage,
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
          "Document message component that displays file information, download functionality, and handles various document types."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof DocumentMessage>;

export const PDFDocument: Story = {
  args: {
    fileName: "project_proposal.pdf",
    fileSize: 1024 * 1024 * 2.5, // 2.5 MB
    mediaUrl: "/api/v1/media/documents/project_proposal.pdf",
    mediaLoading: false,
    mediaError: false,
    message: "Here's the project proposal document for your review",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "PDF document message with caption"
      }
    }
  }
};

export const DocumentError: Story = {
  args: {
    fileName: "corrupted_file.pdf",
    fileSize: 1024 * 1024 * 1.5, // 1.5 MB
    mediaUrl: null,
    mediaLoading: false,
    mediaError: true,
    message: "This document failed to upload properly",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Document with error state and retry functionality"
      }
    }
  }
};
