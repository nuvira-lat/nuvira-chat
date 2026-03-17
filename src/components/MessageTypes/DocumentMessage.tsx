/**
 * Document Message Component
 *
 * Renders document messages with download functionality, file information, and loading states.
 * Supports various document formats and provides accessible download controls.
 */

import { Box, Typography, Alert, IconButton, CircularProgress, Button, Stack } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * Props for the DocumentMessage component
 */
export interface DocumentMessageProps {
  /** The URL of the document file (can be signed URL or reference URL) */
  mediaUrl?: string | null;
  /** Loading state for the media URL */
  mediaLoading: boolean;
  /** Error state for media loading */
  mediaError: boolean;
  /** Function to retry loading the media */
  retryMedia: () => void;
  /** The filename of the document */
  fileName?: string | null;
  /** The size of the document file in bytes */
  fileSize?: number | null;
  /** Optional text message accompanying the document */
  message?: string | null;
}

/**
 * Formats file size in human-readable format
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * DocumentMessage Component
 *
 * Displays document messages with download functionality and proper loading states.
 * Includes file information and retry functionality when loading fails.
 *
 * @param props - The component props
 * @param props.mediaUrl - The URL of the document file to download
 * @param props.mediaLoading - Whether the media is currently loading
 * @param props.mediaError - Whether there was an error loading the media
 * @param props.retryMedia - Function to retry loading the media
 * @param props.fileName - Name of the document file
 * @param props.fileSize - Size of the document file in bytes
 * @param props.message - Optional caption text for the document
 * @returns JSX element containing the document message with controls
 */
export const DocumentMessage = ({
  mediaUrl,
  mediaLoading,
  mediaError,
  retryMedia,
  fileName,
  fileSize,
  message
}: DocumentMessageProps) => {
  /**
   * Renders error state with retry button
   */
  const renderMediaError = () => (
    <Alert
      severity="error"
      action={
        <IconButton color="inherit" size="small" onClick={retryMedia}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      }
    >
      Failed to load document. Click to retry.
    </Alert>
  );

  /**
   * Renders loading state
   */
  const renderMediaLoading = () => (
    <Box display="flex" alignItems="center" gap={1}>
      <CircularProgress size={20} />
      <Typography variant="body2" color="grey.600">
        Loading document...
      </Typography>
    </Box>
  );

  /**
   * Handles document download
   */
  const handleDownload = () => {
    if (mediaUrl) {
      const link = document.createElement("a");
      link.href = mediaUrl;
      link.download = fileName || "document";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /**
   * Renders the document with download functionality
   */
  const renderDocument = () => (
    <Stack spacing={1}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 2,
          border: 1,
          borderColor: "grey.300",
          borderRadius: 1,
          bgcolor: "grey.50"
        }}
      >
        <DescriptionIcon color="action" />
        <Box flex={1}>
          <Typography variant="body2" fontWeight={500}>
            {fileName || "Document"}
          </Typography>
          {fileSize && (
            <Typography variant="caption" color="grey.600">
              {formatFileSize(fileSize)}
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!mediaUrl}
        >
          Download
        </Button>
      </Box>
    </Stack>
  );

  return (
    <Box>
      {/* Optional caption text */}
      {message && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {message}
        </Typography>
      )}

      {/* Document content or error/loading states */}
      {mediaError && renderMediaError()}
      {mediaLoading && renderMediaLoading()}
      {!mediaError && !mediaLoading && renderDocument()}
    </Box>
  );
};
