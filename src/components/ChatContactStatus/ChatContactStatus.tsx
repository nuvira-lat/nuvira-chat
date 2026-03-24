"use client";

import { Stack, Typography, Tooltip, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useState } from "react";
import { ContactStatusChip } from "@/stubs/contact/ContactStatusChip";
import { ContactStatusSelector } from "@/stubs/contact/ContactStatusSelector";
import { logger } from "@/stubs/logger";
import { Contact, ContactStatus } from "@/types";
import { ContactStatusHistoryButton } from "./ContactStatusHistoryButton";
import type { ContactStatusHistoryListProps } from "./ContactStatusHistoryList";
import { fetchContactStatusHistoryDefault } from "@/stubs/contactStatusHistory";

export interface ChatContactStatusProps {
  contact: Contact;
  /** When true, omit the section title (e.g. when used inside an accordion) */
  hideTitle?: boolean;
  /** Passed to {@link ContactStatusHistoryButton}; defaults to Nuvira API fetch. */
  loadContactStatusHistory?: ContactStatusHistoryListProps["loadHistory"];
}

export const ChatContactStatus = ({
  contact,
  hideTitle = false,
  loadContactStatusHistory = fetchContactStatusHistoryDefault
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
    async (newStatus: ContactStatus) => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/contact/status/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contactId: contact.id,
            newStatus,
            reason: "Updated status from chat",
            isAutomatic: false
          })
        });

        if (!response.ok) {
          throw new Error("Failed to update contact status");
        }

        const data = await response.json();

        if (data.success) {
          // TODO: Use New Toast Hook
          // showToast("Contact status updated successfully", "success");
          setLoading(false);
          return data.contact;
        } else {
          setLoading(false);
          throw new Error(data.error || "Failed to update contact status");
        }
      } catch {
        setLoading(false);
        logger.error("Failed to update contact status", "error");
      }
    },
    [contact.id]
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
              onChange={(v) => handleStatusChange(v as ContactStatus)}
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
