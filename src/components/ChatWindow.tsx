"use client";

/**
 * Full chat shell: CRM sidebar (`ChatSidebar`), thread header, messages, input.
 * Supports `sidebarPosition`, collapsible CRM, `chatActionsMaxWidth`, `showAgentToggle`, etc.
 * Inject `useTimelineStream`, `useIsMobile`, and `uploadMediaFileWithUrls` for non-Storybook apps.
 */
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useState, KeyboardEvent, useCallback, useId } from "react";
import {
  Contact,
  ContactMessage,
  ContactNotes,
  CustomFunnel,
  type ChatSidebarCustomSection,
  type ChatSidebarSectionId,
  Workspace
} from "@/types";
import isNil from "lodash/isNil";
import cloneDeep from "lodash/cloneDeep";
import { ChatMessagesContainer } from "./ChatMessagesContainer";
import { ChatWindowHeader } from "./ChatWindowHeader";
import { ChatInput } from "./ChatInput";
import {
  useTimelineStream as defaultUseTimelineStream,
  type UseTimelineStreamOptions
} from "@/stubs/useWorkspaceStream";
import { useIsMobile as defaultUseIsMobile } from "@/stubs/isMobile";
import { uploadMediaFileWithUrls as defaultUploadMediaFileWithUrls } from "@/stubs/mediaUpload";
import { ConsolidatedChatActions } from "./ConsolidatedChatActions";
import { CONTACT_UPDATED_BROADCAST_MESSAGE_TYPE } from "@/stubs/broadcast";

/** Matches CRM sidebar column min width so the header toggle aligns with the actions panel */
const CRM_PANEL_MIN_WIDTH = { md: 320 };

export interface ChatWindowProps {
  messages: ContactMessage[];
  contact: Contact;
  funnels: CustomFunnel[];
  notes: ContactNotes[];
  workspace: Workspace;
  /** Optional: which sidebar sections to show. Omit for full sidebar. */
  sidebarSections?: ChatSidebarSectionId[];
  /** Optional: custom sections to add to the sidebar. */
  sidebarCustomSections?: ChatSidebarCustomSection[];
  /** Optional: section IDs expanded on initial render. */
  sidebarDefaultExpandedSections?: ChatSidebarSectionId[];
  /** Profile image for the header; e.g. from the selected conversation list row */
  avatarUrl?: string | null;
  /** Place CRM sidebar on the left (default) or right of the thread */
  sidebarPosition?: "left" | "right";
  /** When true (desktop only), CRM sidebar can be collapsed; use with header toggle */
  sidebarCollapsible?: boolean;
  /** Initial open state when uncontrolled */
  defaultSidebarOpen?: boolean;
  /** Controlled open state */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** Max width of the CRM sidebar column (px or CSS value). Omit for no cap beyond flex. */
  chatActionsMaxWidth?: number | string;
  /** When false, hides the sales agent toggle row in the header */
  showAgentToggle?: boolean;
  /** Root layout overrides (e.g. height in split-pane demos) */
  sx?: SxProps<Theme>;
  /**
   * Workspace timeline hook; default is a no-op (Storybook). Replace with your SSE/realtime hook.
   */
  useTimelineStream?: (options: UseTimelineStreamOptions) => {
    messages: unknown[];
    isLoading: boolean;
  };
  /** Default `false` (desktop layout). Replace with e.g. MUI `useMediaQuery(theme.breakpoints.down("md"))`. */
  useIsMobile?: () => boolean;
  /** Media upload for attachments; default returns empty URLs (Storybook). */
  uploadMediaFileWithUrls?: typeof defaultUploadMediaFileWithUrls;
  /** Stream event type for contact updates; must match your backend broadcast. */
  contactUpdatedBroadcastType?: string;
}

