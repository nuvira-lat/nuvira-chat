import { Chip } from "@mui/material";

interface CustomFunnelDisplayProps {
  funnelId: string;
}

export function CustomFunnelDisplay({ funnelId }: CustomFunnelDisplayProps) {
  return <Chip label={`Funnel: ${funnelId}`} size="small" variant="outlined" />;
}
