import { Chip } from "@mui/material";

interface CustomStageDisplayProps {
  stageId: string;
  funnelId: string;
}

export function CustomStageDisplay({ stageId }: CustomStageDisplayProps) {
  return <Chip label={`Stage: ${stageId}`} size="small" variant="outlined" />;
}
