import { Alert, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ComponentType } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatThreadAlert } from "@/types";

export interface ChatThreadAlertRenderProps extends ChatThreadAlert {
  /** MUI Alert `sx` forwarded from the row wrapper for the default renderer. */
  sx?: SxProps<Theme>;
  /**
   * When `dismissible` is true, call this to hide the alert in the strip (handled inside
   * `ChatThreadAlerts`). Custom `Alert` components should wire this to a close action.
   */
  onDismiss?: () => void;
}

export interface ChatThreadAlertsProps {
  alerts: ChatThreadAlert[];
  sx?: SxProps<Theme>;
  /** Optional notification after the user dismisses an alert (local state is already updated). */
  onAlertDismissed?: (id: string) => void;
  components?: {
    Alert?: ComponentType<ChatThreadAlertRenderProps>;
  };
}

const DefaultAlert = ({
  id: _id,
  severity,
  title,
  message,
  dismissible,
  onDismiss,
  sx
}: ChatThreadAlertRenderProps) => (
  <Alert
    severity={severity}
    sx={sx}
    onClose={dismissible && onDismiss ? () => onDismiss() : undefined}
  >
    {title ? (
      <>
        <Typography component="span" fontWeight={600} display="block">
          {title}
        </Typography>
        <Typography component="span" variant="body2">
          {message}
        </Typography>
      </>
    ) : (
      <Typography component="span" variant="body2">
        {message}
      </Typography>
    )}
  </Alert>
);

export const ChatThreadAlerts = ({
  alerts,
  sx,
  onAlertDismissed,
  components
}: ChatThreadAlertsProps) => {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const validIds = new Set(alerts.map((a) => a.id));
    setDismissedIds((prev) => {
      const next = new Set([...prev].filter((id) => validIds.has(id)));
      if (next.size === prev.size && [...next].every((id) => prev.has(id))) {
        return prev;
      }
      return next;
    });
  }, [alerts]);

  const prevDismissedRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    const prev = prevDismissedRef.current;
    const current = dismissedIds;
    if (prev === null) {
      prevDismissedRef.current = new Set(current);
      return;
    }
    if (onAlertDismissed) {
      for (const id of current) {
        if (!prev.has(id)) {
          onAlertDismissed(id);
        }
      }
    }
    prevDismissedRef.current = new Set(current);
  }, [dismissedIds, onAlertDismissed]);

  const handleDismiss = useCallback((id: string) => {
    setDismissedIds((prev) => {
      if (prev.has(id)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const visibleAlerts = useMemo(
    () => alerts.filter((a) => !dismissedIds.has(a.id)),
    [alerts, dismissedIds]
  );

  if (visibleAlerts.length === 0) {
    return null;
  }

  const AlertC = components?.Alert ?? DefaultAlert;

  return (
    <Stack gap={1} sx={{ px: 2, pt: 1, pb: 1, ...sx }}>
      {visibleAlerts.map((alert) => (
        <AlertC
          key={alert.id}
          {...alert}
          onDismiss={alert.dismissible ? () => handleDismiss(alert.id) : undefined}
          sx={{ mx: 0, mb: 0 }}
        />
      ))}
    </Stack>
  );
};
