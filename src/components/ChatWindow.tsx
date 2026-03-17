"use client";

import { Stack } from "@mui/material";
import { useState, KeyboardEvent, useCallback } from "react";
import { Contact, ContactMessage, ContactNotes, CustomFunnel, Workspace } from "@/types";
import isNil from "lodash/isNil";
import cloneDeep from "lodash/cloneDeep";
import { ChatMessagesContainer } from "./ChatMessagesContainer";
import { ChatWindowHeader } from "./ChatWindowHeader";
import { ChatInput } from "./ChatInput";
import { useTimelineStream } from "@/stubs/useWorkspaceStream";
import { useIsMobile } from "@/stubs/isMobile";
import { uploadMediaFileWithUrls } from "@/stubs/mediaUpload";
import { ConsolidatedChatActions } from "./ConsolidatedChatActions";
import { CONTACT_UPDATED_BROADCAST_MESSAGE_TYPE } from "@/stubs/broadcast";

interface Props {
  messages: ContactMessage[];
  contact: Contact;
  funnels: CustomFunnel[];
  notes: ContactNotes[];
  workspace: Workspace;
}

export const ChatWindow = ({
  messages: initialMessages,
  contact: initialContact,
  workspace,
  funnels,
  notes
}: Props) => {
  const [agentActive, steAgentActive] = useState(initialContact.talkingToAgent);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [contact, setContact] = useState<Contact>(initialContact);
  const isMobile = useIsMobile();

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
            // eslint-disable-next-line no-console
            console.error("Failed to update talkingToAgent state:", await response.json());
            return;
          }

          const data = await response.json();
          if (data.success) {
            steAgentActive(nv);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
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

  useTimelineStream({
    workspaceId: contact.workspaceId,
    onEvent: (data: unknown) => {
      try {
        const eventData = data as { type?: string; message?: ContactMessage; contact?: Contact };

        // Handle contact updates
        if (
          eventData.type === CONTACT_UPDATED_BROADCAST_MESSAGE_TYPE &&
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
        // eslint-disable-next-line no-console
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
          const uploadResult = await uploadMediaFileWithUrls(mediaFile.file, contact.workspaceId ?? "");
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
          // eslint-disable-next-line no-console
          console.error("Failed to send message:", await response.json());
          return;
        }

        setMessage("");
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error while sending message:", error);
      } finally {
        setLoading(false);
      }
    },
    [contact.id, contact.workspaceId]
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

  return (
    <Stack
      gap={0}
      sx={{
        width: "100%",
        height: "100vh",
        maxHeight: "100vh",
        minHeight: "100vh",
        overflow: "hidden"
      }}
      direction={{ xs: "column", md: "row" }}
      flex={1}
    >
      {!isMobile && (
        <ConsolidatedChatActions
          notes={notes}
          workspace={workspace}
          contact={contact}
          funnels={funnels}
        />
      )}
      <Stack width={{ xs: "100%", md: "80%" }} height={{ xs: "100vh", md: "auto" }}>
        <ChatWindowHeader
          activateAgent={handleTalkingToAgent}
          agentActive={agentActive ?? false}
          contact={contact}
          loading={loading ?? false}
        />
        <ChatMessagesContainer agentActive={agentActive ?? false} messages={messages} contact={contact} />
        <ChatInput
          message={message}
          agentActive={agentActive ?? false}
          loading={loading ?? false}
          onMessageChange={handleChange}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      </Stack>
    </Stack>
  );
};
