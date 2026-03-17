import { Box, TextField, Button } from "@mui/material";

interface ContactNoteFormProps {
  workspace: { id: string };
  contact: { id: string };
  note?: { id: number; description: string };
  createdNote: (note: {
    id: number;
    description: string;
    createdAt: Date;
    contactId?: string;
  }) => void;
}

export function ContactNoteForm({ createdNote }: ContactNoteFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createdNote({
      id: Date.now(),
      description: "New note",
      createdAt: new Date()
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField label="Note" multiline rows={4} fullWidth />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Save
      </Button>
    </Box>
  );
}
