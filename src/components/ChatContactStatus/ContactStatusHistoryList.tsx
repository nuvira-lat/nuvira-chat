import {
  Paper,
  Typography,
  Box,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { StatusChangeDisplay } from "./StatusChangeDisplay";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { type ContactStatusHistoryListItem } from "@/stubs/contactStatusHistory";
import type { LoadContactStatusHistoryFn } from "@/integration/types";
import { nuviraDefaultLoadContactStatusHistory } from "@/integration/nuviraDefaults";

export type { ContactStatusHistoryListItem };

export interface ContactStatusHistoryListProps {
  contactId: string;
  /**
   * Load status history for the contact. Defaults to `nuviraDefaultLoadContactStatusHistory`
   * (Nuvira API route); pass your own in host apps or tests.
   */
  loadHistory?: LoadContactStatusHistoryFn;
}

export const ContactStatusHistoryList = ({
  contactId,
  loadHistory = nuviraDefaultLoadContactStatusHistory
}: ContactStatusHistoryListProps) => {
  const [history, setHistory] = useState<ContactStatusHistoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    loadHistory(contactId)
      .then((history) => {
        setHistory(history);
      })
      .finally(() => setLoading(false));
  }, [contactId, loadHistory]);

  return (
    <>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && history.length === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Status History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No status changes recorded yet.
          </Typography>
        </Paper>
      )}
      {!loading &&
        history.length !== 0 &&
        history.map((item, index) => (
          <Box key={`history-item-${item.id}-${item.customStageId}-${index}`}>
            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
              <ListItemIcon>
                {item.isAutomatic ? (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                ) : (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
              </ListItemIcon>
              <ListItemText
                primary={<StatusChangeDisplay item={item} />}
                secondary={
                  <Box component="span">
                    <Box
                      component="span"
                      sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
                    >
                      <Typography variant="body2" color="text.secondary" component="span">
                        {format(
                          new Date(item.createdAt ?? item.changedAt ?? 0),
                          "MMM dd, yyyy 'at' h:mm a"
                        )}
                      </Typography>
                      <Chip
                        label={item.isAutomatic ? "Automatic" : "Manual"}
                        size="small"
                        variant="outlined"
                        color={item.isAutomatic ? "primary" : "default"}
                      />
                    </Box>
                    {item.changedBy && (
                      <Typography variant="body2" color="text.secondary" component="span">
                        by {item.changedBy.name || item.changedBy.email}
                      </Typography>
                    )}
                    {item.reason && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        Reason: {item.reason}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < history.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
    </>
  );
};
