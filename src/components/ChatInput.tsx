import { NvTextField } from "@/stubs/NvTextField";
import {
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
  Typography
} from "@mui/material";
import { ChangeEvent, useState, KeyboardEvent, useRef, useCallback } from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import { THEME_COLOR_PRIMARY } from "@/stubs/themeColors";

interface MediaFile {
  file: File;
  type: "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT";
  url: string;
}

interface Props {
  message: string | null;
  agentActive: boolean;
  loading?: boolean;
  onMessageChange: (message: string) => void;
  onSubmit: (message: string | null, mediaFile?: MediaFile) => Promise<void>;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

export const ChatInput = ({
  message,
  agentActive,
  loading = false,
  onMessageChange,
  onSubmit,
  onKeyDown
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFileType, setCurrentFileType] = useState<
    "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT" | null
  >(null);

  const handleAttachClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAttachClose = () => {
    setAnchorEl(null);
  };

  const handleFileSelect = useCallback(
    (type: "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT") => {
      setCurrentFileType(type);
      handleAttachClose();

      if (fileInputRef.current) {
        // Set the accept attribute based on file type
        switch (type) {
          case "IMAGE":
            fileInputRef.current.accept = "image/*";
            break;
          case "AUDIO":
            fileInputRef.current.accept = "audio/*";
            break;
          case "VIDEO":
            fileInputRef.current.accept = "video/*";
            break;
          case "DOCUMENT":
            fileInputRef.current.accept = ".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx";
            break;
        }
        fileInputRef.current.click();
      }
    },
    [fileInputRef]
  );

  const handleImageSelect = useCallback(() => {
    handleFileSelect("IMAGE");
  }, [handleFileSelect]);

  const handleAudioSelect = useCallback(() => {
    handleFileSelect("AUDIO");
  }, [handleFileSelect]);

  const handleVideoSelect = useCallback(() => {
    handleFileSelect("VIDEO");
  }, [handleFileSelect]);

  const handleDocumentSelect = useCallback(() => {
    handleFileSelect("DOCUMENT");
  }, [handleFileSelect]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentFileType) {
      const url = URL.createObjectURL(file);
      setSelectedMedia({
        file,
        type: currentFileType,
        url
      });
    }
    // Reset the input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveMedia = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia.url);
      setSelectedMedia(null);
    }
  };

  const handleSubmit = async () => {
    await onSubmit(message, selectedMedia || undefined);
    handleRemoveMedia();
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "IMAGE":
        return <ImageIcon fontSize="small" />;
      case "AUDIO":
        return <AudioFileIcon fontSize="small" />;
      case "VIDEO":
        return <VideoFileIcon fontSize="small" />;
      case "DOCUMENT":
        return <DescriptionIcon fontSize="small" />;
      default:
        return <AttachFileIcon fontSize="small" />;
    }
  };

  const isDisabled = agentActive || loading;

  return (
    <Stack sx={{ py: 0, px: 2, pb: 0, mb: 2, mt: 2 }}>
      {selectedMedia && (
        <Box sx={{ mb: 1, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
          <Chip
            icon={getMediaIcon(selectedMedia.type)}
            label={
              <Box>
                <Typography variant="caption" display="block">
                  {selectedMedia.type}: {selectedMedia.file.name}
                </Typography>
                <Typography variant="caption" color="grey.600">
                  {(selectedMedia.file.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            }
            onDelete={handleRemoveMedia}
            deleteIcon={<CloseIcon />}
            variant="outlined"
            sx={{ maxWidth: "100%" }}
          />
        </Box>
      )}

      <Tooltip title={agentActive ? "Deactivate agent to be able to send messages." : ""}>
        <NvTextField
          placeholder="Type a message or attach media..."
          fullWidth
          value={message || ""}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          multiline
          minRows={1}
          maxRows={5}
          disabled={isDisabled}
          sx={isDisabled ? { backgroundColor: "grey.200" } : {}}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={handleAttachClick}
                    disabled={isDisabled}
                    sx={{ color: isDisabled ? "grey.500" : THEME_COLOR_PRIMARY }}
                    size="small"
                  >
                    <AttachFileIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSubmit}
                    disabled={isDisabled || (!message?.trim() && !selectedMedia)}
                    sx={{ color: isDisabled ? "grey.500" : THEME_COLOR_PRIMARY }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAttachClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <MenuItem onClick={handleImageSelect}>
          <ListItemIcon>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText primary="Image" />
        </MenuItem>
        <MenuItem onClick={handleAudioSelect}>
          <ListItemIcon>
            <AudioFileIcon />
          </ListItemIcon>
          <ListItemText primary="Audio" />
        </MenuItem>
        <MenuItem onClick={handleVideoSelect}>
          <ListItemIcon>
            <VideoFileIcon />
          </ListItemIcon>
          <ListItemText primary="Video" />
        </MenuItem>
        <MenuItem onClick={handleDocumentSelect}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Document" />
        </MenuItem>
      </Menu>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Stack>
  );
};
