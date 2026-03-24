import { useState, useCallback, useEffect } from "react";
import { Stack, Typography, Box, TextField, Button, CircularProgress } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Contact, Workspace } from "@/types";
import SaveIcon from "@mui/icons-material/Save";
import { updateContactData } from "@/stubs/updateContactData";
import { logger } from "@/stubs/logger";

export interface ContactInfoEditorProps {
  workspace: Workspace;
  contact: Contact;
  /** "sidebar" = no title, compact; "standalone" = optional title, full layout */
  variant?: "sidebar" | "standalone";
  /** Called after successful save */
  onSave?: (data: { name: string; email: string | null; phone: string | null }) => void;
  /** MUI sx prop for the root Stack */
  sx?: SxProps<Theme>;
}

const normalize = (v: string | null | undefined): string => v ?? "";

/** Persisted name: blank or whitespace-only input becomes "Anon." */
const nameForSave = (raw: string): string => {
  const t = raw.trim();
  return t === "" ? "Anon." : t;
};

export const ContactInfoEditor = ({
  contact,
  workspace,
  variant = "standalone",
  onSave,
  sx
}: ContactInfoEditorProps) => {
  const [contactFields, setContactFields] = useState({
    name: contact.name || "",
    email: contact.email || "",
    phone: contact.phone || ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContactFields({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || ""
    });
  }, [contact.id, contact.name, contact.email, contact.phone]);

  const isDirty =
    nameForSave(contactFields.name) !== nameForSave(contact.name || "") ||
    normalize(contactFields.email) !== normalize(contact.email) ||
    normalize(contactFields.phone) !== normalize(contact.phone);

  const handleContactFieldChange = useCallback((field: string, value: string) => {
    setContactFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveContact = useCallback(async () => {
    const id = contact.id;
    if (!id) {
      logger.error("Contact ID is missing, cannot save contact");
      return;
    }
    setIsSaving(true);
    try {
      const savedName = nameForSave(contactFields.name);
      const savedEmail = contactFields.email || null;
      const savedPhone = contactFields.phone || null;
      await updateContactData({
        id,
        name: savedName,
        email: savedEmail,
        phone: savedPhone,
        workspaceId: workspace.id,
        company: null,
        website: null,
        description: null
      });
      setContactFields({
        name: savedName === "Anon." ? "" : savedName,
        email: contactFields.email || "",
        phone: contactFields.phone || ""
      });
      onSave?.({
        name: savedName,
        email: savedEmail,
        phone: savedPhone
      });
    } catch (error) {
      logger.error("Failed to save contact:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    contact.id,
    contactFields.email,
    contactFields.name,
    contactFields.phone,
    workspace.id,
    onSave
  ]);

  const handleRevert = useCallback(() => {
    setContactFields({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || ""
    });
  }, [contact.name, contact.email, contact.phone]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && event.ctrlKey) {
        event.preventDefault();
        if (isDirty && !isSaving) handleSaveContact();
      } else if (event.key === "Escape") {
        handleRevert();
      }
    },
    [handleSaveContact, handleRevert, isDirty, isSaving]
  );

  return (
    <Stack spacing={2} sx={sx}>
      {variant === "standalone" && <Typography variant="h6">Contact Information</Typography>}

      <Stack spacing={2}>
        <TextField
          label="Name"
          variant="outlined"
          size="small"
          fullWidth
          value={contactFields.name}
          onChange={(e) => handleContactFieldChange("name", e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="No name provided"
        />
        <TextField
          label="Email"
          variant="outlined"
          size="small"
          fullWidth
          type="email"
          value={contactFields.email}
          onChange={(e) => handleContactFieldChange("email", e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="Phone"
          variant="outlined"
          size="small"
          fullWidth
          value={contactFields.phone}
          onChange={(e) => handleContactFieldChange("phone", e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button
          variant="contained"
          size="small"
          onClick={handleSaveContact}
          disabled={!isDirty || isSaving}
          startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon />}
          fullWidth
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>

        <Typography variant="caption" color="text.secondary">
          Tip: Press Ctrl+Enter to save, Esc to revert
        </Typography>
      </Stack>

      {(contact.company || contact.website) && (
        <Stack spacing={1} sx={{ mt: 1 }}>
          {contact.company && (
            <Box sx={{ ml: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Company:{" "}
                <Typography component="span" variant="body2" color="text.primary">
                  {contact.company}
                </Typography>
              </Typography>
            </Box>
          )}
          {contact.website && (
            <Box sx={{ ml: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Website:{" "}
                <Typography
                  component="a"
                  variant="body2"
                  href={
                    contact.website.startsWith("http")
                      ? contact.website
                      : `https://${contact.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "primary.main" }}
                >
                  {contact.website}
                </Typography>
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  );
};
