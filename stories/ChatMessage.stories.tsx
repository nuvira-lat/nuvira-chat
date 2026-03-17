import { ChatMessage } from "@/components/ChatMessage";
import { Stack } from "@mui/material";
import { Contact, ContactMessage, MessageType } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ChatMessage> = {
  title: "Components/Chat/ChatMessage",
  component: ChatMessage,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 3, bgcolor: "grey.50", minHeight: "200px" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Chat message component that supports text, image, audio, video, and document messages. Handles media loading states and error handling."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatMessage>;

// Base contact data
const contact: Contact = {
  id: "contact-1",
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Corp",
  website: null,
  phone: "+1234567890",
  status: "LEAD_NEW" as const,
  workspaceId: "workspace-1",
  customStageId: null,
  useCustomStages: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  description: null,
  aiNotesSummary: null,
  websiteAnalysis: null,
  websiteDescription: null,
  lastMessageErrored: false,
  talkingToAgent: false,
  lastMessageErrorReason: null,
  customFunnelId: null
};

// Base message properties
const baseMessage = {
  id: "1",
  messageId: "msg-1",
  contactId: "contact-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  timestamp: new Date(),
  confidence: null,
  errorReason: null,
  needsScaling: null,
  intent: "general_inquiry",
  mediaUrl: null,
  mediaType: null,
  fileName: null,
  fileSize: null
} as unknown as ContactMessage;

// Text Messages
export const InboundTextMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      inbound: true,
      messageType: MessageType.TEXT,
      message: "Hello! I'm interested in your services."
    },
    contact
  },
  parameters: {
    docs: {
      description: {
        story: "Inbound text message from a contact"
      }
    }
  }
};

export const OutboundTextMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      inbound: false,
      messageType: MessageType.TEXT,
      message: "Hi John! Thanks for reaching out.",
      confidence: 0.95,
      needsScaling: false
    },
    contact
  },
  parameters: {
    docs: {
      description: {
        story: "Outbound text message with confidence metrics"
      }
    }
  }
};

// Image Messages
export const InboundImageMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      inbound: true,
      messageType: MessageType.IMAGE,
      message: "Here's the design mockup",
      mediaUrl: "https://picsum.photos/800/600",
      mediaType: "image/jpeg"
    },
    contact
  },
  parameters: {
    docs: {
      description: {
        story: "Inbound image message with caption"
      }
    }
  }
};

// Audio Messages
export const InboundAudioMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      inbound: true,
      messageType: MessageType.AUDIO,
      message: "Voice message about project requirements",
      mediaUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      mediaType: "audio/wav",
      fileName: "voice_message_001.wav",
      fileSize: 245760
    },
    contact
  },
  parameters: {
    docs: {
      description: {
        story: "Inbound audio message with file details"
      }
    }
  }
};

// Video Messages
export const InboundVideoMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      inbound: true,
      messageType: MessageType.VIDEO,
      message: "Product demo walkthrough",
      mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      mediaType: "video/mp4"
    },
    contact
  },
  parameters: {
    docs: {
      description: {
        story: "Inbound video message for product demonstration"
      }
    }
  }
};

// Document Messages
export const InboundDocumentMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      inbound: true,
      messageType: MessageType.DOCUMENT,
      message: "Contract requirements and specifications",
      mediaUrl: "/api/v1/media/signed-url?s3Key=documents/sample-contract.pdf",
      mediaType: "application/pdf",
      fileName: "project_requirements.pdf",
      fileSize: 1048576
    },
    contact
  },
  parameters: {
    docs: {
      description: {
        story: "Inbound document message with PDF file"
      }
    }
  }
};

// Error States
export const ImageMessageWithError: Story = {
  args: {
    message: {
      ...baseMessage,
      inbound: true,
      messageType: MessageType.IMAGE,
      message: "Image that failed to load",
      mediaUrl: "https://invalid-url-that-will-fail.com/image.jpg",
      mediaType: "image/jpeg"
    },
    contact
  },
  parameters: {
    docs: {
      description: {
        story: "Image message demonstrating error handling"
      }
    }
  }
};

// Conversation Flow
export const ConversationFlow: Story = {
  render: () => (
    <Stack spacing={2}>
      <ChatMessage
        message={{
          ...baseMessage,
          id: "msg-1",
          inbound: true,
          messageType: MessageType.TEXT,
          message: "Hi! I need help with my project"
        }}
        contact={contact}
      />
      <ChatMessage
        message={{
          ...baseMessage,
          id: "msg-2",
          inbound: false,
          messageType: MessageType.TEXT,
          message: "I'd be happy to help! What do you need?",
          confidence: 0.93,
          needsScaling: false
        }}
        contact={contact}
      />
      <ChatMessage
        message={{
          ...baseMessage,
          id: "msg-3",
          inbound: true,
          messageType: MessageType.IMAGE,
          message: "Here's what I'm working on",
          mediaUrl: "https://picsum.photos/600/400"
        }}
        contact={contact}
      />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete conversation flow showing multiple message types"
      }
    }
  }
};
