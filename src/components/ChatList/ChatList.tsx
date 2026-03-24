"use client";

import type { ReactNode } from "react";
import { List, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ChatListItemData } from "@/types";
import { ChatListItem } from "./ChatListItem";

export interface ChatListProps {
  items: ChatListItemData[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  emptyState?: ReactNode;
  sx?: SxProps<Theme>;
}

export function ChatList({ items, selectedId, onSelect, emptyState, sx }: ChatListProps) {
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
        />
      ))}
    </List>
  );
}
