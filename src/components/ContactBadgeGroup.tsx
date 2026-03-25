/**
 * Renders contact status, optional funnel, and optional stage chips in one row.
 * Use with {@link ChatListItem} or {@link ChatWindowHeader} for consistent CRM badges.
 */
import type { ComponentType, ReactNode } from "react";
import { Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { ContactStatusChip } from "@/stubs/contact/ContactStatusChip";
import { CustomFunnelDisplay } from "@/stubs/contact/CustomFunnelDisplay";
import { CustomStageDisplay } from "@/stubs/contact/CustomStageDisplay";
import type { Contact } from "@/types";

export interface ContactBadgeGroupComponents {
  StatusChip?: ComponentType<{ status: string; onClick?: () => void }>;
  FunnelDisplay?: ComponentType<{ funnelId: string }>;
  StageDisplay?: ComponentType<{ stageId: string; funnelId: string }>;
}

export interface ContactBadgeGroupProps {
  contact: Pick<Contact, "status" | "customFunnelId" | "customStageId">;
  /** Appended after status / funnel / stage chips */
  slotEnd?: ReactNode;
  sx?: SxProps<Theme>;
  components?: ContactBadgeGroupComponents;
}

export function ContactBadgeGroup({ contact, slotEnd, sx, components }: ContactBadgeGroupProps) {
  const StatusChipC = components?.StatusChip ?? ContactStatusChip;
  const FunnelDisplayC = components?.FunnelDisplay ?? CustomFunnelDisplay;
  const StageDisplayC = components?.StageDisplay ?? CustomStageDisplay;
  return (
    <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" sx={sx}>
      <StatusChipC status={contact.status ?? ""} />
      {contact.customFunnelId && <FunnelDisplayC funnelId={contact.customFunnelId} />}
      {contact.customStageId && contact.customFunnelId && (
        <StageDisplayC stageId={contact.customStageId} funnelId={contact.customFunnelId} />
      )}
      {slotEnd}
    </Stack>
  );
}
