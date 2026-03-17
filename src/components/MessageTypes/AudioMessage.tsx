/**
 * Audio Message Component
 *
 * Renders audio messages with playback controls, loading states, and file information.
 * Supports various audio formats and provides accessible controls for audio playback.
 */

import { Box, Typography, Alert, IconButton, CircularProgress } from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import RefreshIcon from "@mui/icons-material/Refresh";

/**
 * Props for the AudioMessage component
 */
export interface AudioMessageProps {
  /** The URL of the audio file (can be signed URL or reference URL) */
  mediaUrl?: string | null;
  /** Loading state for the media URL */
  mediaLoading: boolean;
  /** Error state for media loading */
  mediaError: boolean;
  /** Function to retry loading the media */
  retryMedia: () => void;
  /** The filename of the audio file */
  fileName?: string | null;
  /** The MIME type of the audio file */
  mediaType?: string | null;
  /** Optional text message accompanying the audio */
  message?: string | null;
}

/**
 * AudioMessage Component
 *
 * Displays audio messages with native HTML5 audio controls and proper loading states.
 * Includes file information and retry functionality when loading fails.
 *
 * @param props - The component props
 * @param props.mediaUrl - The URL of the audio file to play
 * @param props.mediaLoading - Whether the media is currently loading
 * @param props.mediaError - Whether there was an error loading the media
 * @param props.retryMedia - Function to retry loading the media
 * @param props.fileName - Name of the audio file
 * @param props.mediaType - MIME type of the audio file
 * @param props.message - Optional caption text for the audio
 * @returns JSX element containing the audio message with controls
 */
export const AudioMessage = ({
  mediaUrl,
  mediaLoading,
  mediaError,
  retryMedia,
  fileName,
  mediaType,
  message
}: AudioMessageProps) => {
  /**
   * Renders error state with retry button
   */
  const renderMediaError = () => (
    <Alert
      severity="error"
      sx={{ mb: 1 }}
      action={
        <IconButton color="inherit" size="small" onClick={retryMedia}>
          <RefreshIcon fontSize="inherit" />
        </IconButton>
      }
    >
      Failed to load audio. Click retry to try again.
    </Alert>
  );

  /**
   * Renders loading state with spinner
   */
  const renderMediaLoading = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
      <CircularProgress size={20} />
      <Typography variant="body2" color="text.secondary">
        Loading audio...
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AudioFileIcon color="primary" />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Audio Message
          </Typography>
          {fileName && (
            <Typography variant="caption" color="grey.600">
              {fileName}
            </Typography>
          )}
          {mediaError && renderMediaError()}
          {mediaLoading && renderMediaLoading()}
          {mediaUrl && !mediaLoading && !mediaError && (
            <audio controls style={{ width: "100%", marginTop: "8px" }}>
              <source src={mediaUrl} type={mediaType || "audio/mpeg"} />
              Your browser does not support the audio element.
            </audio>
          )}
        </Box>
      </Box>
      {message && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};
