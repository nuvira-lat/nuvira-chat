import { Avatar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface NvAvatarProps {
  name: string;
  /** When set, shows image; otherwise initials from `name` */
  src?: string | null;
  /** Passed to the img; defaults to `name` */
  alt?: string;
  sx?: SxProps<Theme>;
}

export function NvAvatar({ name, src, alt, sx }: NvAvatarProps) {
  const initial = name?.[0]?.toUpperCase() ?? "?";
  const imgAlt = alt ?? name ?? "Contact";
  return (
    <Avatar src={src ?? undefined} alt={imgAlt} sx={{ bgcolor: "primary.main", ...sx }}>
      {src ? undefined : initial}
    </Avatar>
  );
}