export const ChatWindow = ({
  messages: initialMessages,
  contact: initialContact,
  workspace,
  funnels,
  notes,
  sidebarSections,
  sidebarCustomSections,
  sidebarDefaultExpandedSections,
  avatarUrl,
  sidebarPosition = "left",
  sidebarCollapsible = false,
  defaultSidebarOpen = true,
  sidebarOpen: sidebarOpenControlled,
  onSidebarOpenChange,
  chatActionsMaxWidth = "200px",
  showAgentToggle = false,
  sx,
  useTimelineStream: useTimelineStreamProp = defaultUseTimelineStream,
  useIsMobile: useIsMobileProp = defaultUseIsMobile,
  uploadMediaFileWithUrls: uploadMediaFileWithUrlsProp = defaultUploadMediaFileWithUrls,
  contactUpdatedBroadcastType = CONTACT_UPDATED_BROADCAST_MESSAGE_TYPE
}: ChatWindowProps) => {
  const crmPanelId = useId();
  const [sidebarOpenInternal, setSidebarOpenInternal] = useState(defaultSidebarOpen);
  const isSidebarControlled = sidebarOpenControlled !== undefined;
  const sidebarOpen = isSidebarControlled ? sidebarOpenControlled : sidebarOpenInternal;
  const setSidebarOpen = useCallback(
    (open: boolean) => {
      if (!isSidebarControlled) {
        setSidebarOpenInternal(open);
      }
      onSidebarOpenChange?.(open);
    },
    [isSidebarControlled, onSidebarOpenChange]
  );

  const [agentActive, steAgentActive] = useState(initialContact.talkingToAgent);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [contact, setContact] = useState<Contact>(initialContact);
  const isMobile = useIsMobileProp();

  const showCrmSidebar = !isMobile && (!sidebarCollapsible || sidebarOpen);
  /** Legacy split uses fixed 80% width; collapsible mode uses flex so the thread grows when CRM is hidden */
  const mainUsesFlex = !isMobile && (sidebarCollapsible || !showCrmSidebar);

  const handleTalkingToAgent = useCallback(
    (nv: boolean) => {
      const asyncUpdate = async (nv: boolean) => {
        try {
          const response = await fetch("/api/v1/contact/update-taling-to-agent", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              talkingToAgent: nv,
              workspaceId: contact.workspaceId,
              id: contact.id
            })
          });

          if (!response.ok) {
            console.error("Failed to update talkingToAgent state:", await response.json());
            return;
          }

          const data = await response.json();
          if (data.success) {
            steAgentActive(nv);
          }
        } catch (error) {
          console.error("Error while updating talkingToAgent state:", error);
        }
      };
      setLoading(true);
      void asyncUpdate(nv).then(() => {
        setLoading(false);
      });
    },
    [contact.id, contact.workspaceId]
  );

  const handleChange = useCallback((message: string) => {
    setMessage(message);
  }, []);

  useTimelineStreamProp({
    workspaceId: contact.workspaceId,
    onEvent: (data: unknown) => {
      try {
        const eventData = data as { type?: string; message?: ContactMessage; contact?: Contact };

        // Handle contact updates
        if (
          eventData.type === contactUpdatedBroadcastType &&
          eventData.contact?.id === contact.id
        ) {
          setContact(eventData.contact);
          return;
        }

        // Handle new messages
        type StreamData = { message: ContactMessage; contact: Contact };
        const newMessage = (data as StreamData).message;
        const _contact = (data as StreamData).contact;
        if (!isNil(newMessage) && _contact.id === contact.id) {
          setMessages((state) => {
            const index = state.findIndex((m) => m.id === newMessage.id);
            if (index !== -1) {
              return state;
            }
            return cloneDeep([...state, newMessage]);
          });
        }
      } catch (error) {
        console.error("Error parsing stream data:", error);
      }
    }
  });

  const handleSubmit = useCallback(
    async (
      message: string | null,
      mediaFile?: { file: File; type: "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT"; url: string }
    ) => {
      if ((!message || message.trim() === "") && !mediaFile) return;

      setLoading(true);
      try {
        let mediaUrl: string | undefined;
        let messageType = "TEXT";
        let mediaType: string | undefined;
        let fileName: string | undefined;

        if (mediaFile) {
          // Upload the media file and get both URLs
          const uploadResult = await uploadMediaFileWithUrlsProp(
            mediaFile.file,
            contact.workspaceId ?? ""
          );
          mediaUrl = uploadResult.whatsappUrl; // Use WhatsApp-accessible URL for sending
          messageType = mediaFile.type;
          mediaType = mediaFile.file.type;
          fileName = mediaFile.file.name;
        }

        const response = await fetch("/api/v1/meta/whatsapp/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: message || null,
            contactId: contact.id,
            messageType,
            mediaUrl,
            mediaType,
            fileName
          })
        });

        if (!response.ok) {
          console.error("Failed to send message:", await response.json());
          return;
        }

        setMessage("");
      } catch (error) {
        console.error("Error while sending message:", error);
      } finally {
        setLoading(false);
      }
    },
    [contact.id, contact.workspaceId, uploadMediaFileWithUrlsProp]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit(message, undefined);
      }
    },
    [handleSubmit, message]
  );

  const sidebar = showCrmSidebar && (
    <Box
      id={crmPanelId}
      sx={{
        flex: { md: 1 },
        minWidth: CRM_PANEL_MIN_WIDTH,
        maxWidth: chatActionsMaxWidth,
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
        overflow: "hidden"
      }}
    >
      <ConsolidatedChatActions
        contact={contact}
        notes={notes}
        workspace={workspace}
        funnels={funnels}
        side={sidebarPosition === "right" ? "right" : "left"}
        {...(sidebarSections && { sections: sidebarSections })}
        {...(sidebarCustomSections && { customSections: sidebarCustomSections })}
        {...(sidebarDefaultExpandedSections && {
          defaultExpandedSections: sidebarDefaultExpandedSections
        })}
      />
    </Box>
  );

  const crmToggleButton =
    sidebarCollapsible && !isMobile ? (
      <Tooltip title={sidebarOpen ? "Hide contact details" : "Show contact details"}>
        <IconButton
          size="medium"
          aria-expanded={sidebarOpen}
          aria-controls={crmPanelId}
          aria-label={sidebarOpen ? "Hide contact details" : "Show contact details"}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{ flexShrink: 0 }}
        >
          <MenuIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
    ) : null;

  const crmToggleInPanelStrip = crmToggleButton ? (
    <Box
      sx={{
        ...CRM_PANEL_MIN_WIDTH,
        display: "flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: sidebarPosition === "right" ? "flex-end" : "flex-start",
        pl: sidebarPosition === "left" ? 1 : 0,
        pr: sidebarPosition === "right" ? 1 : 0
      }}
    >
      {crmToggleButton}
    </Box>
  ) : null;

  const headerStartSlot = sidebarPosition === "left" ? crmToggleInPanelStrip : undefined;
  const headerEndSlot = sidebarPosition === "right" ? crmToggleInPanelStrip : undefined;

  const mainColumn = (
    <Stack
      width={{ xs: "100%", md: mainUsesFlex ? "auto" : "80%" }}
      flex={{ md: mainUsesFlex ? 1 : undefined }}
      minWidth={{ xs: 0, md: 0 }}
      height={{ xs: "100vh", md: "auto" }}
    >
      <ChatWindowHeader
        activateAgent={handleTalkingToAgent}
        agentActive={agentActive ?? false}
        contact={contact}
        avatarUrl={avatarUrl}
        headerStartSlot={headerStartSlot}
        headerEndSlot={headerEndSlot}
        showAgentToggle={showAgentToggle}
        loading={loading ?? false}
      />
      <ChatMessagesContainer
        agentActive={agentActive ?? false}
        messages={messages}
        contact={contact}
      />
      <ChatInput
        message={message}
        agentActive={agentActive ?? false}
        loading={loading ?? false}
        onMessageChange={handleChange}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      />
    </Stack>
  );

  return (
    <Stack
      gap={0}
      sx={{
        width: "100%",
        height: "100vh",
        maxHeight: "100vh",
        minHeight: "100vh",
        overflow: "hidden",
        ...(sx || {})
      }}
      direction={{ xs: "column", md: "row" }}
      flex={1}
    >
      {sidebarPosition === "right" ? (
        <>
          {mainColumn}
          {sidebar}
        </>
      ) : (
        <>
          {sidebar}
          {mainColumn}
        </>
      )}
    </Stack>
  );
};
