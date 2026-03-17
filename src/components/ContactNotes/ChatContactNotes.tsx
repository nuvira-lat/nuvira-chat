import { ContactNoteCard } from "@/stubs/ContactNoteCard";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Workspace, Contact, ContactNotes } from "@/types";
import AddIcon from "@mui/icons-material/Add";
import compact from "lodash/compact";
import orderBy from "lodash/orderBy";
import { useCallback, useState } from "react";
import { ContactNoteForm } from "@/stubs/ContactNoteForm";
import { NvModal } from "@/stubs/NvModal";

interface Props {
  contact: Contact;
  notes: ContactNotes[];
  workspace: Workspace;
  /** MUI sx prop for the root Box */
  sx?: SxProps<Theme>;
}

export const ChatContactNotes = ({ contact, notes: _notes, workspace, sx }: Props) => {
  const [notes, setNotes] = useState<ContactNotes[]>(_notes);
  const [selectedNote, setSelectedNote] = useState<ContactNotes | null>(null);
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => {
    setSelectedNote(null);
    setOpen(false);
  }, []);
  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, ...(sx || {}) }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Contact Notes</Typography>
          <IconButton color="primary" size="small">
            <AddIcon onClick={handleOpen} />
          </IconButton>
        </Stack>

        <Stack overflow={"auto"} gap={2} mb={2}>
          {notes.length === 0 && (
            <Typography color="secondary.dark" fontWeight={400} variant="subtitle2">
              There are no meeting notes for this contact
            </Typography>
          )}
          {notes.length > 0 &&
            orderBy(
              compact(notes),
              (n) => -(typeof n.createdAt === "string" ? new Date(n.createdAt) : n.createdAt)
            ).map((note, index) => {
              const handleNoteEdit = () => {
                setSelectedNote(note);
                setOpen(true);
              };
              return (
                <ContactNoteCard
                  key={`note-${index}-${note.id}`}
                  note={note}
                  noPadding
                  handleNoteEdit={handleNoteEdit}
                />
              );
            })}
        </Stack>
      </Box>
      <NvModal
        open={open}
        handleClose={handleClose}
        subTitle="Enter the details of your meeting or interaction with this contact."
        title="Add New Meeting Note"
      >
        <ContactNoteForm
          workspace={workspace}
          contact={contact}
          note={selectedNote ?? undefined}
          createdNote={(note) => {
            setNotes((s) => {
              const fullNote = { ...note, contactId: contact.id };
              const index = s.findIndex((n) => n.id === note.id);
              if (index !== -1) {
                const updatedNotes = [...s];
                updatedNotes.splice(index, 1, { ...s[index], ...fullNote });
                return updatedNotes;
              }
              return [fullNote as ContactNotes, ...s];
            });
            setOpen(false);
          }}
        />
      </NvModal>
    </>
  );
};
