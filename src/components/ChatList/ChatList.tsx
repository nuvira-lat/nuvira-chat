"use client";

/**
 * Scrollable list of conversations. Renders {@link ChatListItem} rows; parent supplies
 * data, selection, and `onSelect`. Empty state is customizable via `emptyState`.
 */
import type { ReactNode } from "react";
import { List, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ChatListItemData } from "@/types";
import { ChatListItem, type ChatListItemProps } from "./ChatListItem";

export interface ChatListProps {
  items: ChatListItemData[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  emptyState?: ReactNode;
  sx?: SxProps<Theme>;
  /** Forwarded to every {@link ChatListItem}. */
  itemComponents?: ChatListItemProps["components"];
}

/** MUI `List` of conversation rows with optional selection. */
export function ChatList({
  items,
  selectedId,
  onSelect,
  emptyState,
  sx,
  itemComponents
}: ChatListProps) {
  if (items.length === 0) {
    return (
      <Stack
        sx={{ overflow: "auto", flex: 1, minHeight: 0, ...sx }}
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        {emptyState ?? (
          <Typography variant="body2" color="text.secondary">
            No conversations
          </Typography>
        )}
      </Stack>
    );
  }

  return (
    <List disablePadding sx={{ overflow: "auto", flex: 1, minHeight: 0, ...sx }}>
      {items.map((item) => (
        <ChatListItem
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onClick={onSelect ? () => onSelect(item.id) : undefined}
          components={itemComponents}
        />
      ))}
    </List>
  );
}
