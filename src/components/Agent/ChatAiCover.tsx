import LoadingAnimation from "@/stubs/LoadingAnimation";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Stack, Avatar, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import type { ComponentType } from "react";

export interface ChatAiCoverProps {
  sx?: SxProps<Theme>;
  components?: {
    Loading?: ComponentType<{ type?: string; color?: string }>;
  };
}

export const ChatAiCover = ({ sx, components }: ChatAiCoverProps) => {
  const theme = useTheme();
  const LoadingComp = components?.Loading ?? LoadingAnimation;

  return (
    <Stack
      sx={{
        width: "calc(100% - 32px)",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        position: "absolute",
        borderRadius: "5px",
        zIndex: 20,
        bottom: 0,
        ...(sx || {})
      }}
    >
      <Stack sx={{ height: "min-content", my: "auto" }} gap={2}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, mx: "auto", p: 1 }}>
          <SmartToyIcon fontSize="large" />
        </Avatar>
        <Typography
          textAlign="center"
          my="auto"
          variant="subtitle1"
          fontWeight={600}
          color="grey.300"
        >
          Propulso AI talking with client
          <LoadingComp />
        </Typography>
      </Stack>
    </Stack>
  );
};
