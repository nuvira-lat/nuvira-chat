/**
 * Text Message Component
 *
 * Renders text-based messages in the chat interface.
 * This component handles the display of simple text messages without any media content.
 * Includes support for message intent tags for categorizing the message.
 */

import { Typography, Box, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";

/**
 * Props for the TextMessage component
 */
export interface TextMessageProps {
  /** The text content of the message */
  message: string;
  /** Classification of message intent (optional) */
  intent?: string | null;
  /** Optional override for intent colors. Keys are intent names, values are hex colors. */
  intentColors?: Record<string, string>;
}

/**
 * Maps message intents to human-readable labels and colors
 */
const intentConfig: Record<string, { label: string; color: string }> = {
  general_inquiry: { label: "General Inquiry", color: "#1976d2" },
  appointment_request: { label: "Appointment", color: "#2e7d32" },
  pricing_inquiry: { label: "Pricing", color: "#ed6c02" },
  complaint: { label: "Complaint", color: "#d32f2f" },
  feature_request: { label: "Feature Request", color: "#7b1fa2" },
  urgent: { label: "Urgent", color: "#c62828" },
  feedback: { label: "Feedback", color: "#0288d1" },
  support: { label: "Support", color: "#0097a7" }
};

/**
 * TextMessage Component
 *
 * A component for rendering text messages in the chat, with optional intent tags.
 *
 * @param props - The component props
 * @param props.message - The text content to display
 * @param props.intent - Optional intent classification
 * @returns JSX element containing the formatted text message with intent tag
 */
export const TextMessage = ({ message, intent, intentColors }: TextMessageProps) => {
  const theme = useTheme();
  const fallbackColor = theme.palette.text.secondary ?? "#757575";

  const intentData = useMemo(() => {
    if (!intent) return null;

    const overriddenColor = intentColors?.[intent];
    const config = intentConfig[intent] || {
      label: intent.replace(/_/g, " "),
      color: fallbackColor
    };

    return {
      label: config.label,
      color: overriddenColor ?? config.color
    };
  }, [intent, intentColors, fallbackColor]);

  return (
    <Box>
      {intentData && (
        <Chip
          label={intentData.label}
          size="small"
          sx={{
            height: "20px",
            fontSize: "0.65rem",
            fontWeight: 500,
            color: intentData.color,
            bgcolor: `${intentData.color}15`,
            border: `1px solid ${intentData.color}50`,
            mb: 1,
            "& .MuiChip-label": {
              px: 0.8,
              py: 0.2
            }
          }}
        />
      )}
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
};
