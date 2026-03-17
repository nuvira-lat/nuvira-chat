import { CircularProgress } from "@mui/material";

interface LoadingAnimationProps {
  type?: string;
  color?: string;
}

export default function LoadingAnimation({ color }: LoadingAnimationProps) {
  return (
    <CircularProgress
      size={16}
      sx={{ color: color || "inherit", ml: 0.5, display: "inline-block", verticalAlign: "middle" }}
    />
  );
}
