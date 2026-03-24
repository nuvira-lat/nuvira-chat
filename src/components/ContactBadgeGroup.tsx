/**
 * Renders contact status, optional funnel, and optional stage chips in one row.
 * Use with {@link ChatListItem} or {@link ChatWindowHeader} for consistent CRM badges.
 */
import type { ReactNode } from "react";
import { Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { ContactStatusChip } from "@/stubs/contact/ContactStatusChip";
import { CustomFunnelDisplay } from "@/stubs/contact/CustomFunnelDisplay";
import { CustomStageDisplay } from "@/stubs/contact/CustomStageDisplay";
import type { Contact } from "@/types";

export interface ContactBadgeGroupProps {
  contact: Pick<Contact, "status" | "customFunnelId" | "customStageId">;
  /** Appended after status / funnel / stage chips */
  slotEnd?: ReactNode;
  sx?: SxProps<Theme>;
}

export function ContactBadgeGroup({ contact, slotEnd, sx }: ContactBadgeGroupProps) {
  return (
    <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" sx={sx}>
      <ContactStatusChip status={contact.status ?? ""} />
      {contact.customFunnelId && <CustomFunnelDisplay funnelId={contact.customFunnelId} />}
      {contact.customStageId && contact.customFunnelId && (
        <CustomStageDisplay stageId={contact.customStageId} funnelId={contact.customFunnelId} />
      )}
      {slotEnd}
    </Stack>
  );
}
