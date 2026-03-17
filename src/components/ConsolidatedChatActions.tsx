"use client";

import { FunnelStageSelector } from "./FunnelStageSelector/FunnelStageSelector";
import { Stack, Typography } from "@mui/material";
import { Contact, ContactNotes, CustomFunnel, Workspace } from "@/types";

import { AISummary } from "./AISummary";
import { ChatContactStatus } from "./ChatContactStatus/ChatContactStatus";
import { ContactInfoEditor } from "./ContactInfoEditor";
import { ChatContactNotes } from "./ContactNotes/ChatContactNotes";

interface Props {
  notes: ContactNotes[];
  funnels: CustomFunnel[];
  workspace: Workspace;
  contact: Contact;
}

export const ConsolidatedChatActions = ({ notes, workspace, funnels, contact }: Props) => {
  return (
    <Stack
      sx={{
        borderRightStyle: "solid",
        borderRightColor: "grey.400",
        borderRightWidth: "1px",
        p: 1
      }}
      flex={1}
      gap={2}
      flexGrow={1}
      alignContent="space-between"
      justifyContent="space-between"
    >
      <ChatContactStatus contact={contact} />
      <ContactInfoEditor contact={contact} workspace={workspace} />

      {/* Funnel & Stage Selection */}
      <Stack>
        <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
          Funnel & Stage
        </Typography>
        <FunnelStageSelector contact={contact} funnels={funnels} />
      </Stack>

      {/* AI Summary Section */}
      <AISummary contact={contact} />

      {/* Contact Notes Section */}
      <ChatContactNotes contact={contact} notes={notes} workspace={workspace} />
    </Stack>
  );
};
