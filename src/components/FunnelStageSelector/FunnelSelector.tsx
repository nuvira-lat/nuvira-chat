import { logger } from "@/stubs/logger";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Chip,
  SelectChangeEvent
} from "@mui/material";
import { Contact, CustomFunnel, CustomStage } from "@/types";
import { useCallback } from "react";

interface Props {
  activeFunnels: CustomFunnel[];
  contact: Contact;
  disabled?: boolean;
  selectedFunnel?: CustomFunnel;
  setSelectedFunnel: (funnel: CustomFunnel | undefined) => void;
  setSelectedStage: (stageId: CustomStage | undefined) => void;
  setUpdating: (updating: boolean) => void;
  updating?: boolean;
  workspaceId?: string;
}

export const FunnelSelector = ({
  activeFunnels,
  contact,
  disabled,
  selectedFunnel,
  setSelectedFunnel,
  setSelectedStage,
  setUpdating,
  updating
}: Props) => {
  const handleChange = useCallback(
    async (e: SelectChangeEvent) => {
      const funnelId = e.target.value;
      const funnel: CustomFunnel | undefined = activeFunnels.find((f) => f.id === funnelId);
      if (updating || !funnel || !contact) return;

      setUpdating(true);
      try {
        const response = await fetch("/api/v1/contact/custom-funnel", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contactId: contact.id,
            funnelId: funnelId,
            reason: "Funnel updated from chat interface"
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update stage");
        }

        setSelectedFunnel(funnel);
        setSelectedStage(undefined); // Reset stage selection when funnel changes
      } catch (error) {
        const stage = activeFunnels.find((s) => s.id === contact.customFunnelId) || undefined;
        setSelectedFunnel(stage);
        // Revert the selection
        logger.error("Failed to update stage", error);
        // showToast(
        //   `Failed to update stage: ${error instanceof Error ? error.message : "Unknown error"}`,
        //   "error"
        // );
      } finally {
        setUpdating(false);
      }
    },
    [activeFunnels, contact, setSelectedFunnel, setSelectedStage, setUpdating, updating]
  );

  return (
    <FormControl size="small" fullWidth disabled={disabled || updating}>
      <InputLabel>Funnel</InputLabel>
      <Select value={selectedFunnel?.id || ""} onChange={handleChange} label="Funnel">
        {activeFunnels.map((funnel) => (
          <MenuItem key={funnel.id} value={funnel.id}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>{funnel.name}</Typography>
              {funnel.isDefault && (
                <Chip label="Default" size="small" color="primary" variant="outlined" />
              )}
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
