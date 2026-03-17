/**
 * AI Summary Component
 *
 * Displays AI-generated summary for a contact with generate functionality.
 * This component allows users to generate and view AI summaries for contact interactions.
 */

"use client";

import LoadingAnimation from "@/stubs/LoadingAnimation";
import ReplayIcon from "@mui/icons-material/Replay";
import { Typography, Button, Tooltip, Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Contact } from "@/types";
import isNil from "lodash/isNil";
import { useCallback, useState } from "react";

/**
 * Props for the AISummary component
 */
export interface AISummaryProps {
  /** Contact information for generating the summary */
  contact: Contact;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** MUI sx prop for the root Stack */
  sx?: SxProps<Theme>;
}

/**
 * AISummary Component
 *
 * Provides AI-powered summary generation for contact interactions.
 * Displays existing summaries and allows generating new ones.
 *
 * @param props - The component props
 * @param props.contact - Contact data containing summary information
 * @param props.disabled - Whether summary generation is disabled
 * @returns JSX element containing the AI summary interface
 */
export const AISummary = ({ contact, disabled = false, sx }: AISummaryProps) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(contact.aiNotesSummary);

  /**
   * Requests a new AI summary for the contact
   */
  const requestSummary = useCallback(() => {
    setLoading(true);
    void (async () => {
      const url = "/api/v1/agents/contact-summary";
      const method = "POST";
      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contactId: contact.id })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
        const responseData = await response.json();
        const description = responseData.description as string;
        setSummary(description);
        setLoading(false);
        return;
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert(`Error: ${(error as unknown as any).message}`);
        setLoading(false);
      }
    })().then(() => setLoading(false));
  }, [contact.id]);

  return (
    <Stack spacing={2} sx={sx}>
      <Typography variant="h6" fontWeight={500}>
        AI Summary
      </Typography>
      {isNil(summary) && (
        <Typography color="secondary.dark" fontWeight={400} variant="subtitle2">
          No summary generated yet.
        </Typography>
      )}
      <Stack
        maxHeight={100}
        overflow="auto"
        sx={{ backgroundColor: "background.paper", p: 1, borderRadius: 1 }}
      >
        {summary && (
          <Typography fontWeight={400} variant="subtitle2">
            {summary}
          </Typography>
        )}
      </Stack>
      <Tooltip
        title={disabled ? "You need to add notes before you can generate an AI summary" : ""}
        arrow
      >
        <Button
          variant="contained"
          startIcon={<ReplayIcon />}
          disabled={disabled || loading}
          endIcon={loading && <LoadingAnimation type="dots" />}
          onClick={requestSummary}
          fullWidth
        >
          <Typography variant="body2" sx={{ width: "max-content", minWidth: "max-content" }}>
            Generate AI Summary
          </Typography>
        </Button>
      </Tooltip>
    </Stack>
  );
};
