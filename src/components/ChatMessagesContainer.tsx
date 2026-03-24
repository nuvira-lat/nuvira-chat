import { ChatMessage } from "./ChatMessage";
import { Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { Contact, ContactMessage } from "@/types";
import { useRef, useEffect } from "react";
import { ChatAiCover } from "./Agent/ChatAiCover";

export interface ChatMessagesContainerProps {
  agentActive: boolean;
  messages: ContactMessage[];
  contact: Contact;
  /** MUI sx prop for the root Stack */
  sx?: SxProps<Theme>;
}

export const ChatMessagesContainer = ({
  agentActive,
  messages,
  contact,
  sx
}: ChatMessagesContainerProps) => {
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
      {agentActive === true && <ChatAiCover />}
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
          <ChatMessage key={`${message}-${index}`} message={message} contact={contact} />
        ))}
      </Stack>
    </Stack>
  );
};
