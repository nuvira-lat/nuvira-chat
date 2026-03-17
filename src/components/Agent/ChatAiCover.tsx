import LoadingAnimation from "@/stubs/LoadingAnimation";
import { THEME_COLOR_PRIMARY } from "@/stubs/themeColors";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Stack, Avatar, Typography } from "@mui/material";

export const ChatAiCover = () => {
  return (
    <Stack
      sx={{
        width: "calc(100% - 32px)",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        position: "absolute",
        borderRadius: "5px",
        zIndex: 20,
        bottom: 0
      }}
    >
      <Stack sx={{ height: "min-content", my: "auto" }} gap={2}>
        <Avatar sx={{ bgcolor: THEME_COLOR_PRIMARY, mx: "auto", p: 1 }}>
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
          <LoadingAnimation />
        </Typography>
      </Stack>
    </Stack>
  );
};
