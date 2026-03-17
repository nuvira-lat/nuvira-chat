import {
  Tooltip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Contact } from "@/types";
import { useState, useCallback } from "react";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import { ContactStatusHistoryList } from "./ContactStatusHistoryList";

interface Props {
  contact: Contact;
  variant?: "icon" | "button";
}

export const ContactStatusHistoryButton = ({ contact, variant = "icon" }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const content =
    variant === "icon" ? (
      <Tooltip title="View status history">
        <IconButton size="small" onClick={handleOpen} sx={{ ml: 0.5, p: 0.25 }}>
          <HistoryIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ) : (
      <Button variant="outlined" size="small" startIcon={<HistoryIcon />} onClick={handleOpen}>
        Status History
      </Button>
    );

  return (
    <>
      {content}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HistoryIcon />
          Contact Status History
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ContactStatusHistoryList contactId={contact.id} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
