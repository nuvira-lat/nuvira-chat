"use client";

import type { ReactNode } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export interface CollapsibleEdgePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Width when `open` is true */
  expandedWidth: number | string;
  /** Width when `open` is false; default 0 */
  collapsedWidth?: number;
  /** `start` = panel on the left of the row; `end` = panel on the right */
  side: "start" | "end";
  /** For `aria-controls` on the toggle */
  panelId: string;
  toggleAriaLabelExpand: string;
  toggleAriaLabelCollapse: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export function CollapsibleEdgePanel({
  open,
  onOpenChange,
  expandedWidth,
  collapsedWidth = 0,
  side,
  panelId,
  toggleAriaLabelExpand,
  toggleAriaLabelCollapse,
  children,
  sx
}: CollapsibleEdgePanelProps) {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const widthResolved = open ? expandedWidth : collapsedWidth;
  const toggleLabel = open ? toggleAriaLabelCollapse : toggleAriaLabelExpand;
  const toggle = (
    <Tooltip title={toggleLabel}>
      <IconButton
        size="small"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={toggleLabel}
        onClick={() => onOpenChange(!open)}
        sx={{ flexShrink: 0, alignSelf: "flex-start", mt: 0.5 }}
      >
        {side === "start" ? (
          open ? (
            <ChevronLeft fontSize="small" />
          ) : (
            <ChevronRight fontSize="small" />
          )
        ) : open ? (
          <ChevronRight fontSize="small" />
        ) : (
          <ChevronLeft fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );

  const panel = (
    <Box
      id={panelId}
      aria-hidden={!open}
      sx={{
        width: widthResolved,
        minWidth: 0,
        overflow: "hidden",
        flexShrink: 0,
        transition: prefersReducedMotion ? "none" : "width 0.2s ease",
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch"
      }}
    >
      {open ? children : null}
    </Box>
  );

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "stretch",
        alignSelf: "stretch",
        minHeight: 0,
        minWidth: 0,
        flexShrink: 0,
        ...sx
      }}
    >
      {side === "start" ? (
        <>
          {toggle}
          {panel}
        </>
      ) : (
        <>
          {panel}
          {toggle}
        </>
      )}
    </Stack>
  );
}
