import { prisma } from "@/stubs/prisma";
import { ChatWindow } from "./ChatWindow";
import { Contact, Workspace } from "@/types";

interface Props {
  contact: Contact;
  workspace: Workspace;
}

export const ChatWindowSC = async ({ contact, workspace }: Props) => {
  const messages = await prisma.contactMessage.findMany({
    where: { contactId: contact.id },
    orderBy: { createdAt: "asc" }
  });

  const notes = await prisma.contactNotes.findMany({
    where: { contactId: contact.id },
    orderBy: { createdAt: "desc" }
  });

  const funnels = await prisma.customFunnel.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "asc" }
  });

  return (
    <ChatWindow
      messages={messages}
      contact={contact}
      notes={notes}
      workspace={workspace}
      funnels={funnels}
    />
  );
};
