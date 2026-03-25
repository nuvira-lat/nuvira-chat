/**
 * AI Summary Component
 *
 * Displays AI-generated summary for a contact with generate functionality.
 */

"use client";

import LoadingAnimation from "@/stubs/LoadingAnimation";
import ReplayIcon from "@mui/icons-material/Replay";
import { Typography, Button, Tooltip, Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Contact } from "@/types";
import isNil from "lodash/isNil";
import { useCallback, useEffect, useState } from "react";
import { nuviraDefaultGenerateSummary } from "@/integration/nuviraDefaults";

export interface AISummaryProps {
  contact: Contact;
  disabled?: boolean;
  hideTitle?: boolean;
  sx?: SxProps<Theme>;
  /** Generate summary text; default calls Nuvira `POST /api/v1/agents/contact-summary`. */
  onGenerateSummary?: (contactId: string) => Promise<string>;
  onIntegrationError?: (error: unknown, context: string) => void;
  /** Controlled summary text; omit for internal state synced from `contact.aiNotesSummary`. */
  summary?: string | null;
  onSummaryChange?: (value: string | null) => void;
  /** Replace loading indicator on the generate button. */
  components?: {
    Loading?: typeof LoadingAnimation;
  };
}

export const AISummary = ({
  contact,
  disabled = false,
  hideTitle = false,
  sx,
  onGenerateSummary = nuviraDefaultGenerateSummary,
  onIntegrationError,
  summary: summaryControlled,
  onSummaryChange,
  components
}: AISummaryProps) => {
  const LoadingComp = components?.Loading ?? LoadingAnimation;
  const [internalSummary, setInternalSummary] = useState<string | null | undefined>(
    contact.aiNotesSummary
  );
  const [loading, setLoading] = useState(false);

  const isControlled = summaryControlled !== undefined;
  const summary = isControlled ? summaryControlled : internalSummary;

  useEffect(() => {
    if (!isControlled) {
      setInternalSummary(contact.aiNotesSummary);
    }
  }, [contact.aiNotesSummary, contact.id, isControlled]);

  const setSummary = useCallback(
    (value: string | null) => {
      if (isControlled) {
        onSummaryChange?.(value);
      } else {
        setInternalSummary(value);
      }
    },
    [isControlled, onSummaryChange]
  );

  const requestSummary = useCallback(() => {
    setLoading(true);
    void (async () => {
      try {
        const description = await onGenerateSummary(contact.id);
        setSummary(description);
      } catch (error) {
        onIntegrationError?.(error, "AISummary.onGenerateSummary");
        setSummary(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [contact.id, onGenerateSummary, onIntegrationError, setSummary]);

  return (
    <Stack spacing={2} sx={sx}>
      {!hideTitle && (
        <Typography variant="h6" fontWeight={500}>
          AI Summary
        </Typography>
      )}
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
          endIcon={loading ? <LoadingComp type="dots" /> : undefined}
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
