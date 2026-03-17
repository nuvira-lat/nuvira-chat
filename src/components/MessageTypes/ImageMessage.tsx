/**
 * Image Message Component
 *
 * Renders image messages with loading states, error handling, and retry functionality.
 * Supports signed URLs for secure S3 access and displays images with optimal sizing.
 */

import { Box, Typography, Alert, IconButton, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

/**
 * Props for the ImageMessage component
 */
export interface ImageMessageProps {
  /** The URL of the image (can be signed URL or reference URL) */
  mediaUrl?: string | null;
  /** Loading state for the media URL */
  mediaLoading: boolean;
  /** Error state for media loading */
  mediaError: boolean;
  /** Function to retry loading the media */
  retryMedia: () => void;
  /** Optional text message accompanying the image */
  message?: string | null;
}

/**
 * ImageMessage Component
 *
 * Displays image messages with proper loading states and error handling.
 * Includes support for captions and retry functionality when loading fails.
 *
 * @param props - The component props
 * @param props.mediaUrl - The URL of the image to display
 * @param props.mediaLoading - Whether the media is currently loading
 * @param props.mediaError - Whether there was an error loading the media
 * @param props.retryMedia - Function to retry loading the media
 * @param props.message - Optional caption text for the image
 * @returns JSX element containing the image message with controls
 */
export const ImageMessage = ({
  mediaUrl,
  mediaLoading,
  mediaError,
  retryMedia,
  message
}: ImageMessageProps) => {
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
      Failed to load image. Click retry to try again.
    </Alert>
  );

  /**
   * Renders loading state with spinner
   */
  const renderMediaLoading = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
      <CircularProgress size={20} />
      <Typography variant="body2" color="text.secondary">
        Loading image...
      </Typography>
    </Box>
  );

  return (
    <Box>
      {mediaError && renderMediaError()}
      {mediaLoading && renderMediaLoading()}
      {mediaUrl && !mediaLoading && !mediaError && (
        <Box
          component="img"
          src={mediaUrl}
          alt="Shared image"
          sx={{
            maxWidth: "100%",
            maxHeight: "300px",
            borderRadius: 1,
            mb: message ? 1 : 0
          }}
        />
      )}
      {message && <Typography variant="body2">{message}</Typography>}
    </Box>
  );
};
