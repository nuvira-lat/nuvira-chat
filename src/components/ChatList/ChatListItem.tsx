"use client";

/**
 * Single conversation row: avatar (with unread badge), title, preview line, time,
 * {@link ContactBadgeGroup}, and optional error hint. Uses `ListItemButton` for
 * selection and keyboard focus.
 */
import type { ComponentType, ReactNode } from "react";
import {
  Badge,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { format, isToday, isYesterday } from "date-fns";
import { NvAvatar } from "@/stubs/NvAvatar";
import {
  ContactBadgeGroup,
  type ContactBadgeGroupComponents
} from "@/components/ContactBadgeGroup";
import type { ChatListItemData } from "@/types";

/** Props contract for list row avatars (default: {@link NvAvatar}). */
export interface ChatListAvatarComponentProps {
  name: string;
  src?: string | null;
  alt?: string;
  sx?: SxProps<Theme>;
}

function formatListTime(d: Date): string {
  if (isToday(d)) return format(d, "p");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}

export interface ChatListItemProps {
  item: ChatListItemData;
  selected?: boolean;
  onClick?: () => void;
  /** Extra chips or icons after the default badge group */
  slotBadges?: ReactNode;
  sx?: SxProps<Theme>;
  components?: {
    Avatar?: ComponentType<ChatListAvatarComponentProps>;
    badgeGroup?: ContactBadgeGroupComponents;
  };
}

/** One row in {@link ChatList}. */
export function ChatListItem({
  item,
  selected,
  onClick,
  slotBadges,
  sx,
  components
}: ChatListItemProps) {
  const AvatarComp = components?.Avatar ?? NvAvatar;
  const displayName = item.name ?? "Anon.";
  const hasError = item.lastMessageErrored === true || Boolean(item.lastMessageErrorReason);
  const timeLabel = item.updatedAt ? formatListTime(item.updatedAt) : null;
  const unread = item.unreadCount ?? 0;

  const badgeContact = {
    status: item.status,
    customFunnelId: item.customFunnelId,
    customStageId: item.customStageId
  };

  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      alignItems="flex-start"
      sx={{
        py: 1.25,
        px: 1.5,
        ...sx
      }}
    >
      <ListItemAvatar sx={{ minWidth: 56, mt: 0.25 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={unread > 0 ? (unread > 99 ? "99+" : unread) : undefined}
          color="primary"
          invisible={unread <= 0}
        >
          <AvatarComp name={displayName} src={item.avatarUrl} sx={{ width: 40, height: 40 }} />
        </Badge>
      </ListItemAvatar>

      <ListItemText
        sx={{ m: 0, minWidth: 0 }}
        primary={
          <Stack
            direction="row"
            alignItems="baseline"
            justifyContent="space-between"
            gap={1}
            minWidth={0}
          >
            <Typography
              component="span"
              variant="subtitle2"
              fontWeight={600}
              noWrap
              sx={{ minWidth: 0 }}
            >
              {displayName}
            </Typography>
            {timeLabel && (
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
                sx={{ flexShrink: 0 }}
              >
                {timeLabel}
              </Typography>
            )}
          </Stack>
        }
        secondary={
          <Stack component="span" spacing={0.5} sx={{ mt: 0.25, width: "100%" }}>
            {item.subtitle && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                noWrap
                display="block"
                sx={{ width: "100%" }}
              >
                {item.subtitle}
              </Typography>
            )}
            <Stack component="span" direction="row" alignItems="center" gap={0.5} flexWrap="wrap">
              {hasError && (
                <ErrorOutlineIcon
                  fontSize="small"
                  color="warning"
                  sx={{ flexShrink: 0 }}
                  titleAccess={item.lastMessageErrorReason ?? "Message error"}
                />
              )}
              <ContactBadgeGroup
                contact={badgeContact}
                slotEnd={slotBadges}
                components={components?.badgeGroup}
              />
            </Stack>
          </Stack>
        }
        secondaryTypographyProps={{ component: "div" }}
      />
    </ListItemButton>
  );
}
