import { useState, useCallback } from "react";
import {
  Stack,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Tooltip,
  Collapse,
  Card,
  CardContent
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Contact, Workspace } from "@/types";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { updateContactData } from "@/stubs/updateContactData";
import { logger } from "@/stubs/logger";

interface ContactInfoEditorProps {
  workspace: Workspace;
  contact: Contact;
  /** MUI sx prop for the root Stack */
  sx?: SxProps<Theme>;
}

export const ContactInfoEditor = ({ contact, workspace, sx }: ContactInfoEditorProps) => {
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contactFields, setContactFields] = useState({
    name: contact.name || "",
    email: contact.email || "",
    phone: contact.phone || ""
  });
  const [isSaving, setIsSaving] = useState(false);

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
      await updateContactData({
        id,
        name: contactFields.name ?? contactFields.name ?? "Anon.",
        email: contactFields.email || null,
        phone: contactFields.phone || null,
        workspaceId: workspace.id,
        company: null,
        website: null,
        description: null
      });
      setIsEditingContact(false);
    } catch (error) {
      logger.error("Failed to save contact:", error);
    } finally {
      setIsSaving(false);
    }
  }, [contact.id, contactFields.email, contactFields.name, contactFields.phone, workspace.id]);

  const handleCancelEdit = useCallback(() => {
    setContactFields({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || ""
    });
    setIsEditingContact(false);
  }, [contact.name, contact.email, contact.phone]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && event.ctrlKey) {
        handleSaveContact();
      } else if (event.key === "Escape") {
        handleCancelEdit();
      }
    },
    [handleSaveContact, handleCancelEdit]
  );

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Count how many fields have data
  const populatedFieldCount = [
    contact.name,
    contact.email,
    contact.phone,
    contact.company,
    contact.website
  ].filter(Boolean).length;

  return (
    <Stack spacing={2} sx={sx}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Contact Information</Typography>
        <Stack direction="row" spacing={1}>
          {!isEditingContact && (
            <Tooltip title="Edit contact information">
              <IconButton size="small" onClick={() => setIsEditingContact(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {populatedFieldCount > 1 && (
            <Tooltip title={isExpanded ? "Collapse details" : "Show all details"}>
              <IconButton size="small" onClick={toggleExpand}>
                {isExpanded ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {isEditingContact && (
        <Stack spacing={2}>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            value={contactFields.name}
            onChange={(e) => handleContactFieldChange("name", e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            fullWidth
            type="email"
            value={contactFields.email}
            onChange={(e) => handleContactFieldChange("email", e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <TextField
            label="Phone"
            variant="outlined"
            size="small"
            fullWidth
            value={contactFields.phone}
            onChange={(e) => handleContactFieldChange("phone", e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancelEdit}
              disabled={isSaving}
              startIcon={<CancelIcon />}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveContact}
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon />}
              fullWidth
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Tip: Press Ctrl+Enter to save, Esc to cancel
          </Typography>
        </Stack>
      )}
      {!isEditingContact && (
        <Card variant="outlined">
          <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
            {/* Always visible summary */}
            <Stack direction="row" spacing={1} alignItems="center">
              {contact.name ? (
                <PersonIcon fontSize="small" color="primary" />
              ) : (
                <PersonIcon fontSize="small" color="disabled" />
              )}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: contact.name ? 500 : 400,
                  color: contact.name ? "text.primary" : "text.secondary",
                  fontStyle: contact.name ? "normal" : "italic"
                }}
              >
                {contact.name || "No name provided"}
              </Typography>
            </Stack>

            {/* Expandable details */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                {contact.email && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon fontSize="small" color="primary" />
                    <Typography
                      variant="body2"
                      component="a"
                      href={`mailto:${contact.email}`}
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      {contact.email}
                    </Typography>
                  </Stack>
                )}

                {contact.phone && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon fontSize="small" color="primary" />
                    <Typography
                      variant="body2"
                      component="a"
                      href={`tel:${contact.phone}`}
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      {contact.phone}
                    </Typography>
                  </Stack>
                )}

                {contact.company && (
                  <Box sx={{ ml: 3.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Company:{" "}
                      <Typography component="span" variant="body2" color="text.primary">
                        {contact.company}
                      </Typography>
                    </Typography>
                  </Box>
                )}

                {contact.website && (
                  <Box sx={{ ml: 3.5 }}>
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
            </Collapse>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};
