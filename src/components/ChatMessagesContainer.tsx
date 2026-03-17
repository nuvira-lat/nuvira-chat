import { ChatMessage } from "./ChatMessage";
import { THEME_LIGHT_GREY } from "@/stubs/themeColors";
import { Stack } from "@mui/material";
import { Contact, ContactMessage } from "@/types";
import { useRef, useEffect } from "react";
import { ChatAiCover } from "./Agent/ChatAiCover";

interface Props {
  agentActive: boolean;
  messages: ContactMessage[];
  contact: Contact;
}

export const ChatMessagesContainer = ({ agentActive, messages, contact }: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

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
        border: `solid 1px ${THEME_LIGHT_GREY}`
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
