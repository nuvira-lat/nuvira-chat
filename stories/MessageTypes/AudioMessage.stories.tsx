/**
 * Storybook stories for AudioMessage component
 *
 * Showcases audio message scenarios including different audio formats,
 * file sizes, loading states, and error handling.
 */

import { AudioMessage } from "@/components/MessageTypes/AudioMessage";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

// Mock function for retry actions in Storybook
const mockRetryFunction = () => {
  // Mock retry action for Storybook demonstration
};

const meta: Meta<typeof AudioMessage> = {
  title: "Chat/Primitives/Messages/MessageTypes/AudioMessage",
  component: AudioMessage,
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
          "Audio message component with playback controls, file information display, and error handling."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof AudioMessage>;

export const AudioWithCaption: Story = {
  args: {
    mediaUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    mediaLoading: false,
    mediaError: false,
    fileName: "voice_message_001.wav",
    mediaType: "audio/wav",
    message: "Voice message about project requirements",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Audio message with descriptive caption and file details"
      }
    }
  }
};

export const AudioWithoutCaption: Story = {
  args: {
    mediaUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    mediaLoading: false,
    mediaError: false,
    fileName: "recording.mp3",
    mediaType: "audio/mp3",
    message: null,
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Audio message without caption text"
      }
    }
  }
};

export const LoadingAudio: Story = {
  args: {
    mediaUrl: null,
    mediaLoading: true,
    mediaError: false,
    fileName: "loading_audio.mp3",
    mediaType: "audio/mp3",
    message: "Loading audio file...",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Audio message in loading state"
      }
    }
  }
};

export const AudioError: Story = {
  args: {
    mediaUrl: null,
    mediaLoading: false,
    mediaError: true,
    fileName: "corrupted_audio.wav",
    mediaType: "audio/wav",
    message: "This audio file failed to load",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Audio message with error state and retry option"
      }
    }
  }
};

export const DifferentAudioFormats: Story = {
  render: () => (
    <Stack spacing={3}>
      <AudioMessage
        mediaUrl="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
        mediaLoading={false}
        mediaError={false}
        fileName="sample.wav"
        mediaType="audio/wav"
        message="WAV audio format"
        retryMedia={mockRetryFunction}
      />
      <AudioMessage
        mediaUrl="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
        mediaLoading={false}
        mediaError={false}
        fileName="sample.mp3"
        mediaType="audio/mp3"
        message="MP3 audio format"
        retryMedia={mockRetryFunction}
      />
      <AudioMessage
        mediaUrl="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
        mediaLoading={false}
        mediaError={false}
        fileName="sample.ogg"
        mediaType="audio/ogg"
        message="OGG audio format"
        retryMedia={mockRetryFunction}
      />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different audio format types (WAV, MP3, OGG)"
      }
    }
  }
};

export const LongFilename: Story = {
  args: {
    mediaUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    mediaLoading: false,
    mediaError: false,
    fileName: "very_long_audio_filename_that_might_cause_layout_issues_in_the_component.mp3",
    mediaType: "audio/mp3",
    message: "Audio with very long filename",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Audio message with very long filename to test text overflow handling"
      }
    }
  }
};

export const NoFilename: Story = {
  args: {
    mediaUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    mediaLoading: false,
    mediaError: false,
    fileName: null,
    mediaType: "audio/wav",
    message: "Audio without filename",
    retryMedia: mockRetryFunction
  },
  parameters: {
    docs: {
      description: {
        story: "Audio message without filename (edge case)"
      }
    }
  }
};
