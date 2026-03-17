import { Chip } from "@mui/material";

interface Stage {
  id: string;
  name: string;
}

interface CustomStageChipProps {
  stage: Stage | null | undefined;
  size?: "small" | "medium";
}

export function CustomStageChip({ stage, size = "medium" }: CustomStageChipProps) {
  if (!stage) return null;
  return <Chip label={stage.name} size={size} variant="outlined" />;
}
