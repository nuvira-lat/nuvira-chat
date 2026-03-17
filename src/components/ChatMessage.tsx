/**
 * ChatMessage Component
 *
 * Main component for rendering chat messages with different types     switch (message.type) {
      case MessageType.TEXT:
        return <TextMessage message={message.message || ""} intent={message.intent} />;

      case MessageType.IMAGE:
        return (
          <ImageMessageimage, audio, video, document).
 * Handles user avatars, message direction, timestamps, and additional metadata display.
 * Uses specialized sub-components for different message types to maintain clean separation of concerns.
 */

import { nvFormatDate } from "@/util/nvFormatDate";
import { Stack, Avatar, Paper, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Contact, ContactMessage, MessageType } from "@/types";
import { useMemo } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ImageIcon from "@mui/icons-material/Image";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import DescriptionIcon from "@mui/icons-material/Description";
import { useMediaUrl } from "@/stubs/useMediaUrl";
import { logger } from "@/stubs/logger";
import {
  TextMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
  DocumentMessage
} from "./MessageTypes";

/**
 * Props for the ChatMessage component
 */
interface Props {
  /** Contact information for the message sender/receiver */
  contact: Contact;
  /** The message data including content and metadata */
  message: ContactMessage;
  /** Additional content to render below the message */
  additional?: React.ReactNode;
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Optional flag to invert message layout direction */
  inverse?: boolean;
  /** MUI sx prop for the root Stack */
  sx?: SxProps<Theme>;
}

/**
 * ChatMessage Component
 *
 * Renders a complete chat message with avatar, content, and metadata.
 * Automatically handles media URL resolution for messages with attachments.
 *
 * @param props - The component props
 * @param props.contact - Contact information for the message
 * @param props.message - Message data and content
 * @param props.additional - Optional additional content to display
 * @param props.debug - Enable debug logging for troubleshooting
 * @returns JSX element containing the complete chat message
 */
export const ChatMessage = ({
  contact,
  message,
  additional,
  debug = false,
  inverse,
  sx
}: Props) => {
  const inbound = inverse ? message.inbound === false : message.inbound === true;
  // Use the media URL hook to handle signed URLs for media messages
  const {
    url: mediaUrl,
    loading: mediaLoading,
    error: mediaError,
    retry: retryMedia
  } = useMediaUrl(message.mediaUrl);

  // Debug logging for troubleshooting media URL processing
  if (debug)
    logger.info("💬 ChatMessage render:", {
      originalMediaUrl: message.mediaUrl,
      processedMediaUrl: mediaUrl,
      loading: mediaLoading,
      error: mediaError,
      messageType: message.messageType
    });

  /**
   * Determines the avatar icon based on message direction
   */
  const icon = useMemo(() => {
    return inbound === true ? <Typography>{contact.name?.[0] ?? "?"}</Typography> : <PersonIcon />;
  }, [contact.name, inbound]);

  /**
   * Determines the flex direction for message layout
   */
  const direction = useMemo(() => (inbound === false ? "row-reverse" : "row"), [inbound]);

  /**
   * Renders the appropriate message content based on message type
   */
  const renderMessageContent = () => {
    // Convert hook error state to boolean for component props
    const hasError = Boolean(mediaError);

    switch (message.messageType) {
      case MessageType.TEXT:
        return <TextMessage message={message.message || ""} />;

      case MessageType.IMAGE:
        return (
          <ImageMessage
            mediaUrl={mediaUrl}
            mediaLoading={mediaLoading}
            mediaError={hasError}
            retryMedia={retryMedia}
            message={message.message}
          />
        );

      case MessageType.AUDIO:
        return (
          <AudioMessage
            mediaUrl={mediaUrl}
            mediaLoading={mediaLoading}
            mediaError={hasError}
            retryMedia={retryMedia}
            fileName={message.fileName}
            mediaType={message.mediaType}
            message={message.message}
          />
        );

      case MessageType.VIDEO:
        return (
          <VideoMessage
            mediaUrl={mediaUrl}
            mediaLoading={mediaLoading}
            mediaError={hasError}
            retryMedia={retryMedia}
            mediaType={message.mediaType}
            message={message.message}
          />
        );

      case MessageType.DOCUMENT:
        return (
          <DocumentMessage
            mediaUrl={mediaUrl}
            mediaLoading={mediaLoading}
            mediaError={hasError}
            retryMedia={retryMedia}
            fileName={message.fileName}
            fileSize={message.fileSize}
            message={message.message}
          />
        );

      default:
        return (
          <Typography variant="body2" color="grey.500">
            Unsupported message type
          </Typography>
        );
    }
  };

  /**
   * Returns the appropriate icon for the message type
   */
  const getMessageTypeIcon = () => {
    switch (message.messageType) {
      case MessageType.IMAGE:
        return <ImageIcon fontSize="small" color="action" />;
      case MessageType.AUDIO:
        return <AudioFileIcon fontSize="small" color="action" />;
      case MessageType.VIDEO:
        return <VideoFileIcon fontSize="small" color="action" />;
      case MessageType.DOCUMENT:
        return <DescriptionIcon fontSize="small" color="action" />;
      default:
        return null;
    }
  };

  return (
    <Stack
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: direction,
        gap: 1,
        ...(sx || {})
      }}
    >
      <Avatar sx={{ bgcolor: "primary.main" }}>{icon}</Avatar>
      <Paper
        sx={{
          p: 2,
          bgcolor: "grey.100",
          borderRadius: 2,
          maxWidth: "75%",
          minWidth: message.messageType !== MessageType.TEXT ? "200px" : "auto"
        }}
        elevation={2}
      >
        {renderMessageContent()}

        <Stack direction="row" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
          {getMessageTypeIcon()}
          <Typography variant="caption" color="grey.500">
            {nvFormatDate(message.timestamp)}{" "}
            {inbound === true && `(${message.intent ?? "Unknonwn Intent"})`}
          </Typography>
        </Stack>

        {message.confidence && inbound === false && (
          <Stack
            direction="row"
            gap={1}
            justifyContent="space-between"
            alignContent="space-between"
          >
            <Typography variant="caption" color="grey.500">
              Confidence: {(message.confidence ?? 0) * 100}%
            </Typography>
            <Typography variant="caption" color="grey.500">
              Needed scaling: {message.needsScaling ? "Yes" : "No"}
            </Typography>
          </Stack>
        )}
        {additional}
      </Paper>
    </Stack>
  );
};
