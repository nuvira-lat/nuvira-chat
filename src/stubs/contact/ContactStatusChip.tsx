import { Chip } from "@mui/material";
import type { Theme } from "@mui/material/styles";

interface ContactStatusChipProps {
  status: string;
  onClick?: () => void;
}

export function ContactStatusChip({ status, onClick }: ContactStatusChipProps) {
  return <Chip label={status || "Unknown"} size="small" onClick={onClick} variant="outlined" />;
}

export function getColorFromstatus(_status: string, theme?: Theme): { color: string } {
  return { color: theme?.palette?.primary?.main ?? "#00A6A6" };
}
