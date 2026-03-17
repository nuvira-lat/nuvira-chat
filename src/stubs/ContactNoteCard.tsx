import { Box, Typography } from "@mui/material";

interface Note {
  id: number;
  description: string;
  createdAt: Date | string;
}

interface ContactNoteCardProps {
  note: Note;
  noPadding?: boolean;
  handleNoteEdit?: () => void;
}

export function ContactNoteCard({ note, noPadding, handleNoteEdit }: ContactNoteCardProps) {
  return (
    <Box
      sx={{ p: noPadding ? 0 : 2, border: 1, borderColor: "grey.300", borderRadius: 1 }}
      onClick={handleNoteEdit}
    >
      <Typography variant="body2">{note.description}</Typography>
      <Typography variant="caption" color="text.secondary">
        {typeof note.createdAt === "string" ? note.createdAt : note.createdAt.toISOString()}
      </Typography>
    </Box>
  );
}
