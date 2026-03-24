/**
 * Storybook stories for ImageMessage component
 *
 * Showcases different image message scenarios including loading states,
 * error states, and various image types and sizes.
 */

import { ImageMessage } from "@/components/MessageTypes/ImageMessage";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

// Mock function for retry actions in Storybook
const mockRetryFunction = () => {
  // Mock retry action for Storybook demonstration
};

const meta: Meta<typeof ImageMessage> = {
  title: "Chat/Primitives/Messages/MessageTypes/ImageMessage",
  component: ImageMessage,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "500px" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Image message component that displays images with loading states, error handling, and optional caption text."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ImageMessage>;

export const ImageWithCaption: Story = {
  args: {
    mediaUrl: "https://picsum.photos/800/600",
    mediaLoading: false,
    mediaError: false,
    message: "Here's the design mockup I was talking about",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Image message with descriptive caption"
      }
    }
  }
};

export const ImageWithoutCaption: Story = {
  args: {
    mediaUrl: "https://picsum.photos/600/400",
    mediaLoading: false,
    mediaError: false,
    message: null,
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Image message without any caption text"
      }
    }
  }
};

export const LoadingImage: Story = {
  args: {
    mediaUrl: null,
    mediaLoading: true,
    mediaError: false,
    message: "Loading image...",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Image message in loading state"
      }
    }
  }
};

export const ImageError: Story = {
  args: {
    mediaUrl: null,
    mediaLoading: false,
    mediaError: true,
    message: "This image failed to load",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Image message with error state and retry functionality"
      }
    }
  }
};

export const PortraitImage: Story = {
  args: {
    mediaUrl: "https://picsum.photos/400/800",
    mediaLoading: false,
    mediaError: false,
    message: "Portrait orientation image",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Portrait-oriented image message"
      }
    }
  }
};

export const LandscapeImage: Story = {
  args: {
    mediaUrl: "https://picsum.photos/1200/400",
    mediaLoading: false,
    mediaError: false,
    message: "Landscape orientation image",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Landscape-oriented image message"
      }
    }
  }
};

export const SquareImage: Story = {
  args: {
    mediaUrl: "https://picsum.photos/600/600",
    mediaLoading: false,
    mediaError: false,
    message: "Square image format",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Square aspect ratio image"
      }
    }
  }
};
