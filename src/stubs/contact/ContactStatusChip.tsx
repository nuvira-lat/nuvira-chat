import { Chip } from "@mui/material";

interface ContactStatusChipProps {
  status: string;
  onClick?: () => void;
}

export function ContactStatusChip({ status, onClick }: ContactStatusChipProps) {
  return (
    <Chip label={status || "Unknown"} size="small" onClick={onClick} variant="outlined" />
  );
}

export function getColorFromstatus(_status: string): { color: string } {
  return { color: "#00A6A6" };
}
