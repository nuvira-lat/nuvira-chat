"use client";

import type { ReactNode } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import NoteIcon from "@mui/icons-material/Note";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {
  type ChatSidebarSectionId,
  type ChatSidebarSectionConfig,
  type ChatSidebarCustomSection,
  type ChatSidebarProps,
  CHAT_SIDEBAR_SECTIONS,
  CHAT_SIDEBAR_SECTION_TITLES
} from "@/types";

import { FunnelStageSelector } from "./FunnelStageSelector/FunnelStageSelector";
import { AISummary } from "./AISummary";
import { ChatContactStatus } from "./ChatContactStatus/ChatContactStatus";
import { ContactInfoEditor } from "./ContactInfoEditor";
import { ChatContactNotes } from "./ContactNotes/ChatContactNotes";

const CHAT_SIDEBAR_SECTION_ICONS: Record<ChatSidebarSectionId, ReactNode> = {
  status: <BadgeIcon sx={{ fontSize: 20 }} />,
  infoEditor: <PersonIcon sx={{ fontSize: 20 }} />,
  funnelStage: <AccountTreeIcon sx={{ fontSize: 20 }} />,
  aiSummary: <AutoAwesomeIcon sx={{ fontSize: 20 }} />,
  notes: <NoteIcon sx={{ fontSize: 20 }} />
};

const CHAT_SIDEBAR_DEFAULT_CUSTOM_ICON = <WidgetsIcon sx={{ fontSize: 20 }} />;

export const ChatSidebar = ({
  contact,
  sections,
  sectionConfig,
  customSections,
  defaultExpandedSections,
  workspace,
  funnels,
  notes,
  sx
}: ChatSidebarProps) => {
  const activeSections = sections ?? CHAT_SIDEBAR_SECTIONS;
  const startCustoms = (customSections ?? []).filter((c) => (c.position ?? "end") === "start");
  const endCustoms = (customSections ?? []).filter((c) => (c.position ?? "end") === "end");

  const getSectionTitle = (sectionId: ChatSidebarSectionId, config?: ChatSidebarSectionConfig) =>
    config?.title ?? CHAT_SIDEBAR_SECTION_TITLES[sectionId];

  const getSectionIcon = (
    sectionId: ChatSidebarSectionId,
    config?: ChatSidebarSectionConfig
  ): ReactNode => config?.icon ?? CHAT_SIDEBAR_SECTION_ICONS[sectionId];

  const getDefaultExpanded = (key: string, config?: { defaultExpanded?: boolean }): boolean => {
    if (config?.defaultExpanded !== undefined) return config.defaultExpanded;
    if (key.startsWith("built-in-")) {
      const id = key.replace("built-in-", "") as ChatSidebarSectionId;
      return defaultExpandedSections?.includes(id) ?? false;
    }
    return false;
  };

  const AccordionSection = ({
    title,
    icon,
    defaultExpanded,
    children
  }: {
    title: string;
    icon: ReactNode;
    defaultExpanded: boolean;
    children: ReactNode;
  }) => (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      sx={{ width: "100%", "&:before": { display: "none" } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 48 }}>
        <Stack direction="row" alignItems="center" gap={1}>
          {icon}
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ width: "100%", pt: 0, px: 1.5, pb: 1.5 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );

  const renderSectionContent = (sectionId: ChatSidebarSectionId): ReactNode => {
    const config = sectionConfig?.[sectionId];
    if (config?.slot !== undefined) {
      return config.slot;
    }

    switch (sectionId) {
      case "status":
        return <ChatContactStatus contact={contact} hideTitle />;
      case "infoEditor":
        return workspace ? (
          <ContactInfoEditor contact={contact} workspace={workspace} hideTitle />
        ) : null;
      case "funnelStage":
        if (!funnels) return null;
        return (
          <FunnelStageSelector contact={contact} funnels={funnels} disabled={config?.disabled} />
        );
      case "aiSummary":
        return (
          <AISummary contact={contact} disabled={sectionConfig?.aiSummary?.disabled} hideTitle />
        );
      case "notes":
        return notes && workspace ? (
          <ChatContactNotes contact={contact} notes={notes} workspace={workspace} hideTitle />
        ) : null;
      default:
        return null;
    }
  };

  const renderCustomSectionContent = (custom: ChatSidebarCustomSection) => custom.content;

  const allItems: Array<{
    key: string;
    title: string;
    icon: ReactNode;
    defaultExpanded: boolean;
    content: ReactNode;
  }> = [
    ...startCustoms.map((c) => ({
      key: `custom-${c.id}`,
      title: c.title ?? "Custom",
      icon: c.icon ?? CHAT_SIDEBAR_DEFAULT_CUSTOM_ICON,
      defaultExpanded: c.defaultExpanded ?? false,
      content: renderCustomSectionContent(c)
    })),
    ...activeSections.flatMap((sectionId) => {
      const content = renderSectionContent(sectionId);
      if (!content) return [];
      const config = sectionConfig?.[sectionId];
      return [
        {
          key: `built-in-${sectionId}`,
          title: getSectionTitle(sectionId, config),
          icon: getSectionIcon(sectionId, config),
          defaultExpanded: getDefaultExpanded(`built-in-${sectionId}`, config),
          content
        }
      ];
    }),
    ...endCustoms.map((c) => ({
      key: `custom-${c.id}`,
      title: c.title ?? "Custom",
      icon: c.icon ?? CHAT_SIDEBAR_DEFAULT_CUSTOM_ICON,
      defaultExpanded: c.defaultExpanded ?? false,
      content: renderCustomSectionContent(c)
    }))
  ];

  return (
    <Stack
      sx={{
        width: "100%",
        minWidth: 0,
        borderRightStyle: "solid",
        borderRightColor: "grey.400",
        borderRightWidth: "1px",
        p: 1,
        gap: 0,
        flex: 1,
        flexGrow: 1,
        overflow: "auto",
        ...(sx || {})
      }}
    >
      {allItems.map(({ key, title, icon, defaultExpanded, content }) => (
        <AccordionSection key={key} title={title} icon={icon} defaultExpanded={defaultExpanded}>
          {content}
        </AccordionSection>
      ))}
    </Stack>
  );
};

/** @deprecated Use ChatSidebar instead. Alias for backward compatibility. */
export const ConsolidatedChatActions = ChatSidebar;
