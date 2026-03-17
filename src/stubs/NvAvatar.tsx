import { Avatar } from "@mui/material";

interface NvAvatarProps {
  name: string;
}

export function NvAvatar({ name }: NvAvatarProps) {
  const initial = name?.[0]?.toUpperCase() ?? "?";
  return (
    <Avatar sx={{ bgcolor: "primary.main" }}>
      {initial}
    </Avatar>
  );
}
