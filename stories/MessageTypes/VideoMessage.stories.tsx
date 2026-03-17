/**
 * Storybook stories for VideoMessage component
 *
 * Showcases video message scenarios including different video formats,
 * loading states, error handling, and responsive sizing.
 */

import { VideoMessage } from "@/components/MessageTypes/VideoMessage";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

// Mock function for retry actions in Storybook
const mockRetryFunction = () => {
  // Mock retry action for Storybook demonstration
};

const meta: Meta<typeof VideoMessage> = {
  title: "Components/Chat/MessageTypes/VideoMessage",
  component: VideoMessage,
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
          "Video message component with playback controls, responsive sizing, and error handling."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof VideoMessage>;

export const VideoWithCaption: Story = {
  args: {
    mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    mediaLoading: false,
    mediaError: false,
    mediaType: "video/mp4",
    message: "Product demo walkthrough",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Video message with descriptive caption"
      }
    }
  }
};

export const VideoWithoutCaption: Story = {
  args: {
    mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    mediaLoading: false,
    mediaError: false,
    mediaType: "video/mp4",
    message: null,
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Video message without caption text"
      }
    }
  }
};

export const LoadingVideo: Story = {
  args: {
    mediaUrl: null,
    mediaLoading: true,
    mediaError: false,
    mediaType: "video/mp4",
    message: "Loading video...",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Video message in loading state"
      }
    }
  }
};

export const VideoError: Story = {
  args: {
    mediaUrl: null,
    mediaLoading: false,
    mediaError: true,
    mediaType: "video/mp4",
    message: "This video failed to load",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Video message with error state and retry functionality"
      }
    }
  }
};

export const DifferentVideoFormats: Story = {
  render: () => (
    <Stack spacing={3}>
      <VideoMessage
        mediaUrl="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        mediaLoading={false}
        mediaError={false}
        mediaType="video/mp4"
        message="MP4 video format"
        retryMedia={mockRetryFunction}
      />
      <VideoMessage
        mediaUrl="https://sample-videos.com/zip/10/webm/SampleVideo_1280x720_1mb.webm"
        mediaLoading={false}
        mediaError={false}
        mediaType="video/webm"
        message="WebM video format"
        retryMedia={mockRetryFunction}
      />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different video format types (MP4, WebM)"
      }
    }
  }
};

export const VideoWithLongCaption: Story = {
  args: {
    mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    mediaLoading: false,
    mediaError: false,
    mediaType: "video/mp4",
    message:
      "This is a very detailed explanation of the video content that goes on for quite a while to demonstrate how the component handles longer caption text and ensures proper text wrapping and layout.",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Video message with long caption to test text wrapping"
      }
    }
  }
};

export const UnknownVideoFormat: Story = {
  args: {
    mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    mediaLoading: false,
    mediaError: false,
    mediaType: "video/unknown",
    message: "Video with unknown format",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Video message with unknown media type (edge case)"
      }
    }
  }
};
