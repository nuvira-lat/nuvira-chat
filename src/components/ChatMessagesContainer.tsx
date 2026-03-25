import { ChatMessage } from "./ChatMessage";
import { Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { Contact, ContactMessage } from "@/types";
import type { ComponentProps, ComponentType } from "react";
import { useRef, useEffect } from "react";
import { ChatAiCover } from "./Agent/ChatAiCover";
import type { ChatMessageUseMediaUrl } from "./ChatMessage";

export interface ChatMessagesContainerProps {
  agentActive: boolean;
  messages: ContactMessage[];
  contact: Contact;
  /** MUI sx prop for the root Stack */
  sx?: SxProps<Theme>;
  components?: {
    AiCover?: ComponentType<ComponentProps<typeof ChatAiCover>>;
    useMediaUrl?: ChatMessageUseMediaUrl;
  };
}

export const ChatMessagesContainer = ({
  agentActive,
  messages,
  contact,
  sx,
  components
}: ChatMessagesContainerProps) => {
  const AiCoverC = components?.AiCover ?? ChatAiCover;
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const borderColor = theme.palette.divider ?? theme.palette.grey[300] ?? "#e0e0e0";

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth" // Enables smooth scrolling
      });
    }
  }, [messages]);
  return (
    <Stack
      sx={{
        position: "relative",
        overflowY: "auto",
        borderRadius: "5px",
        backgroundColor: "#fbfbfb",
        border: `solid 1px ${borderColor}`,
        ...(sx || {})
      }}
      flex={1}
      flexGrow={1}
    >
      {agentActive === true && <AiCoverC />}
      <Stack
        gap={{ xs: 2, md: 3 }}
        sx={{
          minHeight: 0,
          overflowY: "auto",
          p: 2,
          mb: 0
        }}
        ref={messagesContainerRef}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id ?? message.messageId ?? `msg-${index}`}
            message={message}
            contact={contact}
            useMediaUrl={components?.useMediaUrl}
          />
        ))}
      </Stack>
    </Stack>
  );
};
