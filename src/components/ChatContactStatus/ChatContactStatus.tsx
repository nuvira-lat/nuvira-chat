import { Stack, Typography, Tooltip, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useState } from "react";
import { ContactStatusChip } from "@/stubs/contact/ContactStatusChip";
import { ContactStatusSelector } from "@/stubs/contact/ContactStatusSelector";
import { logger } from "@/stubs/logger";
import { Contact } from "@/types";
import { ContactStatusHistoryButton } from "./ContactStatusHistoryButton";
import type { ContactStatusHistoryListProps } from "./ContactStatusHistoryList";
import {
  nuviraDefaultLoadContactStatusHistory,
  nuviraDefaultUpdateContactStatus
} from "@/integration/nuviraDefaults";
import type { ContactStatusUpdateInput } from "@/integration/types";

export interface ChatContactStatusProps {
  contact: Contact;
  hideTitle?: boolean;
  loadContactStatusHistory?: ContactStatusHistoryListProps["loadHistory"];
  /** Default: Nuvira `PUT /api/v1/contact/status/update`. */
  onStatusUpdate?: (input: ContactStatusUpdateInput) => Promise<Contact | void>;
  onIntegrationError?: (error: unknown, context: string) => void;
}

export const ChatContactStatus = ({
  contact,
  hideTitle = false,
  loadContactStatusHistory = nuviraDefaultLoadContactStatusHistory,
  onStatusUpdate = nuviraDefaultUpdateContactStatus,
  onIntegrationError
}: ChatContactStatusProps) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const edit = useCallback(() => {
    setIsEditingStatus(true);
  }, []);
  const cancelEdit = useCallback(() => {
    setIsEditingStatus(false);
  }, []);

  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      try {
        setLoading(true);
        await onStatusUpdate({
          contactId: contact.id,
          newStatus,
          reason: "Updated status from chat",
          isAutomatic: false
        });
        setIsEditingStatus(false);
      } catch (error) {
        onIntegrationError?.(error, "ChatContactStatus.onStatusUpdate");
        logger.error("Failed to update contact status", error);
      } finally {
        setLoading(false);
      }
    },
    [contact.id, onStatusUpdate, onIntegrationError]
  );

  return (
    <Stack spacing={2}>
      {!hideTitle && (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Contact Status</Typography>
        </Stack>
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        {isEditingStatus && (
          <>
            <ContactStatusSelector
              value={contact.status ?? ""}
              onChange={(v) => void handleStatusChange(v)}
              disabled={loading}
              fullWidth
              label="Status"
            />
            <Tooltip title="Cancel contact status edit">
              <IconButton size="small" onClick={cancelEdit}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
        {!isEditingStatus && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Edit contact status">
              <ContactStatusChip status={contact.status ?? ""} onClick={edit} />
            </Tooltip>
            <ContactStatusHistoryButton contact={contact} loadHistory={loadContactStatusHistory} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
