/**
 * Video Message Component
 *
 * Renders video messages with playback controls, loading states, and optimal sizing.
 * Supports various video formats and provides accessible controls for video playback.
 */

import { Box, Typography, Alert, IconButton, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

/**
 * Props for the VideoMessage component
 */
export interface VideoMessageProps {
  /** The URL of the video file (can be signed URL or reference URL) */
  mediaUrl?: string | null;
  /** Loading state for the media URL */
  mediaLoading: boolean;
  /** Error state for media loading */
  mediaError: boolean;
  /** Function to retry loading the media */
  retryMedia: () => void;
  /** The MIME type of the video file */
  mediaType?: string | null;
  /** Optional text message accompanying the video */
  message?: string | null;
}

/**
 * VideoMessage Component
 *
 * Displays video messages with native HTML5 video controls and proper loading states.
 * Includes responsive sizing and retry functionality when loading fails.
 *
 * @param props - The component props
 * @param props.mediaUrl - The URL of the video file to play
 * @param props.mediaLoading - Whether the media is currently loading
 * @param props.mediaError - Whether there was an error loading the media
 * @param props.retryMedia - Function to retry loading the media
 * @param props.mediaType - MIME type of the video file
 * @param props.message - Optional caption text for the video
 * @returns JSX element containing the video message with controls
 */
export const VideoMessage = ({
  mediaUrl,
  mediaLoading,
  mediaError,
  retryMedia,
  mediaType,
  message
}: VideoMessageProps) => {
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
      Failed to load video. Click retry to try again.
    </Alert>
  );

  /**
   * Renders loading state with spinner
   */
  const renderMediaLoading = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
      <CircularProgress size={20} />
      <Typography variant="body2" color="text.secondary">
        Loading video...
      </Typography>
    </Box>
  );

  return (
    <Box>
      {mediaError && renderMediaError()}
      {mediaLoading && renderMediaLoading()}
      {mediaUrl && !mediaLoading && !mediaError && (
        <video
          controls
          style={{
            width: "100%",
            maxHeight: "300px",
            borderRadius: "4px",
            marginBottom: message ? "8px" : "0"
          }}
        >
          <source src={mediaUrl} type={mediaType || "video/mp4"} />
          Your browser does not support the video element.
        </video>
      )}
      {message && <Typography variant="body2">{message}</Typography>}
    </Box>
  );
};
